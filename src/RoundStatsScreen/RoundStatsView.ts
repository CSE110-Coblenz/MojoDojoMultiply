// placeholder page displaying stats of previous round
import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../constants";

export class RoundStatsView {
  private group: Konva.Group;
  private title: Konva.Text;
  private nextBtn: Konva.Rect;
  private nextLabel: Konva.Text;

  constructor(onNext: () => void) {
    this.group = new Konva.Group({ visible: false });

    // simple backdrop so you always see something
    const backdrop = new Konva.Rect({
      x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT,
      fill: "#f6f6f6"
    });
    this.group.add(backdrop);

    this.title = new Konva.Text({
      text: "Round Complete!",
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 - 80,
      fontSize: 42,
      fontFamily: "Arial",
      fill: "#222",
    });
    this.title.offsetX(this.title.width() / 2);
    this.group.add(this.title);

    this.nextBtn = new Konva.Rect({
      x: STAGE_WIDTH / 2 - 120,
      y: STAGE_HEIGHT / 2,
      width: 240,
      height: 56,
      fill: "#ddd",
      stroke: "#666",
      strokeWidth: 3,
      cornerRadius: 8,
    });
    this.group.add(this.nextBtn);

    this.nextLabel = new Konva.Text({
      text: "Next Round",
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 + 14,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#333",
    });
    this.nextLabel.offsetX(this.nextLabel.width() / 2);
    this.group.add(this.nextLabel);

    // click behavior
    this.nextBtn.on("click", onNext);
    this.nextLabel.on("click", onNext);
  }

  setTitle(text: string): void {
    this.title.text(text);
    this.title.offsetX(this.title.width() / 2);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group { return this.group; }
  show(): void { this.group.visible(true); this.group.getLayer()?.draw(); }
  hide(): void { this.group.visible(false); this.group.getLayer()?.draw(); }
}