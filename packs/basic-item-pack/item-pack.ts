import { AbstractItemPack } from "../../abstract-item-pack";
import { ChatItemsData } from "../../chat/chat-items-data";
import { Item } from "../../item/item";
import { ItemProtoType } from "../../item/item-prototype";
import { Cookie } from "./cookie";

export class ItemPack extends AbstractItemPack {

    private readonly numberOfCookiesInShop = 10;

    private readonly stonksProtoType = new ItemProtoType(0, "Stonks", 0.1, 0.095, "📈", "\"Hodl!\"", ["Miscellaneous"]);
    private readonly cookieProtoType = new Cookie(1);
    private readonly developerBrainProtoType = new ItemProtoType(2, "Preserved Developer's Brain", 0.3, 0.15, '🧠',
        "It's extraordinarily smooth.", ["Miscellaneous"])

    private readonly protoTypes = [ this.stonksProtoType, this.cookieProtoType, this.developerBrainProtoType ];

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
        const stonks = new Item(this.stonksProtoType, 1000);
        chatItemsData.shopInventory.push(stonks);

        const cookies = new Item(this.cookieProtoType, this.numberOfCookiesInShop);
        chatItemsData.shopInventory.push(cookies);
    }

    /**
     * From AbstractItemPack.
     */
    public OnNightlyUpdate(chatItemsData: ChatItemsData): void {
        const cookiesCount = chatItemsData.shopInventory.filter(item => item.prototype === this.cookieProtoType).length;
        const diff = this.numberOfCookiesInShop - cookiesCount;

        if (diff > 0) {
            const freshCookies = new Item(this.cookieProtoType, diff);
            chatItemsData.addToInventory(chatItemsData.shopInventory, freshCookies);
        }
        if (!chatItemsData.shopInventory.find(item => item.prototype === this.developerBrainProtoType) && Math.random() > 0.8) {
            const freshBrain = new Item(this.developerBrainProtoType, 1);
            chatItemsData.addToInventory(chatItemsData.shopInventory, freshBrain);
        }
     }
}