import type { Group } from "konva/lib/Group";

export interface View {
  getGroup(): Group;
  show(): void;
  hide(): void;
}

export type Screen =
  | { type: "start" }
  | { type: "main"; round: number }
  | { type: "help" }
  | { type: "practice" }
  | { type: "roundIntro"; round: number }
  | { type: "results" }
  | { type: "roundStats"; 
      round: number; 
      stats: {roundScore: number; correct: number; total: number; fastestMs: number | null}; 
    };

export abstract class ScreenController {
  abstract getView(): View;
  show(): void { this.getView().show(); }
  hide(): void { this.getView().hide(); }
}

export interface ScreenSwitcher {
  switchToScreen(screen: Screen): void;
}