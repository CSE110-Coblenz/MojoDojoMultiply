import Konva from "konva";
import type { View } from "../types.js";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../constants.js";

/**
 * MainPageView - Renders the main game screen
 */
export class MainPageView implements View {
    private group: Konva.Group;

	// later change to constructor(onStartClick: () => void) {
	constructor() {
		this.group = new Konva.Group({ visible: false });

		const text = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 2,
			text: "MAIN GAME",
			fontSize: 100
		})
		text.offsetX(text.width() / 2);
		text.offsetY(text.height() / 2);
		this.group.add(text);
	}

	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
}