import { ScreenController, type ScreenSwitcher } from "../types";
import { RoundIntroView } from "./RoundIntroView";

export class RoundIntroController extends ScreenController {
  private screenSwitcher: ScreenSwitcher;
  private view: RoundIntroView;
  private currentRound = 1;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new RoundIntroView(() => this.startRound())
  }
  
  setRound(round: number) {
    this.currentRound = round;
    this.view.setRound(`Round ${round}`); 
  }  
  
  private startRound() {
    this.screenSwitcher.switchToScreen({type: "main", round: this.currentRound});
  }
  getView(): RoundIntroView { return this.view; }
}