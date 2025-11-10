import { ScreenController, type ScreenSwitcher } from "../types";
import { RoundIntroView } from "./RoundIntroView";

export class RoundIntroController extends ScreenController {
  private view: RoundIntroView;
  private round = 1;
  constructor(private switcher: ScreenSwitcher) {
    super();
    this.view = new RoundIntroView(() => this.switcher.switchToScreen({ type: "main", round: this.round }));
  }
  setRound(r: number) { this.round = r; this.view.setRound(r); }
  getView(): RoundIntroView { return this.view; }
}