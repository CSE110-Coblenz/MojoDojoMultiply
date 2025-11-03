import { ScreenController } from "../types";
import type { ScreenSwitcher, View } from "../types";
import { HelpPageView } from "./HelpPageView";

/**
 * MenuScreenController - Handles menu interactions
 */

export class HelpPageController extends ScreenController {
    private view: HelpPageView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.view = new HelpPageView(() => this.handleLeaveClick());
    }

    /**
     * Handle leave button click
     */
    private handleLeaveClick(): void {
     // TODO: Implement screen transition from helpScreen to mainGame
    }

     /**
         * Get the view
         */
    getView(): HelpPageView {
        return this.view;
    }
}