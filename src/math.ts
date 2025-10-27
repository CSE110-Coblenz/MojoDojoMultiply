/**
 * Math Library for MojoDojoMultiply
 * 
 * Provides core mathematical operations for the multiplication game:
 * - Generate random multiplication problems
 * - Validate answers
 * - Generate multiple choice options
 * - Support difficulty levels
 */

export interface MultiplicationProblem {
	factor1: number;
	factor2: number;
	correctAnswer: number;
}

export interface MultipleChoiceProblem extends MultiplicationProblem {
	options: number[];
}

export type DifficultyLevel = "easy" | "medium" | "hard";

/**
 * Generate a random multiplication problem based on difficulty level
 * 
 * @param difficulty - The difficulty level ("easy", "medium", or "hard")
 * @returns A multiplication problem with two factors and the correct answer
 */
export function generateMultiplicationProblem(
	difficulty: DifficultyLevel = "easy"
): MultiplicationProblem {
	let maxFactor1: number;
	let maxFactor2: number;

	switch (difficulty) {
		case "easy":
			maxFactor1 = 5;
			maxFactor2 = 5;
			break;
		case "medium":
			maxFactor1 = 10;
			maxFactor2 = 10;
			break;
		case "hard":
			maxFactor1 = 12;
			maxFactor2 = 12;
			break;
	}

	const factor1 = Math.floor(Math.random() * maxFactor1) + 1;
	const factor2 = Math.floor(Math.random() * maxFactor2) + 1;
	const correctAnswer = factor1 * factor2;

	return {
		factor1,
		factor2,
		correctAnswer,
	};
}

/**
 * Generate multiple choice options for a multiplication problem
 * 
 * @param problem - The multiplication problem
 * @param numOptions - Number of options to generate (default: 4)
 * @returns A multiple choice problem with options including the correct answer
 */
export function generateMultipleChoiceOptions(
	problem: MultiplicationProblem,
	numOptions: number = 4
): MultipleChoiceProblem {
	const options = new Set<number>();
	options.add(problem.correctAnswer);

	// Generate wrong answers that are plausible
	while (options.size < numOptions) {
		const offset = Math.floor(Math.random() * 10) - 5;
		const wrongAnswer = problem.correctAnswer + offset;
		
		// Ensure wrong answer is positive and different from correct answer
		if (wrongAnswer > 0 && wrongAnswer !== problem.correctAnswer) {
			options.add(wrongAnswer);
		}
	}

	// Shuffle the options
	const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

	return {
		...problem,
		options: shuffledOptions,
	};
}

/**
 * Check if an answer is correct
 * 
 * @param factor1 - First factor
 * @param factor2 - Second factor
 * @param answer - The answer to check
 * @returns true if the answer is correct, false otherwise
 */
export function checkAnswer(
	factor1: number,
	factor2: number,
	answer: number
): boolean {
	return factor1 * factor2 === answer;
}

/**
 * Multiply two numbers
 * 
 * @param a - First number
 * @param b - Second number
 * @returns The product of a and b
 */
export function multiply(a: number, b: number): number {
	return a * b;
}

/**
 * Generate a set of multiplication problems
 * 
 * @param count - Number of problems to generate
 * @param difficulty - The difficulty level
 * @returns An array of multiplication problems
 */
export function generateProblemSet(
	count: number,
	difficulty: DifficultyLevel = "easy"
): MultiplicationProblem[] {
	const problems: MultiplicationProblem[] = [];
	
	for (let i = 0; i < count; i++) {
		problems.push(generateMultiplicationProblem(difficulty));
	}
	
	return problems;
}

/**
 * Calculate score based on correct answers
 * 
 * @param correctAnswers - Number of correct answers
 * @param totalQuestions - Total number of questions
 * @returns Score as a percentage (0-100)
 */
export function calculateScore(
	correctAnswers: number,
	totalQuestions: number
): number {
	if (totalQuestions === 0) return 0;
	return Math.round((correctAnswers / totalQuestions) * 100);
}
