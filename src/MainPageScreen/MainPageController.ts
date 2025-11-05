import { ScreenController, type ScreenSwitcher } from "../types";
import { MainPageModel } from "./MainPageModel";
import { MainPageView } from "./MainPageView";

export class MainPageController extends ScreenController {
    private model: MainPageModel;
    private view: MainPageView;
    private screenSwitcher: ScreenSwitcher;

    private clickSound: HTMLAudioElement;
    private hoverSound: HTMLAudioElement;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;

        this.model = new MainPageModel();
        this.clickSound = new Audio("/PunchSound.mp3");
        this.hoverSound = new Audio("/Picking.mp3");

        // Pass the event handlers to the view
        this.view = new MainPageView(
            (answer: number) => this.handleAnswerClick(answer),
            () => this.handleAnswerHoverStart(),
            () => this.handleAnswerHoverEnd()
        );
    }

    /**
     * Update score display in view
     */
    updateScore(score: number): void {
        this.view.setScoreText(`Score: ${score}`);
    }

    /**
     * Update timer display in view
     */
    updateTimer(timeRemaining: number): void {
        this.view.setTimerText(`Time: ${timeRemaining}`);
    }

    /**
     * Update question display in view
     */
    updateQuestion(): void {
        const questionText = `${this.model.num1} x ${this.model.num2} = ?`;
        this.view.setQuestionDisplay(questionText, this.model.allAnswers);
    }

    /**
     * Start the game
     */
    startGame(): void {
        // Reset game state
        this.reset();

        // Generate first question
        this.generateNewQuestion();

        // Update view with initial state
        this.updateScore(this.model.score);
        this.updateQuestion();
        this.view.show();

        // Start timer
        this.startTimer((timeLeft: number) => this.updateTimer(timeLeft));
    }

    /**
     * Generate a new question
     */
    private generateNewQuestion(): void {
        this.model.num1 = this.getRandomNumber(1, 12);
        this.model.num2 = this.getRandomNumber(1, 12);
        this.model.correctAnswer = this.model.num1 * this.model.num2;
        this.model.wrongAnswers = this.getWrongAnswers(this.model.correctAnswer, 3);
        this.model.allAnswers = this.randomizeOrder([this.model.correctAnswer, ...this.model.wrongAnswers]);
    }

    /**
     * Start the timer
     */
    private startTimer(callback: (timeLeft: number) => void): void {
        if (!this.model.isTimerRunning) {
            this.model.isTimerRunning = true;
            
            // Initial call to set initial state
            callback(this.model.timeRemaining);
            
            this.model.timerInterval = globalThis.setInterval(() => {
                if (this.model.timeRemaining > 0) {
                    this.model.timeRemaining--;
                    callback(this.model.timeRemaining);
                } else {
                    this.stopTimer();
                    this.endGame();
                }
            }, 1000);
        }
    }

    /**
     * Stop the timer
     */
    private stopTimer(): void {
        if (this.model.timerInterval) {
            globalThis.clearInterval(this.model.timerInterval);
            this.model.timerInterval = null;
            this.model.isTimerRunning = false;
        }
    }

    /**
     * Reset game state
     */
    private reset(): void {
        this.model.score = 0;
        this.model.timeRemaining = this.model.defaultTime;
    }

    /**
     * Generate random number between min and max inclusive
     */
    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate wrong answers for multiple choice
     */
    private getWrongAnswers(correctAnswer: number, count: number): number[] {
        const wrongAnswers: Set<number> = new Set();
        while (wrongAnswers.size < count) {
            const wrongAnswer = this.getRandomNumber(correctAnswer - 10, correctAnswer + 10);
            if (wrongAnswer !== correctAnswer) {
                wrongAnswers.add(wrongAnswer);
            }
        }
        return Array.from(wrongAnswers);
    }

    /**
     * Randomize array order
     */
    private randomizeOrder<T>(items: T[]): T[] {
        const copy = [...items];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
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
     * Handle answer click event
     */
    private handleAnswerClick(selectedAnswer: number): void {
        // Check if answer is correct
        if (selectedAnswer === this.model.correctAnswer) {
            // Update model and view if correct
            this.model.score++;
            this.updateScore(this.model.score);
        }

        // Generate next question and update view
        this.generateNewQuestion();
        this.updateQuestion();

        // Play sound effects
        this.clickSound.play();
        this.clickSound.currentTime = 0;
    }

    /**
     * End the game
     */
    private endGame(): void {
        this.stopTimer();

        // Switch back to start screen
        this.screenSwitcher.switchToScreen({
            type: "start"
        });
    }

    /**
     * Pause the game
     */
    pauseGame(): void {
        this.stopTimer();
    }

    /**
     * Resume the game
     */
    resumeGame(): void {
        if (!this.model.isTimerRunning) {
            this.startTimer((timeLeft: number) => this.updateTimer(timeLeft));
        }
    }

    /**
     * Exit the game
     */
    exitGame(): void {
        this.stopTimer();
    }

    /**
     * Get the view group
     */
    getView(): MainPageView {
        return this.view;
    }
}