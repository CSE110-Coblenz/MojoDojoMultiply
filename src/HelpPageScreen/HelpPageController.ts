import { ScreenController, type ScreenSwitcher } from "../types";
import { HelpPageView } from "./HelpPageView";

export class HelpPageController extends ScreenController {
  private view: HelpPageView;
  private _screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this._screenSwitcher = screenSwitcher;
    this.view = new HelpPageView();

    const backButton = this.view.getBackButton();

    backButton.on('click tap', () => {
      this._screenSwitcher.switchToScreen({ type: "start" });
    });
  }

  getView(): HelpPageView {
    return this.view;
  }
}