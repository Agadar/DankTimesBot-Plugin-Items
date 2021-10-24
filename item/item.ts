import { Message } from "node-telegram-bot-api";
import { Chat } from "../../../src/chat/chat";
import { User } from "../../../src/chat/user/user";
import { PreUserScoreChangedEventArguments } from "../../../src/plugin-host/plugin-events/event-arguments/pre-user-score-changed-event-arguments";
import { ItemProtoType } from "./item-prototype";

/**
 * Instance of an item, indicating an amount and pointing to the item prototype
 * of which this is an instance.
 */
export class Item {

    constructor(
        public prototype: ItemProtoType,
        public stackSize: number,
        public name = prototype.defaultName,
        public rank = 0,
    ) {
    }

    /**
     * Comparison method for sorting arrays. Sorts by equipment slots, then by name.
     */
     public static compare(a: Item, b: Item): number {
        if (a.prototype.equipmentSlots.length === 0 && b.prototype.equipmentSlots.length > 0) {
            return 1;
        }
        if (a.prototype.equipmentSlots.length > 0 && b.prototype.equipmentSlots.length === 0) {
            return -1;
        }

        for (let i = 0; i < Math.min(a.prototype.equipmentSlots.length, b.prototype.equipmentSlots.length); i++) {
            if (a.prototype.equipmentSlots[i] > b.prototype.equipmentSlots[i]) {
                return 1;
            }
            if (a.prototype.equipmentSlots[i] < b.prototype.equipmentSlots[i]) {
                return -1;
            }
        }
        
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    }

    public prettyName(): string {
        return this.prototype.prettyName(this.name);
    }

    public prettyPrint(): string {
        return this.prototype.prettyPrint(this.name, this.rank);
    }

    public onUse(chat: Chat, user: User, msg: Message, match: string): { msg: string, shouldConsume: boolean } {
        return this.prototype.onUse(chat, user, msg, match, this.rank, this.prettyName());
    }

    public onPreUserScoreChange(event: PreUserScoreChangedEventArguments): void {
        this.prototype.onPreUserScoreChange(event, this.rank, this.prettyName());
    }

    public toJSON(): { prototypeId: number, stackSize: number, name: string, rank: number } {
        return { prototypeId: this.prototype.id, stackSize: this.stackSize, name: this.name, rank: this.rank };
    }
}
