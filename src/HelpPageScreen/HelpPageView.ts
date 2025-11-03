import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH , STAGE_HEIGHT } from "../constants";

type Handler = () => void;

/**
 * HelpPageView - Renders the help screen
 */
export class HelpPageView implements View {
  private group: Konva.Group;
  private backButton: Konva.Text;

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

    //Creates back button
    this.backButton = new Konva.Text({
      x: 30,
      y: 30,
      text: "< Back to Start",
      fontSize: 24,
      fontFamily: "Arial",
      fill: "blue",
      padding: 10,
    });

    //Adds hover
    this.backButton.on('mouseenter', () => {
      const stage = this.group.getStage();
      if (stage) stage.container().style.cursor = 'pointer';
      this.backButton.fill('darkblue');
      this.group.getLayer()?.draw();
    });

    this.backButton.on('mouseleave', () => {
      const stage = this.group.getStage();
      if (stage) stage.container().style.cursor = 'default';
      this.backButton.fill('blue');
      this.group.getLayer()?.draw();
    });

    this.group.add(this.backButton);
  }

  show(): void { this.group.visible(true); this.group.getLayer()?.draw(); }
  hide(): void { this.group.visible(false); this.group.getLayer()?.draw(); }
  getGroup(): Konva.Group { return this.group; }

  public getBackButton(): Konva.Text {
    return this.backButton;
  }
}