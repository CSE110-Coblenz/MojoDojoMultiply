/**
 * Math Library for Mojo Dojo Multiply
 * 
 * This module provides mathematical utilities for the multiplication game,
 * including problem generation, answer validation, and scoring.
 */

/**
 * Represents a multiplication problem
 */
export interface MultiplicationProblem {
    factor1: number;
    factor2: number;
    correctAnswer: number;
}

/**
 * Generate a random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer between min and max
 */
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random multiplication problem
 * @param minFactor - Minimum value for factors (default: 1)
 * @param maxFactor - Maximum value for factors (default: 10)
 * @returns A multiplication problem with two factors and the correct answer
 */
export function generateMultiplicationProblem(
    minFactor: number = 1,
    maxFactor: number = 10
): MultiplicationProblem {
    const factor1 = getRandomInt(minFactor, maxFactor);
    const factor2 = getRandomInt(minFactor, maxFactor);
    return {
        factor1,
        factor2,
        correctAnswer: factor1 * factor2
    };
}

/**
 * Check if the user's answer is correct
 * @param factor1 - First factor of the multiplication
 * @param factor2 - Second factor of the multiplication
 * @param userAnswer - User's answer to check
 * @returns True if the answer is correct, false otherwise
 */
export function checkAnswer(factor1: number, factor2: number, userAnswer: number): boolean {
    return factor1 * factor2 === userAnswer;
}

/**
 * Check if the user's answer matches the problem's correct answer
 * @param problem - The multiplication problem
 * @param userAnswer - User's answer to check
 * @returns True if the answer is correct, false otherwise
 */
export function checkProblemAnswer(problem: MultiplicationProblem, userAnswer: number): boolean {
    return problem.correctAnswer === userAnswer;
}

/**
 * Calculate score as a percentage
 * @param correct - Number of correct answers
 * @param total - Total number of problems attempted
 * @returns Score as a percentage (0-100)
 */
export function calculateScore(correct: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}

/**
 * Calculate accuracy as a decimal
 * @param correct - Number of correct answers
 * @param total - Total number of problems attempted
 * @returns Accuracy as a decimal (0-1)
 */
export function calculateAccuracy(correct: number, total: number): number {
    if (total === 0) return 0;
    return correct / total;
}

/**
 * Get difficulty level name based on factor range
 * @param maxFactor - Maximum factor in the problem set
 * @returns Difficulty level name
 */
export function getDifficultyLevel(maxFactor: number): string {
    if (maxFactor <= 5) return "Easy";
    if (maxFactor <= 10) return "Medium";
    if (maxFactor <= 15) return "Hard";
    return "Expert";
}

/**
 * Generate multiple unique multiplication problems
 * @param count - Number of problems to generate
 * @param minFactor - Minimum value for factors
 * @param maxFactor - Maximum value for factors
 * @param allowDuplicates - Whether to allow duplicate problems (default: false)
 * @returns Array of multiplication problems
 */
export function generateMultipleProblems(
    count: number,
    minFactor: number = 1,
    maxFactor: number = 10,
    allowDuplicates: boolean = false
): MultiplicationProblem[] {
    const problems: MultiplicationProblem[] = [];
    const seen = new Set<string>();
    
    let attempts = 0;
    // Calculate max possible unique combinations, then multiply by a safety factor
    const range = maxFactor - minFactor + 1;
    const possibleCombinations = range * range;
    const maxAttempts = Math.max(count * 10, possibleCombinations * 2);
    
    while (problems.length < count && attempts < maxAttempts) {
        const problem = generateMultiplicationProblem(minFactor, maxFactor);
        // Create normalized key to avoid duplicates like 3x4 and 4x3
        const key = `${Math.min(problem.factor1, problem.factor2)}x${Math.max(problem.factor1, problem.factor2)}`;
        
        if (allowDuplicates || !seen.has(key)) {
            problems.push(problem);
            seen.add(key);
        }
        attempts++;
    }
    
    return problems;
}
