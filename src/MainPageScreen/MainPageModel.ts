/**
 * MainPageModel - Manages game state
 */
export class MainPageModel {
	private timeRemaining: number; // Time in seconds
    private timerInterval: number | null;
    private isTimerRunning: boolean;
    private readonly defaultTime: number = 60; // Default time in seconds
	private score = 0;
	private num1: number = 0;
	private num2: number = 0;
	private correctAnswer: number = 0;
	private wrongAnswers: number[] = [];
	private allAnswers: number[] = [];

    constructor() {
        this.timeRemaining = this.defaultTime;
        this.timerInterval = null;
        this.isTimerRunning = false;
    }

    /**
     * Start the countdown timer
     * @param callback - Function to call on each timer tick with array of digits
     */
    startTimer(callback: (digits: number[]) => void): void {
        if (!this.isTimerRunning) {
            this.isTimerRunning = true;
            // Initial call to set initial state
            callback(this.getTimeDigits());
            
            this.timerInterval = globalThis.setInterval(() => {
                if (this.timeRemaining > 0) {
                    this.timeRemaining--;
                    callback(this.getTimeDigits());
                } else {
                    this.stopTimer();
                }
            }, 1000);
        }
    }

    /**
     * Get individual digits of the current time
     * For example: 67 seconds would return [6, 7]
     * @returns array of individual digits
     */
    private getTimeDigits(): number[] {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        
        // Convert to padded strings and split into individual digits
        const minutesStr = minutes.toString().padStart(1, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        
        // Combine and convert to numbers
        return (minutesStr + secondsStr).split('').map(Number);
    }

    /**
     * Stop the countdown timer
     */
    stopTimer(): void {
        if (this.timerInterval) {
            globalThis.clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.isTimerRunning = false;
        }
    }

    /**
     * Reset the timer to default time
     * @param callback - Optional callback to update display after reset
     */
    resetTimer(callback?: (digits: number[]) => void): void {
        this.stopTimer();
        this.timeRemaining = this.defaultTime;
        if (callback) {
            callback(this.getTimeDigits());
        }
    }

    /**
     * Get current time remaining
     * @returns number of seconds remaining
     */
    getTimeRemaining(): number {
        return this.timeRemaining;
    }

    /**
     * Check if timer is currently running
     * @returns boolean indicating if timer is active
     */
    isActive(): boolean {
        return this.isTimerRunning;
    }

    /**
     * Set a custom time for the timer
     * @param seconds - Number of seconds to set the timer to
     * @param callback - Optional callback to update display after setting time
     */
    setTime(seconds: number, callback?: (digits: number[]) => void): void {
        if (seconds > 0) {
            this.timeRemaining = seconds;
            if (callback) {
                callback(this.getTimeDigits());
            }
        }
    }

	/**
	 * Reset game state for a new game
	 */
	private reset(): void {
		this.score = 0;
	}    

	/**
	 * Increment score when lemon is clicked
	 */
	incrementScore(): void {
		this.score++;
	}

	/**
	 * Get current score
	 */
	getScore(): number {
		return this.score;
	}

    getAnswer(): number {
        return 42;
    }

	/**
	 * Populate the model with a new question and its answers.
	 * The model accepts helper functions for randomness and wrong-answer generation so
	 * it doesn't need to know about the controller's implementation details.
	 */
	generateNewQuestion(
		getRandomNumber: (min: number, max: number) => number,
		getWrongAnswers: (correctAnswer: number, count: number) => number[],
		randomizeOrder: (answers: number[]) => number[],
		min = 1,
		max = 12,
		wrongCount = 3
	): void {
		this.num1 = getRandomNumber(min, max);
		this.num2 = getRandomNumber(min, max);
		this.correctAnswer = this.num1 * this.num2;
		this.wrongAnswers = getWrongAnswers(this.correctAnswer, wrongCount);
		this.allAnswers = randomizeOrder([this.correctAnswer, ...this.wrongAnswers]);
	}

	// Gets the first number in the multiplication problem
	getNum1(): number {
		return this.num1;
	}

	// Gets the second number in the multiplication problem
	getNum2(): number {
		return this.num2;
	}

	//Gets the correct answer to the current multiplication problem
	getCorrectAnswer(): number {
		return this.correctAnswer;
	}

	// Gets the list of wrong answers for the current multiplication problem
	getWrongAnswersList(): number[] {
		return this.wrongAnswers;
	}

	// Gets all answer choices for the current multiplication problem
	getAllAnswers(): number[] {
		return this.allAnswers;
	}
}