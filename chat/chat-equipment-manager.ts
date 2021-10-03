import { User } from "../../../src/chat/user/user";
import { Item } from "../item/item";

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
}
