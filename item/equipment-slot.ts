/**
 * All possible equipment slots occupied by an item. An item can occupy multiple
 * slots, e.g. a two-handed weapon will occupy both MainHand and OffHand.
 */
export enum EquipmentSlot {
    MainHand,
    OffHand,
    Head,
    Chest,
    Hands,
    Belt,
    Legs,
    Feet,
    Fingers,
    Neck,
}

/**
 * Gets all equipment slots.
 * @returns All equipment slots in an array.
 */
export function equipmentSlots(): EquipmentSlot[] {
    return [
        EquipmentSlot.MainHand,
        EquipmentSlot.OffHand,
        EquipmentSlot.Head,
        EquipmentSlot.Chest,
        EquipmentSlot.Hands,
        EquipmentSlot.Belt,
        EquipmentSlot.Legs,
        EquipmentSlot.Feet,
        EquipmentSlot.Fingers,
        EquipmentSlot.Neck,
    ];
}
