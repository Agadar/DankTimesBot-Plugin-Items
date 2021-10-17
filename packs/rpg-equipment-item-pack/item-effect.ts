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
        public readonly description: string) { }

    public static pointAlteringEffects(): ItemEffect[] {
        return [
            new ItemEffect("Devout", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
                [AlterUserScoreArgs.NORMAL_DANKTIME_REASON], 0.1,
                "Increases normal dank time points received by"),

            new ItemEffect("Sentinel", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
                [AlterUserScoreArgs.RANDOM_DANKTIME_REASON], 0.1,
                "Increases random dank time points received by"),

            new ItemEffect("Eternal", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
                [AlterUserScoreArgs.HARDCOREMODE_PUNISHMENT_REASON], -0.4,
                "Reduces hardcore mode punishment severity by"),

            new ItemEffect("Pious", ItemEffect.LIFE_PLUGIN, [ItemEffect.WORK_COMPLETED], 0.1,
                "Increases points gained from working by"),

            new ItemEffect("Mastermind", ItemEffect.LIFE_PLUGIN, [ItemEffect.CRIME_COMMITTED], 0.1,
                "Increases points gained from committing crimes by"),

            new ItemEffect("Succubus", ItemEffect.LIFE_PLUGIN, ["bribe"], -0.15,
                "Reduces the cost of bribes by"),

            new ItemEffect("Liberator", ItemEffect.LIFE_PLUGIN, [ItemEffect.BREAKOUT_SUCCEEDED], 0.4,
                "Increases points gained from breaking out players by"),

            new ItemEffect("Oracle", "Blackjack", [ItemEffect.WINNER_REWARD], 0.01,
                "Increases points gained from winning blackjack by"),

            new ItemEffect("Immortal", ItemEffect.RUSSIAN_ROULETTE_PLUGIN, ["bullet.in.cylinder"], -0.1,
                "Reduces points lost from losing russian roulette by"),

            new ItemEffect("Fool-Hearted", ItemEffect.RUSSIAN_ROULETTE_PLUGIN, [ItemEffect.NO_BULLET_IN_CYLINDER], 0.1,
                "Increases points gained from winning russian roulette by"),

            new ItemEffect("Magus", "*", [
                AlterUserScoreArgs.NORMAL_DANKTIME_REASON,
                AlterUserScoreArgs.RANDOM_DANKTIME_REASON,
                ItemEffect.WORK_COMPLETED,
                ItemEffect.CRIME_COMMITTED,
                ItemEffect.BREAKOUT_SUCCEEDED,
                ItemEffect.WINNER_REWARD,
                ItemEffect.NO_BULLET_IN_CYLINDER
            ], 0.005, "Increases all points gained by")
        ];
    };
}