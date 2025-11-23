import { ScreenController, type ScreenSwitcher } from "../types";
import { RoundIntroView } from "./RoundIntroView";

export class RoundIntroController extends ScreenController {
  private screenSwitcher: ScreenSwitcher;
  private view: RoundIntroView;
  private currentRound = 1;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.view = new RoundIntroView(
      () => this.startRound(),
      () => this.returnStartPage(),
      () => this.handleHoverStart(),
      () => this.handleHoverEnd()
    )
  }
  
  /**
   * 
   * @param round 
   */
  setRound(round: number) {
    this.currentRound = round;
    this.view.setRound(`Round ${round}`); 
  }  
  
  /**
   * Takes the user to the main game and starts gameplay when the start button is pressed
   */
  private startRound() {
    this.screenSwitcher.switchToScreen({type: "main", round: this.currentRound});
  }

  /**
   * Takes the user back to the start page when the main menu button is pressed
   */
  private returnStartPage() {
    this.screenSwitcher.switchToScreen({type: "start"});
  }

  /**
   * Changes the cursor to a pointer to demostrate clickability when a clickable item is hovered
   */
  private handleHoverStart() {
    document.body.style.cursor = 'pointer';
  }

  /**
   * Changes the pointer back to a cursor when it no longer hovers a clickable element
   */
  private handleHoverEnd() {
    document.body.style.cursor = 'default';
  }

  /**
   * 
   * @returns The view element
   */
  getView(): RoundIntroView { return this.view; }
}