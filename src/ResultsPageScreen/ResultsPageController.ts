import { ScreenController, type ScreenSwitcher } from "../types";
import { ResultsPageView } from "./ResultsPageView";
import {
	ResultsPageModel,
	type LeaderboardEntry,
} from "./ResultsPageModel";
import { MainPageModel } from "../MainPageScreen/MainPageModel";

const LEADERBOARD_KEY = "MojoDojoLeaderboard";
const MAX_LEADERBOARD_ENTRIES = 5;

/**
 * ResultsScreenController - Handles results screen interactions
 */
export class ResultsScreenController extends ScreenController {
	private model: ResultsPageModel;
	private view: ResultsPageView;
	private screenSwitcher: ScreenSwitcher;
	private mainModel: MainPageModel;
	

	private gameOverSound: HTMLAudioElement;

	constructor(screenSwitcher: ScreenSwitcher, mainModel: MainPageModel) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.mainModel = mainModel; 
		this.model = new ResultsPageModel();
		this.view = new ResultsPageView(
  			() => this.handleNextRoundClick(),
  			() => this.handleMainMenuClick()
		);

		// TODO: Task 4 - Initialize game over sound audio
		this.gameOverSound = new Audio("/game-over-arcade-6435.mp3"); // Placeholder
	}

	showResults(finalScore: number): void {
        //TODO: Show results screen with the final score
		

		// TODO: Play the game over sound
		this.gameOverSound.play();
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
	private handleMainMenuClick(): void {
		this.screenSwitcher.switchToScreen({ type: "start" });
	}

	/**
	 * Handle main Menu button click
	 */
	private handleNextRoundClick(): void {
		this.screenSwitcher.switchToScreen({ type: "intro"});
	}

	/**
	 * Get the view
	 */
	getView(): ResultsPageView {
		return this.view;
	}
}
