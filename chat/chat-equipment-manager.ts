import { User } from "../../../src/chat/user/user";
import { Item } from "../item/item";
import { ItemProtoType } from "../item/item-prototype";

export class ChatEquipmentManager {

    constructor(private readonly equipments = new Map<number, Item[]>()) { }

    public getOrCreateEquipment(user: User): Item[] {
        let equipment = this.equipments.get(user.id);
        if (!equipment) {
            equipment = new Array<Item>();
            this.equipments.set(user.id, equipment);
        }
        return equipment;
    }

    public toJSON(): Array<{ userId: number, equipment: Item[] }> {
        return Array.from(this.equipments, ([key, value]) => ({ userId: key, equipment: value }));
    }

    public updatePrototypes(prototypes: ItemProtoType[]): void {
        this.equipments.forEach((equipment) => {
            equipment.forEach((item) => {
                const newPrototype = prototypes.find(prototype => prototype.id === item.prototype.id);

                if (newPrototype) {
                    item.prototype = newPrototype;
                }
            })
            equipment.sort(Item.compare);
        });
    }
}
