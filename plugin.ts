import TelegramBot from "node-telegram-bot-api";
import { BotCommand } from "../../src/bot-commands/bot-command";
import { AlterUserScoreArgs } from "../../src/chat/alter-user-score-args";
import { Chat } from "../../src/chat/chat";
import { User } from "../../src/chat/user/user";
import { EmptyEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/empty-event-arguments";
import { PluginEvent } from "../../src/plugin-host/plugin-events/plugin-event-types";
import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";
import { ChatInventoryManager } from "./chat-inventory-manager";
import { ChatItemsData } from "./chat-items-data";
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

  // Files
  private static readonly ITEMS_CHATS_DATA_FILE = "items-chats-data.json";
  private static readonly ITEMS_PROTOTYPES_FILE = "items-prototypes.json"

  // Misc.
  private chatsItemsData = new Map<number, ChatItemsData>();
  private itemProtoTypes = new Map<number, ItemProtoType>([
    [0, new ItemProtoType(0, "Stonks", 0.1, 0.095, "📈", false, false, false)]
  ]);

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
    const chatItemsData = this.getOrCreateChatItemsData(chat);
    const inventory = chatItemsData.inventoryManager.getOrCreateInventory(user);

    if (inventory.length === 0) {
      return "Your inventory is empty.";
    }

    let inventoryStr = "You have the following items:\n";
    inventory.forEach((item) => {
      inventoryStr += `\n${item.prettyString()}`;
      if (item.stackSize > 1) {
        inventoryStr += ` (<i>${item.stackSize}</i>)`;
      }
      inventoryStr += ` worth <i>${item.sellPrice(chatItemsData.scoreMedian)}</i> points`;
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
    const chatItemsData = this.getOrCreateChatItemsData(chat);

    if (chatItemsData.shopInventory.length === 0) {
      return "The shop is all out of stock.";
    }
    let inventoryStr = "The shop has the following item(s) for sale:\n";
    chatItemsData.shopInventory.forEach((item) => {
      inventoryStr += `\n${item.prettyString()}`;
      if (item.stackSize > 1) {
        inventoryStr += ` (<i>${item.stackSize}</i>)`;
      }
      inventoryStr += ` for <i>${item.buyPrice(chatItemsData.scoreMedian)}</i> points`;
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
    const chatItemsData = this.getOrCreateChatItemsData(chat);
    const item = chatItemsData.shopInventory.find((shopItem) => shopItem.name().toLowerCase() === itemName);

    if (!item) {
      return "The shop doesn't have that item!";
    }
    let buyPrice = item.buyPrice(chatItemsData.scoreMedian);

    if (user.score < buyPrice) {
      return "You can't afford that item!";
    }
    const alterScoreArgs = new AlterUserScoreArgs(user, -buyPrice, this.name, Plugin.BUY_REASON);
    buyPrice = chat.alterUserScore(alterScoreArgs);
    const inventory = chatItemsData.inventoryManager.getOrCreateInventory(user);
    this.moveToInventory(chatItemsData.shopInventory, inventory, item);

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
    const chatItemsData = this.getOrCreateChatItemsData(chat);
    const inventory = chatItemsData.inventoryManager.getOrCreateInventory(user);
    const item = inventory.find((inventoryItem) => inventoryItem.name().toLowerCase() === itemName);

    if (!item) {
      return "You don't have that item!";
    }
    let sellPrice = item.sellPrice(chatItemsData.scoreMedian);
    const alterScoreArgs = new AlterUserScoreArgs(user, sellPrice, this.name, Plugin.SELL_REASON);
    sellPrice = chat.alterUserScore(alterScoreArgs);
    this.moveToInventory(inventory, chatItemsData.shopInventory, item);

    return `Sold ${item.prettyString()} for <i>${sellPrice}</i> points!`;
  }

  private getOrCreateChatItemsData(chat: Chat): ChatItemsData {
    let data = this.chatsItemsData.get(chat.id);
    if (!data) {
      data = new ChatItemsData(chat.id);
      data.scoreMedian = this.calculateScoreMedian(chat);    
      data.shopInventory.push(new Item(this.itemProtoTypes.get(0), 1000));  // For now, all chats just get 1k stonks.
      this.chatsItemsData.set(chat.id, data);
    }
    return data;
  }

  private updateScoreMediansAndPersistData(eventArgs: EmptyEventArguments): void {
    const chatIds = Array.from(this.chatsItemsData.keys());
    chatIds.forEach((chatId) => {
      const chat = this.getChat(chatId);

      if (!chat) {
        this.chatsItemsData.delete(chatId);

      } else {
        const newScoreMedian = this.calculateScoreMedian(chat);
        this.chatsItemsData.get(chatId).scoreMedian = newScoreMedian;
      }
    });
    this.persistData();
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

  private loadData(): void {
    const rawitemProtoTypes: any[] = this.loadDataFromFile(Plugin.ITEMS_PROTOTYPES_FILE);

    if (!rawitemProtoTypes) {
      console.log(`No ${Plugin.ITEMS_PROTOTYPES_FILE} loaded, starting fresh`);
      return;
    }
    this.itemProtoTypes = new Map();

    rawitemProtoTypes.forEach(raw => {
      const protoType = new ItemProtoType(raw.id, raw.name, raw.buyPriceRatioToMedian, raw.sellPriceRatioToMedian, raw.icon, raw.usable,
        raw.consumedOnUse, raw.equippable);
      this.itemProtoTypes.set(protoType.id, protoType);
    });

    const rawChatsItemsData: any[] = this.loadDataFromFile(Plugin.ITEMS_CHATS_DATA_FILE);

    if (!rawChatsItemsData) {
      console.log(`No ${Plugin.ITEMS_CHATS_DATA_FILE} loaded, starting fresh`);
      return;
    }
    this.chatsItemsData = new Map();

    rawChatsItemsData.forEach(raw => {
      const shopInventory = this.parseRawItems(raw.shopInventory);
      const inventoryManager = this.parseRawInventoryManager(raw.inventoryManager);
      const data = new ChatItemsData(raw.chatId, inventoryManager, shopInventory, raw.scoreMedian);
      this.chatsItemsData.set(data.chatId, data);
    });
  }

  private parseRawInventoryManager(inventoryManager?: any): ChatInventoryManager {
    const inventories = new Map<number, Item[]>();
    inventoryManager?.forEach(raw => {
      const items = this.parseRawItems(raw.inventory);
      inventories.set(raw.userId, items);
    });
    return new ChatInventoryManager(inventories);
  }

  private parseRawItems(rawItems?: any): Item[] {
    return rawItems?.map(raw => {
      const protoType = this.itemProtoTypes.get(raw.prototypeId);
      return new Item(protoType, raw.stackSize);
    }) ?? [];
  }

  private persistData(): void {
    this.saveDataToFile(Plugin.ITEMS_PROTOTYPES_FILE, this.itemProtoTypes);
    this.saveDataToFile(Plugin.ITEMS_CHATS_DATA_FILE, this.chatsItemsData);
  }
}

