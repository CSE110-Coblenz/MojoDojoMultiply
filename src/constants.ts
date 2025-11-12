// Stage dimensions
export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 600;

//Standard game colors
export const BCKGRD_COLOR = "#FFFFCD";
export const HIGHLIGHT_COLOR = "#FD754D";
export const ALERT_COLOR = "#F94449";

//Standard font
export const DEFAULT_FONT = "Impact";

// Game settings
export const GAME_DURATION = 10; // seconds

// AI settings
export const AI_ANSWER_CHANCE = 0.1; // 10% chance AI answers correctly
export const AI_CHANCE_SCALE = 0.02;

// Number of wrong answers to generate
export const WRONG_ANSWER_NUMBER = 3;

export const GAMECST = {
    STAGE_HEIGHT,
    STAGE_WIDTH,
    BCKGRD_COLOR,
    HIGHLIGHT_COLOR,
    ALERT_COLOR,
    DEFAULT_FONT,
    GAME_DURATION,
    AI_ANSWER_CHANCE,
    AI_CHANCE_SCALE,
    WRONG_ANSWER_NUMBER
} as const;