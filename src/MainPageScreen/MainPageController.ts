/**
 * GameScreenModel - Manages game state
 */
import { ScreenController } from "../types";
import type { ScreenSwitcher } from "../types.ts";
import { MainPageModel } from "./MainPageModel";
import { MainPageView } from "./MainPageView";
import { GAME_DURATION } from "../constants";


export class MainPageController extends ScreenController {
	private model: MainPageModel;
	private view: MainPageView;
	private screenSwitcher: ScreenSwitcher;
	private gameTimer: number | null = null;

	private squeezeSound: HTMLAudioElement;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

		this.model = new MainPageModel();
		this.view = new MainPageView(() => this.handleLemonClick());

		// TODO: Task 4 - Initialize squeeze sound audio
		this.squeezeSound = new Audio("/squeeze.mp3");
	}

	/**
	 * Start the game
	 */
	startGame(): void {
		// Reset model state
		this.model.reset();

		// Update view
		this.view.updateScore(this.model.getScore());
		this.view.updateTimer(GAME_DURATION);
		this.view.show();

		this.startTimer();
	}

	/**
	 * Start the countdown timer
	 */
	private startTimer(): void {
		let timeRemaining = GAME_DURATION;
		const timerId = setInterval(() => {
			timeRemaining--;
			this.view.updateTimer(timeRemaining);
  			console.log("This runs every 1000ms");
			if (timeRemaining <= 0) {
				this.endGame();
			}
		}, 1000);

		// Stop the timer
		this.gameTimer = timerId;
	}

	/**
	 * Stop the timer
	 */
	private stopTimer(): void {
		if (this.gameTimer !== null) {
			clearInterval(this.gameTimer);
			this.gameTimer = null;
		}
	}

	/**
	 * Handle lemon click event
	 */
	private handleLemonClick(): void {
		// Update model
		this.model.incrementScore();

		// Update view
		this.view.updateScore(this.model.getScore());
		this.view.randomizeLemonPosition();

		this.squeezeSound.play();

		this.squeezeSound.currentTime = 0;
	}

	/**
	 * End the game
	 */
	private endGame(): void {
		this.stopTimer();

		// Switch to results screen with final score
		this.screenSwitcher.switchToScreen({
			type: "result",
			score: this.model.getScore(),
		});
	}

	/**
	 * Get final score
	 */
	getFinalScore(): number {
		return this.model.getScore();
	}

	/**
	 * Get the view group
	 */
	getView(): MainPageView {
		return this.view;
	}
}
