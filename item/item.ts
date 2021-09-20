import { ItemProtoType } from "./item-prototype";

export class Item {

    private static readonly MINIMUM_MEDIAN = 100;
    private static readonly MINIMUM_BUY_PRICE = 10;
    private static readonly MINIMUM_SELL_PRICE = 5;

    constructor(
        public readonly prototype: ItemProtoType,
        public stackSize: number,
    ) {
    }

    public toJSON(): { prototypeId: number, stackSize: number } {
        return {
            prototypeId: this.prototype.id,
            stackSize: this.stackSize
        };
    }

    public name(): string {
        return this.prototype.name;
    }

    public sameItemTypeAs(other: Item) {
        return other.prototype === this.prototype;
    }

    public buyPrice(scoreMedian: number): number {
        scoreMedian = Math.max(scoreMedian, Item.MINIMUM_MEDIAN);
        let price = this.prototype.buyPriceRatioToMedian * scoreMedian;
        price = Math.round(price);
        price = Math.max(price, Item.MINIMUM_BUY_PRICE);
        return price;
    }

    public sellPrice(scoreMedian: number): number {
        scoreMedian = Math.max(scoreMedian, Item.MINIMUM_MEDIAN);
        let price = this.prototype.sellPriceRatioToMedian * scoreMedian;
        price = Math.round(price);
        price = Math.max(price, Item.MINIMUM_SELL_PRICE);
        return price;
    }
}