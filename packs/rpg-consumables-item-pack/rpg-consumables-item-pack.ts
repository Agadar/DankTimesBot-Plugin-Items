import { Chat } from "../../../../src/chat/chat";
import { User } from "../../../../src/chat/user/user";

import { AbstractItemPack } from "../../abstract-item-pack";
import { ChatItemsData } from "../../chat/chat-items-data";
import { Item } from "../../item/item";
import { ItemProtoType } from "../../item/item-prototype";
import { HealingPotionProtoType } from "./healing-potion-prototype";

export class RpgConsumablesItemPack extends AbstractItemPack {

    private readonly dtbCoinPrototype = new ItemProtoType(0, "DTB Coin", 20000, 0.5, "🪙", "Limited Edition", ["Miscellaneous"],
        false, false, [], true, true);
    private readonly healingPotionProtoType: HealingPotionProtoType;
    private readonly developerBrainProtoType = new ItemProtoType(2, "Preserved Developer's Brain", 60, 0.5, "🧠",
        "It's extraordinarily smooth.", ["Miscellaneous"]);
    private readonly monkeyNFTProtoType = new ItemProtoType(3, "Monkey NFT", 250, 0.5, "🐒",
        "Unique and programmatically generated from over 170 possible traits.", ["Miscellaneous"]);

    private readonly protoTypes: ItemProtoType[];

    constructor(potionEffect: (chat: Chat, user: User) => boolean) {
        super("RpgConsumablesItemPack");

        this.healingPotionProtoType = new HealingPotionProtoType(1, potionEffect);
        this.protoTypes = [ this.dtbCoinPrototype, this.healingPotionProtoType, this.developerBrainProtoType, this.monkeyNFTProtoType ];
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
        this.addRandomBasicItems(chatItemsData);
    }

    /**
     * From AbstractItemPack.
     */
    public OnNightlyUpdate(chatItemsData: ChatItemsData): void {
        this.addRandomBasicItems(chatItemsData);
    }

    private addRandomBasicItems(chatItemsData: ChatItemsData): void {
        const numberOfHealingPotions = Math.floor(Math.random() * 5) + 1;   // At least 1 healing potion, at most 5.
        const healingPotions = new Item(this.healingPotionProtoType, numberOfHealingPotions);
        chatItemsData.addToInventory(chatItemsData.shopInventory, healingPotions);
    }
}
