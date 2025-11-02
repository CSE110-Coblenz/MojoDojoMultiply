import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.js";
import { StartPageView } from "./StartPageScreen/StartPageView.js";

// Create the Konva stage and a single layer. The views expose Konva.Groups
// so we add them to the layer.
const stage = new Konva.Stage({
	container: "root",
	width: STAGE_WIDTH,
	height: STAGE_HEIGHT,
});

const layer = new Konva.Layer();
stage.add(layer);

// Instantiate the main page view and add its group to the layer so it is visible.
const startView = new StartPageView(() => {
	// placeholder start handler
	// Later this would switch screens / start the game
	// console.log("Start clicked");
});

layer.add(startView.getGroup());
layer.draw();