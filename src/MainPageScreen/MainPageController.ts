import { ScreenController, type ScreenSwitcher } from "../types";
import { MainPageView } from "./MainPageView";

export class MainPageController extends ScreenController {
  private view: MainPageView;
  // keep a reference for future transitions if needed
  private _screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this._screenSwitcher = screenSwitcher;
    this.view = new MainPageView(); // currently just a placeholder view
  }

  getView(): MainPageView {
    return this.view;
  }
}