import Konva from "konva";
import { GAMECST } from "../constants";

export class RoundIntroView {
  private group: Konva.Group;
  private roundText: Konva.Text;
  private nextButton: Konva.Group;
  private backButton: Konva.Group;

  constructor(
    onNext: () => void,
    onBack: () => void,
    getRound: () => string,
    onHoverStart: () => void,
    onHoverEnd: () => void
  ) {
    this.group = new Konva.Group({ visible: false });

    this.roundText = new Konva.Text({
      x: GAMECST.STAGE_WIDTH / 2,
      y: GAMECST.STAGE_HEIGHT / 3,
      fontFamily: GAMECST.DEFAULT_FONT,
      fontSize: 80,
      fill: "black",
    });
    this.group.add(this.roundText);
    this.roundText.offsetX(this.roundText.width() / 2);

    this.nextButton = new Konva.Group({});
    this.group.add(this.nextButton);

    const nextButtonBackground = new Konva.Rect({
      x: GAMECST.STAGE_WIDTH / 2,
      y: GAMECST.STAGE_HEIGHT * 2 / 3,
      width: 200,
      height: 60,
      stroke: "black",
      strokeWidth: 4,
      fill: GAMECST.HIGHLIGHT_COLOR
    });
    this.nextButton.add(nextButtonBackground);

    nextButtonBackground.offsetX(nextButtonBackground.width() / 2);
    nextButtonBackground.offsetY(nextButtonBackground.height() / 2);

    const nextButtonText = new Konva.Text({
      text: "Start!",
      x: nextButtonBackground.x(),
      y: nextButtonBackground.y(),
      fontSize: 36,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: "black",
    });
    this.nextButton.add(nextButtonText);
    
    nextButtonText.offsetX(nextButtonText.width() / 2);
    nextButtonText.offsetY(nextButtonText.height() / 2);

    this.nextButton.on("click", onNext);
    this.nextButton.on("mouseover", onHoverStart);
    this.nextButton.on("mouseout", onHoverEnd);

    this.backButton = new Konva.Group({});
    this.group.add(this.backButton);

    const backButtonBackground = new Konva.Rect({
      x: GAMECST.STAGE_WIDTH / 2,
      y: nextButtonBackground.x() + nextButtonBackground.height() + 20,
      width: 200,
      height: 60,
      stroke: "black",
      strokeWidth: 4,
      fill: GAMECST.HIGHLIGHT_COLOR
    });
    this.backButton.add(backButtonBackground);

    backButtonBackground.offsetX(backButtonBackground.width() / 2);
    backButtonBackground.offsetY(backButtonBackground.height() / 2);

    const backButtonText = new Konva.Text({
      text: "Main Menu",
      x: backButtonBackground.x(),
      y: backButtonBackground.y(),
      fontSize: 36,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: "black",
    });
    this.backButton.add(backButtonText);
    
    backButtonText.offsetX(backButtonText.width() / 2);
    backButtonText.offsetY(backButtonText.height() / 2);

    this.backButton.on("click", onBack);
    this.backButton.on("mouseover", onHoverStart);
    this.backButton.on("mouseout", onHoverEnd);

  }

  setRound(text: string): void {
    this.roundText.text(text);
    this.roundText.offsetX(this.roundText.width() / 2);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group { return this.group; }
  show(): void { this.group.show(); this.group.getLayer()?.draw(); }
  hide(): void { this.group.hide(); this.group.getLayer()?.draw(); }
}