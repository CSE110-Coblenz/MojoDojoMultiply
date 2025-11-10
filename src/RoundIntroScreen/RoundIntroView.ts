import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../constants";

export class RoundIntroView implements View {
  private group = new Konva.Group({ visible: false });
  private title = new Konva.Text({
    x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 - 20,
    text: "Round 1", fontSize: 48, fontFamily: "Arial",
    fill: "yellow", stroke: "orange", strokeWidth: 2, align: "center",
  });
  private sub = new Konva.Text({
    x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 + 30,
    text: "Tap to start", fontSize: 24, fontFamily: "Arial", fill: "white",
  });

  constructor(onContinue: () => void) {
    this.title.offsetX(this.title.width() / 2);
    this.sub.offsetX(this.sub.width() / 2);
    this.group.add(this.title, this.sub);
    this.group.on("click tap", onContinue);
  }

  setRound(r: number) {
    this.title.text(`Round ${r}`);
    this.title.offsetX(this.title.width() / 2);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group { return this.group; }
  show(): void { this.group.visible(true); this.group.getLayer()?.draw(); }
  hide(): void { this.group.visible(false); this.group.getLayer()?.draw(); }
}