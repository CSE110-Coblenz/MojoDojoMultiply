import { ScreenController, type ScreenSwitcher } from "../types";
import { PracticeAreaView } from "./PracticeAreaView";

export class PracticeAreaController extends ScreenController {
  private view: PracticeAreaView;
  private _screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this._screenSwitcher = screenSwitcher;
    this.view = new PracticeAreaView();
  }

  getView(): PracticeAreaView {
    return this.view;
  }
}