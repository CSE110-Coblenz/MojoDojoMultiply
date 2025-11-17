import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH } from "../constants";
import { GAMECST } from "../constants.js";

export interface RoundStatsEntry {
  round: number;
  points: number;
  correct: number;
  total: number;
  timestamp: string;
}

export class RoundStatsView implements View {
  private group: Konva.Group;
  private title: Konva.Text;
  private finalScoreText: Konva.Text;
  private leaderboardText: Konva.Text;
  private playerAvatar?: Konva.Image;

  constructor(onNextRoundClick: () => void, onMainMenuClick: () => void) {
    this.group = new Konva.Group({ visible: false });

    this.title = new Konva.Text({
      x: 50,
      y: 60,
      text: "ROUND __ COMPLETE!",
      fontSize: 48,
      fontFamily: "Arial",
      fill: GAMECST.HIGHLIGHT_COLOR,
      width: STAGE_WIDTH - 100,
      align: "left",
    });
    this.group.add(this.title);

    this.finalScoreText = new Konva.Text({
      x: STAGE_WIDTH / 2 + 50,
      y: 150,
      text: "Final Round: 0 pts (0% correct)",
      fontSize: 28,
      fontFamily: "Arial",
      fill: "black",
      width: STAGE_WIDTH,
      align: "left",
    });
    this.finalScoreText.offsetX(this.finalScoreText.width() / 2);
    this.group.add(this.finalScoreText);

    this.loadStickFigure();

    this.leaderboardText = new Konva.Text({
      x: STAGE_WIDTH / 2 + 50,
      y: 205,
      text: "Round History:\n(No rounds yet!)",
      fontSize: 18,
      fontFamily: "Arial",
      fill: "#665",
      align: "left",
      width: STAGE_WIDTH,
      lineHeight: 1.5,
    });
    this.leaderboardText.offsetX(this.leaderboardText.width() / 2);
    this.group.add(this.leaderboardText);

    const nextRound = new Konva.Group();
    nextRound.add(new Konva.Rect({
      x: STAGE_WIDTH / 2 - 220,
      y: 480,
      width: 200,
      height: 60,
      fill: "#665",
      cornerRadius: 10,
      stroke: "rgba(66,66,60,1)",
      strokeWidth: 3,
    }));
    const nextText = new Konva.Text({
      x: STAGE_WIDTH / 2 - 120,
      y: 495,
      text: "NEXT ROUND",
      fontSize: 24,
      fontFamily: "Arial",
      fill: GAMECST.HIGHLIGHT_COLOR,
    });
    nextText.offsetX(nextText.width() / 2);
    nextRound.add(nextText);
    nextRound.on("click", onNextRoundClick);
    this.group.add(nextRound);

    const menu = new Konva.Group();
    menu.add(new Konva.Rect({
      x: STAGE_WIDTH / 2 + 20,
      y: 480,
      width: 200,
      height: 60,
      fill: "#665",
      cornerRadius: 10,
      stroke: "rgba(66,66,60,1)",
      strokeWidth: 3,
    }));
    const menuText = new Konva.Text({
      x: STAGE_WIDTH / 2 + 120,
      y: 495,
      text: "MENU",
      fontSize: 24,
      fontFamily: "Arial",
      fill: GAMECST.HIGHLIGHT_COLOR,
    });
    menuText.offsetX(menuText.width() / 2);
    menu.add(menuText);
    menu.on("click", onMainMenuClick);
    this.group.add(menu);
  }

  private loadStickFigure(): void {
    const img = new Image();
    img.src = "/boxer.png";

    img.onload = () => {
      const x = STAGE_WIDTH - 225;
      const y = 150;

      this.group.add(new Konva.Rect({
        x,
        y,
        width: 180,
        height: 220,
        stroke: "#f77",
        fill: "rgba(236,147,138,1)",
        strokeWidth: 4,
        cornerRadius: 6,
      }));

      this.group.add(new Konva.Text({
        text: "Victor!",
        x: x + 12,
        y: y + 8,
        fontSize: 28,
        fontStyle: "bold",
        fill: "#e54",
      }));

      const figure = new Konva.Image({
        x: x + 30,
        y: y + 60,
        width: 120,
        height: 140,
        image: img,
        listening: false,
      });

      this.playerAvatar = figure;
      this.group.add(figure);
      this.group.getLayer()?.batchDraw();
    };
  }

  setRound(round: number): void {
    this.title.text(`ROUND ${round} COMPLETE!`);
    this.group.getLayer()?.draw();
  }

  updateFinalRoundStats(points: number, correct: number, total: number): void {
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    this.finalScoreText.text(
      `Final Round: ${points} pts (${percent}% correct)`
    );
    this.finalScoreText.offsetX(this.finalScoreText.width() / 2);
    this.group.getLayer()?.draw();
  }

  updateLeaderboard(entries: RoundStatsEntry[]): void { 
    if (entries.length === 0) {
      this.leaderboardText.text("Round History:\n(No rounds yet!)");
    } else {
      let text = "Round History:\n";
      for (const entry of entries) {
        const percent =
          entry.total > 0
            ? Math.round((entry.correct / entry.total) * 100)
            : 0;
        text += `Round ${entry.round}: ${entry.points} pts (${percent}% correct) @ ${entry.timestamp}\n`;
      }
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