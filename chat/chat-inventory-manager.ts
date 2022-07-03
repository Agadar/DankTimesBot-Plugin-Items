import { User } from "../../../src/chat/user/user";
import { Item } from "../item/item";
import { ItemProtoType } from "../item/item-prototype";

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

    public toJSON(): Array<{ userId: number, inventory: Item[] }> {
        return Array.from(this.inventories, ([key, value]) => ({ userId: key, inventory: value }));
    }

    public updatePrototypes(prototypes: ItemProtoType[]): void {
        this.inventories.forEach((inventory) => {
            inventory.forEach((item) => {
                const newPrototype = prototypes.find(prototype => prototype.id === item.prototype.id);

                if (newPrototype) {
                    item.prototype = newPrototype;
                }
            });
            inventory.sort(Item.compare);
        });
    }
}
