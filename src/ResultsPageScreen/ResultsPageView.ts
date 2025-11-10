import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH } from "../constants";
import { GAMECST } from "../constants.js";
import { LeaderboardEntry } from "./ResultsPageModel";

/**
 * ResultsScreenView - Renders the results screen
 */
export class ResultsPageView implements View {
  private group: Konva.Group;
  private finalScoreText: Konva.Text;
  private leaderboardText: Konva.Text;
  private playerAvatar?: Konva.Image;

  constructor(onNextRoundClick: () => void, onMainMenuClick: () => void) {
    this.group = new Konva.Group({ visible: false });

    // Title
	//TODO: Import counter variable to announce what specific round is over
    const title = new Konva.Text({
      x: 50,
      y: 60,
      text: "ROUND __ COMPLETE!",
      fontSize: 48,
      fontFamily: "Arial",
      fill: GAMECST.HIGHLIGHT_COLOR,
      width: STAGE_WIDTH - 100,
      align: "left",
    });
    this.group.add(title);

    // Final score
    this.finalScoreText = new Konva.Text({
      x: STAGE_WIDTH / 2 + 50,
      y: 150,
      text: "Final Score: 0",
      fontSize: 36,
      fontFamily: "Arial",
      fill: "black",
      width: STAGE_WIDTH,
      align: "left",
    });
    this.finalScoreText.offsetX(this.finalScoreText.width() / 2);
    this.group.add(this.finalScoreText);

    // Victor card + boxer image
    this.loadStickFigure();

    // Leaderboard text
	//TODO: Import counter variable to announce what specific round user is on
    this.leaderboardText = new Konva.Text({
      x: STAGE_WIDTH / 2 + 50,
      y: 205,
      text: "Top Round Scores: (Play more rounds to get higher scores!)",
      fontSize: 18,
      fontFamily: "Arial",
      fill: "#665",
      align: "left",
      width: STAGE_WIDTH,
      lineHeight: 1.5,
    });
    this.leaderboardText.offsetX(this.leaderboardText.width() / 2);
    this.group.add(this.leaderboardText);

    // NEXT ROUND button
    const nextRoundButtonGroup = new Konva.Group();
    const nextRoundButton = new Konva.Rect({
      x: STAGE_WIDTH / 2 - 220,
      y: 480,
      width: 200,
      height: 60,
      fill: "#665",
      cornerRadius: 10,
      stroke: "rgba(66, 66, 60, 1)",
      strokeWidth: 3,
    });
    const nextRoundText = new Konva.Text({
      x: STAGE_WIDTH / 2 - 120,
      y: 495,
      text: "NEXT ROUND",
      fontSize: 24,
      fontFamily: "Arial",
      fill: GAMECST.HIGHLIGHT_COLOR,
      align: "center",
    });
    nextRoundText.offsetX(nextRoundText.width() / 2);

    nextRoundButtonGroup.add(nextRoundButton, nextRoundText);
    nextRoundButtonGroup.on("click", onNextRoundClick);
    this.group.add(nextRoundButtonGroup);

    // MENU button
    const mainMenuButtonGroup = new Konva.Group();
    const mainMenuButton = new Konva.Rect({
      x: STAGE_WIDTH / 2 + 20,
      y: 480,
      width: 200,
      height: 60,
      fill: "#665",
      cornerRadius: 10,
      stroke: "rgba(66, 66, 60, 1)",
      strokeWidth: 3,
    });
    const mainMenuText = new Konva.Text({
      x: STAGE_WIDTH / 2 + 120,
      y: 495,
      text: "MENU",
      fontSize: 24,
      fontFamily: "Arial",
      fill: GAMECST.HIGHLIGHT_COLOR,
      align: "center",
    });
    mainMenuText.offsetX(mainMenuText.width() / 2);

    mainMenuButtonGroup.add(mainMenuButton, mainMenuText);
    mainMenuButtonGroup.on("click", onMainMenuClick);
    this.group.add(mainMenuButtonGroup);
  }

  private loadStickFigure(): void {
    const img = new Image();
    img.src = "/boxer.png";

    img.onload = () => {
      const borderX = STAGE_WIDTH - 225;
      const borderY = 150;

      const border = new Konva.Rect({
        x: borderX,
        y: borderY,
        width: 180,
        height: 220,
        stroke: "#f77",
        fill: "rgba(236, 147, 138, 1)",
        strokeWidth: 4,
        cornerRadius: 6,
      });

      const victorText = new Konva.Text({
        text: "Victor!",
        x: borderX + 12,
        y: borderY + 8,
        fontSize: 28,
        fontStyle: "bold",
        fill: "#e54",
      });

      const figure = new Konva.Image({
        x: borderX + 30,
        y: borderY + 60,
        width: 120,
        height: 140,
        image: img,
        listening: false,
      });

      this.playerAvatar = figure;

      this.group.add(border, victorText, figure);
      this.group.getLayer()?.batchDraw();
    };
  }

  	/**
	 * Update the final score display
	*/
  updateFinalScore(score: number): void {
    this.finalScoreText.text(`Final Score: ${score}`);
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
    this.leaderboardText.offsetX(this.leaderboardText.width() / 2);
    this.group.getLayer()?.draw();
  }

  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
