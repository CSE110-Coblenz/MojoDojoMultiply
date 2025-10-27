/**
 * Example usage and manual tests for the math library
 * This file demonstrates how to use the math library functions
 */

import {
	generateProblem,
	generateProblemByDifficulty,
	checkAnswer,
	calculatePoints,
	generateMultipleProblems,
	formatProblem,
	isValidAnswer,
	Difficulty,
	type ProblemConfig,
} from "./mathLib.js";

// Example 1: Generate a problem with custom config
console.log("Example 1: Generate a problem with custom config");
const customConfig: ProblemConfig = { minFactor: 1, maxFactor: 10 };
const problem1 = generateProblem(customConfig);
console.log(`Problem: ${formatProblem(problem1)}`);
console.log(`Answer: ${problem1.answer}`);
console.log("");

// Example 2: Generate problems by difficulty
console.log("Example 2: Generate problems by difficulty");
const easyProblem = generateProblemByDifficulty(Difficulty.EASY);
const mediumProblem = generateProblemByDifficulty(Difficulty.MEDIUM);
const hardProblem = generateProblemByDifficulty(Difficulty.HARD);
console.log(`Easy: ${formatProblem(easyProblem)} = ${easyProblem.answer}`);
console.log(`Medium: ${formatProblem(mediumProblem)} = ${mediumProblem.answer}`);
console.log(`Hard: ${formatProblem(hardProblem)} = ${hardProblem.answer}`);
console.log("");

// Example 3: Check answers
console.log("Example 3: Check answers");
const testProblem = { factor1: 5, factor2: 6, answer: 30 };
console.log(`Problem: ${formatProblem(testProblem)}`);
console.log(`User answer 30: ${checkAnswer(testProblem, 30) ? "Correct!" : "Wrong!"}`);
console.log(`User answer 25: ${checkAnswer(testProblem, 25) ? "Correct!" : "Wrong!"}`);
console.log("");

// Example 4: Calculate points
console.log("Example 4: Calculate points");
console.log(`Easy, 3 seconds, correct: ${calculatePoints(Difficulty.EASY, 3, true)} points`);
console.log(`Medium, 5 seconds, correct: ${calculatePoints(Difficulty.MEDIUM, 5, true)} points`);
console.log(`Hard, 2 seconds, correct: ${calculatePoints(Difficulty.HARD, 2, true)} points`);
console.log(`Easy, 3 seconds, incorrect: ${calculatePoints(Difficulty.EASY, 3, false)} points`);
console.log("");

// Example 5: Generate multiple unique problems
console.log("Example 5: Generate multiple unique problems");
const problems = generateMultipleProblems(5, { minFactor: 1, maxFactor: 5 });
problems.forEach((p, i) => {
	console.log(`Problem ${i + 1}: ${formatProblem(p)} = ${p.answer}`);
});
console.log("");

// Example 6: Validate answers
console.log("Example 6: Validate answers");
console.log(`Is 25 valid? ${isValidAnswer(25)}`);
console.log(`Is -5 valid? ${isValidAnswer(-5)}`);
console.log(`Is 3.14 valid? ${isValidAnswer(3.14)}`);
console.log(`Is 1001 valid? ${isValidAnswer(1001)}`);
