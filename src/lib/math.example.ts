/**
 * Example usage and manual testing for the math library
 * This file demonstrates how to use the math library functions
 * Run with: npx tsx src/lib/math.example.ts (after installing tsx)
 */

import {
    generateMultiplicationProblem,
    checkAnswer,
    checkProblemAnswer,
    calculateScore,
    calculateAccuracy,
    getDifficultyLevel,
    generateMultipleProblems,
    getRandomInt
} from './math';

console.log('=== Math Library Examples ===\n');

// Example 1: Generate a random multiplication problem
console.log('1. Generate a multiplication problem (1-10):');
const problem1 = generateMultiplicationProblem();
console.log(`   Problem: ${problem1.factor1} × ${problem1.factor2} = ?`);
console.log(`   Correct answer: ${problem1.correctAnswer}\n`);

// Example 2: Generate a harder problem
console.log('2. Generate a harder problem (5-15):');
const problem2 = generateMultiplicationProblem(5, 15);
console.log(`   Problem: ${problem2.factor1} × ${problem2.factor2} = ?`);
console.log(`   Correct answer: ${problem2.correctAnswer}\n`);

// Example 3: Check answers
console.log('3. Check if answers are correct:');
console.log(`   Is 6 × 7 = 42 correct? ${checkAnswer(6, 7, 42)}`);
console.log(`   Is 6 × 7 = 43 correct? ${checkAnswer(6, 7, 43)}\n`);

// Example 4: Check problem answers
console.log('4. Check problem answer:');
const testProblem = generateMultiplicationProblem(1, 5);
console.log(`   Problem: ${testProblem.factor1} × ${testProblem.factor2}`);
console.log(`   Is ${testProblem.correctAnswer} correct? ${checkProblemAnswer(testProblem, testProblem.correctAnswer)}`);
console.log(`   Is ${testProblem.correctAnswer + 1} correct? ${checkProblemAnswer(testProblem, testProblem.correctAnswer + 1)}\n`);

// Example 5: Calculate scores
console.log('5. Calculate scores:');
console.log(`   7 correct out of 10: ${calculateScore(7, 10)}%`);
console.log(`   9 correct out of 10: ${calculateScore(9, 10)}%`);
console.log(`   5 correct out of 8: ${calculateScore(5, 8)}%\n`);

// Example 6: Calculate accuracy
console.log('6. Calculate accuracy:');
console.log(`   7 correct out of 10: ${calculateAccuracy(7, 10).toFixed(2)}`);
console.log(`   9 correct out of 10: ${calculateAccuracy(9, 10).toFixed(2)}\n`);

// Example 7: Get difficulty levels
console.log('7. Difficulty levels:');
console.log(`   Max factor 5: ${getDifficultyLevel(5)}`);
console.log(`   Max factor 10: ${getDifficultyLevel(10)}`);
console.log(`   Max factor 15: ${getDifficultyLevel(15)}`);
console.log(`   Max factor 20: ${getDifficultyLevel(20)}\n`);

// Example 8: Generate multiple problems
console.log('8. Generate 5 unique problems (1-5):');
const problems = generateMultipleProblems(5, 1, 5, false);
problems.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.factor1} × ${p.factor2} = ${p.correctAnswer}`);
});
console.log();

// Example 9: Random integer generation
console.log('9. Generate 10 random integers (1-10):');
const randoms = Array.from({ length: 10 }, () => getRandomInt(1, 10));
console.log(`   ${randoms.join(', ')}\n`);

console.log('=== All examples completed successfully! ===');
