import type { Group } from "konva/lib/Group";

export interface View {
	getGroup(): Group;
	show(): void;
	hide(): void;
}


/**
 * To do: This is from lab 3 - need to alter our specific transitioning needs
 * 
 */
/**
 * Screen types for navigation
 *
 * - "menu": Main menu screen
 * - "game": Gameplay screen
 * - "result": Results screen with final score
 *   - score: Final score to display on results screen
 */
export type Screen =
	| { type: "start" }
	| { type: "main" };

export abstract class ScreenController {
	abstract getView(): View;

	show(): void {
		this.getView().show();
	}

	hide(): void {
		this.getView().hide();
	}
}

export interface ScreenSwitcher {
	switchToScreen(screen: Screen): void;
}
