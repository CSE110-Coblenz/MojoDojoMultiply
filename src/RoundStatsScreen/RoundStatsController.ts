import { ScreenController, type ScreenSwitcher } from "../types";
import { RoundStatsView } from "./RoundStatsView";

export class RoundStatsController extends ScreenController {
  private view: RoundStatsView;
  private round = 1;
  constructor(private switcher: ScreenSwitcher) {
    super();
    this.view = new RoundStatsView(
      () => this.switcher.switchToScreen({ type: "roundIntro", round: this.round + 1 }),
      () => this.switcher.switchToScreen({ type: "start" }),
    );
  }
  setRound(r: number) { this.round = r; this.view.setRound(r); }
  setStats(stats: { roundScore: number; correct: number; total: number; fastestMs: number | null; }) {
    this.view.setStats(stats);
  }
  getView(): RoundStatsView { return this.view; }
}