import Konva from "konva";
import type { View } from "../types";
import {
  STAGE_WIDTH,
  STAGE_HEIGHT,
  NEUTRAL_COLOR,
  DARK_COLOR,
  DEFAULT_FONT,
  HIGHLIGHT_COLOR,
  ALERT_COLOR,
  UNAVAIL_COLOR,
  LIGHT_NEUTRAL_COLOR,
} from "../constants";
import { GAMECST } from "../constants.js";
import { AnimatedSprite } from "../AnimatedSprites";

export interface RoundStatsEntry {
  round: number;
  points: number;
  correct: number;
  total: number;
  timestamp: string;
}

export class RoundStatsView implements View {
  private layer: Konva.Layer;

  private group: Konva.Group;
  private title: Konva.Text;
  private finalScoreText: Konva.Text;
  private leaderboardText: Konva.Text;
  private playerAvatar?: Konva.Image;

  private victorPanel: Konva.Group | null = null;
  private victorySprite: AnimatedSprite | null = null;

  constructor(
    onNextRoundClick: () => void,
    onMainMenuClick: () => void,
    onHoverStart: () => void,
    onHoverEnd: () => void,
    layer: Konva.Layer
  ) {

    // Layer that holds everything for this screen
    this.layer = layer;

    // Group so we can show/hide the whole screen at once
    this.group = new Konva.Group({ visible: false });
    this.layer.add(this.group);

    // Main Title
    this.title = new Konva.Text({
      x: 50,
      y: 60,
      text: "ROUND __ COMPLETE!",
      fontSize: 48,
      fontFamily: DEFAULT_FONT,
      fill: GAMECST.HIGHLIGHT_COLOR,
      width: STAGE_WIDTH - 100,
      align: "left",
    });
    this.group.add(this.title);

    // Current Round Score
    this.finalScoreText = new Konva.Text({
      x: STAGE_WIDTH / 2 + 50,
      y: 150,
      text: "Current Round: 0 pts (0% correct)",
      fontSize: 28,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: GAMECST.DARK_COLOR,
      width: STAGE_WIDTH,
      align: "left",
    });
    this.finalScoreText.offsetX(this.finalScoreText.width() / 2);
    this.group.add(this.finalScoreText);

    // Victor panel + celebrating animation
    this.loadPlayerFigure();

    // History Box
    this.group.add(
      new Konva.Rect({
        x: STAGE_WIDTH / 2 - 360,
        y: 190,
        width: 520,
        height: 240,
        stroke: NEUTRAL_COLOR,
        fill: LIGHT_NEUTRAL_COLOR,
        strokeWidth: 4,
      })
    );

    // Round History Text
    this.leaderboardText = new Konva.Text({
      x: STAGE_WIDTH / 2 + 50,
      y: 205,
      text: "Round History:\n\tNo previous rounds yet. (Keep playing!)",
      fontSize: 18,
      fontFamily: "Arial",
      fill: DARK_COLOR,
      align: "left",
      width: STAGE_WIDTH,
      lineHeight: 1.5,
    });
    this.leaderboardText.offsetX(this.leaderboardText.width() / 2);
    this.group.add(this.leaderboardText);

    // NEXT ROUND Button
    const nextRound = new Konva.Group();
    const nextRoundBackground = new Konva.Rect({
      x: STAGE_WIDTH / 2 - 260,
      y: 480,
      width: 250,
      height: 60,
      fill: HIGHLIGHT_COLOR,
      stroke: DARK_COLOR,
      strokeWidth: 4,
    })
    nextRound.add(nextRoundBackground);

    const nextText = new Konva.Text({
      x: nextRoundBackground.x() + nextRoundBackground.width() / 2,
      y: nextRoundBackground.y() + nextRoundBackground.height() / 2,
      text: "NEXT ROUND",
      fontSize: 30,
      fontFamily: DEFAULT_FONT,
      fill: DARK_COLOR,
    });
    nextText.offset({x: nextText.width() / 2, y: nextText.height() / 2});
    nextRound.add(nextText);
    nextRound.on("mouseover", onHoverStart);
    nextRound.on("mouseout", onHoverEnd)
    nextRound.on("click", onNextRoundClick);
    this.group.add(nextRound);

    // MAIN MENU Button
    const menu = new Konva.Group();
    
    const menuBackground = new Konva.Rect({
      x: STAGE_WIDTH / 2 + 40,
      y: 480,
      width: 250,
      height: 60,
      fill: HIGHLIGHT_COLOR,
      stroke: DARK_COLOR,
      strokeWidth: 4,
    });
    menu.add(menuBackground);

    const menuText = new Konva.Text({
      x: menuBackground.x() + menuBackground.width() / 2,
      y: menuBackground.y() + menuBackground.height() / 2,
      text: "MAIN MENU",
      fontSize: 30,
      fontFamily: DEFAULT_FONT,
      fill: DARK_COLOR,
    });
    menuText.offset({x: menuText.width() / 2, y: menuText.height() / 2});
    menu.add(menuText);
    menu.on("mouseover", onHoverStart);
    menu.on("mouseout", onHoverEnd)
    menu.on("click", onMainMenuClick);
    this.group.add(menu);
  }

  // Loads the "Victor" panel + adds the celebrating animation
  private loadPlayerFigure(): void {

  const redFill = "#f77";
  const redBackground = "rgba(236,147,138,1)";
  const redText = "#e54";

  // Create Image object
  const playerCelebrating = new Image();

  // Handle successful load
  playerCelebrating.onload = () => {

    const panelX = STAGE_WIDTH - 225;
    const panelY = 150;

    this.victorPanel = new Konva.Group({
      x: panelX,
      y: panelY,
      width: 230,
      height: 330,
    });

    // Background box
    const victorBg = new Konva.Rect({
      x: 0,
      y: 0,
      width: 200,
      height: 280,
      stroke: redFill,
      fill: redBackground,
      strokeWidth: 4,
    });

    const victorText = new Konva.Text({
      text: "Victor!",
      x: 30,
      y: 14,
      fontSize: 50,
      fontFamily: DEFAULT_FONT,
      fill: redText,
    });

    this.victorPanel.add(victorBg);
    this.victorPanel.add(victorText);
    this.group.add(this.victorPanel);

    // Sprite frame dimensions
    const frameWidth = 128;
    const frameHeight = 128;
    const frameCount = 12;

    // Scale it up inside the panel
    const scale = 1.8; // try 1.4–1.8 and tweak
    const scaledWidth = frameWidth * scale;
    const scaledHeight = frameHeight * scale;

    // Position *inside* the panel (no victorPanel.x() / y() here)
    const spriteX = this.victorPanel.width() / 2 - scaledWidth / 2 - 15;
    const spriteY = 140 - scaledHeight / 2 + 30; 

    this.victorySprite = new AnimatedSprite(this.layer, {
      image: playerCelebrating,
      frameWidth,
      frameHeight,
      frameCount: 5,
      frameRate: 10,
      loop: true,
      x: spriteX,
      y: spriteY,
    });

    this.victorySprite.node.scale({ x: scale, y: scale });

    this.victorPanel.add(this.victorySprite.node);

    this.victorySprite.play();

    this.layer.draw();
  };

  playerCelebrating.src = "/player_celebration.png";

  }

  // Update the Title Text
  setRound(round: number): void {
    this.title.text(`ROUND ${round} COMPLETE!`);
    this.group.getLayer()?.draw();
  }

  // Update the final round results
  updateFinalRoundStats(points: number, correct: number, total: number): void {
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    this.finalScoreText.text(
      `Current Round: ${points} pts (${percent}% correct)`
    );
    this.finalScoreText.offsetX(this.finalScoreText.width() / 2);
    this.group.getLayer()?.draw();
  }

  // Update the history section
  updateLeaderboard(entries: RoundStatsEntry[]): void {
    if (entries.length === 0) {
      this.leaderboardText.text("Round History:\n\tNo previous rounds yet. (Keep playing!)");
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
