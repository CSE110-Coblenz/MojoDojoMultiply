import Konva from "konva";
import type { View } from "../types.js";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../constants.js";

/**
 * MainPageView - Renders the main game screen
 */
export class MainPageView implements View {
    private group: Konva.Group;
    // Konva.Image placeholders for timer digits (minute, tens, ones)
    private readonly timerImageNodes: Konva.Image[] = [];
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
	private questionText: Konva.Text;
	private answerTexts: Konva.Text[];
	private correctAnswer: number;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// later change to constructor(onStartClick: () => void) {
	constructor(
		onAnswerClick: (answer: number) => void,
		onAnswerHoverStart: () => void,
		onAnswerHoverEnd: () => void
	) {
		this.group = new Konva.Group({ visible: false });

        const text = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: STAGE_HEIGHT / 2,
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
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#87CEEB"
		});
		this.group.add(bg);

		const roundAnswerOptions = new Konva.Group();

		const sectionPlatter = new Konva.Rect({
			x: 10,
			y: 10,
			width: 200,
			height: 100,
			fill: "#c5c6c7"
		})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// Score display (top-left)
		this.scoreText = new Konva.Text({
			x: 20,
			y: 20,
			text: "Score: 0",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "black",
		});
		this.group.add(this.scoreText);

		// Timer display (top-right)
		this.timerText = new Konva.Text({
			x: STAGE_WIDTH - 150,
			y: 20,
			text: "Time: 60",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "red",
		});
		this.group.add(this.timerText);

		// Create four answer squares in a 2x2 grid pattern in the center of the screen
		const squareSize = 80;
		const spacing = 20;
		const totalWidth = (squareSize * 2) + spacing;
		const totalHeight = (squareSize * 2) + spacing;
		const startX = (STAGE_WIDTH - totalWidth) / 2;
		const startY = (STAGE_HEIGHT - totalHeight) / 2;
		// initial empty values; controller will populate the first question
		this.correctAnswer = 0;
		const allAnswers: (string | number)[] = ["", "", "", ""];

		//This is the question box
		const question = new Konva.Rect({
			x: startX,
			y: startY - spacing * 5,
			width: squareSize * 2 + spacing,
			height: squareSize,
			fill: 'green',
			stroke: 'black',
			strokeWidth: 4
		});
		this.group.add(question);

		//This is the answer 1 box
		const answer1 = new Konva.Rect({
			x: startX,
			y: startY,
			width: squareSize,
			height: squareSize,
			fill: 'green',
			stroke: 'black',
			strokeWidth: 4
		});
		this.group.add(answer1);

		//This is the answer 2 box
		const answer2 = new Konva.Rect({
			x: startX + squareSize + spacing,
			y: startY,
			width: squareSize,
			height: squareSize,
			fill: 'green',
			stroke: 'black',
			strokeWidth: 4
		});
		this.group.add(answer2);

		const answer3 = new Konva.Rect({
			x: startX,
			y: startY + squareSize + spacing,
			width: squareSize,
			height: squareSize,
			fill: 'green',
			stroke: 'black',
			strokeWidth: 4
		});
		this.group.add(answer3);

		const answer4 = new Konva.Rect({
			x: startX + squareSize + spacing,
			y: startY + squareSize + spacing,
			width: squareSize,
			height: squareSize,
			fill: 'green',
			stroke: 'black',
			strokeWidth: 4
		});
		this.group.add(answer4);

		this.questionText = new Konva.Text({
			x: question.x() + 25,
			y: question.y() + 25,
			text: ``,
			fontSize: 30,
			fontFamily: 'Calibri',
			fill: 'Black'
		});
		this.group.add(this.questionText);

		this.answerTexts = [
			new Konva.Text({
				x: answer1.x() + 25,
				y: answer1.y() + 25,
				text: `${allAnswers[0]}`,
				fontSize: 30,
				fontFamily: 'Calibri',
				fill: 'Black'
			}),
			new Konva.Text({
				x: answer2.x() + 25,
				y: answer2.y() + 25,
				text: `${allAnswers[1]}`,
				fontSize: 30,
				fontFamily: 'Calibri',
				fill: 'Black'
			}),
			new Konva.Text({
				x: answer3.x() + 25,
				y: answer3.y() + 25,
				text: `${allAnswers[2]}`,
				fontSize: 30,
				fontFamily: 'Calibri',
				fill: 'Black'
			}),
			new Konva.Text({
				x: answer4.x() + 25,
				y: answer4.y() + 25,
				text: `${allAnswers[3]}`,
				fontSize: 30,
				fontFamily: 'Calibri',
				fill: 'Black'
			})
		];

		// Attach click/hover handlers now that answerTexts exist
		answer1.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[0].text())));
		answer1.on('mouseover', onAnswerHoverStart);
		answer1.on('mouseout', onAnswerHoverEnd);

		answer2.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[1].text())));
		answer2.on('mouseover', onAnswerHoverStart);
		answer2.on('mouseout', onAnswerHoverEnd);

		answer3.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[2].text())));
		answer3.on('mouseover', onAnswerHoverStart);
		answer3.on('mouseout', onAnswerHoverEnd);

		answer4.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[3].text())));
		answer4.on('mouseover', onAnswerHoverStart);
		answer4.on('mouseout', onAnswerHoverEnd);

		this.answerTexts.forEach(text => this.group.add(text));
	}

	/**
	 * Internal method to update score text
	 */
	setScoreText(scoreText: string): void {
		this.scoreText.text(scoreText);
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
		this.answerTexts.forEach((text, index) => {
			text.text(`${answers[index] ?? ""}`);
		});
		this.group.getLayer()?.draw();
	}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
}