import { ScreenController, type ScreenSwitcher } from "../types";
import { StartPageView } from "./StartPageView";

export class StartPageController extends ScreenController {
  private view: StartPageView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new StartPageView(
      () => this.handleStartClick(),
      () => this.handleHelpClick(),
      () => this.handlePracticeClick(),
      () => this.onHoverStart(),
      () => this.onHoverStop()
    );
  }
  /**
   * Takes the user to the main game by switching screens
   */
  private handleStartClick(): void {
    this.screenSwitcher.switchToScreen({ type: "roundIntro", round: 1 });
  }

  /**
   * Takes the user to the help page by switching screens when the help button is pressed
   */
  private handleHelpClick(): void {
    this.screenSwitcher.switchToScreen({ type: "help" });
  }

  /**
   * Takes the user to the practice page by switching screens when the practice button is pressed
   */
  private handlePracticeClick(): void {
    this.screenSwitcher.switchToScreen({ type: "practice" });
  }

  /**
   * Turns the cursor to a pointer to demonstrate clickability when the mouse hovers over a clickable item
   */
  private onHoverStart(): void {
    document.body.style.cursor = 'pointer';
  }

  /**
   * Turns the pointer back to a cursor when the user pointer leaves hovering a clickable item
   */
  private onHoverStop(): void {
    document.body.style.cursor = 'default';
  }

  /**
   * 
   * @returns The view type
   */
  getView(): StartPageView {
    return this.view;
  }
}
