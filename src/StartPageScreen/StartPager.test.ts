import { describe, it, expect, vi, beforeEach } from "vitest";
import { StartPageController } from "./StartPageController";

//TODO: See if we can import screenswitcher from types.ts to here instead of using a mock version

/**
 * We mock StartPageView so Vitest doesn’t need to actually load or render Konva.
 * The controller calls `new StartPageView(...)`, so this must be a *constructor function*
 * that can be instantiated with `new`. That’s why we use `vi.fn(function() { ... })`
 * instead of an arrow function. Need to have a ".test.ts" file as vitest won't pick up unit tests within .ts files
 */
vi.mock("./StartPageView", () => {
  const StartPageView = vi.fn(function (this: any, _onStart: any, _onHelp: any, _onPractice: any) {
    // These stubbed methods simulate the real view methods
    // so the controller doesn’t crash when calling them
    this.getGroup = vi.fn();
    this.show = vi.fn();
    this.hide = vi.fn();
  });
  // Export our mock so the controller’s import is replaced.
  return { StartPageView };
});

/**
 * The controller calls `this.screenSwitcher.switchToScreen({ type: ... })`.
 * Here, we create a fake object with a mocked function using `vi.fn()`.
 * This allows us to assert what arguments were passed to it later.
 */

type MockScreenSwitcher = { switchToScreen: ReturnType<typeof vi.fn> };

// Declare it here and reset before each test.
let screenSwitcher: MockScreenSwitcher;

// Ensure a clean mock for every test run.
beforeEach(() => {
  screenSwitcher = { switchToScreen: vi.fn() };
});

/**
 * Each `it()` test below corresponds to one controller action
 * (Start, Help, Practice buttons), verifying the controller logic
 * without rendering Konva.
 */
describe("StartPageController", () => {
  /*
  it("should transition from start to main game", () => {
    // Instantiate controller with our fake screenSwitcher
    const controller = new StartPageController(screenSwitcher as any);

    // Access private handler for minimal-change testing
    // @ts-ignore
    controller.handleStartClick();

    // Expect that switchToScreen was called with the correct type
    expect(screenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "main" });
  });

  it("calls switchToScreen({ type: 'main' }) when start is triggered", () => {
    const controller = new StartPageController(screenSwitcher as any);

    // @ts-ignore
    controller.handleStartClick();

    // Verify correct navigation type
    expect(screenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "main" });
  });
  */

  it("calls switchToScreen({ type: 'help' }) when help is triggered", () => {
    const controller = new StartPageController(screenSwitcher as any);
    // @ts-ignore
    controller.handleHelpClick();
    expect(screenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "help", fromGame: false });
  });

  it("calls switchToScreen({ type: 'practice' }) when practice is triggered", () => {
    const controller = new StartPageController(screenSwitcher as any);
    // @ts-ignore
    controller.handlePracticeClick();
    expect(screenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "practice" });
  });

/**
 * Ensures the controller calls `new StartPageView(onStart, onHelp, onPractice)`
* with exactly three functions — proving that button callbacks are passed correctly.
*/

  it("constructs StartPageView with three callback functions", async () => {
    // Import the mocked StartPageView
    const { StartPageView } = await import("./StartPageView"); 

    // Instantiate the controller (this will trigger the mock constructor)
    new StartPageController(screenSwitcher as any);

    // Pull recorded constructor calls from the mock
    const calls = (StartPageView as unknown as { mock: { calls: any[][] } }).mock.calls;

    // There should be at least one constructor call
    expect(calls.length).toBeGreaterThan(0);

    // Extract arguments from the first call
    const [onStart, onHelp, onPractice] = calls[0];

    // Confirm each argument is a function (the expected callbacks)
    expect(typeof onStart).toBe("function");
    expect(typeof onHelp).toBe("function");
    expect(typeof onPractice).toBe("function");
  });
});