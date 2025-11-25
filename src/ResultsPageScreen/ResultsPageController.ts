import { ScreenController, type ScreenSwitcher } from "../types";
import { ResultsPageView} from "./ResultsPageView";
import {
	ResultsPageModel,
	type RoundStatsEntry,
} from "./ResultsPageModel";
import { GAMECST } from "../constants";
import { getGlobalState, saveGlobalState } from "../storageManager";

const LEADERBOARD_KEY = "MojoDojoLeaderboard";
const MAX_LEADERBOARD_ENTRIES = 5;

/**
 * ResultsScreenController - Handles results screen interactions
 */
export class ResultsScreenController extends ScreenController {
	private model: ResultsPageModel;
	private view: ResultsPageView;
	private screenSwitcher: ScreenSwitcher;

	private gameOverSound: HTMLAudioElement;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new ResultsPageModel();
		this.view = new ResultsPageView(
  			() => this.handleNextRoundClick(),
  			() => this.handleMainMenuClick(),
			() => this.handleHoverStart(),
			() => this.handleHoverEnd()
		);

		// TODO: Task 4 - Initialize game over sound audio
		this.gameOverSound = new Audio("/gameover.mp3"); // Placeholder
	}

	showResults(finalScore: number): void {
        this.view.updateFinalScore(0);
	}

	/**
	 * Load leaderboard from localStorage
	 */
	private loadLeaderboard(): RoundStatsEntry[] {
		// TODO: Task 5 - Load leaderboard from localStorage
        
        return []; //Placeholder
	}

	/**
	 * Save leaderboard to localStorage
	 */
	private saveLeaderboard(entries: RoundStatsEntry[]): void {
		// TODO: Task 5 - Save leaderboard to localStorage
		
	}

	/**
	 * Handle play again button click
	 */
	private handleMainMenuClick(): void {
		this.screenSwitcher.switchToScreen({ type: "start" });
	}

	/**
	 * Handle main Menu button click
	 */
	private handleNextRoundClick(): void {
		this.screenSwitcher.switchToScreen({ type: "intro"});
	}

	private loadHistory(): RoundStatsEntry[] {
		const raw = localStorage.getItem(GAMECST.ROUND_STATS_KEY);
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
	 * Show the results screen
	 * 
	 */
	show(): void {
		const history = this.loadHistory();
		const globalState = getGlobalState();

		//this.view.setRound(globalState.currentRound);
		this.view.updateFinalScore(globalState.totalScore);

		if (history.length > 0) {

			let previousRounds = history.slice(0,-1);

			// Limit how many we print
			if (previousRounds.length > GAMECST.MAX_HISTORY_PRINT) {
				previousRounds = previousRounds.slice(-GAMECST.MAX_HISTORY_PRINT); 
				// last N entries (most recent)
			}     

			// Leaderboard sorted by BEST ROUND (highest points first)
				const leaderboardByBest = this.getHistorySortedByBest(previousRounds);
				this.view.updateLeaderboard(leaderboardByBest);
			} else {
				// No history yet
				this.view.updateLeaderboard([]);
			}

			this.view.show();
		}

	_hide(): void {
		this.view.hide();
	}

	/**
	 * Get the view
	 */
	getView(): ResultsPageView {
		return this.view;
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
}