import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";
import { StartPageController } from "./StartPageScreen/StartPageController";
import { MainPageController } from "./MainPageScreen/MainPageController";
import { HelpPageController } from "./HelpPageScreen/HelpPageController";
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
class App implements ScreenSwitcher {
	private stage: Konva.Stage;
	private layer: Konva.Layer;

	private menuController: StartPageController;
	private gameController: MainPageController;
	private resultsController: HelpPageController;

	constructor(container: string) {
		// Initialize Konva stage (the main canvas)
		this.stage = new Konva.Stage({
			container,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
		});

		// Create a layer (screens will be added to this layer)
		this.layer = new Konva.Layer();
		this.stage.add(this.layer);

		// Initialize all screen controllers
		// Each controller manages a Model, View, and handles user interactions
		this.menuController = new StartPageController(this);
		this.gameController = new MainPageController(this);
		this.resultsController = new HelpPageController(this);

		// Add all screen groups to the layer
		// All screens exist simultaneously but only one is visible at a time
		this.layer.add(this.menuController.getView().getGroup());
		this.layer.add(this.gameController.getView().getGroup());
		this.layer.add(this.resultsController.getView().getGroup());

		// Draw the layer (render everything to the canvas)
		this.layer.draw();

		// Start with menu screen visible
		this.menuController.getView().show();
	}

	/**
	 * Switch to a different screen
	 *
	 * This method implements screen management by:
	 * 1. Hiding all screens (setting their Groups to invisible)
	 * 2. Showing only the requested screen
	 *
	 * This pattern ensures only one screen is visible at a time.
	 */
	switchToScreen(screen: Screen): void {
		// Hide all screens first by setting their Groups to invisible
		this.menuController.hide();
		this.gameController.hide();
		this.resultsController.hide();

		// Show the requested screen based on the screen type
		switch (screen.type) {
			case "menu":
				this.menuController.show();
				break;

			case "game":
				// Start the game (which also shows the game screen)
				this.gameController.startGame();
				break;

			case "result":
				//this.resultsController.showResults(screen.score);
				break;
		}
	}
}

// Initialize the application
new App("container");