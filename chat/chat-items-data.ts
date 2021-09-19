import { ChatInventoryManager } from "./chat-inventory-manager";
import { Item } from "../item/item";

export class ChatItemsData {

    constructor(
        public readonly chatId: number,
        public readonly inventoryManager = new ChatInventoryManager(),
        public readonly shopInventory = new Array<Item>(),
        public scoreMedian = 0) { }

    public moveToInventory(from: Item[], item: Item, amount: number, to: Item[]): void {
        this.removeFromInventory(from, item, amount);
        const itemToAdd = new Item(item.prototype, amount);
        this.addToInventory(to, itemToAdd);
    }

    public addToInventory(to: Item[], item: Item) {
        const itemInTargetInventory = to.find(toFind => toFind.sameItemTypeAs(item));

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