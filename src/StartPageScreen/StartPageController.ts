import { ScreenController, type ScreenSwitcher } from "../types";
import { StartPageView } from "./StartPageView";

export class StartPageController extends ScreenController {
  private view: StartPageView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new StartPageView(
      () => this.handleStartClick(),
      () => this.handleHelpClick(),
      () => this.handlePracticeClick()
    );
  }

  private handleStartClick(): void {
    this.screenSwitcher.switchToScreen({ type: "roundIntro", round: 1 });
  }
  private handleHelpClick(): void {
    this.screenSwitcher.switchToScreen({ type: "help" });
  }
  private handlePracticeClick(): void {
    this.screenSwitcher.switchToScreen({ type: "practice" });
  }


  getView(): StartPageView {
    return this.view;
  }
}
