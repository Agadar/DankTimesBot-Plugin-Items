export class ItemProtoType {

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly buyPriceRatioToMedian: number,
        public readonly sellPriceRatioToMedian: number,
        public readonly icon?: string,
        public readonly description = "This item is indescribable",
        public readonly tags: string[] = [],
        public readonly usable: boolean = false,
        public readonly consumedOnUse: boolean = false,
        public readonly equippable: boolean = false,
        public readonly incompatibleTagsForEquip: string[]  = []
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
                tags.push("Consumed On Use");
            }
        }
        if (this.equippable) {
            tags.push("Equippable");
        }
        if (tags.length > 0) {
            prettified += `\n<i>${tags.join(", ")}</i>`;
        }
        if (this.description) {
            prettified += `\n${this.description}`;
        }
        return prettified;
    }
}
