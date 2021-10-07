export class ItemAesthetics {

    constructor(
        public readonly icon: string,
        public readonly name: string,) { }

    public static oneHandedWeapons(): ItemAesthetics[] {
        return [
            new ItemAesthetics("🗡️", "Longsword"),
            new ItemAesthetics("🔪", "Dagger"),
            new ItemAesthetics("🔨", "Mace"),
            new ItemAesthetics("🪓", "Handaxe"),
            new ItemAesthetics("⛏️", "Warpick"),
            new ItemAesthetics("🔫", "Blunderbuss"),
            new ItemAesthetics("🪃", "Boomerang"),
            new ItemAesthetics("🪄", "Wand")
        ];
    }

    public static twoHandedWeapons(): ItemAesthetics[] {
        return [
            new ItemAesthetics("🗡️", "Greatsword"),
            new ItemAesthetics("🏹", "Shortbow"),
            new ItemAesthetics("🏹", "Longbow"),
            new ItemAesthetics("🔨", "Maul"),
            new ItemAesthetics("🪓", "Greataxe"),
            new ItemAesthetics("⚔️", "Twin Blades"),
            new ItemAesthetics("🔫", "Musket"),
        ];
    }

    public static offHandWeapons(): ItemAesthetics[] {
        return [
            new ItemAesthetics("🔮", "Crystal Ball"),
            new ItemAesthetics("🛡️", "Shield"),
            new ItemAesthetics("📯", "Warhorn"),
        ];
    }
}