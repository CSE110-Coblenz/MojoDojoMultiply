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
            () => this.handleHelpClick()
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

    //TODO: Create counter variable to announce what specific round player is on

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
        
        setTimeout(() => {this.model.computerTime = Date.now(); }, delay);
    }

    /**
     * Start the game running other functions that update the game view
     * @returns void
     */
    startGame(round: number = this.model.currentRound): void {
        // Reset game state
        this.resetForRound(round);

        // Update view with initial state
        this.updateScore(this.model.score);
        
        // Generate first question
        this.generateNewQuestion();
        this.updateQuestion();

        // Show the view after initial setup
        this.view.show();

        // Start timer
        this.startQuestionTimer();
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
        this.updateHealthBars();
    }

    /**
     * new per-question timer
     */
    private startQuestionTimer(): void {
        this.clearQuestionTimer();
        this.model.questionTimeRemaining = 30;
        this.updateTimer(this.model.questionTimeRemaining);

        this.model.questionTimerId = window.setInterval(() => {
            this.model.questionTimeRemaining--;
            this.updateTimer(this.model.questionTimeRemaining);

            if (this.model.questionTimeRemaining <= 0) {
                this.onQuestionTimeout();
            }
        }, 1000);
    }

    /**
     * pauses question timer to be resumed later
     */
    private pauseQuestionTimer(): void {
        if (this.model.questionTimerId !== null) {
            clearInterval(this.model.questionTimerId);
            this.model.questionTimerId = null;
        }
    }

    /**
     * resumes question timer after being paused
     */
    private resumeQuestionTimer(): void {
        // if timer is already running, do nothing
        if (this.model.questionTimerId !== null) return;

        // if resume is called without calling start first
        if (this.model.questionTimeRemaining <= 0) {
            this.onQuestionTimeout();
            return;
        }

        // Update UI with current remaining time
        this.updateTimer(this.model.questionTimeRemaining);

        // resume countdown
        this.model.questionTimerId = window.setInterval(() => {
            this.model.questionTimeRemaining--;
            this.updateTimer(this.model.questionTimeRemaining);

            if (this.model.questionTimeRemaining <= 0) {
                this.onQuestionTimeout();
            }
        }, 1000);
    }

    /**
     * Switches the screen to the start page when the pause menu button is clicked
     */
    private handleStartClick(): void {
        this.screenSwitcher.switchToScreen({ type: "start" });
    }

    /**
     * Switches the screen to the start page when the pause menu button is clicked
     */
    private handleHelpClick(): void {
        this.screenSwitcher.switchToScreen({ type: "help" });
    }


    /**
     * clears timer for new questions
     */
    private clearQuestionTimer(): void {
        // stop timer if running
        if (this.model.questionTimerId !== null) {
            clearInterval(this.model.questionTimerId);
            this.model.questionTimerId = null;
        }

        // remove saved remaining time
        this.model.questionTimeRemaining = 0;
        this.updateTimer(this.model.questionTimeRemaining);
    }

    /**
     * when time runs out, its as if player got answer wrong
     * Reset game state by setting model properties to default values
     */
    private onQuestionTimeout(): void {
        this.clearQuestionTimer();
        this.model.playerResponse = NaN;
        this.model.playerTime = Number.POSITIVE_INFINITY;
        const damages = this.damageCalculation();
        this.applyDamagesAndAdvance(damages, 0);
    }

    /**
     * handles damage, score, advancing rounds
     * @param [playerDmg, oppDmg] tuple with damage that player and opponent will face
     * @param questionPoints points that will be awarded 
     * @returns void
     */
    private applyDamagesAndAdvance([playerDmg, oppDmg]: number[], questionPoints: number = 0): void {
        // debugging to show cur round
        console.log("Current round: " + this.getCurrentRound());

        // deals damage to player and opponet 
        if (playerDmg > 0) {
            this.model.playerHealth = Math.max(0, this.model.playerHealth - playerDmg);
        }
        if (oppDmg > 0) {
            this.model.opponentHealth = Math.max(0, this.model.opponentHealth - oppDmg);
        }


        // TODO: Expand Stats
        // increments stats (total answered, correct answers)
        const playerCorrect = this.model.playerResponse === this.model.correctAnswer;
        this.model.roundTotal++
        if (playerCorrect) {
            this.model.roundCorrect++;
        }

        // handles points
        if (questionPoints > 0) {
            this.model.score += questionPoints;
            this.model.roundScore += questionPoints;
            this.updateScore(this.model.score);
        }

        this.updateHealthBars();

        // handles winning round
        if (this.model.opponentHealth <= 0) {
            // gives bonus points if win w/ > 50% health
            if (this.model.playerHealth > this.model.maxHealth / 2) {
                this.model.score += 400;
                this.model.roundScore += 400;
                this.updateScore(400);
            }

            this.clearQuestionTimer();
            this.screenSwitcher.switchToScreen({
                type: "stats",
                round: this.model.currentRound
            });
            return;
        }
        // handles losing round
        if (this.model.playerHealth <= 0) {
            this.clearQuestionTimer();
            this.screenSwitcher.switchToScreen( {type: "results"});
            return;
        }

        this.generateNewQuestion();
        this.updateQuestion();
        this.startQuestionTimer();
    }


    /**
     * Update both player and opponent health bars in the view
     */
    private updateHealthBars(): void {
        this.view.updateHealthBars(
            this.model.playerHealth / this.model.maxHealth,
            this.model.opponentHealth / this.model.maxHealth
        );
    }

    /**
     * Update player's health and health bar
     * @param newHealth new health value for the player after a question is answered
     * @returns void
     */
    updatePlayerHealth(newHealth: number): void {
        this.model.playerHealth = Math.max(0, Math.min(newHealth, this.model.maxHealth));
        this.updateHealthBars();
    }

    /**
     * Update opponent's health and health bar
     * @param newHealth new health value for the opponent after a question is answered
     * @returns void
     */
    updateOpponentHealth(newHealth: number): void {
        this.model.opponentHealth = Math.max(0, Math.min(newHealth, this.model.maxHealth));
        this.updateHealthBars();
    }

    /**
     * Generate random number between min and max inclusive
     */
    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * returns current round number
     */
    getCurrentRound(): number {
        return this.model.currentRound;
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

         // Debug logging
        //console.log('Question:', this.model.num1, 'x', this.model.num2, '=', this.model.correctAnswer);
        //console.log('Player clicked:', selectedAnswer);
        //console.log('Player response value:', this.model.playerResponse);
        //console.log('Computer response value:', this.model.computerResponse);

        // Store current question's correct answer
        const currentCorrectAnswer = this.model.correctAnswer;
        
        // Calculate damages based on both player and computer responses
        const damages = this.damageCalculation();
        // Calculates points based on speed of answer
        const questionPoints = this.pointsCalculation(timeLeftSeconds);

        // Stop timer
        this.clearQuestionTimer();

        // apply damage 
        this.applyDamagesAndAdvance(damages, questionPoints);
        // Play sound effects
        this.clickSound.play();
        this.clickSound.currentTime = 0;

        // * game ending is handled in applyDamageAndAdvance
        // Check if game should end due to health
        // if (this.model.playerHealth <= 0 || this.model.opponentHealth <= 0) {
        //     this.endGame();
        // }
    }

    /**
     * Pauses the timer, hides the question and answer choices for the user
     * @param pauseGame Boolean telling whether the game needs to be paused or resumed
     */
    private handlePausePlayGame() {
        console.log(this.model.gamePaused);
        if(this.model.gamePaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }


    //I put this todo somewhere within main page controller cause I'm not exactly sure where we should implement this switch-to yet
    //TODO: switch screen at the end of each round to the results
    private resultsScreen(): void {
        this.screenSwitcher.switchToScreen({ type: "results"});
    }

    /**
     * Returns negative value when player takes damage, positive when opponent takes damage
     * Takes no parameters but uses model properties determined by the handle click function to determine damages
     * @returns [playerDamage, opponentDamage]
     */
    private damageCalculation(): number[] {
        if(this.model.playerResponse == this.model.correctAnswer && this.model.computerResponse != this.model.correctAnswer){
            return [0, 15];
        }else if (this.model.playerResponse == this.model.correctAnswer && this.model.computerResponse == this.model.correctAnswer && this.model.playerTime < this.model.computerTime){
            return [0, 10];
        }else if (this.model.playerResponse == this.model.correctAnswer && this.model.computerResponse == this.model.correctAnswer){
            return [5, 5];
        }else if (this.model.playerResponse != this.model.correctAnswer && this.model.computerResponse != this.model.correctAnswer){
            return [0, 0];
        }
        return [15, 0];
    }

    /**
     * Calculates number of points, based off time remaining when answered. 
     * @param timeLeftSeconds time remaining when player answered
     * @returns number of points earned
     */
    //TODO: if points get too high, scale numbers back
    private pointsCalculation(timeLeftSeconds: number): number {
        const t = Math.max(0, timeLeftSeconds) * 10;

        const playerCorrect = this.model.playerResponse === this.model.correctAnswer;
        const opponentCorrect = this.model.computerResponse === this.model.correctAnswer;

        if (playerCorrect && !opponentCorrect) {
            return 15*t
        }

        if (playerCorrect && opponentCorrect) {
            if (this.model.playerTime < this.model.computerTime) {
                // player answers faster
                return 10 * t;
            } else if (this.model.playerTime > this.model.computerTime) {
                // computer answers faster
                return 2 * t;
            } else {
                // tie
                return 5 * t;
            }
        }
        // wrong
        return 0
    }

    /**
     * End the game which for now just goes back to the start screen
     */
    private endGame(): void {
        this.clearQuestionTimer();
        this.model.currentRound += 1;

        // Switch back to start screen
        this.screenSwitcher.switchToScreen({
            type: "intro",
            round: this.model.currentRound
        });
    }

    /**
     * Pause the game
     */
    pauseGame(): void {
        this.pauseQuestionTimer();
        this.model.gamePaused = true;
        this.view.pauseLogo?.visible(false);
        this.view.playLogo?.visible(true);
        this.view.pauseMenu?.visible(true);
    }

    /**
     * Resume the game
     */
    resumeGame(): void {
        this.resumeQuestionTimer();
        this.model.gamePaused = false;
        this.view.pauseLogo?.visible(true);
        this.view.playLogo?.visible(false);
        this.view.pauseMenu?.visible(false);
    }


    /**
     * Exit the game
     */
    exitGame(): void {
        this.clearQuestionTimer();
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