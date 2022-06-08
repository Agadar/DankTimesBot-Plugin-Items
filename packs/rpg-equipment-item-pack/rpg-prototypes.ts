import { ItemProtoType } from "../../item/item-prototype";
import { ItemEffect } from "../rpg-equipment-item-pack/item-effect"
import { UserScoreChangeEquipment } from "./user-score-change-equipment";
import { ItemAesthetics } from "./item-aesthetics";

export class RpgPrototypes {

    public readonly oneHandedItemProtoTypes = new Array<ItemProtoType>();
    public readonly twoHandedItemProtoTypes = new Array<ItemProtoType>();
    public readonly offHandItemProtoTypes = new Array<ItemProtoType>();
    public readonly ringItemProtoTypes = new Array<ItemProtoType>();
    public readonly necklaceItemProtoTypes = new Array<ItemProtoType>();

    constructor() {
        let oneHandedId = 1000;
        let twoHandedId = 1100;
        let offHandId = 1200;
        let ringId = 1300;
        let necklaceId = 1400;
        let newShieldsId = 1500;

        ItemEffect.ALL.forEach((effect) => {
            ItemAesthetics.oneHandedWeapons().forEach((aesthetic) => {
                const weapon = this.createWeapon(effect, aesthetic, oneHandedId++);
                this.oneHandedItemProtoTypes.push(weapon);
            });
            ItemAesthetics.twoHandedWeapons().forEach((aesthetic) => {
                const weapon = this.createWeapon(effect, aesthetic, twoHandedId++);
                this.twoHandedItemProtoTypes.push(weapon);
            });
            ItemAesthetics.offHandWeapons().forEach((aesthetic) => {
                const weapon = this.createWeapon(effect, aesthetic, offHandId++);
                this.offHandItemProtoTypes.push(weapon);
            });
            ItemAesthetics.rings().forEach((aesthetic) => {
                const weapon = this.createWeapon(effect, aesthetic, ringId++);
                this.ringItemProtoTypes.push(weapon);
            });
            ItemAesthetics.necklaces().forEach((aesthetic) => {
                const weapon = this.createWeapon(effect, aesthetic, necklaceId++);
                this.necklaceItemProtoTypes.push(weapon);
            });
            ItemAesthetics.newShields().forEach((aesthetic) => {
                const weapon = this.createWeapon(effect, aesthetic, newShieldsId++);
                this.offHandItemProtoTypes.push(weapon);
            });
        });
    }

    public get allPrototypes(): Array<ItemProtoType> {
        return this.oneHandedItemProtoTypes
            .concat(this.twoHandedItemProtoTypes)
            .concat(this.offHandItemProtoTypes)
            .concat(this.ringItemProtoTypes)
            .concat(this.necklaceItemProtoTypes);
    }

    private createWeapon(effect: ItemEffect, itemAesthetics: ItemAesthetics, id: number) {
        return new UserScoreChangeEquipment(id, itemAesthetics, effect);
    }
}