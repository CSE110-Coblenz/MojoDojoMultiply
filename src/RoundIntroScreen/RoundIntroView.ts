import Konva from "konva";
import { GAMECST } from "../constants";

export class RoundIntroView {
  private group: Konva.Group;
  private roundText: Konva.Text;
  private nextButton: Konva.Group;
  private backButton: Konva.Group;

  private background: Konva.Rect;
  private diagonalLine: Konva.Line;
  private villainBox: Konva.Group;
  private heroBox: Konva.Group;

  constructor(
    onNext: () => void,
    onBack: () => void,
    onHoverStart: () => void,
    onHoverEnd: () => void
  ) {
    const width = GAMECST.STAGE_WIDTH;
    const height = GAMECST.STAGE_HEIGHT;

    this.group = new Konva.Group({ visible: false });

    //Set up the background
    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width,
      height,
      fill: "#2e2a2aff",
      opacity: 0.9,
      stroke: GAMECST.DARK_COLOR,
      strokeWidth: 8
    });
    this.group.add(this.background);

    //Diagonal line from bottom-left to top-right
    this.diagonalLine = new Konva.Line({
      points: [
        0, height, width, 0
      ],
      stroke: GAMECST.DARK_COLOR,
      strokeWidth: 4,
    });
    this.group.add(this.diagonalLine);

    //Text that tells the user what round they are about to start
    this.roundText = new Konva.Text({
      x: width * 0.04,
      y: height * 0.04,
      fontFamily: GAMECST.DEFAULT_FONT,
      fontSize: 36,
      fill: GAMECST.DARK_COLOR,
      text: "ROUND 1",
    });
    this.group.add(this.roundText);

    //Villian area
    this.villainBox = new Konva.Group({
      x: width * 0.03,
      y: height * 0.10,
    });
    this.group.add(this.villainBox);

    const villainImgObj = new Image();

    villainImgObj.src = "/Opponent_Intro.png";
    villainImgObj.onload = () => {
      const villainImage = new Konva.Image({
        image: villainImgObj,
        width: width * 0.33,
        height: width * 0.33,  
      });
      this.villainBox.add(villainImage);
      this.group.getLayer()?.draw();
    };

    // Hero Image 
    this.heroBox = new Konva.Group({
      x: width * 0.65,
      y: height * 0.40,
    });
    this.group.add(this.heroBox);

    const heroImgObj = new Image();
    heroImgObj.src = "/Player_Intro.png";  
    heroImgObj.onload = () => {
      const heroImage = new Konva.Image({
        image: heroImgObj,
        width: width * 0.30,
        height: width * 0.30 * 1.45, 
      });
      this.heroBox.add(heroImage);
      this.group.getLayer()?.draw();
    };

    // START BUTTON (center of diagonal)
    //Button that allows the user to go the game page
     const midX = width / 2;
    const midY = height / 2;

    this.nextButton = new Konva.Group({
      x: midX,
      y: midY,
    });
    this.group.add(this.nextButton);

    const nextButtonBackground = new Konva.Rect({
      x: -100,
      y: -30,
      width: 200,
      height: 60,
      stroke: "black",
      strokeWidth: 3,
      fill: GAMECST.HIGHLIGHT_COLOR,
    });
    this.nextButton.add(nextButtonBackground);

    const nextButtonText = new Konva.Text({
      text: "Start",
      x: -100,
      y: -30,
      width: 200,
      height: 60,
      fontSize: 32,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: "black",
      align: "center",
      verticalAlign: "middle",
    });
    this.nextButton.add(nextButtonText);

    this.nextButton.on("click", onNext);
    this.nextButton.on("mouseover", () => {
      onHoverStart();
      document.body.style.cursor = "pointer";
    });
    this.nextButton.on("mouseout", () => {
      onHoverEnd();
      document.body.style.cursor = "default";
    });

    // ----- BACK button -----
    this.backButton = new Konva.Group({
      x: width * 0.04,
      y: height * 0.85,
    });
    this.group.add(this.backButton);

    const backButtonBackground = new Konva.Rect({
      x: 0,
      y: 0,
      width: 180,
      height: 50,
      stroke: "black",
      strokeWidth: 2,
      fill: GAMECST.HIGHLIGHT_COLOR,
    });
    this.backButton.add(backButtonBackground);

    const backButtonText = new Konva.Text({
      text: "Main Menu",
      x: 0,
      y: 0,
      width: 180,
      height: 50,
      fontSize: 24,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: "black",
      align: "center",
      verticalAlign: "middle",
    });
    this.backButton.add(backButtonText);

    this.backButton.on("click", onBack);
    this.backButton.on("mouseover", () => {
      onHoverStart();
      document.body.style.cursor = "pointer";
    });
    this.backButton.on("mouseout", () => {
      onHoverEnd();
      document.body.style.cursor = "default";
    });
  }

  setRound(text: string): void {
    this.roundText.text(text);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.show();
    this.group.moveToTop();
    this.group.getLayer()?.draw();
  }

  private playGong(): void {
    if (this.isMuted) return; // respect main mute button

    this.gongSound.currentTime = 0;
    this.gongSound.play().catch(() => {
      // ignore autoplay / gesture issues
    });
  }

  getGroup(): Konva.Group { return this.group; }
  show(): void { this.group.show(); this.group.getLayer()?.draw(); }
  hide(): void { this.group.hide(); this.group.getLayer()?.draw(); }
}