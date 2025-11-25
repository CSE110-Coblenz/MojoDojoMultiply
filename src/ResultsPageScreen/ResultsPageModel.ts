/**
 * Represents a single leaderboard entry
 */
export interface RoundStatsEntry {
  round: number;      // which round was completed
  points: number;     // total points earned this round
  correct: number;    // # correct this round
  total: number;      // # attempted this round
  timestamp: string;  // when round finished
}

/**
 * ResultsScreenModel - Stores final score and leaderboard
 */
export class ResultsPageModel {
	private finalScore = 0;
	private leaderboard: RoundStatsEntry[] = [];

	/**
	 * Set the final score
	 */
	setFinalScore(score: number): void {
		this.finalScore = score;
	}

	/**
	 * Get the final score
	 */
	getFinalScore(): number {
		return this.finalScore;
	}

	/**
	 * Set the leaderboard entries
	 */
	setLeaderboard(entries: RoundStatsEntry[]): void {
		this.leaderboard = entries;
	}

	/**
	 * Get the leaderboard entries
	 */
	getLeaderboard(): RoundStatsEntry[] {
		return this.leaderboard;
	}
}
