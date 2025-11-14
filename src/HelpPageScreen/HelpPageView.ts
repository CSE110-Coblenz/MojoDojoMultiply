import Konva from "konva";
import type { View } from "../types";
import { GAMECST } from "../constants";

type Handler = () => void;

/**
 * HelpPageView - Renders the help screen
 */
export class HelpPageView implements View {
    private group: Konva.Group;

    // The ? For the constructor values makes it so the value is optional, both buttons do not have to be clicked
    /** TODO: Change constructor to proper Back and Start buttons */
    constructor(onBack?: Handler, onStart?: Handler) {
        this.group = new Konva.Group({ visible: false });

        // Title text
        const title = new Konva.Text({
            x: GAMECST.STAGE_WIDTH * 0.08,
            y: GAMECST.STAGE_HEIGHT * 0.12,
            text: "How to Play",
            fontSize: 48,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: GAMECST.DARK_COLOR,
        });
        this.group.add(title);

        const leftMargin = GAMECST.STAGE_WIDTH * 0.08;
        const startY = GAMECST.STAGE_HEIGHT * 0.25; //starting Y for first line
        const lineSpacing = 60; // pixel gap in between lines

        //Editable instruction text array
        const instructions = [
            "1. Select answer to given equation.",
            "2. If wrong, opponent attacks you.",
            "3. If correct, you attack opponent",
            "4. Whoever's health bar is gone first, loses!",
            "5. Earn points for each attack, loose points if hit",
        ];

        instructions.forEach((text, i) => {
            const t = new Konva.Text({
                text,
                fontFamily: GAMECST.DEFAULT_FONT,
                fontSize: 24,
                fill: "black",
                x: leftMargin,
                y: startY + i * lineSpacing,
            });
            this.group.add(t);
        })

        // // Back Button
        // const back = new Konva.Text({
        //     text: "← Back",
        //     fontFamily: "Arial",
        //     fontSize: 24,
        //     fill: "white",
        //     x: GAMECST.STAGE_WIDTH * 0.05,
        //     y: GAMECST.STAGE_HEIGHT * 0.05,
        //     listening: true,
        // });
        // back.on("mouseenter", () => (document.body.style.cursor = "pointer"));
        // back.on("mouseleave", () => (document.body.style.cursor = "default"));
        // back.on("click", () => onBack?.());
        // this.group.add(back);

        //Start Training Button
        const buttonWidth = 260;
        const buttonHeight = 60;

        //Button that allows the user to move into the training grounds from the help page
        const startTrainButton = new Konva.Group({});
        this.group.add(startTrainButton);

        const startTrainButtonBackground = new Konva.Rect({
            x: GAMECST.STAGE_WIDTH / 2,
            y: GAMECST.STAGE_HEIGHT - 100,
            width: buttonWidth,
            height: buttonHeight,
            fill: GAMECST.HIGHLIGHT_COLOR,
            stroke: GAMECST.DARK_COLOR,
            strokeWidth: 4,
        });
        startTrainButton.add(startTrainButtonBackground);

        //Offset the origin point to the middle of the button
        startTrainButton.offsetX(startTrainButtonBackground.width() / 2);

        //Text telling the user what the button does
        const btnText = new Konva.Text({
            x: startTrainButtonBackground.x() + buttonWidth / 2,
            y: startTrainButtonBackground.y() + buttonHeight / 2,
            text: "Start Game",
            fontSize: 24,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: "black",
        });
        
        //GetClientRect gets the full x and y which includes any shadow or stoke later added, is more precise
        const { width: bW, height: bH } = btnText.getClientRect();
        btnText.offset({ x: bW / 2, y: bH / 2});

        const btnGroup = new Konva.Group({listening : true});
        btnGroup.on("mouseenter", () => (document.body.style.cursor = "pointer"));
        btnGroup.on("mouseleave", () => (document.body.style.cursor = "default"));
        btnGroup.on("click", () => onStart?.());
        this.group.add(btnGroup);
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