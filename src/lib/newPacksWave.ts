import type { Stats } from '../types';
import { hasCompletedOnboarding } from './onboarding';
import { CURATED_PACK_IDS } from './curatedPacks';

/** Versioned so a future wave can show again without reviving this one. */
export const NEW_PACKS_WAVE_KEY = 'wordseek:new-packs:2026-08-family';

export const FEATURED_NEW_PACK_IDS = CURATED_PACK_IDS;

export function isReturningVisitor(stats: Stats): boolean {
  if (stats.totalPuzzlesCompleted > 0) return true;
  if (stats.totalWordsFound > 0) return true;
  if (stats.dailyStreak > 0) return true;
  if (stats.lastDailyDate) return true;
  if ((stats.recentGames?.length ?? 0) > 0) return true;
  if (Object.keys(stats.packProgress ?? {}).length > 0) return true;
  return hasCompletedOnboarding();
}

export function isNewPacksWaveDismissed(): boolean {
  try {
    return localStorage.getItem(NEW_PACKS_WAVE_KEY) === '1';
  } catch {
    return true;
  }
}

export function dismissNewPacksWave(): void {
  try {
    localStorage.setItem(NEW_PACKS_WAVE_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function shouldShowNewPacksPopup(
  stats: Stats,
  opts: { onboardingVisible?: boolean } = {},
): boolean {
  if (opts.onboardingVisible) return false;
  if (isNewPacksWaveDismissed()) return false;
  return isReturningVisitor(stats);
}
