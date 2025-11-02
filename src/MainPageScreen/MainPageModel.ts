/**
 * GameScreenModel - Manages game state
 */
export class MainPageModel {
	private score = 0;
	private num1: number = 0;
	private num2: number = 0;
	private correctAnswer: number = 0;
	private wrongAnswers: number[] = [];
	private allAnswers: number[] = [];

	/**
	 * Reset game state for a new game
	 */
	reset(): void {
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

	getNum1(): number {
		return this.num1;
	}

	getNum2(): number {
		return this.num2;
	}

	getCorrectAnswer(): number {
		return this.correctAnswer;
	}

	getWrongAnswersList(): number[] {
		return this.wrongAnswers;
	}

	getAllAnswers(): number[] {
		return this.allAnswers;
	}
}