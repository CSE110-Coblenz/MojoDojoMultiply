import { ScreenController } from "../types";
import type { ScreenSwitcher} from "../types";
import { HelpPageView } from "./HelpPageView";
import { getGlobalState } from "../storageManager";

export class HelpPageController extends ScreenController {
    private view: HelpPageView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.view = new HelpPageView(
            () => this.handleLeaveClick(),
            () => this.handleStartClick()
        );
    }

    /**
     * Handle leave button click
     */
    private handleLeaveClick(): void {
     // TODO: Implement screen transition from helpScreen to start screen
     this.screenSwitcher.switchToScreen({ type: "start" });
    }

    /**
     * Handle help to main game button
     */
    private handleStartClick(): void {
     // TODO: Implement screen transition from helpScreen to mainGame
     // TODO: Implement round incrementing
     const state = getGlobalState();
     const startRound = state.currentRound;
     this.screenSwitcher.switchToScreen({ type: "main", round:startRound });
    }

     /**
         * Get the view
         */
    getView(): HelpPageView {
        return this.view;
    }
}