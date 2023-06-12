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

    constructor(
        public readonly id: number,
        protected readonly name: string,
        protected readonly buyPrice = 0,
        protected readonly sellPriceRatioToBuyPrice = 0.5,
        public readonly icon?: string,
        protected readonly description = "This item is indescribable",
        public readonly tags: string[] = [],
        public readonly usable = false,
        public readonly consumedOnUse = false,
        public readonly equipmentSlots: EquipmentSlot[] = [],
        public readonly tradeable = true,
        protected readonly staticPrice = false,
        protected readonly maxRank = 1
    ) {
    }

    /**
     * Gets all possible names and ranks for this item prototype. Override for custom behavior,
     * e.g. if metadata is part of the name and/or ranks.
     */
    public getPrettyPrintsOfMatchingNames(input: string, chatModifier: number): string[] {
        const allNames = new Array<{ name: string, rank: number }>();
        allNames.push({ name: `${this.baseName()} ${ItemProtoType.toRoman(1)}`, rank: 1 });

        for (let rank = 1; rank <= this.getMaxRank(); rank++) {
            allNames.push({ name: this.nameForRank(rank), rank: rank });
        }
        return allNames.filter(nameAndRank => nameAndRank.name.toLowerCase() === input.toLowerCase())
            .map(nameAndRank => this.prettyPrint(chatModifier, nameAndRank.rank));
    }

    /**
     * Gets this item's base name. Returns the name supplied in the constructor by default.
     * Override to set name based on for example the item's metadata.
     */
    public baseName(metaData?: any): string {
        return this.name;
    }

    /**
     * Gets the name for the specified rank, e.g. 'Scroll of Ingenuity II'.
     */
    public nameForRank(rank = 1, metaData?: any): string {
        if (rank == 1) {
            return this.baseName(metaData);
        }
        return `${this.baseName(metaData)} ${ItemProtoType.toRoman(rank)}`;
    }

    /**
     * Pretty prints the name for the specified rank including font style and emoji.
     */
    public prettyName(rank: number, metaData?: any): string {
        let prettified = "";
        if (this.icon) {
            prettified += `${this.icon} `;
        }
        return prettified + `<b>${this.nameForRank(rank, metaData)}</b>`;
    }

    /**
     * Pretty prints the name, tags, description etc. for the specified rank.
     */
    public prettyPrint(modifier: number, rank: number, metaData?: any): string {
        let prettified = `${this.prettyName(rank, metaData)}`;
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
            tags.push("Untradeable");
        }
        if (this.getMaxRank(metaData) > rank) {
            tags.push("Upgradable");
        }
        if (tags.length > 0) {
            prettified += `\n<i>${tags.join(", ")}</i>`;
        }
        const description = this.getDescription(rank, metaData);
        
        if (description) {
            prettified += `\n\n${description}`;
        }
        if (this.tradeable || this.getMaxRank(metaData) > rank) {
            prettified += "\n";
        }
        if (this.getMaxRank(metaData) > rank) {
            prettified += `\n<u>Upgrades</u> for ${this.getUpgradePrice(modifier, rank, metaData)} points`;
        }
        if (this.tradeable) {
            prettified += `\n<u>Sells</u> for ${this.getSellPrice(modifier, rank, metaData)} points`;
        }
        return prettified;
    }

    /**
     * By default just returns the description supplied in the constructor. Override for custom behavior.
     */
    public getDescription(rank = 1, metaData?: any): string {
        return this.description;
    }

    /**
     * By default just returns the max rank supplied in the constructor. Override for custom behavior.
     */
    public getMaxRank(metaData?: any): number {
        return this.maxRank;
    }

    /**
     * Gets the buy price according to the buy price specified in the constructor and the costs of the required upgrades to reach
     * the specified rank. Override for custom behavior.
     */
    public getBuyPrice(modifier: number, rank: number, metaData?: any): number {
        let totalPrice = this.buyPrice;

        if (!this.staticPrice) {
            totalPrice *= modifier;
        }
        for (let i = 1; i < rank; i++) {
            totalPrice += this.getUpgradePrice(modifier, i, metaData);
        }
        return Math.ceil(totalPrice);
    }

    /**
     * By default returns the buy price for the rank times the sell price ratio. Override for custom behavior.
     */
    public getSellPrice(modifier: number, rank: number, metaData?: any): number {
        return Math.ceil(this.getBuyPrice(modifier, rank, metaData) * this.sellPriceRatioToBuyPrice);
    }

    /**
     * Gets the upgrade price based on the buy price supplied in the constructor. Override for custom behavior.
     */
    public getUpgradePrice(modifier: number, currentRank: number, metaData?: any): number {
        let price = this.buyPrice + this.buyPrice * 0.5;
        price *= Math.pow(2, currentRank - 1);

        if (!this.staticPrice) {
            price *= modifier;
        }
        return Math.ceil(price);
    }

    /**
     * Only prints a message by default. Override for custom behavior.
     */
    public onUse(chat: Chat, user: User, msg: Message, match: string, rank: number, metaData?: any): { msg: string, shouldConsume: boolean } {
        return { msg: `You shake ${this.prettyName(rank, metaData)} around for a bit and give it a lick. Nothing happens.`, shouldConsume: false };
    }

    /**
     * No behavior by default. Override for custom behavior.
     */
    public onPreUserScoreChange(event: PreUserScoreChangedEventArguments, rank: number, metaData?: any): void {
        // No behavior by default.
    }

    protected static toRoman(number: number): string {
        // From https://www.geeksforgeeks.org/converting-decimal-number-lying-between-1-to-3999-to-roman-numerals/
        const num = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000];
        const sym = ["I", "IV", "V", "IX", "X", "XL", "L", "XC", "C", "CD", "D", "CM", "M"];
        let result = "";
        let i = 12;
        while (number > 0) {
            let div = Math.floor(number / num[i]);
            number = number % num[i];
            while (div--) {
                result += sym[i];
            }
            i--;
        }
        return result;
    }
}
