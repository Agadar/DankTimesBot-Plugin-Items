import { User } from "../../../src/chat/user/user";
import { Item } from "../item/item";

export class ChatInventoryManager {

    constructor(private readonly inventories = new Map<number, Item[]>()) { }

    public getOrCreateInventory(user: User): Item[] {
        let inventory = this.inventories.get(user.id);
        if (!inventory) {
            inventory = new Array<Item>();
            this.inventories.set(user.id, inventory);
        }
        return inventory;
    }

    public toJSON(): { userId: number, inventory: Item[] }[] {
        return Array.from(this.inventories, ([key, value]) => ({ userId: key, inventory: value }));
    }
}
