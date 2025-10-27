/**
 * Example Usage of Math Library
 * 
 * This file demonstrates how to use the math library in the game.
 */

import {
	generateMultiplicationProblem,
	generateMultipleChoiceOptions,
	checkAnswer,
	multiply,
	generateProblemSet,
	calculateScore,
	type DifficultyLevel,
	type MultiplicationProblem,
	type MultipleChoiceProblem,
} from "./math.js";

// Example 1: Generate a simple multiplication problem
function example1() {
	console.log("Example 1: Generate a problem");
	const problem = generateMultiplicationProblem("easy");
	console.log(`Question: ${problem.factor1} × ${problem.factor2} = ?`);
	console.log(`Answer: ${problem.correctAnswer}`);
}

// Example 2: Generate a multiple choice problem
function example2() {
	console.log("\nExample 2: Generate multiple choice problem");
	const problem = generateMultiplicationProblem("medium");
	const mcProblem = generateMultipleChoiceOptions(problem, 4);
	
	console.log(`Question: ${mcProblem.factor1} × ${mcProblem.factor2} = ?`);
	console.log(`Options: ${mcProblem.options.join(", ")}`);
	console.log(`Correct Answer: ${mcProblem.correctAnswer}`);
}

// Example 3: Validate user answers
function example3() {
	console.log("\nExample 3: Validate answers");
	const problem = generateMultiplicationProblem("easy");
	const userAnswer = 20; // Simulated user input
	
	const isCorrect = checkAnswer(problem.factor1, problem.factor2, userAnswer);
	console.log(`${problem.factor1} × ${problem.factor2} = ${userAnswer}`);
	console.log(`Is correct? ${isCorrect}`);
}

// Example 4: Generate a set of problems for a game session
function example4() {
	console.log("\nExample 4: Generate problem set for a game");
	const problems = generateProblemSet(5, "medium");
	
	console.log("Game problems:");
	problems.forEach((p, i) => {
		console.log(`  ${i + 1}. ${p.factor1} × ${p.factor2} = ?`);
	});
}

// Example 5: Calculate final score
function example5() {
	console.log("\nExample 5: Calculate score");
	const correctAnswers = 7;
	const totalQuestions = 10;
	const score = calculateScore(correctAnswers, totalQuestions);
	
	console.log(`Correct: ${correctAnswers}/${totalQuestions}`);
	console.log(`Score: ${score}%`);
}

// Example 6: Complete game flow
function example6() {
	console.log("\nExample 6: Complete game flow simulation");
	
	// Generate problems
	const problems = generateProblemSet(3, "easy");
	let correctCount = 0;
	
	console.log("Starting game with 3 questions...\n");
	
	problems.forEach((problem, i) => {
		const mcProblem = generateMultipleChoiceOptions(problem, 4);
		console.log(`Question ${i + 1}: ${mcProblem.factor1} × ${mcProblem.factor2} = ?`);
		console.log(`Options: ${mcProblem.options.join(", ")}`);
		
		// Simulate user selecting the correct answer
		const userAnswer = mcProblem.correctAnswer;
		const isCorrect = checkAnswer(mcProblem.factor1, mcProblem.factor2, userAnswer);
		
		if (isCorrect) {
			correctCount++;
			console.log(`✓ Correct!\n`);
		} else {
			console.log(`✗ Wrong! The answer was ${mcProblem.correctAnswer}\n`);
		}
	});
	
	const finalScore = calculateScore(correctCount, problems.length);
	console.log(`Game Over! Score: ${finalScore}%`);
}

// Run examples
if (import.meta.url === `file://${process.argv[1]}`) {
	example1();
	example2();
	example3();
	example4();
	example5();
	example6();
}
