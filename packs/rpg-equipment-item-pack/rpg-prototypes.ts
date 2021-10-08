import { EquipmentSlot } from "../../item/equipment-slot";
import { ItemProtoType } from "../../item/item-prototype";
import { ItemEffect } from "../rpg-equipment-item-pack/item-effect"
import { RpgEquipment } from "./rpg-equipment";
import { ItemAesthetics } from "./item-aesthetics";

export class RpgPrototypes {

    public readonly oneHandedItemProtoTypes = new Array<ItemProtoType>();
    public readonly twoHandedItemProtoTypes = new Array<ItemProtoType>();
    public readonly offHandItemProtoTypes = new Array<ItemProtoType>();
    public readonly ringItemProtoTypes = new Array<ItemProtoType>();
    public readonly necklaceItemProtoTypes = new Array<ItemProtoType>();

    private static readonly pricemodifier = 200;

    constructor() {
        let oneHandedId = 1000;
        let twoHandedId = 1100;
        let offHandId = 1200;
        let ringId = 1300;
        let necklaceId = 1400;
        let newShieldsId = 1500;

        ItemEffect.pointAlteringEffects().forEach((effect) => {
            ItemAesthetics.oneHandedWeapons().forEach((item) => {
                const weapon = this.createWeapon(1.25, effect, item, oneHandedId++, ["Main Hand"], [EquipmentSlot.MainHand]);
                this.oneHandedItemProtoTypes.push(weapon);
            });
            ItemAesthetics.twoHandedWeapons().forEach((item) => {
                const weapon = this.createWeapon(2, effect, item, twoHandedId++, ["Two-Handed"], [EquipmentSlot.MainHand, EquipmentSlot.OffHand]);
                this.twoHandedItemProtoTypes.push(weapon);
            });
            ItemAesthetics.offHandWeapons().forEach((item) => {
                const weapon = this.createWeapon(0.75, effect, item, offHandId++, ["Off-Hand"], [EquipmentSlot.OffHand]);
                this.offHandItemProtoTypes.push(weapon);
            });
            ItemAesthetics.rings().forEach((item) => {
                const weapon = this.createWeapon(0.5, effect, item, ringId++, ["Finger"], [EquipmentSlot.Fingers]);
                this.ringItemProtoTypes.push(weapon);
            });
            ItemAesthetics.necklaces().forEach((item) => {
                const weapon = this.createWeapon(0.5, effect, item, necklaceId++, ["Neck"], [EquipmentSlot.Neck]);
                this.necklaceItemProtoTypes.push(weapon);
            });
            ItemAesthetics.newShields().forEach((item) => {
                const weapon = this.createWeapon(0.75, effect, item, newShieldsId++, ["Off-Hand"], [EquipmentSlot.OffHand]);
                this.offHandItemProtoTypes.push(weapon);
            });
        });
    }

    public get allPrototypes(): Array<ItemProtoType> {
        return this.oneHandedItemProtoTypes.concat(this.twoHandedItemProtoTypes).concat(this.offHandItemProtoTypes)
            .concat(this.ringItemProtoTypes).concat(this.necklaceItemProtoTypes);
    }

    private createWeapon(modifier: number, effect: ItemEffect, itemAesthetics: ItemAesthetics,
        id: number, tags: string[], slots: EquipmentSlot[]) {

        let effectModifier = Math.round(modifier * effect.modifier * 1000) / 10;
        const description = `${effect.description} ${Math.abs(effectModifier)}%`;
        effectModifier = (effectModifier / 100) + 1;

        const buyPriceMod = RpgPrototypes.pricemodifier * modifier;
        const sellPriceMod = buyPriceMod / 2;

        const name = `${itemAesthetics.name} of the ${effect.name}`;

        const weapon = new RpgEquipment(id, name, buyPriceMod, sellPriceMod, itemAesthetics.icon, description,
            tags, slots, effect.plugin, effect.reason, effectModifier);
        return weapon;
    }
}