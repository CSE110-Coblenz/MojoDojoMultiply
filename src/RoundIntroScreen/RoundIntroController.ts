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
      () => this.sendRound(),
      () => this.handleHoverStart(),
      () => this.handleHoverEnd()
    )
  }
  
  setRound(round: number) {
    this.currentRound = round;
    this.view.setRound(`Round ${round}`); 
  }  
  
  private startRound() {
    this.screenSwitcher.switchToScreen({type: "main", round: this.currentRound});
  }

  private returnStartPage() {
    this.screenSwitcher.switchToScreen({type: "start"});
  }

  private sendRound() {
    return this.currentRound.toString();
  }

  private handleHoverStart() {
    document.body.style.cursor = 'pointer';
  }

  private handleHoverEnd() {
    document.body.style.cursor = 'default';
  }
  getView(): RoundIntroView { return this.view; }
}