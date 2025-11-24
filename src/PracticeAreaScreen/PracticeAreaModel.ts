/**
 * MainPageModel - Stores game state
 */
export class PracticeAreaModel {
    tickCallback: ((digits: number[]) => void) | null;
    score: number;
    num1: number;
    num2: number;
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



    constructor() {
        this.tickCallback = null;
        this.score = 0;
        this.num1 = 0;
        this.num2 = 0;
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