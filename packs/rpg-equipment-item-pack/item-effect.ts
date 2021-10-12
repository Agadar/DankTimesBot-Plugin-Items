import { AlterUserScoreArgs } from "../../../../src/chat/alter-user-score-args";

export class ItemEffect {

    private static readonly LIFE_PLUGIN = "Life";
    private static readonly RUSSIAN_ROULETTE_PLUGIN = "Russian Roulette";

    constructor(
        public readonly name: string,
        public readonly plugin: string,
        public readonly reason: string,
        public readonly modifier: number,
        public readonly description: string) { }

    public static pointAlteringEffects(): ItemEffect[] {
        return [
            new ItemEffect("Devout", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
                AlterUserScoreArgs.NORMAL_DANKTIME_REASON, 0.1,
                "Increases normal dank time points received by"),

            new ItemEffect("Sentinel", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
                AlterUserScoreArgs.RANDOM_DANKTIME_REASON, 0.1,
                "Increases random dank time points received by"),

            new ItemEffect("Eternal", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
                AlterUserScoreArgs.HARDCOREMODE_PUNISHMENT_REASON, -0.4,
                "Reduces hardcore mode punishment severity by"),

            new ItemEffect("Pious", ItemEffect.LIFE_PLUGIN, "workCompleted", 0.1,
                "Increases points gained from working by"),

            new ItemEffect("Mastermind", ItemEffect.LIFE_PLUGIN, "crimeCommitted", 0.1,
                "Increases points gained from committing crimes by"),

            new ItemEffect("Succubus", ItemEffect.LIFE_PLUGIN, "bribe", -0.15,
                "Reduces the cost of bribes by"),

            new ItemEffect("Liberator", ItemEffect.LIFE_PLUGIN, "breakoutSucceeded", 0.4,
                "Increases points gained from breaking out players by"),

            new ItemEffect("Oracle", "Blackjack", "winner.reward", 0.01,
                "Increases points gained from winning blackjack by"),

            new ItemEffect("Immortal", ItemEffect.RUSSIAN_ROULETTE_PLUGIN, "bullet.in.cylinder", -0.1,
                "Reduces points lost from losing russian roulette by"),

            new ItemEffect("Fool-Hearted", ItemEffect.RUSSIAN_ROULETTE_PLUGIN, "no.bullet.in.cylinder", 0.1,
                "Increases points gained from winning russian roulette by"),

            new ItemEffect("Magus", "*", "*", 0.005, "Increases all points gained by")
        ];
    };
}