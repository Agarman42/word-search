import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Stats } from '../types';
import {
  NEW_PACKS_WAVE_KEY,
  dismissNewPacksWave,
  isReturningVisitor,
  shouldShowNewPacksPopup,
} from './newPacksWave';

const emptyStats: Stats = {
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
  recentWords: [],
  blitzHighScore: 0,
  weekWordsFound: 0,
  weekStartDate: null,
  packProgress: {},
};

describe('newPacksWave', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    for (const k of Object.keys(store)) delete store[k];
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    });
  });

  it('does not treat a first-time visitor with no stats as returning', () => {
    expect(isReturningVisitor(emptyStats)).toBe(false);
    expect(shouldShowNewPacksPopup(emptyStats)).toBe(false);
  });

  it('does not show while onboarding is visible', () => {
    const returning = { ...emptyStats, totalPuzzlesCompleted: 4 };
    expect(shouldShowNewPacksPopup(returning, { onboardingVisible: true })).toBe(false);
  });

  it('shows once per wave for a returning player, then stays dismissed', () => {
    const returning = { ...emptyStats, totalPuzzlesCompleted: 4 };
    expect(shouldShowNewPacksPopup(returning)).toBe(true);
    dismissNewPacksWave();
    expect(store[NEW_PACKS_WAVE_KEY]).toBe('1');
    expect(shouldShowNewPacksPopup(returning)).toBe(false);
  });

  it('treats completed onboarding as a return visit', () => {
    store['lexis-onboarding-v3'] = 'done';
    expect(isReturningVisitor(emptyStats)).toBe(true);
    expect(shouldShowNewPacksPopup(emptyStats)).toBe(true);
  });
});
