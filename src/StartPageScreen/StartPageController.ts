import { ScreenController } from "../types.js";
import type { ScreenSwitcher } from "../types.js";
import { StartPageView } from "./StartPageView.js";

/**
 * StartPageController - Handles menu interactions
 */
export class StartPageController extends ScreenController {
	private view: StartPageView;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.view = new StartPageView(() => this.handleStartClick());
	}

	/**
	 * Handle start button click
	 */
	private handleStartClick(): void {
		this.screenSwitcher.switchToScreen({ type: "main" });
	}

	/**
	 * Get the view
	 */
	getView(): StartPageView {
		return this.view;
	}
}
