import TelegramBot from "node-telegram-bot-api";
import { BotCommand } from "../../src/bot-commands/bot-command";
import { AlterUserScoreArgs } from "../../src/chat/alter-user-score-args";
import { Chat } from "../../src/chat/chat";
import { User } from "../../src/chat/user/user";
import { EmptyEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/empty-event-arguments";
import { PluginEvent } from "../../src/plugin-host/plugin-events/plugin-event-types";
import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";

import { ChatInventoryManager } from "./chat-inventory-manager";
import { Item } from "./item";
import { ItemProtoType } from "./item-prototype";

export class Plugin extends AbstractPlugin {

  // Commands
  private static readonly INFO_CMD = "items";
  private static readonly INVENTORY_CMD = `inventory`;
  private static readonly SHOP_CMD = `shop`;
  private static readonly BUY_CMD = `buy`;
  private static readonly SELL_CMD = `sell`;

  // User score change reasons
  private static readonly BUY_REASON = "buy.item";
  private static readonly SELL_REASON = "sell.item";

  // Chat-specific managers
  private readonly inventoryManagers = new Map<number, ChatInventoryManager>();
  private readonly shopInventories = new Map<number, Item[]>();
  private readonly scoreMedians = new Map<number, number>();
  private readonly itemProtoTypes = new Map<number, ItemProtoType>();

  constructor() {
    super("Items", "1.0.0-alpha");

    this.subscribeToPluginEvent(PluginEvent.BotStartup, this.loadData.bind(this));
    this.subscribeToPluginEvent(PluginEvent.HourlyTick, this.updateScoreMediansAndPersistData.bind(this));
    this.subscribeToPluginEvent(PluginEvent.BotShutdown, this.persistData.bind(this));
  }

  /**
   * @override
   */
  public getPluginSpecificCommands(): BotCommand[] {
    const infoCmd = new BotCommand([Plugin.INFO_CMD], "prints info about the Items plugin", this.itemsInfo.bind(this));
    const inventoryCmd = new BotCommand([Plugin.INVENTORY_CMD], "", this.inventory.bind(this), false);
    const shopCmd = new BotCommand([Plugin.SHOP_CMD], "", this.shop.bind(this), false);
    const buyCmd = new BotCommand([Plugin.BUY_CMD], "", this.buy.bind(this), false);
    const sellCmd = new BotCommand([Plugin.SELL_CMD], "", this.sell.bind(this), false);
    return [infoCmd, inventoryCmd, shopCmd, buyCmd, sellCmd];
  }

  /**
   * info command
   */
  private itemsInfo(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    return "The Item plugin supports the following commands:\n\n"
      + `/${Plugin.INVENTORY_CMD} to show your inventory\n`
      + `/${Plugin.SHOP_CMD} to show all items for sale in the shop\n`
      + `/${Plugin.BUY_CMD} to buy an item from the shop\n`
      + `/${Plugin.SELL_CMD} to sell an item to the shop`;
  }

  /**
   * inventory command
   */
  private inventory(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    const chatInventoryManager = this.getOrCreateInventoryManager(chat);
    const inventory = chatInventoryManager.getOrCreateInventory(user);

    if (inventory.length === 0) {
      return "Your inventory is empty.";
    }

    const scoreMedian = this.getOrCreateScoreMedian(chat);
    let inventoryStr = "You have the following items:\n";
    inventory.forEach((item) => {
      inventoryStr += `\n${item.prettyString()}`;
      if (item.stackSize > 1) {
        inventoryStr += ` (<i>${item.stackSize}</i>)`;
      }
      inventoryStr += ` worth <i>${item.sellPrice(scoreMedian)}</i> points`;
      if (item.stackSize > 1) {
        inventoryStr += ' each';
      }
    });
    return inventoryStr;
  }

  /**
   * shop command
   */
  private shop(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    const shopInventory = this.getOrCreateShopInventory(chat);

    if (shopInventory.length === 0) {
      return "The shop is all out of stock.";
    }
    const scoreMedian = this.getOrCreateScoreMedian(chat);
    let inventoryStr = "The shop has the following item(s) for sale:\n";
    shopInventory.forEach((item) => {
      inventoryStr += `\n${item.prettyString()}`;
      if (item.stackSize > 1) {
        inventoryStr += ` (<i>${item.stackSize}</i>)`;
      }
      inventoryStr += ` for <i>${item.buyPrice(scoreMedian)}</i> points`;
      if (item.stackSize > 1) {
        inventoryStr += ' each';
      }
    });
    return inventoryStr;
  }

  /**
   * buy command
   */
  private buy(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    if (!match) {
      return "You have to specify what you want to buy!";
    }
    const itemName = match.toLowerCase();
    const shopInventory = this.getOrCreateShopInventory(chat);
    const item = shopInventory.find((shopItem) => shopItem.name().toLowerCase() === itemName);

    if (!item) {
      return "The shop doesn't have that item!";
    }
    const scoreMedian = this.getOrCreateScoreMedian(chat);
    let buyPrice = item.buyPrice(scoreMedian);

    if (user.score < buyPrice) {
      return "You can't afford that item!";
    }
    const alterScoreArgs = new AlterUserScoreArgs(user, -buyPrice, this.name, Plugin.BUY_REASON);
    buyPrice = chat.alterUserScore(alterScoreArgs);
    const inventoryManager = this.getOrCreateInventoryManager(chat);
    const inventory = inventoryManager.getOrCreateInventory(user);
    this.moveToInventory(shopInventory, inventory, item);

    return `Bought ${item.prettyString()} for <i>${-buyPrice}</i> points!`;
  }

  /**
   * sell command
   */
  private sell(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    if (!match) {
      return "You have to specify what you want to sell!";
    }
    const itemName = match.toLowerCase();
    const inventoryManager = this.getOrCreateInventoryManager(chat);
    const inventory = inventoryManager.getOrCreateInventory(user);
    const item = inventory.find((inventoryItem) => inventoryItem.name().toLowerCase() === itemName);

    if (!item) {
      return "You don't have that item!";
    }
    const scoreMedian = this.getOrCreateScoreMedian(chat);
    let sellPrice = item.sellPrice(scoreMedian);
    const alterScoreArgs = new AlterUserScoreArgs(user, sellPrice, this.name, Plugin.SELL_REASON);
    sellPrice = chat.alterUserScore(alterScoreArgs);
    const shopInventory = this.getOrCreateShopInventory(chat);
    this.moveToInventory(inventory, shopInventory, item);

    return `Sold ${item.prettyString()} for <i>${sellPrice}</i> points!`;
  }

  private getOrCreateInventoryManager(chat: Chat): ChatInventoryManager {
    let manager = this.inventoryManagers.get(chat.id);
    if (!manager) {
      manager = new ChatInventoryManager();
      this.inventoryManagers.set(chat.id, manager);
    }
    return manager;
  }

  private getOrCreateShopInventory(chat: Chat): Item[] {
    let shopInventory = this.shopInventories.get(chat.id);
    if (!shopInventory) {
      shopInventory = new Array<Item>();
      this.shopInventories.set(chat.id, shopInventory);
      shopInventory.push(...this.generateStonks());  // For now, we just push 1000 stonks in there.
    }
    return shopInventory;
  }

  private getOrCreateScoreMedian(chat: Chat): number {
    let median = this.scoreMedians.get(chat.id);

    if (!median) {
      median = this.calculateScoreMedian(chat);
      this.scoreMedians.set(chat.id, median);
    }
    return median;
  }

  private updateScoreMediansAndPersistData(eventArgs: EmptyEventArguments): void {
    const chatIds = Array.from(this.scoreMedians.keys());
    chatIds.forEach((chatId) => {
      const chat = this.getChat(chatId);

      if (!chat) {
        this.clearDataOfChat(chatId);

      } else {
        const newScoreMedian = this.calculateScoreMedian(chat);
        this.scoreMedians.set(chatId, newScoreMedian);
      }
    });
    this.persistData();
  }

  private clearDataOfChat(chatId: number): void {
    this.scoreMedians.delete(chatId);
    this.shopInventories.delete(chatId);
    this.inventoryManagers.delete(chatId);
  }

  private calculateScoreMedian(chat: Chat): number {
    const users = chat.sortedUsers();

    if (users.length === 0) {
      return 0;
    }

    if (users.length % 2 !== 0) {
        return users[Math.floor(users.length / 2)].score;
    }
    return (users[(Math.floor(users.length - 1) / 2)].score + users[Math.floor(users.length / 2)].score) / 2.0;
  }

  private moveToInventory(from: Item[], to: Item[], item: Item): void {
    if (item.stackSize == 1) {
      from.splice(from.indexOf(item), 1);

    } else {
      item.stackSize--;
    }
    const itemInTargetInventory = to.find(toFind => toFind.sameItemTypeAs(item));

    if (itemInTargetInventory) {
      itemInTargetInventory.stackSize++;

    } else {
      to.push(item.copy());
    }
  }

  // For now, all new chats just get a hard-coded 1000 stonks.
  private generateStonks(): Item[] {
    const prototype = new ItemProtoType(0, "Stonks", 0.1, 0.095, "📈", false, false, false);
    const item = new Item(prototype, 1000);
    return [item];
  }

  private loadData(): void {
    // TODO
  }

  private persistData(): void {
    // TODO
  }
}
