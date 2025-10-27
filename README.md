# MojoDojoMULTIPLY

## Math Library

This project includes a comprehensive math library (`src/mathLib.ts`) for generating and managing multiplication problems.

### Features

- **Problem Generation**: Generate random multiplication problems with configurable difficulty
- **Answer Validation**: Check if user answers are correct
- **Point Calculation**: Calculate points based on difficulty and response time
- **Multiple Problems**: Generate sets of unique problems
- **Three Difficulty Levels**:
  - Easy: 1-5 × 1-5
  - Medium: 1-10 × 1-10
  - Hard: 1-12 × 1-12

### Usage Example

```typescript
import { 
  generateProblemByDifficulty, 
  checkAnswer, 
  Difficulty 
} from './mathLib';

// Generate a problem
const problem = generateProblemByDifficulty(Difficulty.MEDIUM);
console.log(`${problem.factor1} × ${problem.factor2} = ?`);

// Check answer
const isCorrect = checkAnswer(problem, userAnswer);
```

See `src/mathLibExample.ts` for more usage examples.
