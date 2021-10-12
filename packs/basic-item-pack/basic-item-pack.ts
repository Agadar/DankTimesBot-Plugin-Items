import { AbstractItemPack } from "../../abstract-item-pack";
import { ChatItemsData } from "../../chat/chat-items-data";
import { Item } from "../../item/item";
import { ItemProtoType } from "../../item/item-prototype";
import { Cookie } from "./cookie";

export class BasicItemPack extends AbstractItemPack {

    private readonly numberOfCookiesInShop = 10;

    private readonly dtbCoinPrototype = new ItemProtoType(0, "DTB Coin", 20000, 19000, "🪙", "Limited Edition", ["Miscellaneous"],
        false, false, [], true, true);
    private readonly cookieProtoType = new Cookie(1);
    private readonly developerBrainProtoType = new ItemProtoType(2, "Preserved Developer's Brain", 60, 30, "🧠",
        "It's extraordinarily smooth.", ["Miscellaneous"]);

    private readonly protoTypes = [ this.dtbCoinPrototype, this.cookieProtoType, this.developerBrainProtoType ];

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
        const cookies = new Item(this.cookieProtoType.id, this.numberOfCookiesInShop);
        chatItemsData.shopInventory.push(cookies);
    }

    /**
     * From AbstractItemPack.
     */
    public OnNightlyUpdate(chatItemsData: ChatItemsData): void {
        const cookiesCount = chatItemsData.shopInventory.filter((item) => item.prototypeId === this.cookieProtoType.id).length;
        const diff = this.numberOfCookiesInShop - cookiesCount;

        if (diff > 0) {
            const freshCookies = new Item(this.cookieProtoType.id, diff);
            chatItemsData.addToInventory(chatItemsData.shopInventory, freshCookies);
        }
        if (!chatItemsData.shopInventory.find((item) => item.prototypeId === this.developerBrainProtoType.id) && Math.random() > 0.9) {
            const freshBrain = new Item(this.developerBrainProtoType.id, 1);
            chatItemsData.addToInventory(chatItemsData.shopInventory, freshBrain);
        }
        if (!chatItemsData.shopInventory.find((item) => item.prototypeId === this.dtbCoinPrototype.id) && Math.random() > 0.8) {
            const newCoin = new Item(this.dtbCoinPrototype.id, 1);
            chatItemsData.addToInventory(chatItemsData.shopInventory, newCoin);
        }
     }
}
