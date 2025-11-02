import { ScreenController, type ScreenSwitcher } from "../types";
import { MainPageView } from "./MainPageView";

/**
 * MainPageController - Manages game logic and user interactions
 */

export class MainPageController extends ScreenController{
    private view: MainPageView;
    private _screenSwitcher: ScreenSwitcher;
  
    constructor(screenSwitcher: ScreenSwitcher) {
      super();
      this._screenSwitcher = screenSwitcher;
      this.view = new MainPageView(); // currently just a placeholder view
    }
  
    getView(): MainPageView {
      return this.view;
    }
    //use Math class for calculations (ie. Math.random())

    /**
    * Helper function to generate random num, generates problems for model
    * @param min - minimum number generate can produce
    * @param max - maximum number generate can produce
    * @return number - random number between min and max
    */ 
    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Helper function to generate wrong answers, used to make multiple choice options
     * TODO: Modify to create better wrong answers
     * @param correctAnswer - the correct answer to base wrong answers off of
     * @param count - the number of wrong answers to generate
     * @returns an array of wrong answers
     */
    getWrongAnswers(correctAnswer: number, count: number): number[] {
        const wrongAnswers: Set<number> = new Set();
        while (wrongAnswers.size < count) {
            const wrongAnswer = this.getRandomNumber(correctAnswer - 10, correctAnswer + 10); //TODO: bad implementation, generates random wrong based on +- 10
            if (wrongAnswer !== correctAnswer) {
                wrongAnswers.add(wrongAnswer);
            }
        }
        return Array.from(wrongAnswers);
    }

    /**
     * Helper function to randomize order of multiple choice options
     * @param items - array of items to randomize
     * @returns randomized array of items
     */
    randomizeOrder<T>(items: T[]): T[] {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); //generate random swap
            [items[i], items[j]] = [items[j], items[i]]; //perform swap
        }
        return items;
    }
}
