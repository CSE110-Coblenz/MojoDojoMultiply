import { ScreenController, type ScreenSwitcher } from "../types";
import { PracticeAreaView } from "./BonusLevelView";

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