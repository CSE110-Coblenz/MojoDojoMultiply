import { ScreenController, type ScreenSwitcher } from "../types";
import { BonusLevelView } from "./BonusLevelView";
import { BonusLevelModel } from "./BonusLevelModel";

export class BonusLevelController extends ScreenController {
  private view: BonusLevelView;
  private _screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this._screenSwitcher = screenSwitcher;
    this.view = new BonusLevelView();
  }

  getView(): BonusLevelView {
    return this.view;
  }
}