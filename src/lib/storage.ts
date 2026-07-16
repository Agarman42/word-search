import type { AppState, GameRecord, Settings, Stats } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { createDefaultAchievements } from './achievements';
import { getWeekStart } from './daily';
import { updateCategoryMastery } from './mastery';

const STORAGE_KEY = 'lexis-app-state-v2';

const DEFAULT_STATS: Stats = {
  totalPuzzlesCompleted: 0,
  totalWordsFound: 0,
  totalPlayTimeMs: 0,
  totalWrongAttempts: 0,
  bestTimes: {},
  categoryCompletions: {},
  categoryMastery: {},
  dailyStreak: 0,
  longestDailyStreak: 0,
  lastDailyDate: null,
  completedDailyDates: [],
  recentGames: [],
  favoriteWords: [],
  blitzHighScore: 0,
  weekWordsFound: 0,
  weekStartDate: getWeekStart(),
  packProgress: {},
};

function migrateStats(raw: Partial<Stats>): Stats {
  return { ...DEFAULT_STATS, ...raw };
}

function migrateSettings(raw: Partial<Settings> & { themeMode?: string }): Settings {
  const s = { ...DEFAULT_SETTINGS, ...raw };
  if ('themeMode' in raw && !('lightBackground' in raw)) {
    s.lightBackground = raw.themeMode === 'day';
  }
  if (!raw.wordLengthPreset) {
    s.wordLengthPreset = 'mixed';
  }
  return s;
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem('lexis-app-state-v1');
      if (legacy) {
        const parsed = JSON.parse(legacy) as AppState;
        const state = {
          settings: migrateSettings({ ...DEFAULT_SETTINGS, ...parsed.settings }),
          stats: migrateStats(parsed.stats),
          achievements: mergeAchievements(parsed.achievements),
        };
        saveAppState(state);
        return state;
      }
      return {
        settings: { ...DEFAULT_SETTINGS },
        stats: { ...DEFAULT_STATS },
        achievements: createDefaultAchievements(),
      };
    }
    const parsed = JSON.parse(raw) as AppState;
    const settings = migrateSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
    return {
      settings,
      stats: migrateStats(parsed.stats),
      achievements: mergeAchievements(parsed.achievements),
    };
  } catch {
    return {
      settings: { ...DEFAULT_SETTINGS },
      stats: { ...DEFAULT_STATS },
      achievements: createDefaultAchievements(),
    };
  }
}

function mergeAchievements(saved: AppState['achievements']): AppState['achievements'] {
  const defaults = createDefaultAchievements();
  const savedMap = new Map(saved.map((a) => [a.id, a]));
  return defaults.map((d) => {
    const s = savedMap.get(d.id);
    return s ? { ...d, unlockedAt: s.unlockedAt } : d;
  });
}

export function saveAppState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function rollWeek(stats: Stats): Stats {
  const currentWeek = getWeekStart();
  if (stats.weekStartDate === currentWeek) return stats;
  return { ...stats, weekStartDate: currentWeek, weekWordsFound: 0 };
}

export function recordGameCompletion(stats: Stats, record: GameRecord): Stats {
  let s = rollWeek(stats);

  // Don't re-count the same daily on the same local day
  if (record.isDaily) {
    const day = new Date(record.completedAt);
    const y = day.getFullYear();
    const m = String(day.getMonth() + 1).padStart(2, '0');
    const d = String(day.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    if (stats.completedDailyDates.includes(dateStr) && stats.lastDailyDate === dateStr) {
      // Still allow streak helper to no-op; skip duplicate completion stats
      return s;
    }
  }

  const bestKey = record.isDaily ? 'overall' : record.category;
  const prevBest = s.bestTimes[bestKey];
  const newBestTimes = { ...s.bestTimes };
  if (record.mode === 'timed' && (!prevBest || record.timeMs < prevBest)) {
    newBestTimes[bestKey] = record.timeMs;
    if (!record.isDaily) {
      const overall = s.bestTimes.overall;
      if (!overall || record.timeMs < overall) {
        newBestTimes.overall = record.timeMs;
      }
    }
  }

  const recentGames = [record, ...s.recentGames].slice(0, 30);
  s = {
    ...s,
    totalPuzzlesCompleted: s.totalPuzzlesCompleted + 1,
    totalPlayTimeMs: s.totalPlayTimeMs + record.timeMs,
    totalWrongAttempts: s.totalWrongAttempts + record.wrongAttempts,
    bestTimes: newBestTimes,
    categoryCompletions: {
      ...s.categoryCompletions,
      [record.category]: (s.categoryCompletions[record.category] ?? 0) + 1,
    },
    recentGames,
  };

  if (record.mode === 'blitz' && (record.wordsFound ?? 0) > s.blitzHighScore) {
    s = { ...s, blitzHighScore: record.wordsFound! };
  }

  if (record.packId != null && record.packLevel != null) {
    const current = s.packProgress[record.packId] ?? 0;
    const nextLevel = record.packLevel + 1;
    if (nextLevel > current) {
      s = {
        ...s,
        packProgress: { ...s.packProgress, [record.packId]: nextLevel },
      };
    }
  }

  return updateCategoryMastery(s, record.category);
}

export function undoWrongAttempt(stats: Stats): Stats {
  return {
    ...stats,
    totalWrongAttempts: Math.max(0, stats.totalWrongAttempts - 1),
  };
}

export function recordWordFound(stats: Stats): Stats {
  const s = rollWeek(stats);
  return {
    ...s,
    totalWordsFound: s.totalWordsFound + 1,
    weekWordsFound: s.weekWordsFound + 1,
  };
}

export function recordWrongAttempt(stats: Stats): Stats {
  return { ...stats, totalWrongAttempts: stats.totalWrongAttempts + 1 };
}

export function toggleFavoriteWord(stats: Stats, word: string): Stats {
  const upper = word.toUpperCase();
  const exists = stats.favoriteWords.includes(upper);
  return {
    ...stats,
    favoriteWords: exists
      ? stats.favoriteWords.filter((w) => w !== upper)
      : [...stats.favoriteWords, upper].slice(0, 50),
  };
}

export function updateSettings(current: Settings, patch: Partial<Settings>): Settings {
  return { ...current, ...patch };
}