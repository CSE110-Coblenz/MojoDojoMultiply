import { ScreenController, type ScreenSwitcher } from "../types";
import { BonusLevelView } from "./BonusLevelView";
import { BonusLevelModel } from "./BonusLevelModel";
import { GAMECST } from "../constants";

export class BonusLevelController extends ScreenController {
  private view: BonusLevelView;
  private model: BonusLevelModel;
  private screenSwitcher: ScreenSwitcher;
  private isShowingResult: boolean = false;
  private maxAnswer: number = 10;
  private maxDivisor: number = 10;
  private timerInterval: number | null = null;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.model = new BonusLevelModel();
    this.view = new BonusLevelView();
  }

  /**
   * Sets the constants maxAnswer and maxDivisor to modify difficulty
   * @param maxAnswer Desired max answer
   * @param maxDivisor Desired max divisor
   */
  public setDifficulty(maxAnswer: number, maxDivisor: number): void {
    this.maxAnswer = maxAnswer;
    this.maxDivisor = maxDivisor;
  }

  /**
   * Get the view group
   */
  getView(): BonusLevelView {
      return this.view;
  }

  /**
   * Helper to calculate total points from previous rounds stored in localStorage
   */
  private getPreviousTotalScore(): number {
    const raw = localStorage.getItem(GAMECST.ROUND_STATS_KEY);
    if (!raw) return 0;
    
    try {
        const history = JSON.parse(raw);
        if (Array.isArray(history)) {
            // Sum up the 'points' field from each entry
            return history.reduce((sum: number, entry: any) => sum + (entry.points || 0), 0);
        }
    } catch (e) {
        console.error("Error parsing stats for score calculation:", e);
    }
    return 0;
  }

  /**
   * Show view and start event listener
   */
  show(): void {
    this.isShowingResult = false;

    // Log points before the bonus round starts
    const previousTotal = this.getPreviousTotalScore();
    console.log("Points before bonus round:", previousTotal);

    this.generateNewQuestion();
    
    // Fixed: Ensure view is updated immediately so it doesn't show 0/0
    this.view.update(this.model);
    
    this.view.show();
    // Starts listener that looks for any keydown ie key pressed down
    window.addEventListener("keydown", this.handleKeyDown);
    this.startTimer()
  }

  /**
   * Hides view and stops event listener
   */
  hide(): void {
    this.stopTimer();
    this.view.hide();
    // Stops listener
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  /**
   * Resets model values
   */
  private resetBonusRound(): void {
    this.isShowingResult = false;
    this.model.timeRemaining = GAMECST.BONUS_DURATION;
    this.model.score = 0;
    this.model.correctCount = 0;
    this.model.totalQuestions = 0;
    this.generateNewQuestion();
    this.view.update(this.model);
  }

  /**
   * Starts bonusRound local timer
   */
  private startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    };
    
    this.timerInterval = window.setInterval(() => {
        this.model.timeRemaining--;
        this.view.update(this.model);

        if (this.model.timeRemaining <= 0) {
            this.endBonusRound();
        }
    }, 1000);
  }

  /**
   * Stops bonusRound local timer
   */
  private stopTimer(): void {
    if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }
  }

  /**
   * Ends the bonus round, saves stats, and switches to results
   */
  private endBonusRound(): void {
    this.stopTimer();

    const bonusPoints = this.model.score;
    const previousTotal = this.getPreviousTotalScore();
    const totalAfter = previousTotal + bonusPoints;

    console.log("Points earned during bonus round:", bonusPoints);
    console.log("Points after the round:", totalAfter);

    this.saveBonusStats();
    this.screenSwitcher.switchToScreen({ type: "results" });
  }

  // TODO I vibe coded the crap out of this fix/understand later
  /**
   * Saves the bonus round stats to localStorage so they appear in history/results
   */
  private saveBonusStats(): void {
    const raw = localStorage.getItem(GAMECST.ROUND_STATS_KEY);
    let history: {
        round: number;
        points: number;
        correct: number;
        total: number;
        timestamp: string;
    }[] = [];

    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                history = parsed;
            }
        } catch (e) {
            console.error("Error parsing round history", e);
        }
    }

    // Creates a "bonus" entry at round 999
    const entry = {
        round: 999, 
        points: this.model.score,
        correct: this.model.correctCount,
        total: this.model.totalQuestions,
        timestamp: new Date().toLocaleString(),
    };

    history.push(entry);

    if (history.length > 20) {
        history = history.slice(history.length - 20);
    }

    localStorage.setItem(GAMECST.ROUND_STATS_KEY, JSON.stringify(history));
  }

  /**
   * Arrow function that handles keyboard inputs and deals with issues that I had when using this.
   * @param e Keydown event from event listener
   * @returns void
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.isShowingResult) {
      return;
    }

    const key = e.key;

    if (key === "Enter") {
      if (this.model.playerInput.length > 0) {
        this.checkAnswer();
        this.view.update(this.model);
        this.isShowingResult = true;
        
        // Sets timer for between questions
        setTimeout(() => {
          this.isShowingResult = false;
          this.generateNewQuestion();
          this.view.update(this.model);
        }, GAMECST.BONUS_RESULT_DELAY);
      }
    } else if (key === "Backspace") {
      this.backspace();
      this.view.update(this.model);
    } else if (/\d/.test(key)) { // Only accepts number keys 0-9
      this.appendInput(key);
      this.view.update(this.model);
    }
  };

  /**
   * Generates new problem and uses it to set model state for next round
   * @returns void
   */
  private generateNewQuestion(): void {
    const problem = this.generateDivisionProblem();
    this.model.dividend = problem.dividend;
    this.model.divisor = problem.divisor;
    this.model.quotient = problem.quotient;
    this.model.playerInput = "";
    this.model.resultMessage = "";
  }

  /**
   * Checks the answer sets result message
   * @returns boolean true if answer correct or false if not
   */
  private checkAnswer(): boolean {
    const isCorrect = this.checkDivisionAnswer();
    this.model.totalQuestions++;
    
    if (isCorrect) {
        this.model.score += GAMECST.POINTS_PER_ANSWER;
        this.model.correctCount++;
        this.model.resultMessage = "Correct!";
    } else {
        this.model.resultMessage = `Wrong! ${this.model.dividend} / ${this.model.divisor} = ${this.model.quotient}`;
    }
    
    return isCorrect;
  }
  
  /**
   * Generates the numbers for a division problem with a whole-number answer
   * @returns array { dividend, divisor, quotient }
   */
  private generateDivisionProblem(): { dividend: number, divisor: number, quotient: number } {
    const quotient = Math.floor(Math.random() * this.maxAnswer) + 1;
    const divisor = Math.floor(Math.random() * this.maxDivisor) + 1;
    const dividend = quotient * divisor;
    
    return { dividend, divisor, quotient };
  }

  /**
   * Checks if the player input string matches the correct quotient
   * @returns boolean true if answer correct or false if not
   */
  private checkDivisionAnswer(): boolean {
    const playerAnswer = parseInt(this.model.playerInput, 10);
    return playerAnswer === this.model.quotient;
  }

  /**
   * Checks whether valid input and if so appends it to player input
   * @param char character to add to the end of players input
   * @returns void
   */
  private appendInput(char: string): void {
    if (/\d/.test(char) && this.model.playerInput.length < 5) {
      this.model.playerInput += char;
    }
  }

  /**
   * Deletes last character in player input string
   * @returns void
   */
  private backspace(): void {
    this.model.playerInput = this.model.playerInput.slice(0, -1);
  }
}