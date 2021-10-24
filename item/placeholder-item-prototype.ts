import { ItemProtoType } from "./item-prototype";

/**
 * Placeholder for when an item is loaded from persistant storage but the prototype
 * which it points to hasn't been loaded (yet) into the Items plugin via the item
 * prototype register event.
 */
export class PlaceholderItemPrototype extends ItemProtoType {

    public static readonly PLACEHOLDER_NAME = "Mysterious Object";

    constructor(id: number) {
        super(id, PlaceholderItemPrototype.PLACEHOLDER_NAME, 0, 0, "❓", "A riddle wrapped in a mystery inside an enigma",
            ["Placeholder"], false, false, [], false, false);
    }
}
