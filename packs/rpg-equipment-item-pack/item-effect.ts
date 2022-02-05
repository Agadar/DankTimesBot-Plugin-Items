import { AlterUserScoreArgs } from "../../../../src/chat/alter-user-score-args";

export class ItemEffect {

    private static readonly LIFE_PLUGIN = "Life";
    private static readonly RUSSIAN_ROULETTE_PLUGIN = "Russian Roulette";

    private static readonly WORK_COMPLETED = "workCompleted";
    private static readonly CRIME_COMMITTED = "crimeCommitted";
    private static readonly BREAKOUT_SUCCEEDED = "breakoutSucceeded";
    private static readonly WINNER_REWARD = "winner.reward";
    private static readonly NO_BULLET_IN_CYLINDER = "no.bullet.in.cylinder";

    constructor(
        public readonly name: string,
        public readonly plugin: string,
        public readonly reasons: string[],
        public readonly modifier: number,
        public readonly description: string,
        public readonly maxRank: number = 1) { }

    public static pointAlteringEffects(): ItemEffect[] {
        return [
            new ItemEffect("Devout", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
                [AlterUserScoreArgs.NORMAL_DANKTIME_REASON], 0.1,
                "Increases normal dank time points received by", 4),

            new ItemEffect("Sentinel", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
                [AlterUserScoreArgs.RANDOM_DANKTIME_REASON], 0.15,
                "Increases random dank time points received by", 4),

            new ItemEffect("Eternal", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
                [AlterUserScoreArgs.HARDCOREMODE_PUNISHMENT_REASON], -0.5,
                "Reduces hardcore mode punishment severity by"),

            new ItemEffect("Pious", ItemEffect.LIFE_PLUGIN, [ItemEffect.WORK_COMPLETED], 0.1,
                "Increases points gained from working by", 4),

            new ItemEffect("Mastermind", ItemEffect.LIFE_PLUGIN, [ItemEffect.CRIME_COMMITTED], 0.1,
                "Increases points gained from committing crimes by", 4),

            new ItemEffect("Succubus", ItemEffect.LIFE_PLUGIN, ["bribe"], -0.2,
                "Reduces the cost of bribes by"),

            new ItemEffect("Liberator", ItemEffect.LIFE_PLUGIN, [ItemEffect.BREAKOUT_SUCCEEDED], 0.5,
                "Increases points gained from breaking out players by", 4),

            new ItemEffect("Oracle", "Blackjack", [ItemEffect.WINNER_REWARD], 0.02,
                "Increases points gained from winning blackjack by", 4),

            new ItemEffect("Immortal", ItemEffect.RUSSIAN_ROULETTE_PLUGIN, ["bullet.in.cylinder"], -0.2,
                "Reduces points lost from losing russian roulette by"),

            new ItemEffect("Fool-Hearted", ItemEffect.RUSSIAN_ROULETTE_PLUGIN, [ItemEffect.NO_BULLET_IN_CYLINDER], 0.15,
                "Increases points gained from winning russian roulette by", 4),

            new ItemEffect("Magus", "*", [
                AlterUserScoreArgs.NORMAL_DANKTIME_REASON,
                AlterUserScoreArgs.RANDOM_DANKTIME_REASON,
                ItemEffect.WORK_COMPLETED,
                ItemEffect.CRIME_COMMITTED,
                ItemEffect.BREAKOUT_SUCCEEDED,
                ItemEffect.WINNER_REWARD,
                ItemEffect.NO_BULLET_IN_CYLINDER
            ], 0.01, "Increases all points gained by", 4)
        ];
    };
}