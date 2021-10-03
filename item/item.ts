/**
 * Instance of an item, indicating an amount and pointing to the item prototype
 * of which this is an instance.
 */
export class Item {

    constructor(
        public prototypeId: number,
        public stackSize: number,
    ) {
    }
}
