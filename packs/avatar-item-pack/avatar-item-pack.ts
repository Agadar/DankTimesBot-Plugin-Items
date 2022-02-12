import { AbstractItemPack } from "../../abstract-item-pack";
import { ChatItemsData } from "../../chat/chat-items-data";
import { Item } from "../../item/item";
import { ItemProtoType } from "../../item/item-prototype";
import { Avatar } from "./avatar";
import { emojiList } from "./emojis";

export class AvatarItemPack extends AbstractItemPack {

    private readonly numberOfAvatarsInShop = 3;
    private readonly avatarProtoType = new Avatar(100);
    private readonly protoTypes = [this.avatarProtoType];

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
            chatItemsData.shopInventory.push(this.generateRandomAvatar());
        }
    }

    /**
     * From AbstractItemPack.
     */
    public OnHourlyTick(chatItemsData: ChatItemsData): void {
        let avatarsInShop: Item[];

        while ((avatarsInShop = chatItemsData.shopInventory.filter(item => item.prototype.id === this.avatarProtoType.id)).length > this.numberOfAvatarsInShop - 1) {
            const randomIndex = Math.floor(Math.random() * avatarsInShop.length);
            const randomItem = avatarsInShop[randomIndex];
            const indexInShop = chatItemsData.shopInventory.indexOf(randomItem);
            chatItemsData.shopInventory.splice(indexInShop, 1);
        }
        chatItemsData.shopInventory.push(this.generateRandomAvatar());
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
