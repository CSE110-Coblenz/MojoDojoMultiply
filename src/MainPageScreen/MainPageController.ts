import { ScreenController, type ScreenSwitcher } from "../types";
import { MainPageModel } from "./MainPageModel";
import { MainPageView } from "./MainPageView";
import { GAMECST } from "../constants";
import { clearGlobalState, GlobalState } from "../storageManager"
import { RoundStatsModel } from "../RoundStatsScreen/RoundStatsModel";

export class MainPageController extends ScreenController {
    // Static reference to the most recently constructed MainPageController.
    // This allows other controllers/screens to call MainPageController.endGameEarly()
    // without needing a direct reference to the instance.
    private static currentInstance: MainPageController | null = null;
    private model: MainPageModel;
    private view: MainPageView;
    private screenSwitcher: ScreenSwitcher;
    private clickSound: HTMLAudioElement;
    private backgroundMusic: HTMLAudioElement;
    private playerLost: boolean = false;
    private isMuted: boolean = false;
    private isRunning: boolean = false;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        // register this instance as the active controller
        MainPageController.currentInstance = this;
        this.screenSwitcher = screenSwitcher;

        this.model = new MainPageModel();
        
        // Initialize click sound with error handling
        this.clickSound = new Audio("/PunchSound.mp3");
        this.clickSound.volume = 0.5;
        this.clickSound.onerror = (e) => {
            console.error('Error loading sound:', e);
        };

        // Initialize background music with looping enabled
        this.backgroundMusic = new Audio("/BackgroundMusic.mp3");
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.onerror = (e) => {
            console.error('Error loading background music:', e);
        };

        // Pass the event handlers to the view
        this.view = new MainPageView(
            (answer: number) => this.handleAnswerClick(answer),
            () => this.handlePausePlayGame(),
            () => this.handleHoverStart(),
            () => this.handleHoverEnd(),
            () => this.handleMenuClick(),
            () => this.handleHelpClick(),
            () => this.endGame(false),
            () => this.handleMuteClick()
        );

        this.setupGlobalStateListener();
    }

    /**
     * Static wrapper so other modules can request the active MainPageController
     * to end the game early without having a direct instance reference.
     */
    static endGameEarly(): void {
        if (MainPageController.currentInstance) {
            MainPageController.currentInstance.endGameEarly();
        } else {
            console.warn("MainPageController.endGameEarly() called but no controller instance is available.");
        }
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
    * Save the completed round’s stats into localStorage.
    * @param:
    * - Round Number
    * - Round Score
    * - Correct Answers
    * - Total Answers
    * - Time Stamps
    */
    private saveRoundStats(): void {
        //Get existing stats list from storage
        const raw = localStorage.getItem(GAMECST.ROUND_STATS_KEY);

        let history: {
            round: number;
            points: number;
            correct: number;
            total: number;
            timestamp: string;
        }[] = [];

        //Attempt to parse history retrieved from storage
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    history = parsed;
                }
            } catch (e) {
                console.error("Error parsing round history, resetting.", e);
            }
        }

        //Build the NEW entry (for the current round) to save
        const entry = {
            round: this.model.currentRound, //Current Round num
            points: this.model.roundScore, //Total Points for this round
            correct: this.model.roundCorrect, //# correct answer
            total: this.model.roundTotal, // # total questions
            timestamp: new Date().toLocaleString(), //timestamp
        };

        //Add this completed round to the round history
        history.push(entry);

        //Keep the history length to only 5 (Player plays 5 rounds til bonus level)
        if (history.length > 5) {
            history = history.slice(history.length - 20);
        }

        //Save the list back to localStorage
        try {
            localStorage.setItem(GAMECST.ROUND_STATS_KEY, JSON.stringify(history));
        } catch (e) {
            console.error("Error saving round history.", e);
        }
    }


    /**
     * Update score display in view
     */
    updateScore(score: number): void {
        this.view.setScoreText(score);
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
        this.model.prevNum1 = this.model.num1;
        this.model.prevNum2 = this.model.num2;

        this.model.num1 = this.getRandomNumber(this.model.questionMin, this.model.questionMax);
        this.model.num2 = this.getRandomNumber(this.model.questionMin, this.model.questionMax);

        //Decreases the chance of duplicate questions appearing back to back
        if((this.model.prevNum1 == this.model.num1 && this.model.prevNum2 == this.model.num2) || (this.model.prevNum1 == this.model.num2 && this.model.prevNum2 == this.model.num1)){
            this.model.num1 = this.getRandomNumber(this.model.questionMin, this.model.questionMax);
            this.model.num2 = this.getRandomNumber(this.model.questionMin, this.model.questionMax);
        }

        this.model.correctAnswer = this.model.num1 * this.model.num2;
        this.model.wrongAnswers = this.getWrongAnswers(this.model.correctAnswer, 3);
        this.model.allAnswers = this.randomizeOrder([this.model.correctAnswer, ...this.model.wrongAnswers]);
        
        // Reset response times for new question
        this.model.playerTime = 0;
        this.model.computerTime = 0;
        this.model.playerResponse = 0;

        // Clear bubbles for the new question
        this.view.clearAnswerBubble();

        // AI chance to get the correct answer
        if (Math.random() < GAMECST.AI_ANSWER_CHANCE + GAMECST.AI_CHANCE_SCALE * this.model.currentRound) {
            this.model.computerResponse = this.model.correctAnswer;
        } else {
            // Pick a random wrong answer
            this.model.computerResponse = this.model.wrongAnswers[
                Math.floor(Math.random() * this.model.wrongAnswers.length)
            ];
        }

        this.view.clearAnswerBubble();
        this.view.setOpponentAnswerBubble("...");

        // Simulate computer's response after a random delay
        const minDelay = 1000; // 1 second
        const maxDelay = 3000; // 3 seconds
        const thinkingDelay = 9000;
        
        setTimeout(() => {
            this.model.computerTime = Date.now();

            // Optional extra short delay before showing the real answer
            const revealDelay = 800; 

            setTimeout(() => {
                // swap "..." with the actual answer
                this.view.setOpponentAnswerBubble(String(this.model.computerResponse));
            }, revealDelay);
        }, thinkingDelay);
    }

    /**
     * Start the game running other functions that update the game view
     * @returns void
     */
    startGame(): void {
        // Start background music if not muted
        if (!this.isMuted) {
            this.backgroundMusic.play().catch((e) => {
                console.warn('Failed to play background music:', e);
            });
        }

        // Reset game state
        this.resetForRound();
        this.isRunning = true;

        // Reset round score
        this.model.roundScore = 0;

        // Update view with initial state
        this.updateScore(this.model.roundScore);

        // Set the correct round number
        this.view.setRoundNumber(this.model.currentRound);

        if(this.model.currentRound == 1){
            this.model.questionMin = GAMECST.INITIAL_MIN_QUESTION_VALUE;
            this.model.questionMax = GAMECST.INITIAL_MAX_QUESTION_VALUE;
        }

        // increase difficulty every round
        if(this.model.currentRound % GAMECST.MIN_QUESTION_VALUE_UPDATE == 0) {
            this.model.questionMin += 1;
        }
        if (this.model.currentRound % GAMECST.MAX_QUESTION_VALUE_UPDATE == 1){
            this.model.questionMax += 1;
        }
        
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
    private resetForRound(): void {
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
    private handleMenuClick(): void {
        this.endGameEarly();
        localStorage.removeItem(GAMECST.ROUND_STATS_KEY);
        clearGlobalState();
        this.screenSwitcher.switchToScreen({ type: "start" });
    }

    /**
     * Switches the screen to the start page when the pause menu button is clicked
     */
    private handleHelpClick(): void {
        this.screenSwitcher.switchToScreen({ type: "help", fromGame: true });
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
        if(!this.isRunning) return;
        this.clearQuestionTimer();
        this.model.playerResponse = NaN;
        this.model.playerTime = Number.POSITIVE_INFINITY;
        const damages = this.damageCalculation();
        this.applyDamages(damages);
        this.updatePoints(0);
        this.advanceGame();
    }

    /**
     * handles damage, score, advancing rounds
     * @param [playerDmg, oppDmg] tuple with damage that player and opponent will face
     * @param questionPoints points that will be awarded 
     * @returns void
     */
    private applyDamages([playerDmg, oppDmg]: number[]): void {

        // deals damage to player and opponent 
        if (playerDmg > 0) {
            this.model.playerHealth = Math.max(0, this.model.playerHealth - playerDmg);
        }
        if (oppDmg > 0) {
            this.model.opponentHealth = Math.max(0, this.model.opponentHealth - oppDmg);
        }

        // trigger attack animations
        if (oppDmg > 0) {
            this.view.playPlayerAttack();
        }
        if (playerDmg > 0) {
            this.view.playOpponentAttack();
        }
        
        //Records the stats at the end of each question
        this.recordStats();

        //Changes the health bars to reflect damage done
        this.updateHealthBars();

        // ends game when the players run out of health
        if (this.model.opponentHealth <= 0) {
            this.endGame(false);
            return;
        } else if (this.model.playerHealth <= 0) {
            this.endGame(true);
            return;
        }
    }

    /**
     * records statistics from each question that will be used to show the user personal bests later in the game
     */
    private recordStats() {
        // TODO: Expand Stats
        // increments stats (total answered, correct answers)
        const playerCorrect = this.model.playerResponse === this.model.correctAnswer;
        this.model.roundTotal++
        if (playerCorrect) {
            this.model.roundCorrect++;
        }
    }

    /**
     * 
     */
    private updatePoints( questionPoints: number = 0 ) {
        // handles points
        if (questionPoints > 0) {
            this.model.roundScore += questionPoints;
            this.updateScore(this.model.roundScore);
        }
    }

    /**
     * Generates new questions, displays the new questions, and resets the timer.
     */
    private advanceGame() {
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
            //Added special case for 1x1 multiplication to avoid having infinite loops
            if(this.model.num1 == 1 && this.model.num2 == 1){
                wrongAnswers.add(correctAnswer + 1);
                wrongAnswers.add(0);
                wrongAnswers.add(3);
                break;
            }
            let wrongAnswer = this.getRandomNumber(correctAnswer-maxBetweenMultiplicands, correctAnswer + maxBetweenMultiplicands);
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

        if (this.model.playerResponse == this.model.correctAnswer) {
            this.view.correctAnswer();
        } else {
            this.view.incorrectAnswer();
            this.view.showCorrectAnswer(this.model.num1, this.model.num2, this.model.correctAnswer);
        }
        
        // Calculate damages based on both player and computer responses
        const damages = this.damageCalculation();
        // Calculates points based on speed of answer
        const questionPoints = this.pointsCalculation(timeLeftSeconds);

        // Stop timer
        this.clearQuestionTimer();

        this.updatePoints(questionPoints);

        // apply damage 
        this.applyDamages(damages);
        
        this.advanceGame();
        
        // Play sound effects
        if(!this.isMuted) this.clickSound.play();
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
        if(this.model.gamePaused) {
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
            // Resume music when unmuted
            this.backgroundMusic.play().catch((e) => {
                console.warn('Failed to resume background music:', e);
            });
        } else {
            this.view.showMute();
            this.isMuted = true;
            // Pause music when muted
            this.backgroundMusic.pause();
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
        console.log("Damage calculated");
        if(this.model.playerResponse == this.model.correctAnswer && this.model.computerResponse != this.model.correctAnswer){
            return [0, 15];
        }else if (this.model.playerResponse == this.model.correctAnswer && this.model.computerResponse == this.model.correctAnswer && this.model.playerTime < this.model.computerTime){
            return [0, 10];
        }else if (this.model.playerResponse == this.model.correctAnswer && this.model.computerResponse == this.model.correctAnswer){
            return [5, 5];
        }else if (this.model.playerResponse != this.model.correctAnswer && this.model.computerResponse != this.model.correctAnswer){
            return [15, 5];
        }
        return [20, 0];
    }

    /**
     * Calculates number of points, based off time remaining when answered. 
     * @param timeLeftSeconds time remaining when player answered
     * @returns number of points earned
     */
    //TODO: if points get too high, scale numbers back
    private pointsCalculation(timeLeftSeconds: number): number {
        const t = Math.max(0, timeLeftSeconds);

        const playerCorrect = this.model.playerResponse === this.model.correctAnswer;
        const opponentCorrect = this.model.computerResponse === this.model.correctAnswer;

        if (playerCorrect && !opponentCorrect) {
            return 5*t
        }

        if (playerCorrect && opponentCorrect) {
            if (this.model.playerTime < this.model.computerTime) {
                // player answers faster
                return 3 * t;
            } else if (this.model.playerTime > this.model.computerTime) {
                // computer answers faster
                return 2 * t;
            } else {
                // tie
                return t;
            }
        }
        // wrong
        return 0
    }


    /**
     * End the game which for now just goes back to the start screen
     */
    private endGame(playerLost: boolean): void {
        this.pauseQuestionTimer();
        this.isRunning = false;
        this.view.hideCorrectIncorrect();

        //Switch to the stats page if the player looses or the results page if the player wins
        if(playerLost) {
            this.saveRoundStats();
            this.screenSwitcher.switchToScreen({ type: "results" });
            localStorage.removeItem(GAMECST.ROUND_STATS_KEY);
            clearGlobalState();
        } else {
            // gives bonus points if win w/ > 50% health
            if (this.model.playerHealth > this.model.maxHealth / 2) {
                this.model.roundScore += 400;
            }

            this.saveRoundStats();

            // TODO need to decide if we want to go maingame --> bonus --> stats or maingame --> stats --> bonus etc.
            // Check if we should go to the bonus level
            if (this.model.currentRound % GAMECST.ROUNDS_UNTIL_BONUS === 0) {
                this.screenSwitcher.switchToScreen({ type: "bonus" });
            } else {
                this.screenSwitcher.switchToScreen({ type: "stats"});
            }
        }
    }

    /**
     * Pause the game
     */
    pauseGame(): void {
        this.pauseQuestionTimer();
        this.model.gamePaused = true;
        this.view.showPlayButton();
    }

    /**
     * Resume the game
     */
    resumeGame(): void {
        this.resumeQuestionTimer();
        this.model.gamePaused = false;
        this.view.showPauseButton();
    }


    /**
     * Exit the game
     */
    endGameEarly(): void {
        this.clearQuestionTimer();
        this.model.roundScore = 0;
        this.isRunning = false;
        this.model.playerHealth = this.model.maxHealth;
        this.model.opponentHealth = this.model.maxHealth;
        this.view.hideCorrectIncorrect();
        // Stop background music when exiting
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
        this.resumeGame();
    }

    /**
     * Get the view group
     */
    getView(): MainPageView {
        return this.view;
    }

    /**
     * Override the show method to start a new game whenever the screen is shown
     * This is because the game should reset each time the user navigates to this screen
     */
    show(): void {
        // Start background music if not muted
        if (!this.isMuted) {
            this.backgroundMusic.play().catch((e) => {
                console.warn('Failed to play background music:', e);
            });
        }
        this.startGame();
    }

    /**
     * Override the hide method to stop music when leaving the screen
     */
    hide(): void {
        this.view.hide();
        // Stop background music
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }
}