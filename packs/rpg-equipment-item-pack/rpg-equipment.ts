import { PreUserScoreChangedEventArguments } from "../../../../src/plugin-host/plugin-events/event-arguments/pre-user-score-changed-event-arguments";
import { ItemProtoType } from "../../item/item-prototype";

export class RpgEquipment extends ItemProtoType {

    constructor(
        id: number,
        name: string,
        buyPriceRatioToMedian: number,
        sellPriceRatioToMedian: number,
        icon: string,
        description: string,
        tags: string[],
        private readonly nameOfOriginPlugin: string,
        private readonly scoreChangeReason: string,
        private readonly modifier: number,
    ) {
        super(id, name, buyPriceRatioToMedian, sellPriceRatioToMedian, icon, description, tags, false, false, true);
    }

    public override onPreUserScoreChange(event: PreUserScoreChangedEventArguments): void {
        if (event.nameOfOriginPlugin === this.nameOfOriginPlugin && event.reason === this.scoreChangeReason) {
            event.changeInScore *= this.modifier;
        }
    }
}
