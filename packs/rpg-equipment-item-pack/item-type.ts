import { EquipmentSlot } from "../../item/equipment-slot";

export class ItemType {

    public static readonly ALL = new Map<string, ItemType>([
        ["One-Handed", new ItemType("One-Handed", 1.25, [EquipmentSlot.MainHand], ["Main Hand"])],
        ["Two-Handed", new ItemType("Two-Handed", 2, [EquipmentSlot.MainHand, EquipmentSlot.OffHand], ["Two-Handed"])],
        ["Off-Hand", new ItemType("Off-Hand", 0.75, [EquipmentSlot.OffHand], ["Off-Hand"])],
        ["Finger", new ItemType("Finger", 0.5, [EquipmentSlot.Fingers], ["Finger"])],
        ["Neck", new ItemType("Neck", 0.5, [EquipmentSlot.Neck], ["Neck"])],
    ]);

    constructor(
        public readonly name: string,
        public readonly itemTypeModifier: number,
        public readonly equipmentSlots: EquipmentSlot[],
        public readonly tags: string[]
    ) { }
}