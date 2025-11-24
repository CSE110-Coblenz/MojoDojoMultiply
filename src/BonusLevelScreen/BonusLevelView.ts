import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH, STAGE_HEIGHT, GAMECST } from "../constants";
import type { BonusLevelModel } from "./BonusLevelModel";

export class BonusLevelView implements View {
  private group: Konva.Group;
  private questionText: Konva.Text;
  private inputText: Konva.Text;
  private resultText: Konva.Text;

  constructor() {
    this.group = new Konva.Group({ visible: false });

    // Add stage background
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: GAMECST.STAGE_WIDTH,
      height: GAMECST.STAGE_HEIGHT,
      fill: GAMECST.BCKGRD_COLOR
    });
    this.group.add(bg);

    // Division Question
    this.questionText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 - 80,
      text: "0 / 0 =",
      fontSize: 48,
      fontFamily: GAMECST.DEFAULT_FONT, 
      fill: GAMECST.DARK_COLOR, 
    });
    this.group.add(this.questionText);

    // Player Text Input
    this.inputText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      text: "",
      fontSize: 48,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: "blue",
    });
    this.group.add(this.inputText);
    
    // Result
    this.resultText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 + 80,
      text: "",
      fontSize: 32,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: "green",
    });
    this.group.add(this.resultText);
  }

  /**
   * Updates the view's text elements based on the model's state.
   */
  update(model: BonusLevelModel): void {
    // Update question text to use the new property names
    this.questionText.text(`${model.dividend} / ${model.divisor} =`);
    this.questionText.offsetX(this.questionText.width() / 2);

    // Update player input
    this.inputText.text(model.playerInput || "_"); // Show underscore if empty
    this.inputText.offsetX(this.inputText.width() / 2);
    
    // Update result message
    this.resultText.text(model.resultMessage);
    this.resultText.fill(model.resultMessage === "Correct!" ? "green" : "red");
    this.resultText.offsetX(this.resultText.width() / 2);

    this.group.getLayer()?.draw();
  }

  /**
   * Show view
   */
  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }
  
  /**
   * Hide View
   */
  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  /**
   * Gets group
   * @returns group
   */
  getGroup(): Konva.Group {
    return this.group;
  }
}