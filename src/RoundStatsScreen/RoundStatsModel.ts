import type { MainPageModel } from "../MainPageScreen/MainPageModel";

export interface RoundStatsEntry {
  round: number;      // which round was completed
  points: number;     // total points earned this round
  correct: number;    // # correct this round
  total: number;      // # attempted this round
  timestamp: string;  // when round finished
}

const ROUND_STATS_KEY = "MojoDojoRoundStats";

export class RoundStatsModel {
  /**
   * Load all saved round stats from localStorage.
   */
  static load(): RoundStatsEntry[] {
    const jsonString = localStorage.getItem(ROUND_STATS_KEY);
    if (!jsonString) {
      return [];
    }

    try {
      const parsed = JSON.parse(jsonString) as RoundStatsEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error parsing round stats:", e);
      return [];
    }
  }

  /**
   * Save all round stats to localStorage.
   */
  static save(entries: RoundStatsEntry[]): void {
    try {
      const jsonString = JSON.stringify(entries);
      localStorage.setItem(ROUND_STATS_KEY, jsonString);
    } catch (e) {
      console.error("Error saving round stats:", e);
    }
  }

  /**
   * Append one new round entry, based on the current MainPageModel.
   */
  static appendFromMainModel(model: MainPageModel): void {
    const entries = RoundStatsModel.load();

    const entry: RoundStatsEntry = {
      round: model.currentRound,
      points: model.roundScore,
      correct: model.roundCorrect,
      total: model.roundTotal,
      timestamp: new Date().toLocaleString(),
    };

    entries.push(entry);
    RoundStatsModel.save(entries);
  }
}