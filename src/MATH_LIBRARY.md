# Math Library

A comprehensive math library for the MojoDojoMultiply game, providing core mathematical operations for generating multiplication problems, validating answers, and managing game difficulty.

## Features

- 🎲 **Random Problem Generation**: Create multiplication problems with configurable difficulty levels
- ✅ **Answer Validation**: Check if multiplication answers are correct
- 🎯 **Multiple Choice**: Generate multiple choice options with plausible wrong answers
- 📊 **Score Calculation**: Calculate player scores as percentages
- 🎮 **Problem Sets**: Generate sets of problems for game sessions
- 🏆 **Difficulty Levels**: Support for easy, medium, and hard difficulty

## Installation

The math library is located in `src/math.ts`. Import the functions you need:

```typescript
import {
  generateMultiplicationProblem,
  generateMultipleChoiceOptions,
  checkAnswer,
  calculateScore,
  type DifficultyLevel,
} from "./math.js";
```

## API Reference

### Types

#### `MultiplicationProblem`
```typescript
interface MultiplicationProblem {
  factor1: number;
  factor2: number;
  correctAnswer: number;
}
```

#### `MultipleChoiceProblem`
```typescript
interface MultipleChoiceProblem extends MultiplicationProblem {
  options: number[];
}
```

#### `DifficultyLevel`
```typescript
type DifficultyLevel = "easy" | "medium" | "hard";
```

### Functions

#### `generateMultiplicationProblem(difficulty?: DifficultyLevel): MultiplicationProblem`

Generates a random multiplication problem based on the specified difficulty level.

**Difficulty Ranges:**
- `easy`: factors from 1-5
- `medium`: factors from 1-10
- `hard`: factors from 1-12

**Example:**
```typescript
const problem = generateMultiplicationProblem("medium");
// { factor1: 7, factor2: 4, correctAnswer: 28 }
```

#### `generateMultipleChoiceOptions(problem: MultiplicationProblem, numOptions?: number): MultipleChoiceProblem`

Generates multiple choice options for a multiplication problem. Options are shuffled using the Fisher-Yates algorithm for unbiased randomization.

**Parameters:**
- `problem`: The multiplication problem
- `numOptions`: Number of options to generate (default: 4)

**Example:**
```typescript
const problem = generateMultiplicationProblem("easy");
const mcProblem = generateMultipleChoiceOptions(problem, 4);
// { factor1: 3, factor2: 4, correctAnswer: 12, options: [10, 12, 14, 11] }
```

#### `checkAnswer(factor1: number, factor2: number, answer: number): boolean`

Validates if an answer is correct for a multiplication problem.

**Example:**
```typescript
const isCorrect = checkAnswer(5, 6, 30); // true
const isWrong = checkAnswer(5, 6, 31);  // false
```

#### `multiply(a: number, b: number): number`

Multiplies two numbers. Provides a consistent API that can be extended with validation or logging.

**Example:**
```typescript
const result = multiply(7, 8); // 56
```

#### `generateProblemSet(count: number, difficulty?: DifficultyLevel): MultiplicationProblem[]`

Generates a set of multiplication problems for a game session.

**Example:**
```typescript
const problems = generateProblemSet(5, "medium");
// [
//   { factor1: 3, factor2: 7, correctAnswer: 21 },
//   { factor1: 9, factor2: 2, correctAnswer: 18 },
//   ...
// ]
```

#### `calculateScore(correctAnswers: number, totalQuestions: number): number`

Calculates the player's score as a percentage (0-100).

**Example:**
```typescript
const score = calculateScore(8, 10); // 80
const perfectScore = calculateScore(10, 10); // 100
```

## Usage Examples

### Basic Problem Generation

```typescript
// Generate a simple problem
const problem = generateMultiplicationProblem("easy");
console.log(`${problem.factor1} × ${problem.factor2} = ?`);
// Answer: problem.correctAnswer
```

### Multiple Choice Game

```typescript
// Generate a multiple choice problem
const problem = generateMultiplicationProblem("medium");
const mcProblem = generateMultipleChoiceOptions(problem);

console.log(`${mcProblem.factor1} × ${mcProblem.factor2} = ?`);
console.log(`Options: ${mcProblem.options.join(", ")}`);

// Check player's answer
const playerAnswer = 42; // from user input
const isCorrect = checkAnswer(
  mcProblem.factor1,
  mcProblem.factor2,
  playerAnswer
);
```

### Complete Game Session

```typescript
// Generate a set of problems
const problems = generateProblemSet(10, "medium");
let correctCount = 0;

// Present each problem to the player
problems.forEach((problem) => {
  const mcProblem = generateMultipleChoiceOptions(problem);
  
  // ... present question and get answer from player ...
  const playerAnswer = getPlayerAnswer(); // your game logic
  
  if (checkAnswer(problem.factor1, problem.factor2, playerAnswer)) {
    correctCount++;
  }
});

// Calculate final score
const finalScore = calculateScore(correctCount, problems.length);
console.log(`Final Score: ${finalScore}%`);
```

## Implementation Details

### Random Number Generation

The library uses `Math.random()` for generating random factors. Each problem is generated independently with uniform distribution within the difficulty range.

### Multiple Choice Options

Wrong answers are generated by adding offsets to the correct answer. The offset is randomly selected from a range of ±5 (calculated as `Math.random() * 10 - 5`), creating plausible wrong answers that are close enough to be challenging but distinct from the correct answer. The options are shuffled using the Fisher-Yates algorithm for unbiased randomization.

### Difficulty Progression

- **Easy (1-5)**: Suitable for beginners learning basic multiplication tables
- **Medium (1-10)**: Standard multiplication practice
- **Hard (1-12)**: Advanced practice covering extended multiplication tables

## Testing

The library includes comprehensive examples in `src/math-examples.ts` demonstrating all features.

## License

This math library is part of the MojoDojoMultiply project.
