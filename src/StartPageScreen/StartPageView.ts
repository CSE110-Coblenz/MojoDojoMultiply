import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH } from "../constants";

/**
 * MenuScreenView - Renders the menu screen
 */
export class StartPageView implements View {
    private group: Konva.Group;

    constructor(onStartClick: () => void) {
        this.group = new Konva.Group({ visible: true });

        // Title text (part 1)
        const title1 = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 150,
            text: "Mojo Dojo",
            fontSize: 48,
            fontFamily: "Arial",
            fill: "yellow",
            stroke: "orange",
            strokeWidth: 2,
            align: "center",
        });
        // Center the text using offsetX
        title1.offsetX(title1.width() / 2);
        this.group.add(title1);

        //Want to add a "slash animation" then "Multiply" will lay on it once the slash animation finishes

        //Want to make this an animation for it to slam onto "Mojo Dojo" (lower priority)
        const title2 = new Konva.Text({
            x: STAGE_WIDTH / 2 - 10,
            y: 150,
            text: "MULTIPLY",
            fontSize: 48,
            fontFamily: "Arial",
            fill: "yellow",
            stroke: "orange",
            strokeWidth: 2,
            align: "center",
        });
        title2.offsetX(title2.width() / 2);
        this.group.add(title2);


        const startButtonGroup = new Konva.Group();
        const startButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 200,
            y: 300,
            width: 200,
            height: 60,
            fill: "yellow",
            cornerRadius: 10,
            stroke: "orange",
            strokeWidth: 3,
        });
        const startText = new Konva.Text({
            x: STAGE_WIDTH / 2 - 200,
            y: 315,
            text: "START GAME",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        startText.offsetX(startText.width() / 2);
        startButtonGroup.add(startButton);
        startButtonGroup.add(startText);
        startButtonGroup.on("click", onStartClick);
        this.group.add(startButtonGroup);

        //Help Button
        const helpButtonGroup = new Konva.Group();
        const helpButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 300,
            y: 300,
            width: 200,
            height: 60,
            fill: "yellow",
            cornerRadius: 10,
            stroke: "orange",
            strokeWidth: 3,
        });
        const helpText = new Konva.Text({
            x: STAGE_WIDTH / 2 - 300,
            y: 315,
            text: "HELP",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        helpText.offsetX(helpText.width() / 2);
        helpButtonGroup.add(helpButton);
        helpButtonGroup.add(helpText);
        helpButtonGroup.on("click", onStartClick); //Need to create a onHelpClick func, remove onStartClick later, left as spaceholder
        this.group.add(helpButtonGroup);

        //Practice Button
        const practiceButtonGroup = new Konva.Group();
        const practiceButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 400,
            y: 300,
            width: 400,
            height: 60,
            fill: "yellow",
            cornerRadius: 10,
            stroke: "orange",
            strokeWidth: 3,
        });
        const practiceText = new Konva.Text({
            x: STAGE_WIDTH / 2 - 400,
            y: 315,
            text: "PRACTICE ARENA",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        practiceText.offsetX(practiceText.width() / 2);
        practiceButtonGroup.add(practiceButton);
        practiceButtonGroup.add(practiceText);
        helpButtonGroup.on("click", onStartClick); //Need to create a onPracticeClick func, remove onStartClick later, left as spaceholder
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
