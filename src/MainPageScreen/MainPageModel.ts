/**
 * MainPageModel - Stores game state
 */
export class MainPageModel {
    timeRemaining: number;
    timerInterval: number | null;
    isTimerRunning: boolean;
    readonly defaultTime: number = 60;
    tickCallback: ((digits: number[]) => void) | null;
    score: number;
    num1: number;
    num2: number;
    correctAnswer: number;
    wrongAnswers: number[];
    allAnswers: number[];

    constructor() {
        this.timeRemaining = this.defaultTime;
        this.timerInterval = null;
        this.isTimerRunning = false;
        this.tickCallback = null;
        this.score = 0;
        this.num1 = 0;
        this.num2 = 0;
        this.correctAnswer = 0;
        this.wrongAnswers = [];
        this.allAnswers = [];
    }
}