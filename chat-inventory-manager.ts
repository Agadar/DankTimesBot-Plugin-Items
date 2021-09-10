import { User } from "../../src/chat/user/user";
import { Item } from "./item";

export class ChatInventoryManager {

    private readonly inventories: Map<number, Item[]> = new Map();

    public getOrCreateInventory(user: User): Item[] {
        let inventory = this.inventories.get(user.id);
        if (!inventory) {
            inventory = new Array<Item>();
            this.inventories.set(user.id, inventory);
        }
        return inventory;
    }
}
