import { PreUserScoreChangedEventArguments } from "../../../../src/plugin-host/plugin-events/event-arguments/pre-user-score-changed-event-arguments";

import { ItemProtoType } from "../../item/item-prototype";
import { ItemAesthetics } from "./item-aesthetics";
import { ItemEffect } from "./item-effect";
import { ItemType } from "./item-type";

import { LifeActionEventData } from "../../../DankTimesBot-Plugin-Life/event/LifeActionEventData";
import { LifeAction } from "../../../DankTimesBot-Plugin-Life/model/LifeAction";

export class UserScoreChangeEquipment extends ItemProtoType {

    public static readonly ANY = "*";

    private static readonly pricemodifier = 200;

    constructor(private readonly aesthetics: ItemAesthetics) {
        super(
            aesthetics.id,
            "",
            UserScoreChangeEquipment.pricemodifier * aesthetics.itemType.userScoreChangeModifier,
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
        const innateKillOdds = this.aesthetics.itemType.innateKillOdds;
        let description = "";
        let prependNewline = false;
        let appendInnateKillOdds = (effect.killOdds >= 0 && innateKillOdds < 0) || (effect.killOdds <= 0 && innateKillOdds > 0);

        if (effect.userScoreChange !== 0) {
            const userScoreChangeForRank = this.userScoreChangeForRank(rank, effect);
            description += this.describeEffect(effect, userScoreChangeForRank);
            prependNewline = true;
        }
        if (effect.killOdds !== 0) {
            if (prependNewline) {
                description += "\n";
            }
            let effectKillOdds = this.aesthetics.itemType.killOddsModifier * effect.killOdds;

            if (!appendInnateKillOdds) {
                effectKillOdds += innateKillOdds;
            }
            description += this.describeEffect(effect, effectKillOdds);
            prependNewline = true;
        }
        if (appendInnateKillOdds) {
            if (prependNewline) {
                description += "\n";
            }
            if (innateKillOdds > 0) {
                description += `Increases the chance to kill a player by an additional ${innateKillOdds * 100}%`;

            } else if (innateKillOdds < 0) {
                description += `Reduces the chance to be killed by a player by an additional ${Math.abs(innateKillOdds) * 100}%`;
            }
        }
        return description;
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
            return;
        }
        if (effect.userScoreChange === 0) {
            return;
        }
        if ((effect.userScoreChangePluginName === UserScoreChangeEquipment.ANY || event.nameOfOriginPlugin === effect.userScoreChangePluginName) &&
            (effect.userScoreChangePluginReasons.includes(UserScoreChangeEquipment.ANY) || effect.userScoreChangePluginReasons.includes(event.reason))) {
            event.changeInScore *= (1 + this.userScoreChangeForRank(rank, effect));
        }
    }

    public override onLifeAction(eventData: LifeActionEventData, isTarget: boolean, rank: number, metaData?: any): void {
        if (eventData.action !== LifeAction.KILL) {
            return;
        }
        if ((isTarget && this.aesthetics.itemType.innateKillOdds < 0) || (!isTarget && this.aesthetics.itemType.innateKillOdds > 0)) {
            eventData.odds += this.aesthetics.itemType.innateKillOdds;
        }
        const effect = ItemEffect.ALL.get(metaData);

        if (!effect) {
            this.logMetaDataError(metaData);
            return;
        }
        if ((isTarget && effect.killOdds < 0) || (!isTarget && effect.killOdds > 0)) {
            eventData.odds += this.aesthetics.itemType.killOddsModifier * effect.killOdds;
        }
    }

    private userScoreChangeForRank(rank: number, effect: ItemEffect): number {
        const modifier = this.aesthetics.itemType.userScoreChangeModifier * effect.userScoreChange;
        return modifier + modifier * 0.5 * (rank - 1);
    }

    private describeEffect(effect: ItemEffect, delta: number) {
        const modifierAsPercentage = Math.abs(Math.round(delta * 1000) / 10);
        let description = `${effect.description} ${modifierAsPercentage}%`;

        if (effect.postDescription) {
            description += ` ${effect.postDescription}`;
        }
        return description;
    }

    private logMetaDataError(metaData: any): void {
        console.error(`Invalid metadata ${JSON.stringify(metaData)} for UserScoreChangeEquipment`);
    }
}
