import { ItemProtoType } from "../../item/item-prototype";
import { UserScoreChangeEquipment } from "./user-score-change-equipment";
import { ItemAesthetics } from "./item-aesthetics";

export class RpgPrototypes {

    public readonly oneHandedItemProtoTypes = new Array<ItemProtoType>();
    public readonly twoHandedItemProtoTypes = new Array<ItemProtoType>();
    public readonly offHandItemProtoTypes = new Array<ItemProtoType>();
    public readonly ringItemProtoTypes = new Array<ItemProtoType>();
    public readonly necklaceItemProtoTypes = new Array<ItemProtoType>();

    constructor() {
        ItemAesthetics.oneHandedWeapons().forEach((aesthetic) => {
            const weapon = new UserScoreChangeEquipment(aesthetic);
            this.oneHandedItemProtoTypes.push(weapon);
        });
        ItemAesthetics.twoHandedWeapons().forEach((aesthetic) => {
            const weapon = new UserScoreChangeEquipment(aesthetic);
            this.twoHandedItemProtoTypes.push(weapon);
        });
        ItemAesthetics.offHandWeapons().forEach((aesthetic) => {
            const weapon = new UserScoreChangeEquipment(aesthetic);
            this.offHandItemProtoTypes.push(weapon);
        });
        ItemAesthetics.rings().forEach((aesthetic) => {
            const weapon = new UserScoreChangeEquipment(aesthetic);
            this.ringItemProtoTypes.push(weapon);
        });
        ItemAesthetics.necklaces().forEach((aesthetic) => {
            const weapon = new UserScoreChangeEquipment(aesthetic);
            this.necklaceItemProtoTypes.push(weapon);
        });
    }

    public get allPrototypes(): Array<ItemProtoType> {
        return this.oneHandedItemProtoTypes
            .concat(this.twoHandedItemProtoTypes)
            .concat(this.offHandItemProtoTypes)
            .concat(this.ringItemProtoTypes)
            .concat(this.necklaceItemProtoTypes);
    }
}