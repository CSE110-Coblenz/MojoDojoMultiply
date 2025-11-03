import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH , STAGE_HEIGHT } from "../constants";

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
            x: STAGE_WIDTH * 0.08,
            y: STAGE_HEIGHT * 0.12,
            text: "How to Play",
            fontSize: 48,
            fontFamily: "Arial",
            fill: "yellow",
            stroke: "orange",
            strokeWidth: 2,
            align: "left",
        });
        this.group.add(title);

        const leftMargin = STAGE_WIDTH * 0.08;
        const startY = STAGE_HEIGHT * 0.25; //starting Y for first line
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
                fontFamily: "Arial",
                fontSize: 24,
                fill: "black",
                x: leftMargin,
                y: startY + i * lineSpacing,
                align: "left",
            });
            this.group.add(t);
        })

        // Back Button
        const back = new Konva.Text({
            text: "← Back",
            fontFamily: "Arial",
            fontSize: 24,
            fill: "white",
            x: STAGE_WIDTH * 0.05,
            y: STAGE_HEIGHT * 0.05,
            listening: true,
        });
        back.on("mouseenter", () => (document.body.style.cursor = "pointer"));
        back.on("mouseleave", () => (document.body.style.cursor = "default"));
        back.on("click", () => onBack?.());
        this.group.add(back);

        //Start Training Button
        const BTN_W = 260;
        const BTN_H = 60;
        const btnRect = new Konva.Rect({
            x: STAGE_WIDTH / 2 - BTN_W / 2,
            y: STAGE_HEIGHT - 100,
            width: BTN_W,
            height: BTN_H,
            fill: "yellow",
            cornerRadius: 12,
            stroke: "orange",
            strokeWidth: 3,
        });
        const btnText = new Konva.Text({
            x: btnRect.x() + BTN_W / 2,
            y: btnRect.y() + BTN_H / 2,
            text: "Start Training",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "black",
            align: "center",
        });
        //GetClientRect gets the full x and y which includes any shadow or stoke later added, is more precise
        const { width: bW, height: bH } = btnText.getClientRect();
        btnText.offset({ x: bW / 2, y: bH / 2});

        const btnGroup = new Konva.Group({listening : true});
        btnGroup.add(btnRect, btnText);
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