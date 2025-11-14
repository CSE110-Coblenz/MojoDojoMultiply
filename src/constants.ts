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
    GLOBAL_DATA_KEY
} as const;