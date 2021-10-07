import { Item } from "../item/item";
import { ChatEquipmentManager } from "./chat-equipment-manager";
import { ChatInventoryManager } from "./chat-inventory-manager";

export class ChatItemsData {

    constructor(
        public readonly chatId: number,
        public readonly inventoryManager = new ChatInventoryManager(),
        public readonly equipmentManager = new ChatEquipmentManager(),
        public readonly shopInventory = new Array<Item>()) { }

    public moveToInventory(from: Item[], item: Item, amount: number, to: Item[]): void {
        this.removeFromInventory(from, item, amount);
        const itemToAdd = new Item(item.prototypeId, amount);
        this.addToInventory(to, itemToAdd);
    }

    public addToInventory(to: Item[], item: Item) {
        const itemInTargetInventory = to.find((toFind) => toFind.prototypeId === item.prototypeId);

        if (itemInTargetInventory) {
            itemInTargetInventory.stackSize += item.stackSize;

        } else {
            to.push(item);
        }
    }

    public removeFromInventory(from: Item[], item: Item, amount: number) {
        if (item.stackSize - amount <= 0) {
            from.splice(from.indexOf(item), 1);

        } else {
            item.stackSize -= amount;
        }
    }
}
