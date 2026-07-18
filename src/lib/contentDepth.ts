import { WORD_BANKS } from './wordBanks';
import { CATEGORIES } from './wordLists';
import { PUZZLE_PACKS } from './packs';

export interface ContentDepth {
  categoryCount: number;
  uniqueWords: number;
  packCount: number;
  packLevels: number;
  /** One quiet line for the home hero, e.g. "16 categories · 3,600+ words · 160 pack levels" */
  homeLine: string;
}

function countUniqueWords(): number {
  const set = new Set<string>();
  for (const bank of Object.values(WORD_BANKS)) {
    for (const w of bank) {
      const u = w.toUpperCase();
      if (u.length >= 3) set.add(u);
    }
  }
  return set.size;
}

/** Round down to a clean floor (e.g. 3651 → 3600) for a stable “3,600+” claim. */
export function formatWordFloor(count: number): string {
  const floor = Math.floor(count / 100) * 100;
  return `${floor.toLocaleString('en-US')}+`;
}

let cached: ContentDepth | null = null;

export function getContentDepth(): ContentDepth {
  if (cached) return cached;

  const categoryCount = CATEGORIES.length;
  const uniqueWords = countUniqueWords();
  const packCount = PUZZLE_PACKS.length;
  const packLevels = PUZZLE_PACKS.reduce((sum, p) => sum + p.puzzleCount, 0);

  cached = {
    categoryCount,
    uniqueWords,
    packCount,
    packLevels,
    homeLine: `${categoryCount} categories · ${formatWordFloor(uniqueWords)} words · ${packLevels} pack levels`,
  };
  return cached;
}
