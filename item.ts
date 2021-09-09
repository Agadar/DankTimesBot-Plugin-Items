import { ItemProtoType } from "./item-prototype";

export class Item {

    private static readonly MINIMUM_MEDIAN = 100;
    private static readonly MINIMUM_BUY_PRICE = 10;
    private static readonly MINIMUM_SELL_PRICE = 5;

    private myBuyPrice: number;
    private mySellPrice: number;

    constructor(
        private readonly prototype: ItemProtoType,
        public stackSize: number,
    ) {
    }

    public name(): string {
        return this.prototype.name;
    }

    public buyPrice(): number {
        return this.myBuyPrice;
    }

    public sellPrice(): number {
        return this.mySellPrice;
    }

    public updatePrices(scoreMedian: number): void {
        scoreMedian = Math.max(scoreMedian, Item.MINIMUM_MEDIAN);

        this.myBuyPrice = this.prototype.buyPriceRatioToMedian * scoreMedian;
        this.myBuyPrice = Math.round(this.myBuyPrice);
        this.myBuyPrice = Math.max(this.myBuyPrice, Item.MINIMUM_BUY_PRICE);

        this.mySellPrice = this.prototype.sellPriceRatioToMedian * scoreMedian;
        this.mySellPrice = Math.round(this.mySellPrice);
        this.mySellPrice = Math.max(this.mySellPrice, Item.MINIMUM_SELL_PRICE);
    }

    public prettyString(): string {
        let prettified = "";
        if (this.prototype.icon) {
            prettified += `[${this.prototype.icon}] `;
        }
        prettified += this.prototype.name;
        if (this.prototype.stackable) {
            prettified += ` x${this.stackSize}`;
        }
        return prettified;
    }
}
