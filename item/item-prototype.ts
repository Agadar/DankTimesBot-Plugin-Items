import { Message } from "node-telegram-bot-api";
import { Chat } from "../../../src/chat/chat";
import { User } from "../../../src/chat/user/user";
import { PreUserScoreChangedEventArguments } from "../../../src/plugin-host/plugin-events/event-arguments/pre-user-score-changed-event-arguments";
import { EquipmentSlot } from "./equipment-slot";

/**
 * Prototype for items. Instantiate this or a custom subclass of this to create a prototype with
 * which items can be created.
 */
export class ItemProtoType {

    private static readonly MINIMUM_BUY_PRICE = 10;
    private static readonly MINIMUM_SELL_PRICE = 5;

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly buyPriceRatioToMedian = 0,
        public readonly sellPriceRatioToMedian = 0,
        public readonly icon?: string,
        public readonly description = "This item is indescribable",
        public readonly tags: string[] = [],
        public readonly usable = false,
        public readonly consumedOnUse = false,
        public readonly equipmentSlots: EquipmentSlot[] = [],
        public readonly tradeable = true
    ) {
    }

    public prettyName(): string {
        let prettified = "";
        if (this.icon) {
            prettified += `${this.icon} `;
        }
        prettified += `<b>${this.name}</b>`;
        return prettified;
    }

    public prettyPrint(): string {
        let prettified = `${this.prettyName()}`;
        const tags = this.tags.slice();

        if (this.usable) {
            tags.push("Usable");

            if (this.consumedOnUse) {
                tags.push("Consumed on use");
            }
        }
        if (this.equipmentSlots.length > 0) {
            tags.push("Equippable");
        }
        if (!this.tradeable) {
            tags.push("Cannot be traded");
        }
        if (tags.length > 0) {
            prettified += `\n<i>${tags.join(", ")}</i>`;
        }
        if (this.description) {
            prettified += `\n${this.description}`;
        }
        return prettified;
    }

    public buyPrice(scoreMedian: number): number {
        let price = this.buyPriceRatioToMedian * scoreMedian;
        price = Math.round(price);
        price = Math.max(price, ItemProtoType.MINIMUM_BUY_PRICE);
        return price;
    }

    public sellPrice(scoreMedian: number): number {
        let price = this.sellPriceRatioToMedian * scoreMedian;
        price = Math.round(price);
        price = Math.max(price, ItemProtoType.MINIMUM_SELL_PRICE);
        return price;
    }

    public onUse(chat: Chat, user: User, msg: Message, match: string): { msg: string, shouldConsume: boolean } {
        return { msg: `You shake ${this.prettyName()} around for a bit and give it a lick. Nothing happens.`, shouldConsume: false };
    }

    public onPreUserScoreChange(event: PreUserScoreChangedEventArguments): void {
        // No behavior by default.
    }
}
