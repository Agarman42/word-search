import type { Achievement, CategoryId, GameRecord, Stats } from '../types';
import { PUZZLE_PACKS } from './packs';
import { addDaysToDateString, todayString } from './rng';
import { CATEGORIES } from './wordLists';

export const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlockedAt'>[] = [
  { id: 'first_word', title: 'First Find', description: 'Discover your first word', icon: '✨' },
  { id: 'first_puzzle', title: 'Puzzle Pro', description: 'Complete your first puzzle', icon: '🏁' },
  { id: 'speed_5', title: 'Quick Thinker', description: 'Finish a timed puzzle under 5 minutes', icon: '⏱️' },
  { id: 'speed_3', title: 'Lightning', description: 'Finish a timed puzzle under 3 minutes', icon: '⚡' },
  { id: 'speed_2', title: 'Blazing', description: 'Finish a timed puzzle under 2 minutes', icon: '🔥' },
  { id: 'perfect', title: 'Flawless', description: 'Finish a puzzle with zero misses', icon: '💎' },
  { id: 'streak_3', title: 'On a Roll', description: '3-day daily streak', icon: '📅' },
  { id: 'streak_7', title: 'Week Warrior', description: '7-day daily streak', icon: '🗓️' },
  { id: 'streak_30', title: 'Dedicated', description: '30-day daily streak', icon: '🏆' },
  { id: 'words_50', title: 'Word Hunter', description: 'Find 50 words total', icon: '🔍' },
  { id: 'words_200', title: 'Lexicon', description: 'Find 200 words total', icon: '📚' },
  { id: 'words_500', title: 'Scholar', description: 'Find 500 words total', icon: '🎓' },
  { id: 'puzzles_10', title: 'Regular', description: 'Complete 10 puzzles', icon: '🎯' },
  { id: 'puzzles_50', title: 'Veteran', description: 'Complete 50 puzzles', icon: '🛡️' },
  { id: 'grid_15', title: 'Grand Grid', description: 'Conquer a 15×15 puzzle', icon: '🏔️' },
  { id: 'all_categories', title: 'Explorer', description: 'Complete a puzzle in every category', icon: '🧭' },
  { id: 'daily_7', title: 'Daily Devotee', description: 'Complete 7 daily challenges', icon: '☀️' },
  { id: 'marathon', title: 'Marathon', description: 'Play for over 1 hour total', icon: '🕐' },
  { id: 'blitz_5', title: 'Blitz Runner', description: 'Find 5+ words in Blitz mode', icon: '⚡' },
  { id: 'blitz_10', title: 'Blitz Master', description: 'Find 10+ words in Blitz mode', icon: '🔥' },
  { id: 'zen_complete', title: 'Zen Master', description: 'Complete a Zen mode puzzle', icon: '🧘' },
  { id: 'coop_complete', title: 'Teamwork', description: 'Complete a Co-op puzzle', icon: '🤝' },
  { id: 'mastery_gold', title: 'Golden Explorer', description: 'Reach Gold mastery in any category', icon: '🥇' },
  { id: 'favorites_5', title: 'Collector', description: 'Save 5 favorite words', icon: '⭐' },
  { id: 'pack_complete', title: 'Pack Master', description: 'Complete a puzzle pack', icon: '📦' },
  { id: 'hint_used', title: 'Need a Nudge', description: 'Use a hint for the first time', icon: '💡' },
];

export function createDefaultAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFS.map((a) => ({ ...a, unlockedAt: null }));
}

export function checkAchievements(
  achievements: Achievement[],
  stats: Stats,
  lastGame?: GameRecord,
  wordsFoundThisSession?: number,
  extras?: { hintUsed?: boolean },
): Achievement[] {
  const unlocked = new Set(
    achievements.filter((a) => a.unlockedAt).map((a) => a.id),
  );
  const now = Date.now();
  const updates = new Map<string, number>();

  const unlock = (id: string) => {
    if (!unlocked.has(id)) updates.set(id, now);
  };

  if (extras?.hintUsed) unlock('hint_used');
  if (wordsFoundThisSession && wordsFoundThisSession >= 1) unlock('first_word');
  if (stats.totalWordsFound >= 50) unlock('words_50');
  if (stats.totalWordsFound >= 200) unlock('words_200');
  if (stats.totalWordsFound >= 500) unlock('words_500');
  if (stats.totalPuzzlesCompleted >= 1) unlock('first_puzzle');
  if (stats.totalPuzzlesCompleted >= 10) unlock('puzzles_10');
  if (stats.totalPuzzlesCompleted >= 50) unlock('puzzles_50');
  if (stats.dailyStreak >= 3) unlock('streak_3');
  if (stats.dailyStreak >= 7) unlock('streak_7');
  if (stats.dailyStreak >= 30) unlock('streak_30');
  if (stats.completedDailyDates.length >= 7) unlock('daily_7');
  if (stats.totalPlayTimeMs >= 3600000) unlock('marathon');

  const allCategories: CategoryId[] = CATEGORIES.map((c) => c.id);
  if (allCategories.every((c) => (stats.categoryCompletions[c] ?? 0) >= 1)) {
    unlock('all_categories');
  }

  if (stats.favoriteWords.length >= 5) unlock('favorites_5');
  if (stats.blitzHighScore >= 5) unlock('blitz_5');
  if (stats.blitzHighScore >= 10) unlock('blitz_10');

  const packProgress = stats.packProgress ?? {};
  if (
    PUZZLE_PACKS.some(
      (pack) => (packProgress[pack.id] ?? 0) >= pack.puzzleCount,
    )
  ) {
    unlock('pack_complete');
  }

  const masteryTiers = Object.values(stats.categoryMastery ?? {});
  if (masteryTiers.some((t) => t === 'gold' || t === 'diamond')) unlock('mastery_gold');

  if (lastGame) {
    // Flawless only for non-blitz full clears
    if (lastGame.wrongAttempts === 0 && lastGame.mode !== 'blitz') unlock('perfect');
    if (lastGame.gridSize >= 15) unlock('grid_15');
    if (lastGame.mode === 'zen') unlock('zen_complete');
    if (lastGame.mode === 'coop') unlock('coop_complete');
    if (lastGame.usedHint) unlock('hint_used');
    if (lastGame.mode === 'blitz' && (lastGame.wordsFound ?? 0) >= 5) unlock('blitz_5');
    if (lastGame.mode === 'blitz' && (lastGame.wordsFound ?? 0) >= 10) unlock('blitz_10');
    if (lastGame.mode === 'timed') {
      if (lastGame.timeMs < 300000) unlock('speed_5');
      if (lastGame.timeMs < 180000) unlock('speed_3');
      if (lastGame.timeMs < 120000) unlock('speed_2');
    }
  }

  if (updates.size === 0) return achievements;

  return achievements.map((a) =>
    updates.has(a.id) ? { ...a, unlockedAt: updates.get(a.id)! } : a,
  );
}

export function updateDailyStreak(stats: Stats): Stats {
  const today = todayString();
  if (stats.lastDailyDate === today) return stats;

  const yesterdayStr = addDaysToDateString(today, -1);

  let streak = 1;
  if (stats.lastDailyDate === yesterdayStr) {
    streak = stats.dailyStreak + 1;
  }

  return {
    ...stats,
    dailyStreak: streak,
    longestDailyStreak: Math.max(stats.longestDailyStreak, streak),
    lastDailyDate: today,
    completedDailyDates: stats.completedDailyDates.includes(today)
      ? stats.completedDailyDates
      : [...stats.completedDailyDates, today],
  };
}