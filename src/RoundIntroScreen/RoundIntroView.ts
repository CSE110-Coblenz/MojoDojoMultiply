import Konva from "konva";

export class RoundIntroView {
  private group: Konva.Group;
  private roundText: Konva.Text;
  private nextButton: Konva.Text;

  constructor(onNext: () => void) {
    this.group = new Konva.Group({ visible: false });

    this.roundText = new Konva.Text({
      //TODO: implement displaying saved round info from GameState
      text: "Round 1",
      x: 200,
      y: 150,
      fontSize: 48,
      fill: "black",
    });

    this.nextButton = new Konva.Text({
      text: "Start!",
      x: 250,
      y: 250,
      fontSize: 36,
      fill: "blue",
    });

    this.nextButton.on("click", onNext);

    this.group.add(this.roundText);
    this.group.add(this.nextButton);
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