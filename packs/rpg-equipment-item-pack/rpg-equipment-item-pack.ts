import { AbstractItemPack } from "../../abstract-item-pack";
import { ChatItemsData } from "../../chat/chat-items-data";
import { Item } from "../../item/item";
import { ItemProtoType } from "../../item/item-prototype";
import { ItemEffect } from "./item-effect";
import { RpgPrototypes } from "./rpg-prototypes";

export class RPGEquipmentItemPack extends AbstractItemPack {

    private readonly rpgPrototypes = new RpgPrototypes();
    private readonly maxEquipmentsInShop = 3;

    constructor() {
        super("RpgEquipmentItemPack");
    }

    /**
     * From AbstractItemPack.
     */
    public itemProtoTypes(): ItemProtoType[] {
        return this.rpgPrototypes.allPrototypes;
    }

    /**
     * From AbstractItemPack.
     */
    public onChatInitialisation(chatItemsData: ChatItemsData): void {
        for (let i = 0; i < this.maxEquipmentsInShop; i++) {
            this.addRandomEquipment(chatItemsData);
        }
    }

    /**
     * From AbstractItemPack.
     */
    public OnHourlyTick(chatItemsData: ChatItemsData): void {
        const prototypeIds = this.itemProtoTypes().map(prototype => prototype.id);
        let equipmentInShop: Item[];

        while ((equipmentInShop = chatItemsData.shopInventory.filter(item => prototypeIds.includes(item.prototype.id))).length >= this.maxEquipmentsInShop) {
            const randomIndex = Math.floor(Math.random() * equipmentInShop.length);
            const randomItem = equipmentInShop[randomIndex];
            chatItemsData.removeFromInventory(chatItemsData.shopInventory, randomItem, 1);
        }
        this.addRandomEquipment(chatItemsData);
    }

    /**
     * From AbstractItemPack.
     */
    public OnNightlyUpdate(chatItemsData: ChatItemsData): void {
        this.onChatInitialisation(chatItemsData);
    }

    private addRandomEquipment(chatItemsData: ChatItemsData) {
        const random = Math.random();

        if (random < 1 / 5) {
            this.addRandomEquipmentOfType(this.rpgPrototypes.oneHandedItemProtoTypes, chatItemsData);
        } else if (random < 2 / 5) {
            this.addRandomEquipmentOfType(this.rpgPrototypes.twoHandedItemProtoTypes, chatItemsData);
        } else if (random < 3 / 5) {
            this.addRandomEquipmentOfType(this.rpgPrototypes.offHandItemProtoTypes, chatItemsData);
        } else if (random < 4 / 5) {
            this.addRandomEquipmentOfType(this.rpgPrototypes.ringItemProtoTypes, chatItemsData);
        } else {
            this.addRandomEquipmentOfType(this.rpgPrototypes.necklaceItemProtoTypes, chatItemsData);
        }
    }

    private addRandomEquipmentOfType(prototypes: ItemProtoType[], chatItemsData: ChatItemsData): void {
        const randomPrototypeIndex = Math.floor(Math.random() * prototypes.length);
        const prototype = prototypes[randomPrototypeIndex];

        const randomEffectIndex = Math.floor(Math.random() * ItemEffect.ALL.size);
        const effect = Array.from(ItemEffect.ALL)[randomEffectIndex][1];

        const item = new Item(prototype, 1, 1, effect.name);
        chatItemsData.addToInventory(chatItemsData.shopInventory, item);
    }
}
