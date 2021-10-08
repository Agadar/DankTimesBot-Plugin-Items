import { PreUserScoreChangedEventArguments } from "../../../../src/plugin-host/plugin-events/event-arguments/pre-user-score-changed-event-arguments";
import { EquipmentSlot } from "../../item/equipment-slot";
import { ItemProtoType } from "../../item/item-prototype";

export class RpgEquipment extends ItemProtoType {

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
        private readonly scoreChangeReason: string,
        private readonly modifier: number,
    ) {
        super(id, name, buyPriceRatioToMedian, sellPriceRatioToMedian, icon, description, tags, false, false, equipmentSlots);
    }

    public override onPreUserScoreChange(event: PreUserScoreChangedEventArguments): void {
        if ((this.nameOfOriginPlugin === RpgEquipment.ANY || event.nameOfOriginPlugin === this.nameOfOriginPlugin) &&
            (this.scoreChangeReason === RpgEquipment.ANY || event.reason === this.scoreChangeReason)) {
            event.changeInScore *= this.modifier;
        }
    }
}
