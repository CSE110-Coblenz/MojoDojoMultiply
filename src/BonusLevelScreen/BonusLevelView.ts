import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../constants";
import type { BonusLevelModel } from "./BonusLevelModel";

export class BonusLevelView implements View {
  private group: Konva.Group;
  private questionText: Konva.Text;
  private inputText: Konva.Text;
  private resultText: Konva.Text;

  constructor() {
    this.group = new Konva.Group({ visible: false });

    // Division Question
    this.questionText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 - 80,
      text: "0 / 0 =",
      fontSize: 48,
      fontFamily: "Arial",
      fill: "black",
    });
    this.group.add(this.questionText);

    // Player Text Input
    this.inputText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      text: "",
      fontSize: 48,
      fontFamily: "Arial",
      fill: "blue",
    });
    this.group.add(this.inputText);
    
    // Result
    this.resultText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 + 80,
      text: "",
      fontSize: 32,
      fontFamily: "Arial",
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