import * as fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import { BotCommand } from "../../src/bot-commands/bot-command";
import { AlterUserScoreArgs } from "../../src/chat/alter-user-score-args";
import { Chat } from "../../src/chat/chat";
import { User } from "../../src/chat/user/user";
import { EmptyEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/empty-event-arguments";
import { PluginEvent } from "../../src/plugin-host/plugin-events/plugin-event-types";
import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";
import { AbstractItemPack } from "./abstract-item-pack";
import { ChatInventoryManager } from "./chat/chat-inventory-manager";
import { ChatItemsData } from "./chat/chat-items-data";
import { Item } from "./item/item";
import { ItemProtoType } from "./item/item-prototype";
import { ItemPack } from "./packs/basic-item-pack/item-pack";

export class Plugin extends AbstractPlugin {

  // Commands
  private static readonly INFO_CMD = "items";
  private static readonly INVENTORY_CMD = 'inventory';
  private static readonly IDENTIFY_CMD = 'identify';
  private static readonly EQUIP_CMD = 'equip';
  private static readonly USE_CMD = 'use';
  private static readonly SHOP_CMD = 'shop';
  private static readonly BUY_CMD = 'buy';
  private static readonly SELL_CMD = 'sell';

  // User score change reasons
  private static readonly BUY_REASON = "buy.item";
  private static readonly SELL_REASON = "sell.item";

  // Files
  private static readonly ITEMS_CHATS_DATA_FILE = "items-chats-data.json";

  // Misc.
  private chatsItemsData = new Map<number, ChatItemsData>();
  private itemProtoTypes = new Map<number, ItemProtoType>();
  private itemPacks = new Array<AbstractItemPack>();

  constructor() {
    super("Items", "1.0.0-alpha");

    this.subscribeToPluginEvent(PluginEvent.BotStartup, this.loadData.bind(this));
    this.subscribeToPluginEvent(PluginEvent.HourlyTick, this.onHourlyTick.bind(this));
    this.subscribeToPluginEvent(PluginEvent.NightlyUpdate, this.onNightlyUpdate.bind(this));
    this.subscribeToPluginEvent(PluginEvent.BotShutdown, this.persistData.bind(this));
  }

  /**
   * @override
   */
  public getPluginSpecificCommands(): BotCommand[] {
    const infoCmd = new BotCommand([Plugin.INFO_CMD], "prints info about the Items plugin", this.itemsInfo.bind(this));
    const inventoryCmd = new BotCommand([Plugin.INVENTORY_CMD], "", this.inventory.bind(this), false);
    const identifyCmd = new BotCommand([Plugin.IDENTIFY_CMD], "", this.identify.bind(this), false);
    const equipCmd = new BotCommand([Plugin.EQUIP_CMD], "", this.equip.bind(this), false);
    const useCmd = new BotCommand([Plugin.USE_CMD], "", this.use.bind(this), false);
    const shopCmd = new BotCommand([Plugin.SHOP_CMD], "", this.shop.bind(this), false);
    const buyCmd = new BotCommand([Plugin.BUY_CMD], "", this.buy.bind(this), false);
    const sellCmd = new BotCommand([Plugin.SELL_CMD], "", this.sell.bind(this), false);
    return [infoCmd, inventoryCmd, identifyCmd, equipCmd, useCmd, shopCmd, buyCmd, sellCmd];
  }

  /**
   * info command
   */
  private itemsInfo(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    return "📦 The Items plugin supports the following commands:\n\n"
      + `/${Plugin.INVENTORY_CMD} to show your inventory\n`
      + `/${Plugin.IDENTIFY_CMD} to identify an item\n`
      + `/${Plugin.EQUIP_CMD} to equip an item\n`
      + `/${Plugin.USE_CMD} to use an item\n\n`
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
      return "🎒 Your inventory is empty.";
    }

    let inventoryStr = "Your inventory contains the following items:\n";
    inventory.forEach((item) => {
      inventoryStr += `\n${item.prototype.prettyName()}`;
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
   * identify command
   */
  private identify(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    if (!match) {
      return "😞 You have to tell me what you want to identify.";
    }

    const protoTypes = Array.from(this.itemProtoTypes.values())
      .filter(protoType => protoType.name.toLowerCase() === match.toLowerCase());

    if (protoTypes.length < 1) {
      return "🤷 That item does not exist."
    }
    return protoTypes.map(protoType => protoType.prettyPrint()).join("\n\n");
  }

  /**
   * identify command
   */
  private equip(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    if (!match) {
      return "😞 You have to specify what item you want to equip.";
    }
    const chatItemsData = this.getOrCreateChatItemsData(chat);
    const inventory = chatItemsData.inventoryManager.getOrCreateInventory(user);
    const item = inventory.find((inventoryItem) => inventoryItem.name().toLowerCase() === match.toLowerCase());

    if (!item) {
      return "😞 You don't have that item.";
    }
    if (!item.prototype.equippable) {
      return `You put ${item.prototype.prettyName()} on your head. You realize you look like an idiot and quickly take it off.`;
    }
    return "😞 The developer didn't implement this yet."; // TODO: Implement.
  }

  /**
   * identify command
   */
   private use(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    if (!match) {
      return "😞 You have to specify what item you want to use.";
    }
    const chatItemsData = this.getOrCreateChatItemsData(chat);
    const inventory = chatItemsData.inventoryManager.getOrCreateInventory(user);
    const item = inventory.find((inventoryItem) => inventoryItem.name().toLowerCase() === match.toLowerCase());

    if (!item) {
      return "😞 You don't have that item.";
    }
    if (!item.prototype.usable) {
      return `You shake ${item.prototype.prettyName()} around for a bit and give it a lick. Nothing happens.`;
    }
    const useResult = item.prototype.onUse(chat, user, msg, match);

    if (item.prototype.consumedOnUse && useResult.shouldConsume) {
      chatItemsData.removeFromInventory(inventory, item, 1);
    }
    return useResult.msg;
  }

  /**
   * shop command
   */
  private shop(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    const chatItemsData = this.getOrCreateChatItemsData(chat);

    if (chatItemsData.shopInventory.length === 0) {
      return "🛒 The shop is all out of stock.";
    }
    let inventoryStr = "The shop has the following item(s) for sale:\n";
    chatItemsData.shopInventory.forEach((item) => {
      inventoryStr += `\n${item.prototype.prettyName()}`;
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
      return "😞 You have to specify what you want to buy.";
    }
    const amountAndItemName = this.determineAmountAndItemNameFromInput(match);

    if (amountAndItemName.amount < 1) {
      return "😞 You have to buy at least 1.";
    }
    const chatItemsData = this.getOrCreateChatItemsData(chat);
    const item = chatItemsData.shopInventory.find((shopItem) => shopItem.name().toLowerCase() === amountAndItemName.itemName);

    if (!item) {
      return "😞 The shop doesn't have that item.";
    }
    let amount = amountAndItemName.amount;
    const shopHasInsufficientAmount = item.stackSize < amount;

    if (shopHasInsufficientAmount) {
      amount = item.stackSize;
    }
    const individualBuyPrice = item.buyPrice(chatItemsData.scoreMedian);
    let buyPrice = amount * individualBuyPrice;
    const playerHasInsufficientFunds = buyPrice > user.score;

    if (playerHasInsufficientFunds) {
      amount = Math.floor(user.score / individualBuyPrice);
      buyPrice = amount * individualBuyPrice;

      if (amount < 1) {
        return "😞 You can't afford that item.";
      }
    }
    const alterScoreArgs = new AlterUserScoreArgs(user, -buyPrice, this.name, Plugin.BUY_REASON);
    buyPrice = chat.alterUserScore(alterScoreArgs);
    const inventory = chatItemsData.inventoryManager.getOrCreateInventory(user);
    chatItemsData.moveToInventory(chatItemsData.shopInventory, item, amount, inventory);
    let successMsg: string;

    if (playerHasInsufficientFunds) {
      successMsg = `You did not have enough points for ${item.prototype.prettyName()} (<i>${amountAndItemName.amount}</i>).\n\n`;
      successMsg += `Instead bought ${item.prototype.prettyName()} (<i>${amount}</i>) for <i>${-buyPrice}</i> points!`;

    } else if (shopHasInsufficientAmount) {
      successMsg = `The shop did not have ${item.prototype.prettyName()} (<i>${amountAndItemName.amount}</i>).\n\n`;
      successMsg += `Instead bought ${item.prototype.prettyName()} (<i>${amount}</i>) for <i>${-buyPrice}</i> points!`;

    } else if (amount > 1) {
      successMsg = `Bought ${item.prototype.prettyName()} (<i>${amount}</i>) for <i>${-buyPrice}</i> points!`;

    } else {
      successMsg = `Bought ${item.prototype.prettyName()} for <i>${-buyPrice}</i> points!`;
    }
    return successMsg;
  }

  /**
   * sell command
   */
  private sell(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    if (!match) {
      return "😞 You have to specify what you want to sell.";
    }
    const amountAndItemName = this.determineAmountAndItemNameFromInput(match);

    if (amountAndItemName.amount < 1) {
      return "😞 You have to sell at least 1.";
    }
    const chatItemsData = this.getOrCreateChatItemsData(chat);
    const inventory = chatItemsData.inventoryManager.getOrCreateInventory(user);
    const item = inventory.find((inventoryItem) => inventoryItem.name().toLowerCase() === amountAndItemName.itemName);

    if (!item) {
      return "😞 You don't have that item.";
    }
    let amount = amountAndItemName.amount;
    const playerHasInsufficientAmount = item.stackSize < amount;

    if (playerHasInsufficientAmount) {
      amount = item.stackSize;
    }
    let sellPrice = amount * item.sellPrice(chatItemsData.scoreMedian);
    const alterScoreArgs = new AlterUserScoreArgs(user, sellPrice, this.name, Plugin.SELL_REASON);
    sellPrice = chat.alterUserScore(alterScoreArgs);
    chatItemsData.moveToInventory(inventory, item, amount, chatItemsData.shopInventory);
    let successMsg: string;

    if (playerHasInsufficientAmount) {
      successMsg = `You did not have ${item.prototype.prettyName()} (<i>${amountAndItemName.amount}</i>).\n\n`;
      successMsg += `Instead sold ${item.prototype.prettyName()} (<i>${amount}</i>) for <i>${sellPrice}</i> points!`;

    } else if (amount > 1) {
      successMsg = `Sold ${item.prototype.prettyName()} (<i>${amount}</i>) for <i>${sellPrice}</i> points!`;

    } else {
      successMsg = `Sold ${item.prototype.prettyName()} for <i>${sellPrice}</i> points!`;
    }
    return successMsg;
  }

  private getOrCreateChatItemsData(chat: Chat): ChatItemsData {
    let data = this.chatsItemsData.get(chat.id);
    if (!data) {
      data = new ChatItemsData(chat.id);
      data.scoreMedian = this.calculateScoreMedian(chat);
      this.itemPacks.forEach(pack => pack.onChatInitialisation(data));
      this.chatsItemsData.set(chat.id, data);
    }
    return data;
  }

  private determineAmountAndItemNameFromInput(match: string): { amount: number, itemName: string } {
    const matchSplit = match.split(" ");
    let amount: number;
    let itemName: string;

    if (matchSplit.length > 1) {
      amount = Number(matchSplit[matchSplit.length - 1]);

      if (isNaN(amount)) {
        amount = 1;
        itemName = match;

      } else {
        itemName = matchSplit.slice(0, -1).join(" ");
      }

    } else {
      amount = 1;
      itemName = match;
    }
    itemName = itemName.toLowerCase();
    return { amount, itemName };
  }


  private onHourlyTick(eventArgs: EmptyEventArguments): void {
    const chatIds = Array.from(this.chatsItemsData.keys());
    chatIds.forEach((chatId) => {
      const chat = this.getChat(chatId);

      if (!chat) {
        this.chatsItemsData.delete(chatId);

      } else {
        const newScoreMedian = this.calculateScoreMedian(chat);
        const chatData = this.chatsItemsData.get(chatId);
        chatData.scoreMedian = newScoreMedian;
        this.itemPacks.forEach(pack => pack.OnHourlyTick(chatData));
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

  private onNightlyUpdate(eventArgs: EmptyEventArguments): void {
    this.chatsItemsData.forEach(data => this.itemPacks.forEach(pack => pack.OnNightlyUpdate(data)));
  }


  private loadData(): void {

    // Packs and prototypes from those packs (TODO: Clean up)
    const directory = "plugins/DankTimesBot-Plugin-Items/packs/";
    const packsDirs = fs.readdirSync(directory).filter((f: any) => fs.statSync(directory + "/" + f).isDirectory());
    const packs = packsDirs.map(packDir => new (require(`./packs/${packDir}/item-pack.js`)).ItemPack());  // TODO: What if not found?
    this.itemPacks = packs as ItemPack[];
    this.itemPacks.forEach(pack => pack.itemProtoTypes().forEach(protoType => this.itemProtoTypes.set(protoType.id, protoType))); // TODO: What if id already exists?

    // Chats data, from file
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
      const protoType = this.itemProtoTypes.get(raw.prototypeId);   // TODO: What if id not found?
      return new Item(protoType, raw.stackSize);
    }) ?? [];
  }

  private persistData(): void {
    this.saveDataToFile(Plugin.ITEMS_CHATS_DATA_FILE, this.chatsItemsData);
  }
}

