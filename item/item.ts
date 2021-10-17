import { ItemProtoType } from "./item-prototype";

/**
 * Instance of an item, indicating an amount and pointing to the item prototype
 * of which this is an instance.
 */
export class Item {

    constructor(
        public prototype: ItemProtoType,
        public stackSize: number,
    ) {
    }

    /**
     * Comparison method for sorting arrays. Sorts according to prototype.
     */
    public static compare(a: Item, b: Item): number {
        return ItemProtoType.compare(a.prototype, b.prototype);
    }

    public toJSON(): { prototypeId: number, stackSize: number } {
        return { prototypeId: this.prototype.id, stackSize: this.stackSize };
    }
}
