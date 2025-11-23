import Konva from "konva";
import { AnimatedSprite } from "../AnimatedSprites";
import { ScreenController, type ScreenSwitcher } from "../types";
import { RoundStatsView, type RoundStatsEntry } from "./RoundStatsView";
import { GAMECST } from "../constants.js";
import { getGlobalState, GlobalState, saveGlobalState } from "../storageManager"
import { RoundStatsModel } from "./RoundStatsModel";

export class RoundStatsController extends ScreenController {
  private screenSwitcher: ScreenSwitcher;
  private view: RoundStatsView;
  private model: RoundStatsModel;

  //Reduces the history print to confines of history box
  private readonly MAX_HISTORY_PRINT = 7;

  private victorySprite: AnimatedSprite | null = null;

  //Key MUST MATCH MainPageControler
  private readonly HISTORY_KEY = "MojoDojoRoundStats";

  constructor(screenSwitcher: ScreenSwitcher, layer: Konva.Layer) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new RoundStatsModel();

    this.view = new RoundStatsView(
      () => this.handleNextRoundButton(),
      () => this.handleMenuButton(),
      () => this.handleHoverStart(),
      () => this.handleHoverEnd(),
      layer
    );

    this.setupGlobalStateListener();
  }

  /**
       * function for activating listener for stored data change to trigger resync
       */
      setupGlobalStateListener(): void {
          // Listen for changes made by other windows (automatic updates when saving)
          window.addEventListener('storage', (event: StorageEvent) => {
              // Check if the change was made to the same key
              if (event.key === GAMECST.GLOBAL_DATA_KEY) {
                  // event.newValue holds the new JSON string
                  if (event.newValue) {
                      try {
                          const newState = JSON.parse(event.newValue) as GlobalState;
                          
                          // Update data with loaded data from JSON
                          this.model.currentRound=newState.currentRound;
                          
                      } catch (e) {
                          console.error("Failed to parse storage update:", e);
                      }
                  }
              }
          });
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
   * Helper: return history sorted by "best round"
   * Highest points first, then (optionally) by accuracy, then by round number.
   */
  private getHistorySortedByBest(history: RoundStatsEntry[]): RoundStatsEntry[] {
    return [...history].sort((a, b) => {
      // 1) Highest points first
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      // 2) Tie-breaker: higher accuracy first
      const aAccuracy = a.total > 0 ? a.correct / a.total : 0;
      const bAccuracy = b.total > 0 ? b.correct / b.total : 0;
      if (bAccuracy !== aAccuracy) {
        return bAccuracy - aAccuracy;
      }

      // 3) Final tie-breaker: earlier round number first
      return a.round - b.round;
    });
  }

  /**
   * NEXT ROUND BUTTON -> goes to the roundIntro screen
   * Use the last round number + 1 to increment to the next round
   */
  private handleNextRoundButton(): void {
    this.hide();

    //increment round num thats in the save system
    const savedState = getGlobalState();
    savedState.currentRound++;
    saveGlobalState(savedState);

    this.screenSwitcher.switchToScreen({type: "intro"});
  }

  /**
     * Handle hover start on any clickable element
     * Changes the cursor to a pointer
     */
    private handleHoverStart(): void {
        document.body.style.cursor = 'pointer';
    }

    /**
     * Handle hover end on any clickable element
     * Resets the cursor to default
     */
    private handleHoverEnd(): void {
        document.body.style.cursor = 'default';
    }

  /**
   * MENU button -> go to the main menu
   */
  private handleMenuButton(): void {
    this.hide();
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

      // Only show *previous* rounds in the history box
      let previousRounds = history.slice(0, -1);

      // Limit how many we print
      if (previousRounds.length > this.MAX_HISTORY_PRINT) {
        previousRounds = previousRounds.slice(-this.MAX_HISTORY_PRINT); 
      // last N entries (most recent)
      }     

      // Leaderboard sorted by BEST ROUND (highest points first)
      const leaderboardByBest = this.getHistorySortedByBest(previousRounds);
      this.view.updateLeaderboard(leaderboardByBest);
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