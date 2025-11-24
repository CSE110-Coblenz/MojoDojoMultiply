/**
 * MainPageModel - Stores game state
 */
export class MainPageModel {
    tickCallback: ((digits: number[]) => void) | null;
    num1: number;
    num2: number;
    prevNum1: number;
    prevNum2: number;
    correctAnswer: number;
    wrongAnswers: number[];
    allAnswers: number[];
    readonly maxHealth: number = 100;
    playerHealth: number;
    opponentHealth: number;
    playerResponse: number;
    computerResponse: number;
    playerTime: number;
    computerTime: number;
    questionTimeRemaining = 30;
    questionTimerId: number | null = null;
    questionStartMs = 0;
    currentRound = 1;
    roundScore = 0;
    roundCorrect = 0;
    roundTotal = 0;
    gamePaused: boolean;
    questionMax = 3;
    questionMin = 1;

    constructor() {
        this.tickCallback = null;
        this.num1 = 0;
        this.num2 = 0;
        this.prevNum1 = 0;
        this.prevNum2 = 0;
        this.correctAnswer = 0;
        this.wrongAnswers = [];
        this.allAnswers = [];
        this.playerHealth = this.maxHealth;
        this.opponentHealth = this.maxHealth;
        this.playerResponse = 0;
        this.computerResponse = 0;
        this.playerTime = 0;
        this.computerTime = 0;
        this.gamePaused = false;
    }
}