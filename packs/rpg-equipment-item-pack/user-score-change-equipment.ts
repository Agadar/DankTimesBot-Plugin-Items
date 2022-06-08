import { PreUserScoreChangedEventArguments } from "../../../../src/plugin-host/plugin-events/event-arguments/pre-user-score-changed-event-arguments";
import { ItemProtoType } from "../../item/item-prototype";
import { ItemAesthetics } from "./item-aesthetics";
import { ItemEffect } from "./item-effect";

/**
 * Old user score change equipment, to be replaced with the new version.
 */
export class UserScoreChangeEquipment extends ItemProtoType {

    public static readonly ANY = "*";

    private static readonly pricemodifier = 200;

    constructor(
        id: number,
        private readonly aesthetics: ItemAesthetics,
        private readonly effect: ItemEffect
    ) {
        super(
            id,
            `${aesthetics.name} of the ${effect.name}`,
            UserScoreChangeEquipment.pricemodifier * aesthetics.itemType.itemTypeModifier,
            0.5,
            aesthetics.icon,
            effect.description,
            aesthetics.itemType.tags,
            false,
            false,
            aesthetics.itemType.equipmentSlots,
            true,
            false,
            effect.maxRank);
    }

    public override onPreUserScoreChange(event: PreUserScoreChangedEventArguments, rank: number): void {
        if ((this.effect.plugin === UserScoreChangeEquipment.ANY || event.nameOfOriginPlugin === this.effect.plugin) &&
            (this.effect.reasons.includes(UserScoreChangeEquipment.ANY) || this.effect.reasons.includes(event.reason))) {
            event.changeInScore *= (1 + this.baseModifierForRank(rank));
        }
    }

    public override getDescription(rank = 1): string {
        const baseModifierForRank = this.baseModifierForRank(rank);
        const modifierAsPercentage = Math.abs(Math.round(baseModifierForRank * 1000) / 10);
        return `${this.description} ${modifierAsPercentage}%`;
    }

    private baseModifierForRank(rank: number): number {
        const modifier = this.aesthetics.itemType.itemTypeModifier * this.effect.modifier;
        return modifier + modifier * 0.5 * (rank - 1);
    }
}
