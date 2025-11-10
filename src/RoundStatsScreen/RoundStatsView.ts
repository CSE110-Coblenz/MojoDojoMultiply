import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH } from "../constants";

export class RoundStatsView implements View {
  private group = new Konva.Group({ visible: false });
  private title = new Konva.Text({ x: STAGE_WIDTH/2, y: 80, text: "Round Complete!", fontSize: 44, fill: "#333" });
  private body = new Konva.Text({ x: STAGE_WIDTH/2, y: 150, text: "", fontSize: 24, fill: "#333", align: "center", lineHeight: 1.5 });

  constructor(onNext: () => void, onMenu: () => void) {
    this.title.offsetX(this.title.width()/2);
    this.group.add(this.title, this.body);

    const next = new Konva.Text({ x: STAGE_WIDTH/2 - 100, y: 470, text: "Next Round", fontSize: 28, fill: "#0a0" });
    const menu = new Konva.Text({ x: STAGE_WIDTH/2 + 60, y: 470, text: "Menu", fontSize: 28, fill: "#a50" });
    next.on("click tap", onNext);
    menu.on("click tap", onMenu);
    this.group.add(next, menu);
  }

  setRound(r: number) {
    this.title.text(`Round ${r} Complete!`);
    this.title.offsetX(this.title.width()/2);
  }

  setStats(s: { roundScore: number; correct: number; total: number; fastestMs: number | null; }) {
    const fastest = s.fastestMs == null ? "—" : `${(s.fastestMs/1000).toFixed(1)}s`;
    this.body.text(
      `Points this round: ${s.roundScore}\nCorrect: ${s.correct}/${s.total}\nFastest answer: ${fastest}`
    );
    this.body.offsetX(this.body.width()/2);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group { return this.group; }
  show(): void { this.group.visible(true); this.group.getLayer()?.draw(); }
  hide(): void { this.group.visible(false); this.group.getLayer()?.draw(); }
}