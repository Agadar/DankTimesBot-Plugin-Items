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

    constructor(private readonly aesthetics: ItemAesthetics) {
        super(
            aesthetics.id,
            "",
            UserScoreChangeEquipment.pricemodifier * aesthetics.itemType.itemTypeModifier,
            0.5,
            aesthetics.icon,
            "",
            aesthetics.itemType.tags,
            false,
            false,
            aesthetics.itemType.equipmentSlots,
            true,
            false);
    }

    public override getPrettyPrintsOfMatchingNames(input: string, chatModifier: number): string[] {
        const allNames = new Array<{ name: string, rank: number, effectName: string }>();
        ItemEffect.ALL.forEach((effect, effectName) => {
            allNames.push({ name: `${this.aesthetics.name} of the ${effectName}`, rank: 1, effectName: effectName });

            for (let rank = 1; rank <= effect.maxRank; rank++) {
                const name = `${this.aesthetics.name} of the ${effectName} ${ItemProtoType.toRoman(rank)}`;
                allNames.push({ name: name, rank: rank, effectName: effectName });
            }
        });      
        return allNames
            .filter(nameAndRank => nameAndRank.name.toLowerCase() === input.toLowerCase())
            .map(nameAndRank => this.prettyPrint(chatModifier, nameAndRank.rank, nameAndRank.effectName));
    }

    public override baseName(metaData?: any): string {
        const effect = ItemEffect.ALL.get(metaData);

        if (!effect) {
            this.logMetaDataError(metaData);
            return super.baseName(metaData);
        }
        return `${this.aesthetics.name} of the ${effect.name}`;
    }

    public override getDescription(rank = 1, metaData?: any): string {
        const effect = ItemEffect.ALL.get(metaData);

        if (!effect) {
            this.logMetaDataError(metaData);
            return super.getDescription(rank, metaData);
        }
        const baseModifierForRank = this.baseModifierForRank(rank, effect);
        const modifierAsPercentage = Math.abs(Math.round(baseModifierForRank * 1000) / 10);
        return `${effect.description} ${modifierAsPercentage}%`;
    }

    public override getMaxRank(metaData?: any): number {
        const effect = ItemEffect.ALL.get(metaData);

        if (!effect) {
            this.logMetaDataError(metaData);
            return super.getMaxRank(metaData);
        }
        return effect.maxRank;
    }

    public override onPreUserScoreChange(event: PreUserScoreChangedEventArguments, rank: number, metaData?: any): void {
        const effect = ItemEffect.ALL.get(metaData);

        if (!effect) {
            this.logMetaDataError(metaData);

        } else if ((effect.plugin === UserScoreChangeEquipment.ANY || event.nameOfOriginPlugin === effect.plugin) &&
            (effect.reasons.includes(UserScoreChangeEquipment.ANY) || effect.reasons.includes(event.reason))) {
            event.changeInScore *= (1 + this.baseModifierForRank(rank, effect));
        }
    }

    private baseModifierForRank(rank: number, effect: ItemEffect): number {
        const modifier = this.aesthetics.itemType.itemTypeModifier * effect.modifier;
        return modifier + modifier * 0.5 * (rank - 1);
    }

    private logMetaDataError(metaData: any): void {
        console.error(`Invalid metadata ${JSON.stringify(metaData)} for UserScoreChangeEquipment`);
    }
}
