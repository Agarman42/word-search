import type { CategoryId, Settings, Stats } from '../types';
import { DIFFICULTY_PRESETS } from './difficulty';
import { getCategory } from './wordLists';

const CONTINUE_WINDOW_MS = 24 * 60 * 60 * 1000;

export interface ContinueSession {
  category: CategoryId;
  difficultyLabel: string;
  completedAgo: string;
}

export function getContinueSession(stats: Stats, settings: Settings): ContinueSession | null {
  const recent = stats.recentGames[0];
  if (!recent || recent.isDaily) return null;

  const age = Date.now() - recent.completedAt;
  if (age > CONTINUE_WINDOW_MS) return null;

  const preset = settings.difficultyPreset;
  const difficultyLabel =
    preset === 'custom'
      ? 'Custom'
      : DIFFICULTY_PRESETS[preset as keyof typeof DIFFICULTY_PRESETS]?.label ?? preset;

  const hours = Math.floor(age / 3600000);
  const completedAgo =
    hours < 1 ? 'Just now' : hours < 24 ? `${hours}h ago` : 'Yesterday';

  return {
    category: recent.category,
    difficultyLabel,
    completedAgo,
  };
}

export function getContinueLabel(session: ContinueSession): string {
  const cat = getCategory(session.category);
  return `${cat.name} · ${session.difficultyLabel}`;
}