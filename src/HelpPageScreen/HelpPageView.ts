import Konva from "konva";
import type { View } from "../types";
import { STAGE_WIDTH } from "../constants";

/**
 * HelpPageView - Renders the help screen
 */
export class HelpPageView implements View {
    private group: Konva.Group;

    constructor(onHelpClick: () => void) {
        this.group = new Konva.Group({ visible: true });

        // Title text (part 1)
        const title1 = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 50,
            text: "HELP",
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

        /**
         * TODO: Add description on game functionality and figure out transition to help page
         */
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