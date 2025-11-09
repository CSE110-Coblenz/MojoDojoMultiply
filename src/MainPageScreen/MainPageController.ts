import { ScreenController, type ScreenSwitcher } from "../types";
import { MainPageModel } from "./MainPageModel";
import { MainPageView } from "./MainPageView";

export class MainPageController extends ScreenController {
    private model: MainPageModel;
    private view: MainPageView;
    private screenSwitcher: ScreenSwitcher;
    private clickSound: HTMLAudioElement;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;

        this.model = new MainPageModel();
        
        // Initialize click sound with error handling
        this.clickSound = new Audio("/PunchSound.mp3");
        this.clickSound.onerror = (e) => {
            console.error('Error loading sound:', e);
        };

        // Pass the event handlers to the view
        this.view = new MainPageView(
            (answer: number) => this.handleAnswerClick(answer),
            () => this.handleAnswerHoverStart(),
            () => this.handleAnswerHoverEnd()
        );
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
     * Generate a new question
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

        // 80% chance to get the correct answer
        if (Math.random() < 0.5) {
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
     * Start the game
     */
    startGame(): void {
        // Reset game state
        this.reset();

        // Update view with initial state
        this.updateScore(this.model.score);
        
        // Generate first question
        this.generateNewQuestion();
        this.updateQuestion();

        // Show the view after initial setup
        this.view.show();

        // Start timer
        this.startTimer((timeLeft: number) => this.updateTimer(timeLeft));
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
        this.model.playerHealth = this.model.maxHealth;
        this.model.opponentHealth = this.model.maxHealth;
        this.updateHealthBars();
    }

    /**
     * Update both player and opponent health bars
     */
    private updateHealthBars(): void {
        this.view.updateHealthBars(
            this.model.playerHealth / this.model.maxHealth,
            this.model.opponentHealth / this.model.maxHealth
        );
    }

    /**
     * Update player's health and health bar
     */
    updatePlayerHealth(newHealth: number): void {
        this.model.playerHealth = Math.max(0, Math.min(newHealth, this.model.maxHealth));
        this.updateHealthBars();
    }

    /**
     * Update opponent's health and health bar
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
        
        // Record player's response and time
        this.model.playerResponse = selectedAnswer;
        this.model.playerTime = Date.now();

         // Debug logging
        console.log('Question:', this.model.num1, 'x', this.model.num2, '=', this.model.correctAnswer);
        console.log('Player clicked:', selectedAnswer);
        console.log('Player response value:', this.model.playerResponse);
        console.log('Computer response value:', this.model.computerResponse);

        // Store current question's correct answer
        const currentCorrectAnswer = this.model.correctAnswer;
        
        // Calculate damages based on both player and computer responses
        const damages = this.damageCalculation();
        
        // Apply damages and update health bars
        if (damages[0] > 0) { // Player takes damage
            this.model.playerHealth = Math.max(0, this.model.playerHealth - damages[0]);
        }
        if (damages[1] > 0) { // Opponent takes damage
            this.model.opponentHealth = Math.max(0, this.model.opponentHealth - damages[1]);
        }
        
        // Update health bars if any damage was dealt
        if (damages[0] > 0 || damages[1] > 0) {
            this.updateHealthBars();
        }

        // Update score if player was correct
        if (selectedAnswer === currentCorrectAnswer) {
            this.model.score += damages[1]; // Increase score by damage dealt to opponent
            this.updateScore(this.model.score);
        }

        // Generate next question first (this will set up computer's response)
        this.generateNewQuestion();

        // Update question display
        this.updateQuestion();

        // Play sound effects
        this.clickSound.play();
        this.clickSound.currentTime = 0;

        // Check if game should end due to health
        if (this.model.playerHealth <= 0 || this.model.opponentHealth <= 0) {
            this.endGame();
        }
    }

    //Returns negative value when player takes damage, positive when opponent takes damage
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

    //I put this todo somewhere within main page controller cause I'm not exactly sure where we should implement this switch-to yet
    //TODO: switch screen at the end of each round to the results
    private resultsScreen(): void {
        this.screenSwitcher.switchToScreen({ type: "results"});
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

    /**
     * Override the show method to start a new game whenever the screen is shown
     */
    show(): void {
        this.startGame();
    }
}