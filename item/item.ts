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
        public rank: number = 1,
        public metaData: any = null
    ) {
    }

    /**
     * Comparison method for sorting arrays.
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

        if (a.prototype.baseName(a.metaData) > b.prototype.baseName(b.metaData)) {
            return 1;
        }
        if (a.prototype.baseName(a.metaData) < b.prototype.baseName(b.metaData)) {
            return -1;
        }
        return 0;
    }

    public toJSON(): { prototypeId: number, stackSize: number, rank: number, metaData: any } {
        return { prototypeId: this.prototype.id, stackSize: this.stackSize, rank: this.rank, metaData: this.metaData };
    }

    /**
     * Gets this item's name, e.g. 'Scroll of Ingenuity II'.
     */
    public get name(): string {
        return this.prototype.nameForRank(this.rank, this.metaData);
    }

    /**
     * Pretty prints this item's name including font style and emoji.
     */
    public prettyName(): string {
        return this.prototype.prettyName(this.rank, this.metaData);
    }

    /**
     * Pretty prints this item's name, tags, description etc.
     */
    public prettyPrint(modifier: number): string {
        return this.prototype.prettyPrint(modifier, this.rank, this.metaData);
    }

    public getMaxRank(): number {
        return this.prototype.getMaxRank(this.metaData);
    }

    public getBuyPrice(modifier: number): number {
        return this.prototype.getBuyPrice(modifier, this.rank, this.metaData);
    }

    public getSellPrice(modifier: number): number {
        return this.prototype.getSellPrice(modifier, this.rank, this.metaData);
    }

    public getUpgradePrice(modifier: number): number {
        return this.prototype.getUpgradePrice(modifier, this.rank, this.metaData);
    }

    public onUse(chat: Chat, user: User, msg: Message, match: string): { msg: string, shouldConsume: boolean } {
        return this.prototype.onUse(chat, user, msg, match, this.rank, this.metaData);
    }

    public onPreUserScoreChange(event: PreUserScoreChangedEventArguments): void {
        return this.prototype.onPreUserScoreChange(event, this.rank, this.metaData);
    }
}
