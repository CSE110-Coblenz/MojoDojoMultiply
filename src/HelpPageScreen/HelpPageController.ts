import { ScreenController } from "../types";
import type { ScreenSwitcher} from "../types";
import { HelpPageView } from "./HelpPageView";

export class HelpPageController extends ScreenController {
    private view: HelpPageView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.view = new HelpPageView(() => this.handleLeaveClick());
    }

    //Im sorry mohammed :(

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