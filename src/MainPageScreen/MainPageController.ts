import { ScreenController, type ScreenSwitcher } from "../types";
import { MainPageView } from "./MainPageView";

/**
 * MainPageController - Manages game logic and user interaction
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

	private clickSound: HTMLAudioElement;
	private hoverSound: HTMLAudioElement;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

		this.model = new MainPageModel();
		this.clickSound = new Audio("/PunchSound.mp3");
		this.hoverSound = new Audio("/Picking.mp3");

		// Pass the event handlers to the view. The controller will coordinate
		// with the model to generate questions and supply answers to the view.
		this.view = new MainPageView(
			(answer: number) => this.handleAnswerClick(answer),
			() => this.handleAnswerHoverStart(),
			() => this.handleAnswerHoverEnd()
		);
	}

	/**
	 * Handle hover start on answer squares
	 */
	private handleAnswerHoverStart(): void {
		document.body.style.cursor = 'pointer';
		this.hoverSound.currentTime = 0;
		this.hoverSound.play();
	}

	/**
	 * Handle hover end on answer squares
	 */
	private handleAnswerHoverEnd(): void {
		document.body.style.cursor = 'default';
	}

	/**
	 * Start the game
	 */
	startGame(): void {
		// Reset model state
		this.model.reset();

		// Generate first question inside the model
		this.model.generateNewQuestion(
			(min, max) => this.getRandomNumber(min, max),
			(correct, count) => this.getWrongAnswers(correct, count),
			(answers) => this.randomizeOrder(answers),
			1,
			12,
			3
		);

		// Update view
		//this.view.updateScore(this.model.getScore());
		//this.view.updateTimer(GAME_DURATION);
		this.view.updateQuestion(this.model.getNum1(), this.model.getNum2(), this.model.getAllAnswers());
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
			//this.view.updateTimer(timeRemaining);
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
	 * Handle answer click event
	 */
	private handleAnswerClick(selectedAnswer: number): void {
		// Check if answer is correct
		if (selectedAnswer === this.model.getCorrectAnswer()) {
			// Update model only if correct
			this.model.incrementScore();
			//this.view.updateScore(this.model.getScore());
		}

		// Generate next question in model and update view
		this.model.generateNewQuestion(
			(min, max) => this.getRandomNumber(min, max),
			(correct, count) => this.getWrongAnswers(correct, count),
			(answers) => this.randomizeOrder(answers),
			1,
			12,
			3
		);
		this.view.updateQuestion(this.model.getNum1(), this.model.getNum2(), this.model.getAllAnswers());

		this.clickSound.play();
		this.clickSound.currentTime = 0;
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

	/**
    * Helper function to generate random num, generates problems for model
    * @param min - minimum number generate can produce
    * @param max - maximum number generate can produce
    * @return number - random number between min and max
    */ 
    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Helper function to generate wrong answers, used to make multiple choice options
     * TODO: Modify to create better wrong answers
     * @param correctAnswer - the correct answer to base wrong answers off of
     * @param count - the number of wrong answers to generate
     * @returns an array of wrong answers
     */
    getWrongAnswers(correctAnswer: number, count: number): number[] {
        const wrongAnswers: Set<number> = new Set();
        while (wrongAnswers.size < count) {
            const wrongAnswer = this.getRandomNumber(correctAnswer - 10, correctAnswer + 10); //TODO: bad implementation, generates random wrong based on +- 10
            if (wrongAnswer !== correctAnswer) {
                wrongAnswers.add(wrongAnswer);
            }
        }
        return Array.from(wrongAnswers);
    }

    /**
     * Helper function to randomize order of multiple choice options
     * @param items - array of items to randomize
     * @returns randomized array of items
     */
    randomizeOrder<T>(items: T[]): T[] {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); //generate random swap
            [items[i], items[j]] = [items[j], items[i]]; //perform swap
        }
        return items;
    }
}
