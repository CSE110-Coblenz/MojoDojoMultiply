import { ScreenController, type ScreenSwitcher } from "../types";
import { PracticeAreaModel } from "./PracticeAreaModel";
import { PracticeAreaView } from "./PracticeAreaView";
import { GAMECST } from "../constants";
import { GlobalState } from "../storageManager"

export class PracticeAreaController extends ScreenController {
    private model: PracticeAreaModel;
    private view: PracticeAreaView;
    private screenSwitcher: ScreenSwitcher;
    private clickSound: HTMLAudioElement;
    private isMuted: boolean = false;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;

        this.model = new PracticeAreaModel();

        // Initialize click sound with error handling
        this.clickSound = new Audio("/PunchSound.mp3");
        this.clickSound.onerror = (e) => {
            console.error('Error loading sound:', e);
        };

        // Pass the event handlers to the view
        this.view = new PracticeAreaView(
            (answer: number) => this.handleAnswerClick(answer),
            () => this.handlePausePlayGame(),
            () => this.handleHoverStart(),
            () => this.handleHoverEnd(),
            () => this.handleStartClick(),
            () => this.handleGameClick(),
            () => this.handleMuteClick(),
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
                        this.model.currentRound = newState.currentRound;

                    } catch (e) {
                        console.error("Failed to parse storage update:", e);
                    }
                }
            }
        });
    }

    /**
     * Update question display in view
     */
    updateQuestion(): void {
        const questionText = `${this.model.num1} x ${this.model.num2} = ?`;
        this.view.setQuestionDisplay(questionText, this.model.allAnswers);
    }

    /**
     * Generate a new question while setting up computer's response and their timing
     * @returns void
     */
    private generateNewQuestion(): void {
        this.model.num1 = this.getRandomNumber(1, 12);
        this.model.num2 = this.getRandomNumber(1, 12);
        this.model.correctAnswer = this.model.num1 * this.model.num2;
        this.model.wrongAnswers = this.getWrongAnswers(this.model.correctAnswer, 3);
        this.model.allAnswers = this.randomizeOrder([this.model.correctAnswer, ...this.model.wrongAnswers]);

        // Reset response times for new question
        this.model.playerTime = 0;
        this.model.computerTime = 0;
        this.model.playerResponse = 0;

        // AI chance to get the correct answer
        if (Math.random() < GAMECST.AI_ANSWER_CHANCE + GAMECST.AI_CHANCE_SCALE * this.model.currentRound) {
            this.model.computerResponse = this.model.correctAnswer;
        } else {
            // Pick a random wrong answer
            this.model.computerResponse = this.model.wrongAnswers[
                Math.floor(Math.random() * this.model.wrongAnswers.length)
            ];
        }

        // Simulate computer's response after a random delay
        const minDelay = 1000; // 1 second
        const maxDelay = 3000; // 3 seconds
        const delay = Math.random() * (maxDelay - minDelay) + minDelay;

        setTimeout(() => { this.model.computerTime = Date.now(); }, delay);
    }

    /**
     * Start the game running other functions that update the game view
     * @returns void
     */
    startGame(round: number = this.model.currentRound): void {
        // Reset game state
        this.resetForRound(round);

        // Generate first question
        this.generateNewQuestion();
        this.updateQuestion();

        // Show the view after initial setup
        this.view.show();

    }

    /**
     * reset state for new rounds
     */
    private resetForRound(round: number): void {
        this.model.currentRound = round;
        this.model.playerHealth = this.model.maxHealth;
        this.model.opponentHealth = this.model.maxHealth;
        this.model.roundCorrect = 0;
        this.model.roundScore = 0;
        this.model.roundTotal = 0;
    }

    /**
     * Switches the screen to the start page when the pause menu button is clicked
     */
    private handleStartClick(): void {
        this.endGameEarly();
        this.screenSwitcher.switchToScreen({ type: "start" });
    }

    /**
     * Switches the screen to the start page when the pause menu button is clicked
     */
    private handleGameClick(): void {
        this.endGameEarly();
        this.screenSwitcher.switchToScreen({ type: "main" });
    }


    /**
     * Generates new questions, displays the new questions, and resets the timer.
     */
    private advanceGame() {
        this.generateNewQuestion();
        this.updateQuestion();
        // this.startQuestionTimer();
    }

    /**
     * Generate random number between min and max inclusive
     */
    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    /**
     * Generate wrong answers for multiple choice
     * Generate wrong answers for multiple choice, ensuring they don't match the correct answer
     * They are generated within a range of 0 to double the correct answer
     * @param correctAnswer the correct answer to avoid
     * @param count number of wrong answers to generate
     * @returns array of wrong answers
     */
    private getWrongAnswers(correctAnswer: number, count: number): number[] {
        const wrongAnswers: Set<number> = new Set();
        const maxBetweenMultiplicands = Math.max(this.model.num1, this.model.num2)
        while (wrongAnswers.size < count) {
            let wrongAnswer = this.getRandomNumber(0, correctAnswer * 2);
            if (wrongAnswer != correctAnswer && !wrongAnswers.has(wrongAnswer)) {
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
     * Handles answer click event from the view where it calculates the damages and updates health bars accordingly
     * after doing so it generates a new question for the player to answer
     * @param selectedAnswer the clicked answer by the user
     * @returns void
     */
    private handleAnswerClick(selectedAnswer: number): void {

        // Record player's response and time
        this.model.playerResponse = selectedAnswer;
        this.model.playerTime = Date.now();
        const timeLeftSeconds = this.model.questionTimeRemaining;

        // Store current question's correct answer
        const currentCorrectAnswer = this.model.correctAnswer;

        //Shows the correct or incorrect text on view based on users answer
        if (this.model.playerResponse == this.model.correctAnswer) {
            this.view.correctAnswer();
            this.view.playPlayerAttack();

            // play sound only when game isn't muted and answer is right
            if (!this.isMuted) {
                // Play sound effects
                this.clickSound.play();
                this.clickSound.currentTime = 0;
            }
        } else {
            this.view.incorrectAnswer();
        }


        this.advanceGame();


    }

    /**
     * Pauses the timer, hides the question and answer choices for the user
     * @param pauseGame Boolean telling whether the game needs to be paused or resumed
     */
    private handlePausePlayGame() {
        console.log(this.model.gamePaused);
        if (this.model.gamePaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    /**
     * 
     */
    private handleMuteClick() {
        if (this.isMuted == true) {
            this.view.showUnmute();
            this.isMuted = false;
        } else {
            this.view.showMute();
            this.isMuted = true;
        }
    }


    /**
     * End the game which for now just goes back to the start screen
     */
    private endGame(playerLost: boolean): void {
        this.model.currentRound += 1;
        this.view.hideCorrectIncorrect();

        //Switch to the stats page if the player looses or the results page if the player wins
        if (playerLost) {
            this.screenSwitcher.switchToScreen({ type: "results" });
        } else {
            // // gives bonus points if win w/ > 50% health
            // if (this.model.playerHealth > this.model.maxHealth / 2) {
            //     this.model.score += 400;
            //     this.model.roundScore += 400;
            //     this.updateScore(400);
            // }
            this.screenSwitcher.switchToScreen({ type: "stats" });
        }
    }

    /**
      * Pause the game
      */
    pauseGame(): void {
        //this.pauseQuestionTimer();
        this.model.gamePaused = true;
        this.view.showPlayButton();
    }

    /**
     * Resume the game
     */
    resumeGame(): void {
        //this.resumeQuestionTimer();
        this.model.gamePaused = false;
        this.view.showPauseButton();
    }

    /**
     * Exit the game
     */
    endGameEarly(): void {
        this.view.hideCorrectIncorrect();
        this.resumeGame();
    }

    /**
     * Get the view group
     */
    getView(): PracticeAreaView {
        return this.view;
    }

    /**
     * Override the show method to start a new game whenever the screen is shown
     * This is because the game should reset each time the user navigates to this screen
     */
    show(): void {
        this.startGame(this.model.currentRound);
    }
}