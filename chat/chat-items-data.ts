import { User } from "../../../src/chat/user/user";
import { EquipmentSlot } from "../item/equipment-slot";
import { Item } from "../item/item";
import { ItemProtoType } from "../item/item-prototype";
import { ChatEquipmentManager } from "./chat-equipment-manager";
import { ChatInventoryManager } from "./chat-inventory-manager";

export class ChatItemsData {

    public lastOpenedInventory: Item[] = [];

    constructor(
        public readonly chatId: number,
        private readonly inventoryManager = new ChatInventoryManager(),
        private readonly equipmentManager = new ChatEquipmentManager(),
        public readonly shopInventory = new Array<Item>()) { }

    public getOrCreateInventory(user: User): Item[] {
        return this.inventoryManager.getOrCreateInventory(user);
    }

    public getOrCreateEquipment(user: User): Item[] {
        return this.equipmentManager.getOrCreateEquipment(user);
    }

    public getItemInSlot(user: User, slot: EquipmentSlot): Item | null {
        const equipment = this.getOrCreateEquipment(user);
        return equipment.find((item) => item.prototype.equipmentSlots.some((equippedSlot) => equippedSlot === slot)) ?? null;
    }

    public moveToInventory(from: Item[], item: Item, amount: number, to: Item[]): void {
        this.removeFromInventory(from, item, amount);
        const itemToAdd = new Item(item.prototype, amount, item.rank, item.metaData);
        this.addToInventory(to, itemToAdd);
    }

    public addToInventory(to: Item[], item: Item) {
        const itemInTargetInventory = to.find((toFind) => toFind.prototype === item.prototype 
            && toFind.rank === item.rank && toFind.metaData === item.metaData);

        if (itemInTargetInventory) {
            itemInTargetInventory.stackSize += item.stackSize;

        } else {
            to.push(item);
            to.sort(Item.compare);
        }
    }

    public removeFromInventory(from: Item[], item: Item, amount: number) {
        if (item.stackSize - amount <= 0) {
            from.splice(from.indexOf(item), 1);

        } else {
            item.stackSize -= amount;
        }
    }

    public clearShop(): void {
        this.shopInventory.splice(0, this.shopInventory.length);
    }

    public updatePrototypes(prototypes: ItemProtoType[]): void {
        this.shopInventory.forEach((item) => {
            const newPrototype = prototypes.find(prototype => prototype.id === item.prototype.id);

            if (newPrototype) {
                item.prototype = newPrototype;
            }
        });
        this.shopInventory.sort(Item.compare);
        this.inventoryManager.updatePrototypes(prototypes);
        this.equipmentManager.updatePrototypes(prototypes);
    }
}
