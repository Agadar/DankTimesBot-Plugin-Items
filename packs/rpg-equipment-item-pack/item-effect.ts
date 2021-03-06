import { AlterUserScoreArgs } from "../../../../src/chat/alter-user-score-args";

export class ItemEffect {

    // Russian Roulette
    private static readonly RUSSIAN_ROULETTE_PLUGIN = "Russian Roulette";
    private static readonly NO_BULLET_IN_CYLINDER = "no.bullet.in.cylinder";
    private static readonly BULLET_IN_CYLINDER = "bullet.in.cylinder";

    // Life
    private static readonly LIFE_PLUGIN = "Life";
    private static readonly WORK_COMPLETED = "workCompleted";
    private static readonly CRIME_COMMITTED = "crimeCommitted";
    private static readonly BREAKOUT_SUCCEEDED = "breakoutSucceeded";

    // Blackjack
    private static readonly BLACKJACK_PLUGIN = "Blackjack";
    private static readonly WINNER_REWARD = "winner.reward";

    // Horseraces
    private static readonly HORSERACES_PLUGIN = "Horse Races Plugin";
    private static readonly HORSERACE_1ST_PLACE_WINNING_SCORE_EVENT = "horserace.1stplace";
    private static readonly HORSERACE_2ND_PLACE_WINNING_SCORE_EVENT = "horserace.2ndplace";
    private static readonly HORSERACE_3RD_PLACE_WINNING_SCORE_EVENT = "horserace.3rdplace";
    private static readonly HORSERACE_WIN_BET_SCORE_EVENT = "horserace.winbet";
    private static readonly HORSERACE_APPLY_DRUGS_SCORE_EVENT = "horserace.horsedope";
    private static readonly HORSERACE_CHEATER_CAUGHT_SCORE_EVENT = "horserace.cheatercaught";

    public static readonly ALL = new Map<string, ItemEffect>([

        ["Devout", new ItemEffect("Devout", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
            [AlterUserScoreArgs.NORMAL_DANKTIME_REASON], 0.1,
            "Increases normal dank time points received by", 4)],

        ["Sentinel", new ItemEffect("Sentinel", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
            [AlterUserScoreArgs.RANDOM_DANKTIME_REASON], 0.15,
            "Increases random dank time points received by", 4)],

        ["Eternal", new ItemEffect("Eternal", AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
            [AlterUserScoreArgs.HARDCOREMODE_PUNISHMENT_REASON], -0.5,
            "Reduces hardcore mode punishment severity by")],

        ["Pious", new ItemEffect("Pious", ItemEffect.LIFE_PLUGIN, [ItemEffect.WORK_COMPLETED], 0.1,
            "Increases points gained from working by", 4)],

        ["Mastermind", new ItemEffect("Mastermind", ItemEffect.LIFE_PLUGIN, [ItemEffect.CRIME_COMMITTED], 0.1,
            "Increases points gained from committing crimes by", 4)],

        ["Succubus", new ItemEffect("Succubus", ItemEffect.LIFE_PLUGIN, ["bribe"], -0.2,
            "Reduces the cost of bribes by")],

        ["Liberator", new ItemEffect("Liberator", ItemEffect.LIFE_PLUGIN, [ItemEffect.BREAKOUT_SUCCEEDED], 0.5,
            "Increases points gained from breaking out players by", 4)],

        ["Oracle", new ItemEffect("Oracle", ItemEffect.BLACKJACK_PLUGIN, [ItemEffect.WINNER_REWARD], 0.02,
            "Increases points gained from winning blackjack by", 4)],

        ["Immortal", new ItemEffect("Immortal", ItemEffect.RUSSIAN_ROULETTE_PLUGIN, [ItemEffect.BULLET_IN_CYLINDER], -0.2,
            "Reduces points lost from losing russian roulette by")],

        ["Fool-Hearted", new ItemEffect("Fool-Hearted", ItemEffect.RUSSIAN_ROULETTE_PLUGIN, [ItemEffect.NO_BULLET_IN_CYLINDER], 0.15,
            "Increases points gained from winning russian roulette by", 4)],

        ["Magus", new ItemEffect("Magus", "*", [
            AlterUserScoreArgs.NORMAL_DANKTIME_REASON,
            AlterUserScoreArgs.RANDOM_DANKTIME_REASON,
            ItemEffect.WORK_COMPLETED,
            ItemEffect.CRIME_COMMITTED,
            ItemEffect.BREAKOUT_SUCCEEDED,
            ItemEffect.WINNER_REWARD,
            ItemEffect.NO_BULLET_IN_CYLINDER,
            ItemEffect.HORSERACE_1ST_PLACE_WINNING_SCORE_EVENT,
            ItemEffect.HORSERACE_2ND_PLACE_WINNING_SCORE_EVENT,
            ItemEffect.HORSERACE_3RD_PLACE_WINNING_SCORE_EVENT,
            ItemEffect.HORSERACE_WIN_BET_SCORE_EVENT
        ], 0.01, "Increases all points gained by", 4)]
    ]);

    constructor(
        public readonly name: string,
        public readonly plugin: string,
        public readonly reasons: string[],
        public readonly modifier: number,
        public readonly description: string,
        public readonly maxRank: number = 1) { }
}