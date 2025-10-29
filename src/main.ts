import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.js";
import { StartPageController } from "./StartPageScreen/StartPageController.js";
import { MainPageController } from "./MainPageScreen/MainPageController.js";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.js";

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

	private startPageController: StartPageController;
	private mainPageController: MainPageController;


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
		this.startPageController = new StartPageController(this);
		this.mainPageController = new MainPageController(this);


		// Add all screen groups to the layer
		// All screens exist simultaneously but only one is visible at a time
		this.layer.add(this.startPageController.getView().getGroup());
		this.layer.add(this.mainPageController.getView().getGroup());


		// Draw the layer (render everything to the canvas)
		this.layer.draw();

		// Start with menu screen visible
		this.startPageController.getView().show()
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
		this.startPageController.hide();
		this.mainPageController.hide();


		// Show the requested screen based on the screen type
		switch (screen.type) {
			case "start":
				this.startPageController.show();
				break;
			case "main":
				this.mainPageController.show();
				break;
		}
	}
}

// Initialize the application
new App("root");
