import { describe, it, expect, vi } from "vitest";
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
      () => this.handlePracticeClick()
    );
  }

  private handleStartClick(): void {
    this.screenSwitcher.switchToScreen({ type: "main" });
  }
  private handleHelpClick(): void {
    this.screenSwitcher.switchToScreen({ type: "help" });
  }
  private handlePracticeClick(): void {
    this.screenSwitcher.switchToScreen({ type: "practice" });
  }


  getView(): StartPageView {
    return this.view;
  }
}

/** -----------------------------------------------------------------
 * 🧪 Example Unit Test
 * 
 * This shows how to use "expect" and "it" in Vitest.
 * ----------------------------------------------------------------- */

describe("StartPageController", () => {
  it("should transition from start to main game", () => {
    const mockScreenSwitcher = { switchToScreen: vi.fn() };
    const controller = new StartPageController(mockScreenSwitcher as any);

    // @ts-ignore
    controller.handleStartClick();

    expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "main" });
  });
});