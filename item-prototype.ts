export class ItemProtoType {

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly buyPriceRatioToMedian: number,
        public readonly sellPriceRatioToMedian: number,
        public readonly icon?: string,
        public readonly usable: boolean = false,
        public readonly consumedOnUse: boolean = false,
        public readonly equippable: boolean = false,
        public readonly stackable: boolean = false,
    ) {
    }
}
