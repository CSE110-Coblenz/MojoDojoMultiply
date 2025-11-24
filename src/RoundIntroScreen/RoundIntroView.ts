import Konva from "konva";
import { GAMECST } from "../constants";
import { AnimatedSprite } from "../AnimatedSprites"

export class RoundIntroView {
  private group: Konva.Group;
  private roundText: Konva.Text;
  private nextButton: Konva.Group;
  private backButton: Konva.Group;

  /** Animated Sprites */
    private playerIdleSprite?: AnimatedSprite;
    private opponentIdleSprite?: AnimatedSprite;

  constructor(
    onNext: () => void,
    onBack: () => void,
    onHoverStart: () => void,
    onHoverEnd: () => void
  ) {

    this.group = new Konva.Group({ visible: false });

    const fightingStage = new Konva.Group();
      fightingStage.position({ x: 120, y: 160 });
      this.group.add(fightingStage); 

    const playerGroup = new Konva.Group({
          x: 80,
          y: GAMECST.STAGE_HEIGHT / 3,
        });
        fightingStage.add(playerGroup);
    
    const opponentGroup = new Konva.Group({
      x: 300,
      y: GAMECST.STAGE_HEIGHT / 3,
    });
    fightingStage.add(opponentGroup);

    /** Animated Sprites */
    // Player Idle
    const playerIdleImg = new Image();
    playerIdleImg.src = "/player_roundIntro.png"; 

    playerIdleImg.onload = () => {
      const animLayer = this.group.getLayer() as Konva.Layer | null;
      if (!animLayer) {
        console.warn("MainPageView: no layer found for playerIdleSprite");
        return;
      }
      this.playerIdleSprite = new AnimatedSprite(animLayer, {
        image: playerIdleImg,
        frameWidth: 128,   
        frameHeight: 128,  
        frameCount: 6,     
        frameRate: 8,
        loop: true,
        x: playerGroup.x() + 130,
        y: playerGroup.y() - 475,
        scale: 3.85,        
      });
      playerGroup.add(this.playerIdleSprite.node);
      this.playerIdleSprite.play();
      this.group.getLayer()?.draw();
    };

    // Opponent idle
    const opponentIdleImg = new Image();
    opponentIdleImg.src = "/opponent_idle.png"; 

    opponentIdleImg.onload = () => {
      const animLayer = this.group.getLayer() as Konva.Layer | null;
      if (!animLayer) {
        console.warn("MainPageView: no layer found for opponentIdleSprite");
        return;
      }
      this.opponentIdleSprite = new AnimatedSprite(animLayer, {
        image: opponentIdleImg,
        frameWidth: 128,   
        frameHeight: 128,  
        frameCount: 8,     
        frameRate: 6,
        loop: true,
        x: opponentGroup.x() - 850,
        y: opponentGroup.y() - 510,
        scale: 4.10,
      });
      opponentGroup.add(this.opponentIdleSprite.node);
      this.opponentIdleSprite.play();
      this.group.getLayer()?.draw();
    };

    //Text that tells the user what round they are about to start
    this.roundText = new Konva.Text({
      x: GAMECST.STAGE_WIDTH / 2,
      y: GAMECST.STAGE_HEIGHT / 3,
      fontFamily: GAMECST.DEFAULT_FONT,
      fontSize: 80,
      fill: "black",
    });
    this.group.add(this.roundText);
    //Centers the origin of the button
    this.roundText.offsetX(this.roundText.width() / 2);

    //Button that allows the user to go the game page
    this.nextButton = new Konva.Group({});
    this.group.add(this.nextButton);

    //Background for the game page button
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

    //Centers the origin point of the button
    nextButtonBackground.offsetX(nextButtonBackground.width() / 2);
    nextButtonBackground.offsetY(nextButtonBackground.height() / 2);

    //Text that tells the user what the game page button does
    const nextButtonText = new Konva.Text({
      text: "Start!",
      x: nextButtonBackground.x(),
      y: nextButtonBackground.y(),
      fontSize: 36,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: "black",
    });
    this.nextButton.add(nextButtonText);

    //Centers the origin of the button
    nextButtonText.offsetX(nextButtonText.width() / 2);
    nextButtonText.offsetY(nextButtonText.height() / 2);

    //Adds click and hover functionalities to the game button
    this.nextButton.on("click tap", () => {
      onNext();
    });
    this.nextButton.on("mouseover", onHoverStart);
    this.nextButton.on("mouseout", onHoverEnd);

    //Button that allows the user to return to the start page
    this.backButton = new Konva.Group({});
    this.group.add(this.backButton);

    //Background and touch target for the start page button
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

    //Centers the origin of the button
    backButtonBackground.offsetX(backButtonBackground.width() / 2);
    backButtonBackground.offsetY(backButtonBackground.height() / 2);

    //Text that tells the user what the start page button does
    const backButtonText = new Konva.Text({
      text: "Main Menu",
      x: backButtonBackground.x(),
      y: backButtonBackground.y(),
      fontSize: 36,
      fontFamily: GAMECST.DEFAULT_FONT,
      fill: "black",
    });
    this.backButton.add(backButtonText);

    //Centers the origin of the button
    backButtonText.offsetX(backButtonText.width() / 2);
    backButtonText.offsetY(backButtonText.height() / 2);

    //Adds hover and click functionality to the start page button
    this.backButton.on("click", onBack);
    this.backButton.on("mouseover", onHoverStart);
    this.backButton.on("mouseout", onHoverEnd);

  }

  /**
   * Changes the round text to reflect what round the user is about to start
   * 
   * @param text 
  */
  setRound(text: string): void {
    this.roundText.text(text);
    this.roundText.offsetX(this.roundText.width() / 2);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group { return this.group; }
  show(): void { this.group.show(); this.group.getLayer()?.draw(); }
  hide(): void { this.group.hide(); this.group.getLayer()?.draw(); }
}