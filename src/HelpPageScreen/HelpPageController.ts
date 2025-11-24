import { ScreenController } from "../types";
import type { ScreenSwitcher} from "../types";
import { HelpPageView } from "./HelpPageView";
import { MainPageController } from "../MainPageScreen/MainPageController";
import { clearGlobalState } from "../storageManager";

export class HelpPageController extends ScreenController {
    private view: HelpPageView;
    private screenSwitcher: ScreenSwitcher;
    private gameWasPrevious: boolean = false;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.view = new HelpPageView(
            () => this.handleMenuClick(),
            () => this.handleStartGameClick(),
            () => this.handleStartPracticeClick()
        );
    }

    /**
     * 
     */
    gamePrev(gamePrev: boolean): void {
        this.gameWasPrevious = gamePrev;
        if(gamePrev) {
            this.view.showReturnButtonText();
        } else {
            this.view.showStartButtonText();
        }
    }

    /**
     * Handle help to main game button
     */
    private handleStartGameClick(): void {
        this.screenSwitcher.switchToScreen({ type: "intro"});
    }

    /**
     * 
     */
    private handleMenuClick(): void {
        if(this.gameWasPrevious) MainPageController.endGameEarly();
        clearGlobalState();
        this.screenSwitcher.switchToScreen({ type: "start"});
    }

    /**
     * 
     */
    private handleStartPracticeClick(): void {
        if(this.gameWasPrevious) MainPageController.endGameEarly();
        clearGlobalState();
        this.screenSwitcher.switchToScreen({ type: "practice"});
    }

    /**
     * Get the view
     */
    getView(): HelpPageView {
        return this.view;
    }
}