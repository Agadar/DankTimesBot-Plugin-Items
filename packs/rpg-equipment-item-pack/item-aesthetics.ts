import { ItemType } from "./item-type";

export class ItemAesthetics {

    public static readonly ALL = new Map<string, ItemAesthetics>([

        // One-Handed
        ["Longsword", new ItemAesthetics(1000, "🗡️", "Longsword", ItemType.ALL.get("One-Handed"))],
        ["Dagger", new ItemAesthetics(1001, "🔪", "Dagger", ItemType.ALL.get("One-Handed"))],
        ["Mace", new ItemAesthetics(1002, "🔨", "Mace", ItemType.ALL.get("One-Handed"))],
        ["Handaxe", new ItemAesthetics(1003, "🪓", "Handaxe", ItemType.ALL.get("One-Handed"))],
        ["Warpick", new ItemAesthetics(1004, "⛏️", "Warpick", ItemType.ALL.get("One-Handed"))],
        ["Blunderbuss", new ItemAesthetics(1005, "🔫", "Blunderbuss", ItemType.ALL.get("One-Handed"))],
        ["Boomerang", new ItemAesthetics(1006, "🪃", "Boomerang", ItemType.ALL.get("One-Handed"))],
        ["Wand", new ItemAesthetics(1007, "🪄", "Wand", ItemType.ALL.get("One-Handed"))],

        // Two-Handed
        ["Greatsword", new ItemAesthetics(1008, "🗡️", "Greatsword", ItemType.ALL.get("Two-Handed"))],
        ["Shortbow", new ItemAesthetics(1009, "🏹", "Shortbow", ItemType.ALL.get("Two-Handed"))],
        ["Longbow", new ItemAesthetics(1010, "🏹", "Longbow", ItemType.ALL.get("Two-Handed"))],
        ["Maul", new ItemAesthetics(1011, "🔨", "Maul", ItemType.ALL.get("Two-Handed"))],
        ["Greataxe", new ItemAesthetics(1012, "🪓", "Greataxe", ItemType.ALL.get("Two-Handed"))],
        ["Twin Blades", new ItemAesthetics(1013, "⚔️", "Twin Blades", ItemType.ALL.get("Two-Handed"))],
        ["Musket", new ItemAesthetics(1014, "🔫", "Musket", ItemType.ALL.get("Two-Handed"))],

        // Off-Hand
        ["Crystal Ball", new ItemAesthetics(1015, "🔮", "Crystal Ball", ItemType.ALL.get("Off-Hand"))],
        ["Shield", new ItemAesthetics(1016, "🛡️", "Shield", ItemType.ALL.get("Off-Hand"))],
        ["Warhorn", new ItemAesthetics(1017, "📯", "Warhorn", ItemType.ALL.get("Off-Hand"))],
        ["Aegis", new ItemAesthetics(1018, "🛡️", "Aegis", ItemType.ALL.get("Off-Hand"))],
        ["Bulwark", new ItemAesthetics(1019, "🛡️", "Bulwark", ItemType.ALL.get("Off-Hand"))],
        ["Crest", new ItemAesthetics(1020, "🛡️", "Crest", ItemType.ALL.get("Off-Hand"))],

        // Finger
        ["Ring", new ItemAesthetics(1021, "💍", "Ring", ItemType.ALL.get("Finger"))],
        ["Signet", new ItemAesthetics(1022, "💍", "Signet", ItemType.ALL.get("Finger"))],
        ["Loop", new ItemAesthetics(1023, "💍", "Loop", ItemType.ALL.get("Finger"))],
        ["Band", new ItemAesthetics(1024, "💍", "Band", ItemType.ALL.get("Finger"))],

        // Neck
        ["Necklace", new ItemAesthetics(1025, "📿", "Necklace", ItemType.ALL.get("Neck"))],
        ["Collar", new ItemAesthetics(1026, "📿", "Collar", ItemType.ALL.get("Neck"))],
        ["Choker", new ItemAesthetics(1027, "📿", "Choker", ItemType.ALL.get("Neck"))],
        ["Talisman", new ItemAesthetics(1028, "📿", "Talisman", ItemType.ALL.get("Neck"))],
        ["Pendant", new ItemAesthetics(1029, "📿", "Pendant", ItemType.ALL.get("Neck"))],
        ["Amulet", new ItemAesthetics(1030, "📿", "Amulet", ItemType.ALL.get("Neck"))],
        ["Chain", new ItemAesthetics(1031, "📿", "Chain", ItemType.ALL.get("Neck"))],
        ["Medallion", new ItemAesthetics(1032, "📿", "Medallion", ItemType.ALL.get("Neck"))],
    ]);

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

    public static offHandWeapons(): ItemAesthetics[] {
        return [
            ItemAesthetics.ALL.get("Crystal Ball"),
            ItemAesthetics.ALL.get("Shield"),
            ItemAesthetics.ALL.get("Warhorn"),
            ItemAesthetics.ALL.get("Aegis"),
            ItemAesthetics.ALL.get("Bulwark"),
            ItemAesthetics.ALL.get("Crest")
        ];
    }

    public static rings(): ItemAesthetics[] {
        return [
            ItemAesthetics.ALL.get("Ring"),
            ItemAesthetics.ALL.get("Signet"),
            ItemAesthetics.ALL.get("Loop"),
            ItemAesthetics.ALL.get("Band")
        ];
    }

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

    constructor(
        public readonly id: number,
        public readonly icon: string,
        public readonly name: string,
        public readonly itemType: ItemType) { }
}