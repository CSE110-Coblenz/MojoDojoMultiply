// Stage dimensions
export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 600;

//Standard game colors
export const BCKGRD_COLOR = "#FFFFDD";
export const HIGHLIGHT_COLOR = "#FD754D";
export const ALERT_COLOR = "#F94449";
export const UNAVAIL_COLOR = "grey";
export const DARK_COLOR = "black";
export const NEUTRAL_COLOR = "grey";

//Standard font
export const DEFAULT_FONT = "Impact";

// Game settings
export const GAME_DURATION = 10; // seconds
export const ROUNDS_UNTIL_BONUS = 3;
export const BONUS_RESULT_DELAY = 1000; // milliseconds

// AI settings
export const AI_ANSWER_CHANCE = 0.1; // 10% chance AI answers correctly
export const AI_CHANCE_SCALE = 0.02;

// Number of wrong answers to generate
export const WRONG_ANSWER_NUMBER = 3;

// JSON storage key
export const GLOBAL_DATA_KEY = "AppGlobalState";

export const GAMECST = {
    STAGE_HEIGHT,
    STAGE_WIDTH,
    BCKGRD_COLOR,
    HIGHLIGHT_COLOR,
    ALERT_COLOR,
    UNAVAIL_COLOR,
    NEUTRAL_COLOR,
    DARK_COLOR,
    DEFAULT_FONT,
    GAME_DURATION,
    ROUNDS_UNTIL_BONUS,
    BONUS_RESULT_DELAY,
    AI_ANSWER_CHANCE,
    AI_CHANCE_SCALE,
    WRONG_ANSWER_NUMBER,
    GLOBAL_DATA_KEY
} as const;