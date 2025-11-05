import { describe, it, expect, vi, beforeEach } from "vitest";
import { StartPageController } from "./StartPageController";

// ✅ Mock a *constructor* for StartPageView (new-able)
vi.mock("./StartPageView", () => {
  const StartPageView = vi.fn(function (this: any, _onStart: any, _onHelp: any, _onPractice: any) {
    // expose stubs on instances if controller calls them
    this.getGroup = vi.fn();
    this.show = vi.fn();
    this.hide = vi.fn();
  });
  return { StartPageView };
});

type MockScreenSwitcher = { switchToScreen: ReturnType<typeof vi.fn> };

let screenSwitcher: MockScreenSwitcher;

beforeEach(() => {
  screenSwitcher = { switchToScreen: vi.fn() };
});

describe("StartPageController", () => {
  it("should transition from start to main game", () => {
    const controller = new StartPageController(screenSwitcher as any);
    // Access private handler for minimal-change testing
    // @ts-ignore
    controller.handleStartClick();
    expect(screenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "main" });
  });

  it("calls switchToScreen({ type: 'main' }) when start is triggered", () => {
    const controller = new StartPageController(screenSwitcher as any);
    // @ts-ignore
    controller.handleStartClick();
    expect(screenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "main" });
  });

  it("calls switchToScreen({ type: 'help' }) when help is triggered", () => {
    const controller = new StartPageController(screenSwitcher as any);
    // @ts-ignore
    controller.handleHelpClick();
    expect(screenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "help" });
  });

  it("calls switchToScreen({ type: 'practice' }) when practice is triggered", () => {
    const controller = new StartPageController(screenSwitcher as any);
    // @ts-ignore
    controller.handlePracticeClick();
    expect(screenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "practice" });
  });

  it("constructs StartPageView with three callback functions", async () => {
    const { StartPageView } = await import("./StartPageView"); // mocked
    // instantiate to record constructor call
    new StartPageController(screenSwitcher as any);

    const calls = (StartPageView as unknown as { mock: { calls: any[][] } }).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const [onStart, onHelp, onPractice] = calls[0];
    expect(typeof onStart).toBe("function");
    expect(typeof onHelp).toBe("function");
    expect(typeof onPractice).toBe("function");
  });
});