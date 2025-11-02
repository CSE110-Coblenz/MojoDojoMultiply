import Konva from "konva";
import type { View } from "../types.js";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../constants.js";

/**
 * MainPageView - Renders the main game screen
 */
export class MainPageView implements View {
    private group: Konva.Group;
	private questionText: Konva.Text;
	private answerTexts: Konva.Text[];
	private correctAnswer: number;

	// later change to constructor(onStartClick: () => void) {
	constructor(
		onAnswerClick: (answer: number) => void,
		onAnswerHoverStart: () => void,
		onAnswerHoverEnd: () => void) {
		this.group = new Konva.Group({ visible: false });

		const text = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 2,
			text: "MAIN GAME",
			fontSize: 100
		})
		text.offsetX(text.width() / 2);
		text.offsetY(text.height() / 2);
		this.group.add(text);
		// Initialize container for the game
		this.gameContainer = document.createElement('div');
		this.gameContainer.className = 'game-container';
		document.body.appendChild(this.gameContainer);
		
		// Create timer container
		const timerContainer = document.createElement('div');
		timerContainer.className = 'timer-container';
		this.gameContainer.appendChild(timerContainer);
		
		// Initialize array for timer digit elements
		this.timerDigitElements = [];
		
		// Create three digit places for the timer (e.g., 1:45 would need 3 spots)
		for (let i = 0; i < 3; i++) {
			const digitImg = document.createElement('img');
			digitImg.className = 'timer-digit';
			digitImg.alt = 'timer digit';
			timerContainer.appendChild(digitImg);
			this.timerDigitElements.push(digitImg);
		}
		
		// Paths to number images (0-9)
		this.numberImagePaths = Array.from({length: 10}, (_, i) => 
			`/assets/numbers/${i}.png`
		);
		
		// Set initial display to 0's
		this.updateTimer([0, 0, 0]);
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
	private readonly timerDigitElements: HTMLImageElement[];
    private readonly numberImagePaths: string[];
    private gameContainer: HTMLElement;

    /**
     * Updates the timer display with new digits
     * @param digits - Array of numbers representing each digit of the time
     */
    updateTimer(digits: number[]): void {
        for (const [index, digit] of digits.entries()) {
            if (this.timerDigitElements[index] && digit >= 0 && digit <= 9) {
                this.timerDigitElements[index].src = this.numberImagePaths[digit];
            }
        }
    }

    /**
     * Get the main game container element
     * @returns HTMLElement containing the game
     */
    getGameContainer(): HTMLElement {
        return this.gameContainer;
    }

	updateQuestion(num1: number, num2: number, allAnswers: number[]): void {
		this.questionText.text(`${num1} x ${num2} = ?`);

		// Set correct answer (model ensures allAnswers contains it)
		this.correctAnswer = num1 * num2;

		// Update answer texts with provided answers
		this.answerTexts.forEach((text, index) => {
			text.text(`${allAnswers[index] ?? ""}`);
		});

		this.group.getLayer()?.draw();
	}
	
	/**
	 * Get the current correct answer
	 */
	getCorrectAnswer(): number {
		return this.correctAnswer;
	}
}