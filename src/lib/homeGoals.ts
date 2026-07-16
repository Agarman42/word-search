import type { CategoryId, Stats } from '../types';
import { getWeeklyRecap } from './daily';
import { PUZZLE_PACKS } from './packs';
import { getCategory } from './wordLists';

export interface PostDailyGoal {
  type: 'pack' | 'category';
  label: string;
  sublabel: string;
  packId?: string;
  packLevel?: number;
  category: CategoryId;
}

/** Best next action after daily is done. */
export function getPostDailyGoal(stats: Stats): PostDailyGoal {
  // Unfinished pack first
  for (const pack of PUZZLE_PACKS) {
    const progress = stats.packProgress[pack.id] ?? 0;
    if (progress < pack.puzzleCount) {
      return {
        type: 'pack',
        label: `Continue ${pack.name}`,
        sublabel: `Level ${progress + 1} of ${pack.puzzleCount}`,
        packId: pack.id,
        packLevel: progress,
        category: pack.category,
      };
    }
  }

  const recap = getWeeklyRecap(stats);
  const cat = getCategory(recap.suggestedCategory);
  return {
    type: 'category',
    label: `Try ${cat.name}`,
    sublabel: 'Your least-played theme',
    category: cat.id,
  };
}