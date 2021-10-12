import TelegramBot from "node-telegram-bot-api";
import { BotCommand } from "../../src/bot-commands/bot-command";
import { AlterUserScoreArgs } from "../../src/chat/alter-user-score-args";
import { Chat } from "../../src/chat/chat";
import { ChatSettingTemplate } from "../../src/chat/settings/chat-setting-template";
import { User } from "../../src/chat/user/user";
import { CustomEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/custom-event-arguments";
import { EmptyEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/empty-event-arguments";
import { PreUserScoreChangedEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/pre-user-score-changed-event-arguments";
import { PluginEvent } from "../../src/plugin-host/plugin-events/plugin-event-types";
import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";
import { AbstractItemPack } from "./abstract-item-pack";
import { ChatItemsData } from "./chat/chat-items-data";
import { FileIOHelper } from "./file-io-helper";
import { Item } from "./item/item";
import { ItemProtoType } from "./item/item-prototype";
import { PlaceholderItemPrototype } from "./item/placeholder-item-prototype";
import { BasicItemPack } from "./packs/basic-item-pack/basic-item-pack";
import { RPGEquipmentItemPack } from "./packs/rpg-equipment-item-pack/rpg-equipment-item-pack";

export class Plugin extends AbstractPlugin {

  // Commands
  private static readonly INFO_CMD = "items";
  private static readonly INVENTORY_CMD = "inventory";
  private static readonly EQUIPMENT_CMD = "equipment";
  private static readonly EQUIP_CMD = "equip";
  private static readonly UNEQUIP_CMD = "unequip";
  private static readonly IDENTIFY_CMD = "identify";
  private static readonly USE_CMD = "use";
  private static readonly SHOP_CMD = "shop";
  private static readonly BUY_CMD = "buy";
  private static readonly SELL_CMD = "sell";

  // User score change reasons
  private static readonly BUY_REASON = "buy.item";
  private static readonly SELL_REASON = "sell.item";

  // Events this plugin listens to
  private static readonly ADD_ITEM_PACK_REASON = "add.item.pack";

  // Misc.
  private static readonly ITEMS_PRICES_MULTIPLIER_SETTING = "items.prices.multiplier";

  private readonly fileIOHelper = new FileIOHelper(this.loadDataFromFile.bind(this), this.saveDataToFile.bind(this));

  private chatsItemsData = new Map<number, ChatItemsData>();
  private itemProtoTypes = new Map<number, ItemProtoType>();
  private itemPacks = new Array<AbstractItemPack>();

  constructor() {
    super("Items", "1.0.0-alpha");

    this.subscribeToPluginEvent(PluginEvent.BotStartup, this.onBotStartup.bind(this));
    this.subscribeToPluginEvent(PluginEvent.NightlyUpdate, this.onNightlyUpdate.bind(this));
    this.subscribeToPluginEvent(PluginEvent.PreUserScoreChange, this.onPreUserScoreChange.bind(this));
    this.subscribeToPluginEvent(PluginEvent.HourlyTick, this.onHourlyTick.bind(this));
    this.subscribeToPluginEvent(PluginEvent.BotShutdown, () => this.fileIOHelper.persistData(this.chatsItemsData));
    this.subscribeToPluginEvent(PluginEvent.Custom, this.addItemPack.bind(this), "*", Plugin.ADD_ITEM_PACK_REASON);
  }

  /**
   * @override
   */
  public getPluginSpecificCommands(): BotCommand[] {
    const infoCmd = new BotCommand([Plugin.INFO_CMD], "prints info about the Items plugin", this.itemsInfo.bind(this));
    const inventoryCmd = new BotCommand([Plugin.INVENTORY_CMD], "", this.inventory.bind(this), false);
    const equipmentCmd = new BotCommand([Plugin.EQUIPMENT_CMD], "", this.equipment.bind(this), false);
    const identifyCmd = new BotCommand([Plugin.IDENTIFY_CMD], "", this.identify.bind(this), false);
    const equipCmd = new BotCommand([Plugin.EQUIP_CMD], "", this.equip.bind(this), false);
    const unequipCmd = new BotCommand([Plugin.UNEQUIP_CMD], "", this.unequip.bind(this), false);
    const useCmd = new BotCommand([Plugin.USE_CMD], "", this.use.bind(this), false);
    const shopCmd = new BotCommand([Plugin.SHOP_CMD], "", this.shop.bind(this), false);
    const buyCmd = new BotCommand([Plugin.BUY_CMD], "", this.buy.bind(this), false);
    const sellCmd = new BotCommand([Plugin.SELL_CMD], "", this.sell.bind(this), false);
    return [infoCmd, inventoryCmd, equipmentCmd, identifyCmd, equipCmd, unequipCmd, useCmd, shopCmd, buyCmd, sellCmd];
  }

  /**
   * @override
   */
  public getPluginSpecificChatSettings(): Array<ChatSettingTemplate<any>> {
    const priceMultiplierSetting = new ChatSettingTemplate(Plugin.ITEMS_PRICES_MULTIPLIER_SETTING,
      "The multiplier for buy and sell prices", 100,
      original => {
        const asNumber = Number(original);
        if (isNaN(asNumber)) {
            throw new RangeError("The value must be a number!");
        }
        return asNumber;
      },
      value => {
        if (value <= 0) {
          throw new RangeError("The value must be greater than 0!");
        }
      });
      return [priceMultiplierSetting];
  }

  /**
   * info command
   */
  private itemsInfo(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    return "📦 The Items plugin supports the following commands:\n\n"
      + `/${Plugin.INVENTORY_CMD} to show your inventory\n`
      + `/${Plugin.EQUIPMENT_CMD} to show your equipment\n`
      + `/${Plugin.IDENTIFY_CMD} to identify an item\n`
      + `/${Plugin.EQUIP_CMD} to equip an item\n`
      + `/${Plugin.UNEQUIP_CMD} to unequip an item\n`
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
      const prototype = this.getOrCreateItemPrototype(item.prototypeId);
      inventoryStr += `\n${prototype.prettyName()}`;
      if (item.stackSize > 1) {
        inventoryStr += ` (<i>${item.stackSize}</i>)`;
      }
      if (prototype.tradeable) {
        const price = this.calculatePrice(chat, prototype.sellPrice, prototype.staticPrice);
        inventoryStr += ` worth <i>${price}</i> points`;
        if (item.stackSize > 1) {
          inventoryStr += " each";
        }
      }
    });
    return inventoryStr;
  }

  /**
   * equipment command
   */
  private equipment(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    const chatItemsData = this.getOrCreateChatItemsData(chat);
    const equipment = chatItemsData.equipmentManager.getOrCreateEquipment(user);

    if (equipment.length === 0) {
      return "👐 You have nothing equipped.";
    }

    let equipmentStr = "You have the following items equipped:\n";
    equipment.forEach((item) => {
      const prototype = this.getOrCreateItemPrototype(item.prototypeId);
      equipmentStr += `\n${prototype.prettyName()}`;
      if (prototype.tradeable) {
        const price = this.calculatePrice(chat, prototype.sellPrice, prototype.staticPrice);
        equipmentStr += ` worth <i>${price}</i> points`;
      }
    });
    return equipmentStr;
  }

  /**
   * identify command
   */
  private identify(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    if (!match) {
      return "😞 You have to tell me what you want to identify.";
    }

    const protoTypes = Array.from(this.itemProtoTypes.values())
      .filter((protoType) => protoType.name.toLowerCase() === match.toLowerCase());

    if (protoTypes.length < 1) {
      return "🤷 That item does not exist.";
    }
    return protoTypes.map((protoType) => protoType.prettyPrint()).join("\n\n");
  }

  /**
   * equip command
   */
  private equip(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    if (!match) {
      return "😞 You have to specify what item you want to equip.";
    }
    const chatItemsData = this.getOrCreateChatItemsData(chat);
    const inventory = chatItemsData.inventoryManager.getOrCreateInventory(user);
    const itemAndPrototype = this.findItemAndPrototype(inventory, match);

    if (!itemAndPrototype) {
      return "😞 You don't have that item.";
    }
    if (itemAndPrototype.prototype.equipmentSlots.length == 0) {
      return `You put ${itemAndPrototype.prototype.prettyName()} on your head. You realize you look like an idiot and quickly take it off.`;
    }
    const equipment = chatItemsData.equipmentManager.getOrCreateEquipment(user);
    const itemsOccupyingDesiredSlots = this.itemsOccupyingDesiredSlots(equipment, itemAndPrototype.prototype);
    let equippedText = `Equipped ${itemAndPrototype.prototype.prettyName()}!`;

    if (itemsOccupyingDesiredSlots.length > 0) {
      equippedText += "\n";
      itemsOccupyingDesiredSlots.forEach(itemOccupyingDesiredSlot => {
        const unequippedPrototype = this.getOrCreateItemPrototype(itemOccupyingDesiredSlot.prototypeId);
        chatItemsData.moveToInventory(equipment, itemOccupyingDesiredSlot, 1, inventory);
        equippedText += `\nUnequipped ${unequippedPrototype.prettyName()}!`;
      });
    }
    chatItemsData.moveToInventory(inventory, itemAndPrototype.item, 1, equipment);
    return equippedText;
  }

  /**
   * equipment command
   */
  private unequip(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    if (!match) {
      return "😞 You have to specify what item you want to unequip.";
    }
    const chatItemsData = this.getOrCreateChatItemsData(chat);
    const equipment = chatItemsData.equipmentManager.getOrCreateEquipment(user);
    const itemAndPrototype = this.findItemAndPrototype(equipment, match);

    if (!itemAndPrototype) {
      return "😞 You don't have that item equipped.";
    }
    const inventory = chatItemsData.inventoryManager.getOrCreateInventory(user);
    chatItemsData.moveToInventory(equipment, itemAndPrototype.item, 1, inventory);
    return `Unequipped ${itemAndPrototype.prototype.prettyName()}!`;
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
    const itemAndPrototype = this.findItemAndPrototype(inventory, match);

    if (!itemAndPrototype) {
      return "😞 You don't have that item.";
    }
    if (!itemAndPrototype.prototype.usable) {
      return `You shake ${itemAndPrototype.prototype.prettyName()} around for a bit and give it a lick. Nothing happens.`;
    }
    const useResult = itemAndPrototype.prototype.onUse(chat, user, msg, match);

    if (itemAndPrototype.prototype.consumedOnUse && useResult.shouldConsume) {
      chatItemsData.removeFromInventory(inventory, itemAndPrototype.item, 1);
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
      const prototype = this.getOrCreateItemPrototype(item.prototypeId);
      inventoryStr += `\n${prototype.prettyName()}`;
      if (item.stackSize > 1) {
        inventoryStr += ` (<i>${item.stackSize}</i>)`;
      }
      const price = this.calculatePrice(chat, prototype.buyPrice, prototype.staticPrice);
      inventoryStr += ` for <i>${price}</i> points`;
      if (item.stackSize > 1) {
        inventoryStr += " each";
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
    const itemAndPrototype = this.findItemAndPrototype(chatItemsData.shopInventory, amountAndItemName.itemName);

    if (!itemAndPrototype) {
      return "😞 The shop doesn't have that item.";
    }
    if (!itemAndPrototype.prototype.tradeable) {
      return "😞 This item cannot be bought.";
    }
    let amount = amountAndItemName.amount;
    const shopHasInsufficientAmount = itemAndPrototype.item.stackSize < amount;

    if (shopHasInsufficientAmount) {
      amount = itemAndPrototype.item.stackSize;
    }
    const individualBuyPrice = this.calculatePrice(chat, itemAndPrototype.prototype.buyPrice,
      itemAndPrototype.prototype.staticPrice);
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
    chatItemsData.moveToInventory(chatItemsData.shopInventory, itemAndPrototype.item, amount, inventory);
    let successMsg: string;

    if (playerHasInsufficientFunds) {
      successMsg = `You did not have enough points for ${itemAndPrototype.prototype.prettyName()} (<i>${amountAndItemName.amount}</i>).\n\n`;
      successMsg += `Instead bought ${itemAndPrototype.prototype.prettyName()} (<i>${amount}</i>) for <i>${-buyPrice}</i> points!`;

    } else if (shopHasInsufficientAmount) {
      successMsg = `The shop did not have ${itemAndPrototype.prototype.prettyName()} (<i>${amountAndItemName.amount}</i>).\n\n`;
      successMsg += `Instead bought ${itemAndPrototype.prototype.prettyName()} (<i>${amount}</i>) for <i>${-buyPrice}</i> points!`;

    } else if (amount > 1) {
      successMsg = `Bought ${itemAndPrototype.prototype.prettyName()} (<i>${amount}</i>) for <i>${-buyPrice}</i> points!`;

    } else {
      successMsg = `Bought ${itemAndPrototype.prototype.prettyName()} for <i>${-buyPrice}</i> points!`;
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
    const itemAndPrototype = this.findItemAndPrototype(inventory, amountAndItemName.itemName);

    if (!itemAndPrototype) {
      return "😞 You don't have that item.";
    }
    if (!itemAndPrototype.prototype.tradeable) {
      return "😞 This item cannot be sold.";
    }
    let amount = amountAndItemName.amount;
    const playerHasInsufficientAmount = itemAndPrototype.item.stackSize < amount;

    if (playerHasInsufficientAmount) {
      amount = itemAndPrototype.item.stackSize;
    }
    let sellPrice = amount * this.calculatePrice(chat, itemAndPrototype.prototype.sellPrice, itemAndPrototype.prototype.staticPrice);
    const alterScoreArgs = new AlterUserScoreArgs(user, sellPrice, this.name, Plugin.SELL_REASON);
    sellPrice = chat.alterUserScore(alterScoreArgs);
    chatItemsData.moveToInventory(inventory, itemAndPrototype.item, amount, chatItemsData.shopInventory);
    let successMsg: string;

    if (playerHasInsufficientAmount) {
      successMsg = `You did not have ${itemAndPrototype.prototype.prettyName()} (<i>${amountAndItemName.amount}</i>).\n\n`;
      successMsg += `Instead sold ${itemAndPrototype.prototype.prettyName()} (<i>${amount}</i>) for <i>${sellPrice}</i> points!`;

    } else if (amount > 1) {
      successMsg = `Sold ${itemAndPrototype.prototype.prettyName()} (<i>${amount}</i>) for <i>${sellPrice}</i> points!`;

    } else {
      successMsg = `Sold ${itemAndPrototype.prototype.prettyName()} for <i>${sellPrice}</i> points!`;
    }
    return successMsg;
  }

  private getOrCreateChatItemsData(chat: Chat): ChatItemsData {
    let data = this.chatsItemsData.get(chat.id);
    if (!data) {
      data = new ChatItemsData(chat.id);
      this.chatsItemsData.set(chat.id, data);
      this.itemPacks.forEach((pack) => pack.onChatInitialisation(data));
    }
    return data;
  }

  private getOrCreateItemPrototype(prototypeId: number): ItemProtoType {
    let prototype = this.itemProtoTypes.get(prototypeId);
    if (!prototype) {
      prototype = new PlaceholderItemPrototype(prototypeId);
      this.itemProtoTypes.set(prototypeId, prototype);
    }
    return prototype;
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

  private findItemAndPrototype(inventory: Item[], match: string): { item: Item, prototype: ItemProtoType } | null {
    return inventory.map((item) => {
      const prototype = this.getOrCreateItemPrototype(item.prototypeId);
      if (prototype.name.toLowerCase() === match.toLowerCase()) {
        return { item, prototype };
      }
      return null;
    }).find((result) => result) ?? null;
  }

  private itemsOccupyingDesiredSlots(equipment: Item[], itemPrototype: ItemProtoType): Item[] {
    return equipment.filter((equippedItem) => {
      const equippedPrototype = this.getOrCreateItemPrototype(equippedItem.prototypeId);
      return equippedPrototype.equipmentSlots.findIndex((equippedSlot) => itemPrototype.equipmentSlots.includes(equippedSlot)) > -1;
    });
  }

  private calculatePrice(chat: Chat, price: number, staticPrice: boolean): number {
    if (staticPrice) {
      return price;
    }
    const multiplier = chat.getSetting<number>(Plugin.ITEMS_PRICES_MULTIPLIER_SETTING);
    return Math.ceil(price * multiplier);
  }

  private onBotStartup(eventArgs: EmptyEventArguments): void {
    this.chatsItemsData = this.fileIOHelper.loadData();
    this.fireCustomEvent(Plugin.ADD_ITEM_PACK_REASON, new BasicItemPack());
    this.fireCustomEvent(Plugin.ADD_ITEM_PACK_REASON, new RPGEquipmentItemPack());
  }

  private onNightlyUpdate(eventArgs: EmptyEventArguments): void {
    this.chatsItemsData.forEach((data) => {
      data.clearShop();
      this.itemPacks.forEach((pack) => pack.OnNightlyUpdate(data));
    });
  }

  private onPreUserScoreChange(event: PreUserScoreChangedEventArguments): void {
    const equipment = this.getOrCreateChatItemsData(event.chat).equipmentManager.getOrCreateEquipment(event.user);
    equipment.forEach((item) => {
      const prototype = this.getOrCreateItemPrototype(item.prototypeId);
      prototype.onPreUserScoreChange(event);
    });
  }

  private onHourlyTick(eventArgs: EmptyEventArguments): void {
    const chatIds = Array.from(this.chatsItemsData.keys());
    chatIds.forEach((chatId) => {
      try {
        const chat = this.getChat(chatId);

        if (!chat) {
          this.chatsItemsData.delete(chatId);

        } else {
          const chatData = this.chatsItemsData.get(chatId);
          this.itemPacks.forEach((pack) => pack.OnHourlyTick(chatData));
        }
      } catch (error) {
        console.error(`Error while performing hourly tick for chat ${chatId} for plugin ${this.name}: ${error}`);
      }
    });
    this.fileIOHelper.persistData(this.chatsItemsData);
  }

  private addItemPack(eventArgs: CustomEventArguments): void {
    const itemPack = eventArgs.eventData as AbstractItemPack;

    if (itemPack) {
      this.itemPacks.push(itemPack);
      const prototypes = itemPack.itemProtoTypes();
      console.info(`Adding ${prototypes.length} items from item pack '${itemPack.name}'`);
      prototypes.forEach((prototype) => {
        this.itemProtoTypes.set(prototype.id, prototype);
      });
    } else {
      console.error(`Failed to add item pack: ${JSON.stringify(eventArgs.eventData)}`);
    }
  }
}
