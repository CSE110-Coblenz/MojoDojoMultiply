import Konva from "konva";
import type { View } from "../types.js";
import { GAMECST } from "../constants.js";

/**
 * MainPageView - Renders the main game screen
 */
export class MainPageView implements View {
	private group: Konva.Group;
    // Konva.Image placeholders for timer digits (minute, tens, ones)
    private readonly timerImageNodes: Konva.Image[] = [];
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
	private questionText: Konva.Text;
	private answerTexts: Konva.Text[];
	private playerHealthBar: Konva.Rect;
	private opponentHealthBar: Konva.Rect;
	// Konva image for the player's avatar
	private playerAvatar?: Konva.Image;
	// Konva image for the opponent's avatar
	private opponentAvatar?: Konva.Image;

	
	// constructor for the interface Main page interface
	constructor(
		onAnswerClick: (answer: number) => void,
		onAnswerHoverStart: () => void,
		onAnswerHoverEnd: () => void
	) {
		this.group = new Konva.Group({ visible: false });

        const text = new Konva.Text({
            x: GAMECST.STAGE_WIDTH / 2,
            y: GAMECST.STAGE_HEIGHT / 2,
            text: "MAIN GAME",
            fontSize: 100
        });
        text.offsetX(text.width() / 2);
        text.offsetY(text.height() / 2);
        this.group.add(text);

        // Create 3 Konva.Image placeholders for timer (no image/source set here).
        // Positions and sizes can be adjusted later by layout code.
        for (let i = 0; i < 3; i++) {
            // create an empty HTMLImageElement as placeholder (src will be set later by model/controller)
            const placeholder = new Image();
            const img = new Konva.Image({ image: placeholder as unknown as CanvasImageSource, x: 10 + i * 40, y: 10, width: 32, height: 48, listening: false });
            this.timerImageNodes.push(img);
            this.group.add(img);
        }

		//Stage background for Konva Group
		const bg = new Konva.Rect({
			x: 0,
			y: 0,
			width: GAMECST.STAGE_WIDTH,
			height: GAMECST.STAGE_HEIGHT,
			fill: "#FFFFC5"
		});
		this.group.add(bg);

		// Score display (bottom-center). origin will be set to the center so
		// the text remains centered as its content changes.
		this.scoreText = new Konva.Text({
			x: GAMECST.STAGE_WIDTH - 100,
			y: 30,
			text: "Score: 0",
			fontSize: 32,
			fontFamily: GAMECST.DEFAULT_FONT,
			fill: "black",
		});
		// make origin the visual center
		this.scoreText.offsetY(this.scoreText.height() / 2);
		this.group.add(this.scoreText);


		//Health bar that visualizes the health of the player's character
		const playerHealthGroup = new Konva.Group();
		this.group.add(playerHealthGroup);
		const healthBarWidth = 150;

		const playerBarBacking = new Konva.Rect({
			x: 80,
			y: GAMECST.STAGE_HEIGHT * 2 / 3,
			width: healthBarWidth,
			height: 40,
			stroke: 'black',
			strokeWidth: 4,
			fill: 'grey'
		});
		playerHealthGroup.add(playerBarBacking);

		this.playerHealthBar = new Konva.Rect({
			x: playerBarBacking.x() + 2,
			y: playerBarBacking.y() + 2,
			width: healthBarWidth - 4,
			height: 36,
			strokeEnabled: false,
			fill: GAMECST.ALERT_COLOR
		});
		playerHealthGroup.add(this.playerHealthBar);

		//Health bar that visualizes the health of the opponent's character
		const opponentHealthGroup = new Konva.Group();
		this.group.add(opponentHealthGroup);

		const opponentBarBacking = new Konva.Rect({
			x: 300,
			y: playerBarBacking.y(),
			width: healthBarWidth,
			height: 40,
			stroke: 'black',
			strokeWidth: 4,
			fill: 'grey'
		});
		opponentHealthGroup.add(opponentBarBacking);

		this.opponentHealthBar = new Konva.Rect({
			x: opponentBarBacking.x() + 2,
			y: opponentBarBacking.y() + 2,
			width: healthBarWidth - 4,
			height: 36,
			strokeEnabled: false,
			fill: GAMECST.ALERT_COLOR
		});
		opponentHealthGroup.add(this.opponentHealthBar);

		// Initialize health bars to full
		this.updateHealthBars(1, 1);

		const fightingStage = new Konva.Group();
		this.group.add(fightingStage);

		// load boxer image and store it on the instance so other code can access it
		Konva.Image.fromURL('/boxer.png', (image) => {
			// keep a reference to the Konva.Image node
			this.playerAvatar = image;

			// set desired scale and position (adjust values as needed)
			image.scale({ x: 0.3, y: 0.3 });
			image.position({ x: 80, y: GAMECST.STAGE_HEIGHT / 3});

			// add to the fighting stage group
			fightingStage.add(image);
		});

		// load boxer image and store it on the instance so other code can access it
		Konva.Image.fromURL('/boxer2.png', (image) => {
			// keep a reference to the Konva.Image node
			this.opponentAvatar = image;

			// set desired scale and position (adjust values as needed)
			image.scale({ x: 0.3, y: 0.3 });
			image.position({ x: 300, y: GAMECST.STAGE_HEIGHT / 3 });

			// add to the fighting stage group
			fightingStage.add(image);
		});



		// Create four answer squares in a 2x2 grid pattern in the center of the screen
		const squareSize = 80;
		const spacing = 20;
		const totalWidth = (squareSize * 2) + spacing;
		// initial empty values; controller will populate the first question
		const allAnswers: (string | number)[] = ["", "", "", ""];
		
		// Group that holds the question block and all the answer choices.
		// We'll position this group on the right third of the stage and vertically
		// All children coordinates will be relative to the group's origin
		const gameQuestAnsGroup = new Konva.Group();

		//Set the position of the entire group
		gameQuestAnsGroup.position({ x: GAMECST.STAGE_WIDTH * 2 / 3, y: GAMECST.STAGE_HEIGHT / 4, });
		this.group.add(gameQuestAnsGroup);

		//Group that holds the question text and the question box
		const questionGroup = new Konva.Group();
		gameQuestAnsGroup.add(questionGroup);

		// Timer display (top-right)
		this.timerText = new Konva.Text({
			x: totalWidth / 2,
			y: 0,
			text: "Time: 60",
			fontSize: 32,
			fontFamily: GAMECST.DEFAULT_FONT,
			fill: GAMECST.ALERT_COLOR,
		});
		this.timerText.offsetX(this.timerText.width() / 2);
		gameQuestAnsGroup.add(this.timerText);
		
		// The question box sits at the top of the group's local coords
		const questionBox = new Konva.Rect({
			x: 0,
			y: this.timerText.y() + this.timerText.height() + spacing,
			width: totalWidth,
			height: squareSize,
			fill: GAMECST.HIGHLIGHT_COLOR,
			stroke: 'black',
			strokeWidth: 4
		});
		questionGroup.add(questionBox);

		// Answer 1 (top-left)
		const answer1Group = new Konva.Group();
		gameQuestAnsGroup.add(answer1Group);

		// The box that serves as the background and touch target of answer 1
		const answer1Box = new Konva.Rect({
			x: 0,
			y: questionBox.y() + questionBox.height() + spacing,
			width: squareSize,
			height: squareSize,
			fill: GAMECST.HIGHLIGHT_COLOR,
			stroke: 'black',
			strokeWidth: 4
		});
		answer1Group.add(answer1Box);

		// Answer 2 (top-right)
		const answer2Group = new Konva.Group();
		gameQuestAnsGroup.add(answer2Group);

		const answer2Box = new Konva.Rect({
			x: answer1Box.x() + answer1Box.width() + spacing,
			y: questionBox.y() + questionBox.height() + spacing,
			width: squareSize,
			height: squareSize,
			fill: GAMECST.HIGHLIGHT_COLOR,
			stroke: 'black',
			strokeWidth: 4
		});
		answer2Group.add(answer2Box);
		
		// Answer 3 (bottom-left)
		const answer3Group = new Konva.Group();
		gameQuestAnsGroup.add(answer3Group);

		const answer3Box = new Konva.Rect({
			x: 0,
			y: answer1Box.y() + answer1Box.height() + spacing,
			width: squareSize,
			height: squareSize,
			fill: GAMECST.HIGHLIGHT_COLOR,
			stroke: 'black',
			strokeWidth: 4
		});
		answer3Group.add(answer3Box);

		// Answer 4 (bottom-right)
		const answer4Group = new Konva.Group();
		gameQuestAnsGroup.add(answer4Group);

		const answer4Box = new Konva.Rect({
			x: answer3Box.x() + answer3Box.width() + spacing,
			y: answer2Box.y() + answer2Box.height() + spacing,
			width: squareSize,
			height: squareSize,
			fill: GAMECST.HIGHLIGHT_COLOR,
			stroke: 'black',
			strokeWidth: 4
		});
		answer4Group.add(answer4Box);

		this.questionText = new Konva.Text({
			x: questionBox.x() + questionBox.width() / 2,
			y: questionBox.y() + questionBox.height() / 2,
			text: ``,
			fontSize: 30,
			fontFamily: GAMECST.DEFAULT_FONT,
			fill: 'Black'
		});
		// Center the question text within its box
		questionGroup.add(this.questionText);
		

		this.answerTexts = [
			new Konva.Text({
				x: answer1Box.x() + answer1Box.width() / 2,
				y: answer1Box.y() + answer1Box.height() / 2,
				text: `${allAnswers[0]}`,
				fontSize: 30,
				fontFamily: GAMECST.DEFAULT_FONT,
				fill: 'Black'
			}),
			new Konva.Text({
				x: answer2Box.x() + answer2Box.width() / 2,
				y: answer2Box.y() + answer2Box.height() / 2,
				text: `${allAnswers[1]}`,
				fontSize: 30,
				fontFamily: GAMECST.DEFAULT_FONT,
				fill: 'Black'
			}),
			new Konva.Text({
				x: answer3Box.x() + answer3Box.width() / 2,
				y: answer3Box.y() + answer3Box.height() / 2,
				text: `${allAnswers[2]}`,
				fontSize: 30,
				fontFamily: GAMECST.DEFAULT_FONT,
				fill: 'Black'
			}),
			new Konva.Text({
				x: answer4Box.x() + answer4Box.width() / 2,
				y: answer4Box.y() + answer4Box.height() / 2,
				text: `${allAnswers[3]}`,
				fontSize: 30,
				fontFamily: GAMECST.DEFAULT_FONT,
				fill: 'Black'
			})
		
		];
	
	

		// Attach click/hover handlers now that answerTexts exist
		answer1Group.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[0].text())));
		answer1Group.on('mouseover', onAnswerHoverStart);
		answer1Group.on('mouseout', onAnswerHoverEnd);

		answer2Group.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[1].text())));
		answer2Group.on('mouseover', onAnswerHoverStart);
		answer2Group.on('mouseout', onAnswerHoverEnd);

		answer3Group.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[2].text())));
		answer3Group.on('mouseover', onAnswerHoverStart);
		answer3Group.on('mouseout', onAnswerHoverEnd);

		answer4Group.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[3].text())));
		answer4Group.on('mouseover', onAnswerHoverStart);
		answer4Group.on('mouseout', onAnswerHoverEnd);

		[answer1Group, answer2Group, answer3Group, answer4Group].forEach((g, i) =>
			g.add(this.answerTexts[i])
		);
	}

	/**
	 * Internal method to update score text
	 */
	setScoreText(scoreText: string): void {
		this.scoreText.text(scoreText);
		// update origin so the text remains centered as width/height change
		this.scoreText.offsetX(this.scoreText.width() / 2);
		this.scoreText.offsetY(this.scoreText.height() / 2);
		// keep positioned at bottom-center
		// this.scoreText.position({ x: GAMECST.STAGE_WIDTH / 2, y: GAMECST.STAGE_HEIGHT - 30 });
		this.group.getLayer()?.draw();
	}

	/**
	 * Internal method to update timer text
	 */
	setTimerText(timerText: string): void {
		this.timerText.text(timerText);
		this.group.getLayer()?.draw();
	}

	/**
	 * Internal method to update question display
	 */
	setQuestionDisplay(questionText: string, answers: (string | number)[]): void {
		this.questionText.text(questionText);
		// Recenter the question text after changing it
		this.questionText.offsetX(this.questionText.width() / 2);
		this.questionText.offsetY(this.questionText.height() / 2)
		
		this.answerTexts.forEach((text, index) => {
			text.text(`${answers[index] ?? ""}`);
			text.offsetX(text.width() / 2);
			text.offsetY(text.height() / 2);
		});
		this.group.getLayer()?.draw();
	}


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

    /**
     * Expose the Konva image nodes so controller/model can set their image sources.
     * The view intentionally does not contain timing logic or DOM elements.
     */
    getTimerImageNodes(): Konva.Image[] {
        return this.timerImageNodes;
    }

    /**
     * Update the health bars with new percentage values
	 * @param playerHealthPercent The percentage of health for the player (0-1)
	 * @param opponentHealthPercent The percentage of health for the opponent (0-1)
	 * @returns void
     */
    updateHealthBars(playerHealthPercent: number, opponentHealthPercent: number): void {
        const healthBarWidth = 150;
        this.playerHealthBar.width((healthBarWidth - 4) * playerHealthPercent);
        this.opponentHealthBar.width((healthBarWidth - 4) * opponentHealthPercent);
        this.group.getLayer()?.draw();
    }
}