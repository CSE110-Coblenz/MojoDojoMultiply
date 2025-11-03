import { ScreenController } from "../types";
import type { ScreenSwitcher} from "../types";
import { HelpPageView } from "./HelpPageView";

/**
 * MenuScreenController - Handles menu interactions
 */

export class HelpPageController extends ScreenController {
    private view: HelpPageView;
    private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this._screenSwitcher = screenSwitcher;
    this.view = new HelpPageView();

    const backButton = this.view.getBackButton();

    backButton.on('click tap', () => {
      this._screenSwitcher.switchToScreen({ type: "start" });
    });
  }

     /**
         * Get the view
         */
    getView(): HelpPageView {
        return this.view;
    }
}