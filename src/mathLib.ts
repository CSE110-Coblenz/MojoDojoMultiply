/**
 * Math Library for MojoDojoMultiply Game
 * Provides core mathematical operations for multiplication practice
 */

/**
 * Configuration for problem generation
 */
export interface ProblemConfig {
	minFactor: number;
	maxFactor: number;
}

/**
 * Represents a multiplication problem
 */
export interface MultiplicationProblem {
	factor1: number;
	factor2: number;
	answer: number;
}

/**
 * Difficulty levels for the game
 */
export enum Difficulty {
	EASY = "easy",
	MEDIUM = "medium",
	HARD = "hard",
}

/**
 * Maximum valid answer value for validation
 */
export const MAX_VALID_ANSWER = 1000;

/**
 * Default configurations for each difficulty level
 */
export const DIFFICULTY_CONFIGS: Record<Difficulty, ProblemConfig> = {
	[Difficulty.EASY]: { minFactor: 1, maxFactor: 5 },
	[Difficulty.MEDIUM]: { minFactor: 1, maxFactor: 10 },
	[Difficulty.HARD]: { minFactor: 1, maxFactor: 12 },
};

/**
 * Generates a random integer between min and max (inclusive)
 */
export function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a multiplication problem based on the given configuration
 */
export function generateProblem(config: ProblemConfig): MultiplicationProblem {
	const factor1 = getRandomInt(config.minFactor, config.maxFactor);
	const factor2 = getRandomInt(config.minFactor, config.maxFactor);
	const answer = factor1 * factor2;

	return { factor1, factor2, answer };
}

/**
 * Generates a multiplication problem based on difficulty level
 */
export function generateProblemByDifficulty(
	difficulty: Difficulty,
): MultiplicationProblem {
	const config = DIFFICULTY_CONFIGS[difficulty];
	return generateProblem(config);
}

/**
 * Checks if the user's answer is correct
 */
export function checkAnswer(
	problem: MultiplicationProblem,
	userAnswer: number,
): boolean {
	return problem.answer === userAnswer;
}

/**
 * Calculates points based on difficulty and time taken
 * @param difficulty - The difficulty level of the problem
 * @param timeSeconds - Time taken to answer in seconds
 * @param correct - Whether the answer was correct
 * @returns Points earned (0 if incorrect)
 */
export function calculatePoints(
	difficulty: Difficulty,
	timeSeconds: number,
	correct: boolean,
): number {
	if (!correct) return 0;

	const basePoints: Record<Difficulty, number> = {
		[Difficulty.EASY]: 10,
		[Difficulty.MEDIUM]: 20,
		[Difficulty.HARD]: 30,
	};

	const base = basePoints[difficulty];
	const timeBonus = Math.max(0, 10 - timeSeconds);
	return Math.floor(base + timeBonus);
}

/**
 * Generates multiple unique multiplication problems
 * @param count - Number of problems to generate
 * @param config - Configuration for problem generation
 * @returns Array of unique multiplication problems
 */
export function generateMultipleProblems(
	count: number,
	config: ProblemConfig,
): MultiplicationProblem[] {
	const problems: MultiplicationProblem[] = [];
	const seen = new Set<string>();

	let attempts = 0;
	const maxAttempts = count * 10;

	while (problems.length < count && attempts < maxAttempts) {
		const problem = generateProblem(config);
		const key = `${problem.factor1}x${problem.factor2}`;

		if (!seen.has(key)) {
			seen.add(key);
			problems.push(problem);
		}

		attempts++;
	}

	return problems;
}

/**
 * Formats a multiplication problem as a string
 */
export function formatProblem(problem: MultiplicationProblem): string {
	return `${problem.factor1} × ${problem.factor2}`;
}

/**
 * Validates that a number is within a valid range for the game
 */
export function isValidAnswer(answer: number): boolean {
	return Number.isInteger(answer) && answer >= 0 && answer <= MAX_VALID_ANSWER;
}
