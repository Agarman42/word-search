import type { CategoryId, Stats } from '../types';
import { CATEGORIES } from './wordLists';

export function getWeeklyWordActivity(stats: Stats): number[] {
  const days = Array.from({ length: 7 }, () => 0);
  const now = new Date();

  for (const game of stats.recentGames) {
    const d = new Date(game.completedAt);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays >= 0 && diffDays < 7) {
      const idx = 6 - diffDays;
      days[idx] += game.wordsFound ?? game.wordCount;
    }
  }

  return days;
}

export function getBestCategory(stats: Stats): { id: CategoryId; name: string; count: number } | null {
  let best: { id: CategoryId; name: string; count: number } | null = null;
  for (const cat of CATEGORIES) {
    const count = stats.categoryCompletions[cat.id] ?? 0;
    if (!best || count > best.count) {
      best = { id: cat.id, name: cat.name, count };
    }
  }
  return best && best.count > 0 ? best : null;
}