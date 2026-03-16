import { EquipmentSlot } from "../../item/equipment-slot";

export class ItemType {

    public static readonly ONE_HANDED = new ItemType("One-Handed", 1.25, [EquipmentSlot.MainHand], ["Main Hand"], 0.1);
    public static readonly TWO_HANDED = new ItemType("Two-Handed", 2.1875, [EquipmentSlot.MainHand, EquipmentSlot.OffHand], ["Two-Handed"], 0.2);
    public static readonly OFF_HAND = new ItemType("Off-Hand", 0.75, [EquipmentSlot.OffHand], ["Off-Hand"], -0.1);
    public static readonly FINGER = new ItemType("Finger", 0.5, [EquipmentSlot.Fingers], ["Finger"], 0);
    public static readonly NECK = new ItemType("Neck", 0.5, [EquipmentSlot.Neck], ["Neck"], 0);

    public static readonly ALL = new Map<string, ItemType>([
        ["One-Handed", this.ONE_HANDED],
        ["Two-Handed", this.TWO_HANDED],
        ["Off-Hand", this.OFF_HAND],
        ["Finger", this.FINGER],
        ["Neck", this.NECK],
    ]);

    constructor(
        public readonly name: string,
        public readonly itemTypeModifier: number,
        public readonly equipmentSlots: EquipmentSlot[],
        public readonly tags: string[],
        public readonly killOdds: number
    ) { }
}