import { ScreenController, type ScreenSwitcher } from "../types";
import { RoundStatsView } from "./RoundStatsView";

export class RoundStatsController extends ScreenController {
  private screenSwitcher: ScreenSwitcher;
  private view: RoundStatsView;
  private round = 1;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new RoundStatsView(() =>
      this.screenSwitcher.switchToScreen({ type: "intro", round: this.round + 1 })
    );
  }

  setRound(round: number): void {
    this.round = round;
    this.view.setTitle(`Round ${round} Complete! (stats go below)`);
  }

  private nextRound(): void {
    this.screenSwitcher.switchToScreen({
      type: "intro",
      round: this.round + 1,
    });
  }

  show(): void { this.view.show(); }
  hide(): void { this.view.hide(); }
  getView(): RoundStatsView { return this.view; }
}