import Konva from "konva";
import type { View } from "../types";
import { GAMECST } from "../constants";

type Handler = () => void;

/**
 * HelpPageView - Renders the help screen
 */
export class HelpPageView implements View {
    private group: Konva.Group;
    private startGameButtonText: Konva.Text;
    private resumeGameButtonText: Konva.Text;

    // The ? For the constructor values makes it so the value is optional, both buttons do not have to be clicked
    /** TODO: Change constructor to proper Back and Start buttons */
    constructor(
        onMenu: () => void, 
        onGame: () => void,
        onPractice: () => void
    ) {
        this.group = new Konva.Group({ visible: false });

        // Title text
        const title = new Konva.Text({
            x: 60,
            y: 40,
            text: "How to Play",
            fontSize: 48,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: GAMECST.DARK_COLOR,
        });
        this.group.add(title);

        const leftMargin = 40;
        const lineSpacing = 55;
        const startY = title.y() + title.height() + 20; //starting Y for first line
         // pixel gap in between lines

        //Editable instruction text array
        const instructions = [
            "1. Select answer to given equation.",
            "2. If wrong, opponent attacks you and if correct, you attack opponent",
            "3. Shows opponents answer (doesn't mean correct) ",
            "4. Whoever's health bar is gone first, loses!",
            "5. Earn points for each attack, loose points if hit",
            "6. Bonus round comes after every 3 rounds & adds to your final score",
            "7. In bonus round, type your answer & hit enter. You only have 30 seconds!"
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

        const helpNavigationOptions = new Konva.Group();
        this.group.add(helpNavigationOptions);

        helpNavigationOptions.position({x: 40, y: GAMECST.STAGE_HEIGHT - 100});
        

        //Start Training Button
        const buttonWidth = 220;
        const buttonHeight = 60;
        const spacing = 25;

        //Center the origin point of the Konva Group to its visual center
        //helpNavigationOptions.offsetX((buttonWidth * 3 + spacing * 2) / 2);

        //Button that allows the user to move into the training grounds from the help page
        const startTrainButton = new Konva.Group({});
        helpNavigationOptions.add(startTrainButton);

        const startTrainButtonBackground = new Konva.Rect({
            x: 0,
            y: 0,
            width: buttonWidth,
            height: buttonHeight,
            fill: GAMECST.HIGHLIGHT_COLOR,
            stroke: GAMECST.DARK_COLOR,
            strokeWidth: 4,
        });
        startTrainButton.add(startTrainButtonBackground);

        //Text telling the user what the button does
        const startTrainButtonText = new Konva.Text({
            x: startTrainButtonBackground.x() + buttonWidth / 2,
            y: startTrainButtonBackground.y() + buttonHeight / 2,
            text: "Start Training",
            fontSize: 35,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: "black",
        });
        startTrainButton.add(startTrainButtonText);
        
        startTrainButtonText.offset({ x: startTrainButtonText.width() / 2, y: startTrainButtonText.height() / 2});

        startTrainButton.on("mouseenter", () => (document.body.style.cursor = "pointer"));
        startTrainButton.on("mouseleave", () => (document.body.style.cursor = "default"));
        startTrainButton.on("click", onPractice);

        //Button that allows the user to move into the main game from the help page
        const startGameButton = new Konva.Group({});
        helpNavigationOptions.add(startGameButton);

        const startGameButtonBackground = new Konva.Rect({
            x: startTrainButton.x() + buttonWidth + spacing,
            y: 0,
            width: buttonWidth,
            height: buttonHeight,
            fill: GAMECST.HIGHLIGHT_COLOR,
            stroke: GAMECST.DARK_COLOR,
            strokeWidth: 4,
        });
        startGameButton.add(startGameButtonBackground);

        //Text telling the user what the button does
        this.startGameButtonText = new Konva.Text({
            x: startGameButtonBackground.x() + buttonWidth / 2,
            y: startGameButtonBackground.y() + buttonHeight / 2,
            text: "Start Game",
            fontSize: 35,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: "black",
        });
        startGameButton.add(this.startGameButtonText);

        //Center the origin point of the text
        this.startGameButtonText.offset({ x: this.startGameButtonText.width() / 2, y: this.startGameButtonText.height() / 2});

        //Alternative text that is shown when the user is returning to the game rather than starting it
        this.resumeGameButtonText = new Konva.Text({
            x: startGameButtonBackground.x() + buttonWidth / 2,
            y: startGameButtonBackground.y() + buttonHeight / 2,
            text: "Resume Game",
            fontSize: 35,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: "black",
            visible: false
        });
        startGameButton.add(this.resumeGameButtonText);
        
        //Center the origin point of the text
        this.resumeGameButtonText.offset({ x: this.resumeGameButtonText.width() / 2, y: this.resumeGameButtonText.height() / 2});

        startGameButton.on("mouseenter", () => (document.body.style.cursor = "pointer"));
        startGameButton.on("mouseleave", () => (document.body.style.cursor = "default"));
        startGameButton.on("click", onGame);

        //Button that allows the user to move back to the main menu from the help page
        const startPageButton = new Konva.Group({});
        helpNavigationOptions.add(startPageButton);

        const startPageButtonBackground = new Konva.Rect({
            x: startGameButtonBackground.x() + buttonWidth + spacing,
            y: 0,
            width: buttonWidth,
            height: buttonHeight,
            fill: GAMECST.HIGHLIGHT_COLOR,
            stroke: GAMECST.DARK_COLOR,
            strokeWidth: 4,
        });
        startPageButton.add(startPageButtonBackground);

        //Text telling the user what the button does
        const startPageButtonText = new Konva.Text({
            x: startPageButtonBackground.x() + buttonWidth / 2,
            y: startPageButtonBackground.y() + buttonHeight / 2,
            text: "Main Menu",
            fontSize: 35,
            fontFamily: GAMECST.DEFAULT_FONT,
            fill: "black",
        });
        startPageButton.add(startPageButtonText);
        
        startPageButtonText.offset({ x: startPageButtonText.width() / 2, y: startPageButtonText.height() / 2});

        startPageButton.on("mouseenter", () => (document.body.style.cursor = "pointer"));
        startPageButton.on("mouseleave", () => (document.body.style.cursor = "default"));
        startPageButton.on("click", onMenu);
    }

    /**
     * Shows the resume game text on the game button instead of the start game text
     * if the user is coming to the help page from the game
     */
    showReturnButtonText(): void {
        this.startGameButtonText.hide();
        this.resumeGameButtonText.show();
    }

    /**
     * Shows the resume game text on the game button instead of the start game text
     * if the user is coming to the help page from the game
     */
    showStartButtonText(): void {
        this.startGameButtonText.show();
        this.resumeGameButtonText.hide();
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