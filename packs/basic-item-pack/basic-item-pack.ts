import { AbstractItemPack } from "../../abstract-item-pack";
import { ChatItemsData } from "../../chat/chat-items-data";
import { Item } from "../../item/item";
import { ItemProtoType } from "../../item/item-prototype";
import { Cookie } from "./cookie";

export class BasicItemPack extends AbstractItemPack {

    private readonly numberOfCookiesInShop = 10;

    private readonly dtbCoinPrototype = new ItemProtoType(0, "DTB Coin", 20000, 0.95, "🪙", "Limited Edition", ["Miscellaneous"],
        false, false, [], true, true);
    private readonly cookieProtoType = new Cookie(1);
    private readonly developerBrainProtoType = new ItemProtoType(2, "Preserved Developer's Brain", 60, 0.5, "🧠",
        "It's extraordinarily smooth.", ["Miscellaneous"]);
    private readonly monkeyNFTProtoType = new ItemProtoType(3, "Monkey NFT", 250, 0.5, "🐒",
        "Unique and programmatically generated from over 170 possible traits.", ["Miscellaneous"]);

    private readonly protoTypes = [ this.dtbCoinPrototype, this.cookieProtoType, this.developerBrainProtoType, this.monkeyNFTProtoType ];

    constructor() {
        super("BasicItemPack");
    }

    /**
     * From AbstractItemPack.
     */
    public itemProtoTypes(): ItemProtoType[] {
        return this.protoTypes;
    }

    /**
     * From AbstractItemPack.
     */
    public onChatInitialisation(chatItemsData: ChatItemsData): void {
        const cookies = new Item(this.cookieProtoType, this.numberOfCookiesInShop);
        chatItemsData.addToInventory(chatItemsData.shopInventory, cookies);
    }

    /**
     * From AbstractItemPack.
     */
    public OnNightlyUpdate(chatItemsData: ChatItemsData): void {
        if (!chatItemsData.shopInventory.find((item) => item.prototype === this.cookieProtoType) && Math.random() > 0.8) {
            const numberOfCookies = Math.floor(Math.random() * 10) + 1;
            const freshCookies = new Item(this.cookieProtoType, numberOfCookies);
            chatItemsData.addToInventory(chatItemsData.shopInventory, freshCookies);
        }
        if (!chatItemsData.shopInventory.find((item) => item.prototype === this.developerBrainProtoType) && Math.random() > 0.8) {
            const freshBrain = new Item(this.developerBrainProtoType, 1);
            chatItemsData.addToInventory(chatItemsData.shopInventory, freshBrain);
        }
        if (!chatItemsData.shopInventory.find((item) => item.prototype === this.dtbCoinPrototype) && Math.random() > 0.8) {
            const newCoin = new Item(this.dtbCoinPrototype, 1);
            chatItemsData.addToInventory(chatItemsData.shopInventory, newCoin);
        }
        if (!chatItemsData.shopInventory.find((item) => item.prototype === this.monkeyNFTProtoType) && Math.random() > 0.8) {
            const newMonkey = new Item(this.monkeyNFTProtoType, 1);
            chatItemsData.addToInventory(chatItemsData.shopInventory, newMonkey);
        }
    }
}
