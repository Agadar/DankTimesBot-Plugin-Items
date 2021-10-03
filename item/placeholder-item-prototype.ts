import { ItemProtoType } from "./item-prototype";

/**
 * Placeholder for when an item is loaded from persistant storage but the prototype
 * which it points to hasn't been loaded (yet) into the Items plugin via the item
 * prototype register event.
 */
export class PlaceholderItemPrototype extends ItemProtoType {

    constructor(id: number) {
        super(id, "Mysterious Object", 0, 0, "❓", "A riddle wrapped in a mystery inside an enigma",
            ["Placeholder"], false, false, false, false);
    }
}
