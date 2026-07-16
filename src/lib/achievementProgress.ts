import type { Achievement, Stats } from '../types';
import { PUZZLE_PACKS } from './packs';

export function getAchievementHint(achievement: Achievement, stats: Stats): string | null {
  if (achievement.unlockedAt) return null;

  switch (achievement.id) {
    case 'first_word':
      return 'Find any word in a puzzle';
    case 'first_puzzle':
      return 'Complete one full puzzle';
    case 'streak_3':
      return `${Math.max(0, 3 - stats.dailyStreak)} more daily days for streak`;
    case 'streak_7':
      return `${Math.max(0, 7 - stats.dailyStreak)} days to week warrior`;
    case 'streak_30':
      return `${Math.max(0, 30 - stats.dailyStreak)} days to dedicated`;
    case 'words_50':
      return `${Math.max(0, 50 - stats.totalWordsFound)} words to go`;
    case 'words_200':
      return `${Math.max(0, 200 - stats.totalWordsFound)} words to go`;
    case 'words_500':
      return `${Math.max(0, 500 - stats.totalWordsFound)} words to go`;
    case 'puzzles_10':
      return `${Math.max(0, 10 - stats.totalPuzzlesCompleted)} puzzles left`;
    case 'puzzles_50':
      return `${Math.max(0, 50 - stats.totalPuzzlesCompleted)} puzzles left`;
    case 'daily_7':
      return `${Math.max(0, 7 - stats.completedDailyDates.length)} dailies left`;
    case 'favorites_5':
      return `${Math.max(0, 5 - stats.favoriteWords.length)} favorites to save`;
    case 'blitz_5':
      return `Score 5+ words in Blitz (best: ${stats.blitzHighScore})`;
    case 'blitz_10':
      return `Score 10+ words in Blitz (best: ${stats.blitzHighScore})`;
    case 'pack_complete': {
      const closest = PUZZLE_PACKS.map((p) => ({
        name: p.name,
        left: Math.max(0, p.puzzleCount - (stats.packProgress[p.id] ?? 0)),
      })).sort((a, b) => a.left - b.left)[0];
      return closest?.left
        ? `${closest.left} puzzles left in ${closest.name}`
        : 'Finish any puzzle pack';
    }
    default:
      return achievement.description;
  }
}