/**
 * BonusLevelModel - Stores game state for the bonus round
 */
export class BonusLevelModel {
  dividend: number;
  divisor: number;
  quotient: number;
  playerInput: string;
  resultMessage: string;

  constructor() {
    this.dividend = 0;
    this.divisor = 0;
    this.quotient = 0;
    this.playerInput = "";
    this.resultMessage = "";
  }
}