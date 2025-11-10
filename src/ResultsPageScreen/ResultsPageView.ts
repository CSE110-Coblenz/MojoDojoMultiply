import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH } from "../constants";
import { GAMECST } from "../constants.js"
import { LeaderboardEntry } from "./ResultsPageModel";

/**
 * ResultsScreenView - Renders the results screen
 */
export class ResultsPageView implements View {
	private group: Konva.Group;
	private finalScoreText: Konva.Text;
	private leaderboardText: Konva.Text;

	constructor(onNextRoundClick: () => void) {
		this.group = new Konva.Group({ visible: false });

		// "Game Over" title
        //TODO: Import counter variable to announce what specific round is over
		const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 100,
			text: "ROUND OVER!",
			fontSize: 48,
			fontFamily: "Arial",
			fill: GAMECST.HIGHLIGHT_COLOR,
			align: "center",
		});
		title.offsetX(title.width() / 2);
		this.group.add(title);

		// Final score display
		this.finalScoreText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 200,
			text: "Final Score: 0",
			fontSize: 36,
			fontFamily: "Arial",
			fill: "black",
			align: "center",
		});
		this.group.add(this.finalScoreText);

		// Leaderboard display
        //TODO: Import counter variable to announce what specific round user is on
		this.leaderboardText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 260,
			text: "Top Round Scores:\n (Play more rounds to get higher scores!)",
			fontSize: 18,
			fontFamily: "Arial",
			fill: "#665",
			align: "center",
			lineHeight: 1.5,
		});
		this.leaderboardText.offsetX(this.leaderboardText.width() / 2);
		this.group.add(this.leaderboardText);

		// Next Round button (grouped) - moved down to make room for leaderboard
		const nextRoundButtonGroup = new Konva.Group();
		const nextRoundButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 100,
			y: 480,
			width: 200,
			height: 60,
			fill: "#665",
			cornerRadius: 10,
			stroke: "rgba(66, 66, 60, 1)",
			strokeWidth: 3,
		});
		const nextRoundText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 495,
			text: "PLAY AGAIN",
			fontSize: 24,
			fontFamily: "Arial",
			fill: GAMECST.HIGHLIGHT_COLOR,
			align: "center",
		});
		nextRoundText.offsetX(nextRoundText.width() / 2);
		nextRoundButtonGroup.add(nextRoundButton);
		nextRoundButtonGroup.add(nextRoundText);

		// Button interaction - on the group
		nextRoundButtonGroup.on("click", onNextRoundClick);

		this.group.add(nextRoundButtonGroup);
	}

	/**
	 * Update the final score display
	 */
	updateFinalScore(score: number): void {
		this.finalScoreText.text(`Final Score: ${score}`);
		// Re-center after text change
		this.finalScoreText.offsetX(this.finalScoreText.width() / 2);
		this.group.getLayer()?.draw();
	}

	/**
	 * Update the leaderboard display
	 */
	updateLeaderboard(entries: LeaderboardEntry[]): void {
		if (entries.length === 0) {
			this.leaderboardText.text("Top Scores:\n(No scores yet!)");
		} else {
			let text = "Top Scores:\n";
			entries.forEach((entry, index) => {
				text += `${index + 1}. ${entry.score} - ${entry.timestamp}\n`;
			});
			this.leaderboardText.text(text);
		}
		// Re-center after text change
		this.leaderboardText.offsetX(this.leaderboardText.width() / 2);
		this.group.getLayer()?.draw();
	}

	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
}
