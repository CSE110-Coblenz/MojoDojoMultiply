import { ScreenController } from "../types.js";
import type { ScreenSwitcher } from "../types.js";
import { MainPageView } from "./MainPageView.js";

/**
 * MainPageController - placeholder to see main game screen for testing
 */
export class MainPageController extends ScreenController {
    private view: MainPageView;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.view = new MainPageView();
    }

    getView(): MainPageView {
        return this.view;
    }
}