import { PreUserScoreChangedEventArguments } from "../../../../src/plugin-host/plugin-events/event-arguments/pre-user-score-changed-event-arguments";
import { EquipmentSlot } from "../../item/equipment-slot";
import { ItemProtoType } from "../../item/item-prototype";

export class UserScoreChangeEquipment extends ItemProtoType {

    public static readonly ANY = "*";

    constructor(
        id: number,
        name: string,
        buyPriceRatioToMedian: number,
        sellPriceRatioToMedian: number,
        icon: string,
        description: string,
        tags: string[],
        equipmentSlots: EquipmentSlot[],
        private readonly nameOfOriginPlugin: string,
        private readonly scoreChangeReasons: string[],
        private readonly modifier: number,
    ) {
        super(id, name, buyPriceRatioToMedian, sellPriceRatioToMedian, icon, description, tags, false, false, equipmentSlots);
    }

    public override onPreUserScoreChange(event: PreUserScoreChangedEventArguments): void {
        if ((this.nameOfOriginPlugin === UserScoreChangeEquipment.ANY || event.nameOfOriginPlugin === this.nameOfOriginPlugin) &&
            (this.scoreChangeReasons.includes(UserScoreChangeEquipment.ANY) || this.scoreChangeReasons.includes(event.reason))) {
            event.changeInScore *= this.modifier;
        }
    }
}
