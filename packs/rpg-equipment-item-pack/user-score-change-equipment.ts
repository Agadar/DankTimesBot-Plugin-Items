import { PreUserScoreChangedEventArguments } from "../../../../src/plugin-host/plugin-events/event-arguments/pre-user-score-changed-event-arguments";
import { EquipmentSlot } from "../../item/equipment-slot";
import { ItemProtoType } from "../../item/item-prototype";

export class UserScoreChangeEquipment extends ItemProtoType {

    public static readonly ANY = "*";

    constructor(
        id: number,
        name: string,
        buyPrice: number,
        sellPriceRatioToBuyPrice: number,
        icon: string,
        description: string,
        tags: string[],
        equipmentSlots: EquipmentSlot[],
        private readonly nameOfOriginPlugin: string,
        private readonly scoreChangeReasons: string[],
        private readonly modifier: number,
        maxRank: number
    ) {
        super(id, name, buyPrice, sellPriceRatioToBuyPrice, icon, description, tags, false, false, equipmentSlots,
            true, false, maxRank);
    }

    public override onPreUserScoreChange(event: PreUserScoreChangedEventArguments, rank: number): void {
        if ((this.nameOfOriginPlugin === UserScoreChangeEquipment.ANY || event.nameOfOriginPlugin === this.nameOfOriginPlugin) &&
            (this.scoreChangeReasons.includes(UserScoreChangeEquipment.ANY) || this.scoreChangeReasons.includes(event.reason))) {
            event.changeInScore *= (1 + this.baseModifierForRank(rank));
        }
    }

    public override getDescription(rank = 1): string {
        const baseModifierForRank = this.baseModifierForRank(rank);
        const modifierAsPercentage = Math.abs(Math.round(baseModifierForRank * 1000) / 10);
        return `${this.description} ${modifierAsPercentage}%`;
    }

    private baseModifierForRank(rank: number): number {
        return this.modifier + this.modifier * 0.5 * (rank - 1);
    }
}
