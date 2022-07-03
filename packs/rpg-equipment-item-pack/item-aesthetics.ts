import { ItemType } from "./item-type";

export class ItemAesthetics {

    public static readonly ALL = new Map<string, ItemAesthetics>([

        // One-Handed
        ["Longsword", new ItemAesthetics("🗡️", "Longsword", ItemType.ALL.get("One-Handed"))],
        ["Dagger", new ItemAesthetics("🔪", "Dagger", ItemType.ALL.get("One-Handed"))],
        ["Mace", new ItemAesthetics("🔨", "Mace", ItemType.ALL.get("One-Handed"))],
        ["Handaxe", new ItemAesthetics("🪓", "Handaxe", ItemType.ALL.get("One-Handed"))],
        ["Warpick", new ItemAesthetics("⛏️", "Warpick", ItemType.ALL.get("One-Handed"))],
        ["Blunderbuss", new ItemAesthetics("🔫", "Blunderbuss", ItemType.ALL.get("One-Handed"))],
        ["Boomerang", new ItemAesthetics("🪃", "Boomerang", ItemType.ALL.get("One-Handed"))],
        ["Wand", new ItemAesthetics("🪄", "Wand", ItemType.ALL.get("One-Handed"))],

        // Two-Handed
        ["Greatsword", new ItemAesthetics("🗡️", "Greatsword", ItemType.ALL.get("Two-Handed"))],
        ["Shortbow", new ItemAesthetics("🏹", "Shortbow", ItemType.ALL.get("Two-Handed"))],
        ["Longbow", new ItemAesthetics("🏹", "Longbow", ItemType.ALL.get("Two-Handed"))],
        ["Maul", new ItemAesthetics("🔨", "Maul", ItemType.ALL.get("Two-Handed"))],
        ["Greataxe", new ItemAesthetics("🪓", "Greataxe", ItemType.ALL.get("Two-Handed"))],
        ["Twin Blades", new ItemAesthetics("⚔️", "Twin Blades", ItemType.ALL.get("Two-Handed"))],
        ["Musket", new ItemAesthetics("🔫", "Musket", ItemType.ALL.get("Two-Handed"))],

        // Off-Hand
        ["Crystal Ball", new ItemAesthetics("🔮", "Crystal Ball", ItemType.ALL.get("Off-Hand"))],
        ["Shield", new ItemAesthetics("🛡️", "Shield", ItemType.ALL.get("Off-Hand"))],
        ["Warhorn", new ItemAesthetics("📯", "Warhorn", ItemType.ALL.get("Off-Hand"))],
        ["Aegis", new ItemAesthetics("🛡️", "Aegis", ItemType.ALL.get("Off-Hand"))],
        ["Bulwark", new ItemAesthetics("🛡️", "Bulwark", ItemType.ALL.get("Off-Hand"))],
        ["Crest", new ItemAesthetics("🛡️", "Crest", ItemType.ALL.get("Off-Hand"))],

        // Finger
        ["Ring", new ItemAesthetics("💍", "Ring", ItemType.ALL.get("Finger"))],
        ["Signet", new ItemAesthetics("💍", "Signet", ItemType.ALL.get("Finger"))],
        ["Loop", new ItemAesthetics("💍", "Loop", ItemType.ALL.get("Finger"))],
        ["Band", new ItemAesthetics("💍", "Band", ItemType.ALL.get("Finger"))],

        // Neck
        ["Necklace", new ItemAesthetics("📿", "Necklace", ItemType.ALL.get("Neck"))],
        ["Collar", new ItemAesthetics("📿", "Collar", ItemType.ALL.get("Neck"))],
        ["Choker", new ItemAesthetics("📿", "Choker", ItemType.ALL.get("Neck"))],
        ["Talisman", new ItemAesthetics("📿", "Talisman", ItemType.ALL.get("Neck"))],
        ["Pendant", new ItemAesthetics("📿", "Pendant", ItemType.ALL.get("Neck"))],
        ["Amulet", new ItemAesthetics("📿", "Amulet", ItemType.ALL.get("Neck"))],
        ["Chain", new ItemAesthetics("📿", "Chain", ItemType.ALL.get("Neck"))],
        ["Medallion", new ItemAesthetics("📿", "Medallion", ItemType.ALL.get("Neck"))],
    ]);

    /**
     * Deprecated.
     */
    public static oneHandedWeapons(): ItemAesthetics[] {
        return [
            ItemAesthetics.ALL.get("Longsword"),
            ItemAesthetics.ALL.get("Dagger"),
            ItemAesthetics.ALL.get("Mace"),
            ItemAesthetics.ALL.get("Handaxe"),
            ItemAesthetics.ALL.get("Warpick"),
            ItemAesthetics.ALL.get("Blunderbuss"),
            ItemAesthetics.ALL.get("Boomerang"),
            ItemAesthetics.ALL.get("Wand")
        ];
    }

    /**
     * Deprecated.
     */
    public static twoHandedWeapons(): ItemAesthetics[] {
        return [
            ItemAesthetics.ALL.get("Greatsword"),
            ItemAesthetics.ALL.get("Shortbow"),
            ItemAesthetics.ALL.get("Longbow"),
            ItemAesthetics.ALL.get("Maul"),
            ItemAesthetics.ALL.get("Greataxe"),
            ItemAesthetics.ALL.get("Twin Blades"),
            ItemAesthetics.ALL.get("Musket")
        ];
    }

    /**
     * Deprecated.
     */
    public static offHandWeapons(): ItemAesthetics[] {
        return [
            ItemAesthetics.ALL.get("Crystal Ball"),
            ItemAesthetics.ALL.get("Shield"),
            ItemAesthetics.ALL.get("Warhorn")
        ];
    }

    /**
     * Deprecated.
     */
    public static rings(): ItemAesthetics[] {
        return [
            ItemAesthetics.ALL.get("Ring"),
            ItemAesthetics.ALL.get("Signet"),
            ItemAesthetics.ALL.get("Loop"),
            ItemAesthetics.ALL.get("Band")
        ];
    }

    /**
     * Deprecated.
     */
    public static necklaces(): ItemAesthetics[] {
        return [
            ItemAesthetics.ALL.get("Necklace"),
            ItemAesthetics.ALL.get("Collar"),
            ItemAesthetics.ALL.get("Choker"),
            ItemAesthetics.ALL.get("Talisman"),
            ItemAesthetics.ALL.get("Pendant"),
            ItemAesthetics.ALL.get("Amulet"),
            ItemAesthetics.ALL.get("Chain"),
            ItemAesthetics.ALL.get("Medallion")
        ];
    }

    /**
     * Deprecated.
     */
    public static newShields(): ItemAesthetics[] {
        return [
            ItemAesthetics.ALL.get("Aegis"),
            ItemAesthetics.ALL.get("Bulwark"),
            ItemAesthetics.ALL.get("Crest")
        ];
    }

    constructor(
        public readonly icon: string,
        public readonly name: string,
        public readonly itemType: ItemType) { }
}