/**
 * BonusLevelModel - Stores game state for the bonus round
 */
export class BonusLevelModel {
  dividend: number;
  divisor: number;
  quotient: number;
  playerInput: string;
  resultMessage: string;

  timeRemaining: number;
  score: number;
  correctCount: number;
  totalQuestions: number;

  constructor() {
    this.dividend = 0;
    this.divisor = 0;
    this.quotient = 0;
    this.playerInput = "";
    this.resultMessage = "";

    this.timeRemaining = 30;
    this.score = 0;
    this.correctCount = 0;
    this.totalQuestions = 0;
  }
}