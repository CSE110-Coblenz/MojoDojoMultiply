import { ScreenController, type ScreenSwitcher } from "../types";
import { RoundStatsView } from "./RoundStatsView";
import { GAMECST } from "../constants";

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
    if (this.round > 0 && this.round % GAMECST.ROUNDS_UNTIL_BONUS === 0) {
      // Time for the bonus round
      this.screenSwitcher.switchToScreen({ type: "bonus" });
    } else {
      // Go to the next regular round
      this.screenSwitcher.switchToScreen({
        type: "intro",
        round: this.round + 1,
      });
  }

  show(): void { this.view.show(); }
  hide(): void { this.view.hide(); }
  getView(): RoundStatsView { return this.view; }
}