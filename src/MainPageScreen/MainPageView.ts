/**
 * MainPageView - Handles the visual representation of the game screen
 */
export class MainPageView {
    private readonly timerDigitElements: HTMLImageElement[];
    private readonly numberImagePaths: string[];
    private gameContainer: HTMLElement;

    constructor() {
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
}