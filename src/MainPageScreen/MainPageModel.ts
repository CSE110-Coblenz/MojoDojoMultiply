/**
 * MainPageModel - Manages game state
 */
export class MainPageModel {
    private timeRemaining: number; // Time in seconds
    private timerInterval: number | null;
    private isTimerRunning: boolean;
    private readonly defaultTime: number = 60; // Default time in seconds

    constructor() {
        this.timeRemaining = this.defaultTime;
        this.timerInterval = null;
        this.isTimerRunning = false;
    }

    /**
     * Start the countdown timer
     * @param callback - Function to call on each timer tick with array of digits
     */
    startTimer(callback: (digits: number[]) => void): void {
        if (!this.isTimerRunning) {
            this.isTimerRunning = true;
            // Initial call to set initial state
            callback(this.getTimeDigits());
            
            this.timerInterval = globalThis.setInterval(() => {
                if (this.timeRemaining > 0) {
                    this.timeRemaining--;
                    callback(this.getTimeDigits());
                } else {
                    this.stopTimer();
                }
            }, 1000);
        }
    }

    /**
     * Get individual digits of the current time
     * For example: 67 seconds would return [6, 7]
     * @returns array of individual digits
     */
    private getTimeDigits(): number[] {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        
        // Convert to padded strings and split into individual digits
        const minutesStr = minutes.toString().padStart(1, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        
        // Combine and convert to numbers
        return (minutesStr + secondsStr).split('').map(Number);
    }

    /**
     * Stop the countdown timer
     */
    stopTimer(): void {
        if (this.timerInterval) {
            globalThis.clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.isTimerRunning = false;
        }
    }

    /**
     * Reset the timer to default time
     * @param callback - Optional callback to update display after reset
     */
    resetTimer(callback?: (digits: number[]) => void): void {
        this.stopTimer();
        this.timeRemaining = this.defaultTime;
        if (callback) {
            callback(this.getTimeDigits());
        }
    }

    /**
     * Get current time remaining
     * @returns number of seconds remaining
     */
    getTimeRemaining(): number {
        return this.timeRemaining;
    }

    /**
     * Check if timer is currently running
     * @returns boolean indicating if timer is active
     */
    isActive(): boolean {
        return this.isTimerRunning;
    }

    /**
     * Set a custom time for the timer
     * @param seconds - Number of seconds to set the timer to
     * @param callback - Optional callback to update display after setting time
     */
    setTime(seconds: number, callback?: (digits: number[]) => void): void {
        if (seconds > 0) {
            this.timeRemaining = seconds;
            if (callback) {
                callback(this.getTimeDigits());
            }
        }
    }
}