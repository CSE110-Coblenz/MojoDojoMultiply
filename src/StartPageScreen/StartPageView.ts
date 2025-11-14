import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH } from "../constants";
import { GAMECST } from "../constants.js"

/**
 * StartPageView - Renders the main screen
 */
export class StartPageView implements View {
    private group: Konva.Group;

    constructor(
        onStartClick: () => void,
        onHelpClick: () => void,
        onPracticeClick: () => void,
        onHoverStart: () => void,
        onHoverEnd: () => void
    ) {
        this.group = new Konva.Group({ visible: true });

        // Title text (part 1)
        const title1 = new Konva.Text({
            x: STAGE_WIDTH / 2 + 110,
			y: 80,
            text: "Mojo Dojo",
            fontSize: 100,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: 'black',
        });
        // Center the text using offsetX
        title1.offsetX(title1.width() / 2);
		this.group.add(title1);

        //Want to add a "slash animation" then "Multiply" will lay on it once the slash animation finishes

        //Want to make this an animation for it to slam onto "Mojo Dojo" (lower priority)
        const title2 = new Konva.Text({
            x: STAGE_WIDTH / 2 ,
            y: title1.y() + title1.height() - 40,
            text: "MULTIPLY",
            fontSize: 180,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: GAMECST.HIGHLIGHT_COLOR,
        });
        title2.offsetX(title2.width() / 2);
        this.group.add(title2);

        const buttonHeight = 60;
        const buttonWidth = 250;
        const buttonSpacing = 20;


        const startButtonGroup = new Konva.Group();

        const startButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 ,
            y: 330,
            width: buttonWidth,
            height: buttonHeight,
            fill: GAMECST.HIGHLIGHT_COLOR,
            stroke: 'black',
            strokeWidth: 4,
        });
        startButton.offsetX(startButton.width() / 2);

        const startText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: startButton.y() + startButton.height() / 2,
            text: "START GAME",
            fontSize: 35,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: "black",
            align: "center",
        });
        startText.offsetX(startText.width() / 2);
        startText.offsetY(startText.height() / 2)
        startButtonGroup.add(startButton);
        startButtonGroup.add(startText);
        startButtonGroup.on("click", onStartClick);
        startButtonGroup.on("mouseover", onHoverStart);
        startButtonGroup.on("mouseout", onHoverEnd);
        this.group.add(startButtonGroup);

        //Help Button
        const helpButtonGroup = new Konva.Group();
        const helpButton = new Konva.Rect({
            x: STAGE_WIDTH / 2,
            y: startButton.y() + startButton.height() + buttonSpacing,
            width: buttonWidth,
            height: buttonHeight,         
            fill: GAMECST.HIGHLIGHT_COLOR,
            stroke: "black",
            strokeWidth: 4,
        });
        helpButton.offsetX(helpButton.width() / 2)

        const helpText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: helpButton.y() + helpButton.height() / 2,
            text: "HELP",
            fontSize: 35,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: "black",
            align: "center",
        });
        helpText.offsetX(helpText.width() / 2);
        helpText.offsetY(helpText.height() / 2);
        helpButtonGroup.add(helpButton);
        helpButtonGroup.add(helpText);
        helpButtonGroup.on("click", onHelpClick); 
        helpButtonGroup.on("mouseover", onHoverStart);
        helpButtonGroup.on("mouseout", onHoverEnd);
        this.group.add(helpButtonGroup);

        //Practice Button
        const practiceButtonGroup = new Konva.Group();
        const practiceButton = new Konva.Rect({
            x: STAGE_WIDTH / 2,
            y: helpButton.y() + startButton.height() + buttonSpacing,
            width: buttonWidth,
            height: buttonHeight,
            fill: GAMECST.HIGHLIGHT_COLOR,
            stroke: "black",
            strokeWidth: 4,
        });
        practiceButton.offsetX(practiceButton.width() / 2);

        const practiceText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: practiceButton.y() + practiceButton.height() / 2,
            text: "PRACTICE ARENA",
            fontSize: 35,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: "black",
            align: "center",
        });
        practiceText.offsetX(practiceText.width() / 2);
        practiceText.offsetY(practiceText.height() / 2)
        practiceButtonGroup.add(practiceButton);
        practiceButtonGroup.add(practiceText);
        practiceButtonGroup.on("click", onPracticeClick); 
        practiceButtonGroup.on("mouseover", onHoverStart);
        practiceButtonGroup.on("mouseout", onHoverEnd);
        this.group.add(practiceButtonGroup);
    }

    /**
     * Show the screen
     */
    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
    }

    /**
     * Hide the screen
     */
    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
    }

    getGroup(): Konva.Group {
        return this.group;
    }
}