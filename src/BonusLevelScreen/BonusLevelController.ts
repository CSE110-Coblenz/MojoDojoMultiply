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

  // TODO Adds these to constants
  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.model = new BonusLevelModel();
    this.view = new BonusLevelView();
  }

  // TODO Adds these to constants
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
   * 
   */
  show(): void {
    this.isShowingResult = false;
    this.generateNewQuestion();
    this.view.update(this.model);
    this.view.show();
    // Starts listener that looks for any keydown ie key pressed down
    window.addEventListener("keydown", this.handleKeyDown);
  }

  /**
   * 
   */
  hide(): void {
    this.view.hide();
    // Stops listener
    window.removeEventListener("keydown", this.handleKeyDown);
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
        }, 1000); // TODO add this to constants
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
    this.model.resultMessage = isCorrect
      ? "Correct!"
      : `Wrong! ${this.model.dividend} / ${this.model.divisor} = ${this.model.quotient}`;
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