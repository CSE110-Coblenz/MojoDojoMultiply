import { ScreenController } from "../types";
import type { ScreenSwitcher, View } from "../types";
import { StartPageView } from "./StartPageView";

/**
 * MenuScreenController - Handles menu interactions
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
     // TODO: Implement screen transition from startGame to playable game
    }

    /**
     * Handle practice button
     */
    private handlePracticeClick(): void {
        //TODO: Implement screen transition from startGame to practiceArea
    }

    private handleHelpClick(): void {
        //TODO: Implement screen transition from startGame to helpPage
    }

    /**
     * Get the view
     */
    getView(): StartPageView {
        return this.view;
    }
}