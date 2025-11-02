import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../constants";

export class HelpPageView implements View {
  private group: Konva.Group;

  constructor() {
    this.group = new Konva.Group({ visible: false });

    const text = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      text: "HELP PAGE",
      fontSize: 48,
      fontFamily: "Arial",
      fill: "black",
    });
    text.offsetX(text.width() / 2);
    text.offsetY(text.height() / 2);
    this.group.add(text);
  }

  show(): void { this.group.visible(true); this.group.getLayer()?.draw(); }
  hide(): void { this.group.visible(false); this.group.getLayer()?.draw(); }
  getGroup(): Konva.Group { return this.group; }
}