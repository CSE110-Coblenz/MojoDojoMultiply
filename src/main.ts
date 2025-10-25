// import Konva from "konva";
// import type { ScreenSwitcher, Screen } from "./types.ts";
// import { MenuScreenController } from "./screens/MenuScreen/MenuScreenController.ts";
// import { GameScreenController } from "./screens/GameScreen/GameScreenController.ts";
// import { ResultsScreenController } from "./screens/ResultsScreen/ResultsScreenController.ts";
// import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";

/**
 * Main Application - Coordinates all screens
 *
 * This class demonstrates screen management using Konva Groups.
 * Each screen (Menu, Game, Results) has its own Konva.Group that can be
 * shown or hidden independently.
 *
 * Key concept: All screens are added to the same layer, but only one is
 * visible at a time. This is managed by the switchToScreen() method.
 */