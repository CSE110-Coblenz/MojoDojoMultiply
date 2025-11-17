import { ScreenController, type ScreenSwitcher } from "../types";
import { RoundStatsView, type RoundStatsEntry } from "./RoundStatsView";

export class RoundStatsController extends ScreenController {
  private screenSwitcher: ScreenSwitcher;
  private view: RoundStatsView;

  //Key MUST MATCH MainPageControler
  private readonly HISTORY_KEY = "MojoDojoRoundStats";

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.view = new RoundStatsView(
      () => this.handleNextRoundButton(),
      () => this.handleMenuButton()
    );
  }

  /**
   * Reads JSON round history from localStorage
   * @returns [] if none is found
   */
  private loadHistory(): RoundStatsEntry[] {
    const raw = localStorage.getItem(this.HISTORY_KEY);
    if (!raw) return []; //no history yet
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as RoundStatsEntry[];
      }
    } catch (e) {
      console.error("Error parsing round history:", e);
    }
    return [];
  }

  /**
   * NEXT ROUND BUTTON -> goes to the roundIntro screen
   * Use the last round number + 1 to increment to the next round
   */
  private handleNextRoundButton(): void {
    // if we have history, use last round + 1, else start at 1
    const history = this.loadHistory();
    const lastRound =
      history.length > 0 ? history[history.length - 1].round : 1;

    this.screenSwitcher.switchToScreen({
      type: "intro",
      round: lastRound + 1,
    });
  }

  /**
   * MENU button -> go to the main menu
   */
  private handleMenuButton(): void {
    this.screenSwitcher.switchToScreen({ type: "start" });
  }

  /**
   * When stats screen is shown, load the latest round from JSON and update the view
   */
  show(): void {
    const history = this.loadHistory();

    if (history.length > 0) {
      const latest = history[history.length - 1];

      //Update title: ROUND X COMPLETE!
      this.view.setRound(latest.round);

      //Update the main "Final Round" score
      this.view.updateFinalRoundStats(
        latest.points,
        latest.correct,
        latest.total
      );

      //Update the round history list
      this.view.updateLeaderboard(history);

    } else {
      // No history yet
      this.view.setRound(1);
      this.view.updateFinalRoundStats(0, 0, 0);
      this.view.updateLeaderboard([]);
    }

    this.view.show();
  }

  hide(): void {
    this.view.hide();
  }

  getView(): RoundStatsView {
    return this.view;
  }
}