import { AbstractItemPack } from "../../abstract-item-pack";
import { ChatItemsData } from "../../chat/chat-items-data";
import { Item } from "../../item/item";
import { ItemProtoType } from "../../item/item-prototype";
import { RpgPrototypes } from "./rpg-prototypes";

export class RPGEquipmentItemPack extends AbstractItemPack {

    private readonly rpgPrototypes = new RpgPrototypes();

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
        this.addRandomEquipmentOfType(this.rpgPrototypes.oneHandedItemProtoTypes, chatItemsData);
        this.addRandomEquipmentOfType(this.rpgPrototypes.twoHandedItemProtoTypes, chatItemsData);
        this.addRandomEquipmentOfType(this.rpgPrototypes.offHandItemProtoTypes, chatItemsData);
        this.addRandomEquipmentOfType(this.rpgPrototypes.ringItemProtoTypes, chatItemsData);
        this.addRandomEquipmentOfType(this.rpgPrototypes.necklaceItemProtoTypes, chatItemsData);
    }

    /**
     * From AbstractItemPack.
     */
    public OnHourlyTick(chatItemsData: ChatItemsData): void {
        const prototypeIds = this.itemProtoTypes().map(prototype => prototype.id);
        let equipmentInShop: Item[];

        while ((equipmentInShop = chatItemsData.shopInventory.filter(item => prototypeIds.includes(item.prototype.id))).length > 4) {
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
        const randomIndex = Math.floor(Math.random() * prototypes.length);
        const prototype = prototypes[randomIndex];
        const item = new Item(prototype, 1, 1);
        chatItemsData.addToInventory(chatItemsData.shopInventory, item);
    }
}
