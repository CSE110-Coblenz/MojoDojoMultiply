import { ScreenController, type ScreenSwitcher } from "../types";
import { ResultsPageView } from "./ResultsPageView";
import {
	ResultsPageModel,
	type LeaderboardEntry,
} from "./ResultsPageModel";

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
		this.view = new ResultsPageView(() => this.handleNextRoundClick());

		// TODO: Task 4 - Initialize game over sound audio
		this.gameOverSound = new Audio("/gameover.mp3"); // Placeholder
	}

	showResults(finalScore: number): void {
        //TODO: Show results screen with the final score

		// TODO: Play the game over sound
	}

	/**
	 * Load leaderboard from localStorage
	 */
	private loadLeaderboard(): LeaderboardEntry[] {
		// TODO: Task 5 - Load leaderboard from localStorage
        
        return []; //Placeholder
	}

	/**
	 * Save leaderboard to localStorage
	 */
	private saveLeaderboard(entries: LeaderboardEntry[]): void {
		// TODO: Task 5 - Save leaderboard to localStorage
		
	}

	/**
	 * Handle play again button click
	 */
	private handleNextRoundClick(): void {
		this.screenSwitcher.switchToScreen({ type: "roundIntro", round: 1 });
	}

	/**
	 * Get the view
	 */
	getView(): ResultsPageView {
		return this.view;
	}
}
