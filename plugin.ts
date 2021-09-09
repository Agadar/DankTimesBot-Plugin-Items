import { BotCommand } from "../../src/bot-commands/bot-command";
import { AlterUserScoreArgs } from "../../src/chat/alter-user-score-args";
import { Chat } from "../../src/chat/chat";
import { User } from "../../src/chat/user/user";
import { EmptyEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/empty-event-arguments";
import { PluginEvent } from "../../src/plugin-host/plugin-events/plugin-event-types";
import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";

import { ChatInventoryManager } from "./chat-inventory-manager";
import { ChatShop } from "./chat-shop";
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
  private readonly shops = new Map<number, ChatShop>();

  constructor() {
    super("Items", "1.0.0-alpha");

    this.subscribeToPluginEvent(PluginEvent.BotStartup, this.updatePrices);
    this.subscribeToPluginEvent(PluginEvent.NightlyUpdate, this.updatePrices);
  }

  /**
   * @override
   */
  public getPluginSpecificCommands(): BotCommand[] {
    const infoCmd = new BotCommand(Plugin.INFO_CMD, "prints info about the Items plugin", this.itemsInfo.bind(this));
    const inventoryCmd = new BotCommand(Plugin.INVENTORY_CMD, "", this.inventory.bind(this), false);
    const shopCmd = new BotCommand(Plugin.SHOP_CMD, "", this.shop.bind(this), false);
    const buyCmd = new BotCommand(Plugin.BUY_CMD, "", this.buy.bind(this), false);
    const sellCmd = new BotCommand(Plugin.SELL_CMD, "", this.sell.bind(this), false);
    return [infoCmd, inventoryCmd, shopCmd, buyCmd, sellCmd];
  }

  private updatePrices(eventArgs: EmptyEventArguments): void {
    
  }

  private itemsInfo(chat: Chat, user: User, msg: any, match: string[]): string {
    return "The Item plugin supports the following commands:\n\n"
      + `/${Plugin.INVENTORY_CMD} to show your inventory\n`
      + `/${Plugin.SHOP_CMD} to show all items for sale in the shop\n`
      + `/${Plugin.BUY_CMD} to buy an item from the shop\n`
      + `/${Plugin.SELL_CMD} to sell an item to the shop`;
  }

  /**
   * inventory command
   */
  private inventory(chat: Chat, user: User, msg: any, match: string[]): string {
    const chatInventoryManager = this.getOrCreateInventoryManager(chat);
    const inventory = chatInventoryManager.getOrCreateInventory(user);

    if (inventory.length === 0) {
      return "Your inventory is empty.";
    }

    let inventoryStr = "Your inventory contains the following item(s):\n";
    inventory.forEach((item) => {
      inventoryStr += `\n${item.prettyString()}`;
    });
    return inventoryStr;
  }

  /**
   * shop command
   */
  private shop(chat: Chat, user: User, msg: any, match: string[]): string {
    const shop = this.getOrCreateShop(chat);

    if (shop.inventory.length === 0) {
      return "The shop is all out of stock.";
    }

    let inventoryStr = "The shop has the following item(s) for sale:\n";
    shop.inventory.forEach((item) => {
      inventoryStr += `\n${item.prettyString()} for ${item.buyPrice} points`;
    });
    return inventoryStr;
  }

  /**
   * buy command
   */
  private buy(chat: Chat, user: User, msg: any, match: string[]): string {
    if (match.length < 2) {
      return "You have to specify what you want to buy!";
    }
    const itemName = match[1].toLowerCase();
    const shop = this.getOrCreateShop(chat);
    const item = shop.inventory.find((shopItem) => shopItem.name().toLowerCase() === itemName);

    if (!item) {
      return "The shop doesn't have that item!";
    }
    if (user.score < item.buyPrice()) {
      return "You can't afford that item!";
    }
    const alterScoreArgs = new AlterUserScoreArgs(user, -item.buyPrice(), this.name, Plugin.BUY_REASON);
    const buyPrice = chat.alterUserScore(alterScoreArgs);
    const inventoryManager = this.getOrCreateInventoryManager(chat);
    const inventory = inventoryManager.getOrCreateInventory(user);
    inventory.push(item);

    shop.inventory.splice(shop.inventory.indexOf(item), 1);

    return `Bought ${item.prettyString()} for ${buyPrice} points!`;
  }

  /**
   * sell command
   */
  private sell(chat: Chat, user: User, msg: any, match: string[]): string {
    if (match.length < 2) {
      return "You have to specify what you want to sell!";
    }
    const itemName = match[1].toLowerCase();
    const inventoryManager = this.getOrCreateInventoryManager(chat);
    const inventory = inventoryManager.getOrCreateInventory(user);
    const item = inventory.find((inventoryItem) => inventoryItem.name().toLowerCase() === itemName);

    if (!item) {
      return "You don't have that item!";
    }
    const alterScoreArgs = new AlterUserScoreArgs(user, item.sellPrice(), this.name, Plugin.SELL_REASON);
    const sellPrice = chat.alterUserScore(alterScoreArgs);
    inventory.splice(inventory.indexOf(item), 1);

    const shop = this.getOrCreateShop(chat);
    shop.inventory.push(item);

    return `Sold ${item.prettyString()} for ${sellPrice} points!`;
  }

  private getOrCreateInventoryManager(chat: Chat): ChatInventoryManager {
    let manager = this.inventoryManagers.get(chat.id);
    if (!manager) {
      manager = new ChatInventoryManager(chat);
      this.inventoryManagers.set(chat.id, manager);
    }
    return manager;
  }

  private getOrCreateShop(chat: Chat): ChatShop {
    let manager = this.shops.get(chat.id);
    if (!manager) {
      manager = new ChatShop(chat);
      this.shops.set(chat.id, manager);
      manager.inventory.push(...this.generateStonks());

    }
    return manager;
  }

  // Temporary function just to fill the shop with test items
  private generateStonks(): Item[] {
    const prototype = new ItemProtoType(0, "Stonk", 0.1, 0.05, "🗠");
    const items = new Array<Item>();
    for (let i = 0; i < 100; i++) {
      const item = new Item(prototype, 1);
    }
    return items;
  }
}

