import { AbstractItemPack } from "../../abstract-item-pack";
import { ChatItemsData } from "../../chat/chat-items-data";
import { Item } from "../../item/item";
import { ItemProtoType } from "../../item/item-prototype";
import { Avatar } from "./avatar";
import { AvatarValuePack } from "./avatar-value-pack";
import { emojiList } from "./emojis";

export class AvatarItemPack extends AbstractItemPack {

    private readonly numberOfAvatarsInShop = 3;

    private readonly avatarProtoType = new Avatar(100);
    private readonly avatarValuePackProtoType = new AvatarValuePack(101);

    private readonly protoTypes = [this.avatarProtoType, this.avatarValuePackProtoType];

    constructor() {
        super("AvatarItemPack");
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
        for (let i = 0; i < this.numberOfAvatarsInShop; i++) {
            chatItemsData.addToInventory(chatItemsData.shopInventory, this.generateRandomAvatar());
        }
        chatItemsData.addToInventory(chatItemsData.shopInventory, new Item(this.avatarValuePackProtoType, 1));
    }

    /**
     * From AbstractItemPack.
     */
    public OnHourlyTick(chatItemsData: ChatItemsData): void {
        let avatarsInShop: Item[];

        while ((avatarsInShop = chatItemsData.shopInventory.filter(item => item.prototype.id === this.avatarProtoType.id)).length > this.numberOfAvatarsInShop - 1) {
            const randomIndex = Math.floor(Math.random() * avatarsInShop.length);
            const randomItem = avatarsInShop[randomIndex];
            chatItemsData.removeFromInventory(chatItemsData.shopInventory, randomItem, 1);
        }
        chatItemsData.addToInventory(chatItemsData.shopInventory, this.generateRandomAvatar());

        if (chatItemsData.shopInventory.filter(item => item.prototype === this.avatarValuePackProtoType).length < 1) {
            chatItemsData.addToInventory(chatItemsData.shopInventory, new Item(this.avatarValuePackProtoType, 1));
        }
    }

    /**
     * From AbstractItemPack.
     */
    public OnNightlyUpdate(chatItemsData: ChatItemsData): void {
        this.onChatInitialisation(chatItemsData);
    }

    private generateRandomAvatar(): Item {
        const randomIndex = Math.floor(Math.random() * emojiList.length);
        const avatar = emojiList[randomIndex];
        return new Item(this.avatarProtoType, 1, 1, avatar);
    }
}
