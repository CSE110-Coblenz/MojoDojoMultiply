// import Konva from "konva";
// import type { ScreenSwitcher, Screen } from "./types";
//import { MainPageController } from "./MainPageScreen/MainPageController"; (template imports)
//import { GameScreenController } from "./GameScreen/GameScreenController"; (not yet implemented)
//import { ResultsScreenController } from "./ResultsScreen/ResultsScreenController"; (not yet created)
//import { BonusLevelScreenController } from "./BonusLevelScreen/BonusLevelScreenController"; (not yet implemented)
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";

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

// class App implements ScreenSwitcher {
// 	private stage: Konva.Stage;
// 	private layer: Konva.Layer;

// 	private menuController: MainScreenController;
// 	private gameController: GameScreenController;
// 	private resultsController: ResultsScreenController;

// 	constructor(container: string) {
// 		// Initialize Konva stage (the main canvas)
// 		this.stage = new Konva.Stage({
// 			container,
// 			width: STAGE_WIDTH,
// 			height: STAGE_HEIGHT,
// 		});

// 		// Create a layer (screens will be added to this layer)
// 		this.layer = new Konva.Layer();
// 		this.stage.add(this.layer);

// 		// Initialize all screen controllers
// 		// Each controller manages a Model, View, and handles user interactions
// 		this.menuController = new MenuScreenController(this);
// 		this.gameController = new GameScreenController(this);
// 		this.resultsController = new ResultsScreenController(this);

// 		// Add all screen groups to the layer
// 		// All screens exist simultaneously but only one is visible at a time
// 		this.layer.add(this.menuController.getView().getGroup());
// 		this.layer.add(this.gameController.getView().getGroup());
// 		this.layer.add(this.resultsController.getView().getGroup());

// 		// Draw the layer (render everything to the canvas)
// 		this.layer.draw();

// 		// Start with menu screen visible
// 		this.menuController.getView().show();
// 	}
// }
