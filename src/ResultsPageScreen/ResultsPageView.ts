import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH } from "../constants";
import { GAMECST } from "../constants.js";
import { RoundStatsEntry } from "./ResultsPageModel";

/**
 * ResultsScreenView - Renders the results screen
 */
export class ResultsPageView implements View {
  private group: Konva.Group;
  private title: Konva.Text;
  private finalScoreText: Konva.Text;
  private roundsPlayedText: Konva.Text;
  private leaderboardText: Konva.Text;
  private playerAvatar?: Konva.Image;

  constructor(
    onNextRoundClick: () => void, 
    onMainMenuClick: () => void,
    onHoverStart: () => void,
    onHoverEnd: () => void
  ) {
    this.group = new Konva.Group({ visible: false });

    //Title that announces game over
    this.title = new Konva.Text({
      x: 50,
      y: 60,
      text: "GAME OVER",
      fontSize: 60,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: GAMECST.HIGHLIGHT_COLOR,
      width: STAGE_WIDTH - 100,
      align: "left",
    });
    this.group.add(this.title);

    // Final score
    this.finalScoreText = new Konva.Text({
      x: 50,
      y: this.title.y() + this.title.height() + 15,
      text: "Final Score: 000000 pts",
      fontSize: 28,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: "black",
    });
    this.group.add(this.finalScoreText);

    // Final score
    this.roundsPlayedText = new Konva.Text({
      x: this.finalScoreText.x() + this.finalScoreText.width() + 10,
      y: this.finalScoreText.y(),
      text: "Rounds Won: 0",
      fontSize: 28,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: "black",
      width: STAGE_WIDTH,
      align: "left",
    });
    this.group.add(this.roundsPlayedText);

    //Background for the display of best rounds in the game
    const leaderboardBackground = new Konva.Rect({
      x: 50,
      y: this.roundsPlayedText.y() + this.roundsPlayedText.height() + 15,
      width: 450,
      height: 250,
      fill: GAMECST.LIGHT_NEUTRAL_COLOR,
      stroke: GAMECST.NEUTRAL_COLOR,
      strokeWidth: 4
    });
    this.group.add(leaderboardBackground);

    // Leaderboard text
    this.leaderboardText = new Konva.Text({
      x: leaderboardBackground.x() + 10,
      y: leaderboardBackground.y() + 10,
      text: "Top Round Scores: (Play more rounds to get higher scores!)",
      fontSize: 18,
      fontFamily: 'Arial',
      fill: GAMECST.DARK_COLOR,
      align: "left",
      width: STAGE_WIDTH,
      lineHeight: 1.5,
    });
    this.group.add(this.leaderboardText);

    // New Game button that lets the user start a new game
    const nextRoundButtonGroup = new Konva.Group();
    const nextRoundButton = new Konva.Rect({
      x: STAGE_WIDTH / 2 - 220,
      y: 480,
      width: 200,
      height: 60,
      fill: GAMECST.HIGHLIGHT_COLOR,
      stroke: GAMECST.DARK_COLOR,
      strokeWidth: 4,
    });

    //Text that tells the user what the new game button does
    const nextRoundText = new Konva.Text({
      x: nextRoundButton.x() + nextRoundButton.width() / 2,
      y: nextRoundButton.y() + nextRoundButton.height() / 2,
      text: "NEW GAME",
      fontSize: 32,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: GAMECST.DARK_COLOR,
      align: "center",
    });
    nextRoundText.offset({x: nextRoundText.width() / 2, y: nextRoundText.height() / 2});

    nextRoundButtonGroup.add(nextRoundButton, nextRoundText);

    //Add hover and click functionality to button
    nextRoundButtonGroup.on("click", onNextRoundClick);
    nextRoundButtonGroup.on("mouseover", onHoverStart);
    nextRoundButtonGroup.on("mouseout", onHoverEnd);
    this.group.add(nextRoundButtonGroup);

    // MENU button
    const mainMenuButtonGroup = new Konva.Group();
    const mainMenuButton = new Konva.Rect({
      x: STAGE_WIDTH / 2 + 20,
      y: 480,
      width: 200,
      height: 60,
      fill: GAMECST.HIGHLIGHT_COLOR,
      stroke: GAMECST.DARK_COLOR,
      strokeWidth: 4,
    });

    //Text that tells the user what the button does
    const mainMenuText = new Konva.Text({
      x: mainMenuButton.x() + mainMenuButton.width() / 2,
      y: mainMenuButton.y() + mainMenuButton.height() / 2,
      text: "MAIN MENU",
      fontSize: 32,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: GAMECST.DARK_COLOR,
      align: "center",
    });
    mainMenuText.offset({x: mainMenuText.width() / 2, y: mainMenuText.height() / 2});

    mainMenuButtonGroup.add(mainMenuButton, mainMenuText);

    //Adds hover and click functionality to the buttons
    mainMenuButtonGroup.on("click", onMainMenuClick);
    mainMenuButtonGroup.on("mouseover", onHoverStart);
    mainMenuButtonGroup.on("mouseout", onHoverEnd);

    this.group.add(mainMenuButtonGroup);

    //Background for the image of the defeated avatar
    const figureBackground = new Konva.Rect({
      x: leaderboardBackground.x() + leaderboardBackground.width() + 30,
      y: leaderboardBackground.y(),
      width: 200,
      height: 250,
      stroke: "#f77",
      fill: "rgba(236, 147, 138, 1)",
      strokeWidth: 4,
    });
    this.group.add(figureBackground);
    
    //Text that tells the user that they were defeated by the adversary
    const defeatText = new Konva.Text({
      text: "Defeat",
      x: figureBackground.x() + figureBackground.width() / 2,
      y: figureBackground.y() + 10,
      fontSize: 40,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: "#e54",
    });
    defeatText.offsetX(defeatText.width() / 2);
    this.group.add(defeatText);

    //Image of the avatar on the ground, defeated
    Konva.Image.fromURL('/player_defeat.png', (image) => {
      this.playerAvatar = image;
      this.group.add(this.playerAvatar);

      this.playerAvatar.x(figureBackground.x() + figureBackground.width() / 2);
      this.playerAvatar.offsetX(this.playerAvatar.width() / 2);
      this.playerAvatar.y(defeatText.y() + defeatText.height() + 5);
      this.playerAvatar.scale({x: 0.5, y: 0.5});
    })

  }

  /**
   * Sets the number of rounds that the user played before loosing
   * 
   * @param roundNum Number of rounds that were played until loosing
   */
  setRound(roundNum: number): void {
    this.roundsPlayedText.text(`Rounds Won: ${roundNum}`);
    this.group.getLayer()?.draw();
  }

	/**
	* Update the final score display
	*/
  updateFinalScore(score: number): void {
    this.finalScoreText.text(`Final Score: ${score} pts`);
    //this.finalScoreText.offsetX(this.finalScoreText.width() / 2);
    this.group.getLayer()?.draw();
  }

	/**
 	* Update the leaderboard display
 	*/
  updateLeaderboard(entries: RoundStatsEntry[]): void {
    if (entries.length === 0) {
      this.leaderboardText.text("Top Scores:\n(No scores yet!)");
    } else {
      let text = "Top Scores:\n";
      entries.forEach((entry, index) => {
        text += `${index + 1}. ${entry.points} - ${entry.timestamp}\n`;
      });
      this.leaderboardText.text(text);
    }
    //this.leaderboardText.offsetX(this.leaderboardText.width() / 2);
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
