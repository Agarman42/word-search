import type { CategoryId, Cell, PlacedWord, Puzzle, PuzzleOptions } from '../types';
import { createRng } from './rng';
import { getWordsForCategory } from './wordLists';

type DirKind = 'H' | 'V' | 'D';

interface Dir {
  dr: number;
  dc: number;
  name: string;
  kind: DirKind;
}

const FORWARD_DIRS: Dir[] = [
  { dr: 0, dc: 1, name: 'right', kind: 'H' },
  { dr: 1, dc: 0, name: 'down', kind: 'V' },
  { dr: 1, dc: 1, name: 'down-right', kind: 'D' },
  { dr: 1, dc: -1, name: 'down-left', kind: 'D' },
];

const BACKWARD_DIRS: Dir[] = [
  { dr: 0, dc: -1, name: 'left', kind: 'H' },
  { dr: -1, dc: 0, name: 'up', kind: 'V' },
  { dr: -1, dc: -1, name: 'up-left', kind: 'D' },
  { dr: -1, dc: 1, name: 'up-right', kind: 'D' },
];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MAX_ATTEMPTS = 140;
const MAX_DEPTH = 8;

function getDirections(allowBackwards: boolean): Dir[] {
  return allowBackwards ? [...FORWARD_DIRS, ...BACKWARD_DIRS] : FORWARD_DIRS;
}

function canPlace(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  dr: number,
  dc: number,
): boolean {
  const size = grid.length;
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    const existing = grid[r][c];
    if (existing !== null && existing !== word[i]) return false;
  }
  return true;
}

function placeWord(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  dr: number,
  dc: number,
): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    grid[r][c] = word[i];
    cells.push({ row: r, col: c });
  }
  return cells;
}

function fillEmpty(grid: (string | null)[][], rng: () => number): string[][] {
  return grid.map((row) =>
    row.map((cell) => cell ?? LETTERS[Math.floor(rng() * 26)]),
  );
}

function clampOptions(gridSize: number, options: PuzzleOptions): PuzzleOptions {
  const maxLen = Math.min(options.maxWordLength, gridSize);
  const minLen = Math.min(options.minWordLength, maxLen);
  return {
    ...options,
    minWordLength: Math.max(3, minLen),
    maxWordLength: Math.max(3, maxLen),
  };
}

/** Proper Fisher–Yates shuffle using seeded rng. */
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function kindFromCells(cells: Cell[]): DirKind {
  if (cells.length < 2) return 'H';
  const a = cells[0];
  const b = cells[1];
  const dr = Math.sign(b.row - a.row);
  const dc = Math.sign(b.col - a.col);
  if (dr === 0) return 'H';
  if (dc === 0) return 'V';
  return 'D';
}

function countKinds(placed: PlacedWord[]): Record<DirKind, number> {
  const counts: Record<DirKind, number> = { H: 0, V: 0, D: 0 };
  for (const p of placed) {
    counts[kindFromCells(p.cells)]++;
  }
  return counts;
}

/**
 * Higher is better. Rewards full word count first, then even H/V/D mix.
 * Ideal is roughly equal share of horizontal, vertical, and diagonal words.
 */
export function directionBalanceScore(placed: PlacedWord[]): number {
  if (placed.length === 0) return 0;
  const counts = countKinds(placed);
  const total = placed.length;
  const ideal = total / 3;
  // Variance from ideal thirds
  const variance =
    (counts.H - ideal) ** 2 + (counts.V - ideal) ** 2 + (counts.D - ideal) ** 2;
  // Penalize boards missing a direction entirely
  const missing =
    (counts.H === 0 ? 40 : 0) + (counts.V === 0 ? 40 : 0) + (counts.D === 0 ? 40 : 0);
  // Prefer more placed words, then low variance
  return total * 1000 - variance * 25 - missing;
}

interface PlacePos {
  r: number;
  c: number;
  dr: number;
  dc: number;
  name: string;
  kind: DirKind;
}

/**
 * Score a candidate placement: prefer underrepresented direction kinds,
 * with a little random jitter so boards stay varied.
 */
function placementScore(
  pos: PlacePos,
  counts: Record<DirKind, number>,
  placedCount: number,
  rng: () => number,
): number {
  // Expected share if perfectly balanced going forward
  const expected = (placedCount + 1) / 3;
  // How far under the ideal this kind is (positive = underrepresented)
  const under = expected - counts[pos.kind];
  // Strong preference for underrepresented kinds; diagonals get a small boost
  // because they have fewer natural slots on the grid
  const diagonalBoost = pos.kind === 'D' ? 0.35 : 0;
  return under * 10 + diagonalBoost + rng() * 0.5;
}

function tryPlace(
  category: CategoryId,
  gridSize: number,
  wordCount: number,
  seed: string,
  options: PuzzleOptions,
  wordPool?: string[],
  excludeWords: readonly string[] = [],
): Puzzle | null {
  const clamped = clampOptions(gridSize, options);
  const rng = createRng(seed);
  const words = getWordsForCategory(
    category,
    wordCount,
    rng,
    clamped.minWordLength,
    clamped.maxWordLength,
    wordPool,
    excludeWords,
  );
  if (words.length === 0) return null;

  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  const directions = getDirections(clamped.allowBackwards);

  let best: { grid: (string | null)[][]; placed: PlacedWord[]; score: number } | null = null;
  let bestComplete: { grid: (string | null)[][]; placed: PlacedWord[]; score: number } | null =
    null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const attemptRng = createRng(`${seed}-attempt-${attempt}`);
    const grid: (string | null)[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(null),
    );
    const placed: PlacedWord[] = [];

    // Round-robin preferred kinds so early long words aren't all H or all V
    const kindCycle = shuffle(
      sortedWords.map((_, i) => (['H', 'V', 'D'] as DirKind[])[i % 3]),
      attemptRng,
    );

    for (let wi = 0; wi < sortedWords.length; wi++) {
      const word = sortedWords[wi];
      const preferredKind = kindCycle[wi];
      const counts = countKinds(placed);

      // Collect all valid positions
      const positions: PlacePos[] = [];
      for (const dir of directions) {
        for (let r = 0; r < gridSize; r++) {
          for (let c = 0; c < gridSize; c++) {
            if (canPlace(grid, word, r, c, dir.dr, dir.dc)) {
              positions.push({
                r,
                c,
                dr: dir.dr,
                dc: dir.dc,
                name: dir.name,
                kind: dir.kind,
              });
            }
          }
        }
      }

      if (positions.length === 0) break;

      // Prefer preferred kind, then underrepresented kinds via score
      positions.sort((a, b) => {
        const prefA = a.kind === preferredKind ? 50 : 0;
        const prefB = b.kind === preferredKind ? 50 : 0;
        const scoreA = placementScore(a, counts, placed.length, attemptRng) + prefA;
        const scoreB = placementScore(b, counts, placed.length, attemptRng) + prefB;
        return scoreB - scoreA;
      });

      // Try top candidates (not only first — first may still fail rare race)
      let placedWord = false;
      const tryN = Math.min(positions.length, 24);
      for (let i = 0; i < tryN; i++) {
        const pos = positions[i];
        if (canPlace(grid, word, pos.r, pos.c, pos.dr, pos.dc)) {
          const cells = placeWord(grid, word, pos.r, pos.c, pos.dr, pos.dc);
          placed.push({ word, cells, direction: pos.name });
          placedWord = true;
          break;
        }
      }

      // Fallback: any remaining position
      if (!placedWord) {
        for (const pos of positions) {
          if (canPlace(grid, word, pos.r, pos.c, pos.dr, pos.dc)) {
            const cells = placeWord(grid, word, pos.r, pos.c, pos.dr, pos.dc);
            placed.push({ word, cells, direction: pos.name });
            placedWord = true;
            break;
          }
        }
      }

      if (!placedWord) break;
    }

    const score = directionBalanceScore(placed);

    if (!best || placed.length > best.placed.length || (placed.length === best.placed.length && score > best.score)) {
      best = { grid, placed, score };
    }

    if (placed.length === sortedWords.length) {
      if (!bestComplete || score > bestComplete.score) {
        bestComplete = { grid, placed, score };
      }
      // Early exit if mix is excellent (all three kinds present and reasonably even)
      const c = countKinds(placed);
      const minShare = Math.min(c.H, c.V, c.D) / placed.length;
      if (c.H > 0 && c.V > 0 && c.D > 0 && minShare >= 0.18) {
        break;
      }
    }
  }

  const pick = bestComplete ?? (
    best && best.placed.length >= Math.max(4, Math.floor(sortedWords.length * 0.7))
      ? best
      : null
  );

  if (!pick) return null;

  const fillRng = createRng(`${seed}-fill-balanced`);
  return {
    grid: fillEmpty(pick.grid, fillRng),
    words: pick.placed,
    category,
    seed,
    gridSize,
  };
}

export function generatePuzzle(
  category: CategoryId,
  gridSize: number,
  wordCount: number,
  seed: string,
  options: PuzzleOptions = { allowBackwards: false, minWordLength: 3, maxWordLength: 15 },
  depth = 0,
  wordPool?: string[],
  excludeWords: readonly string[] = [],
): Puzzle {
  const clamped = clampOptions(gridSize, options);
  const result = tryPlace(category, gridSize, wordCount, seed, clamped, wordPool, excludeWords);
  if (result) return result;

  if (depth >= MAX_DEPTH) {
    const fallback = tryPlace(
      category,
      gridSize,
      Math.max(4, Math.min(wordCount, 6)),
      `${seed}-fallback`,
      {
        allowBackwards: false,
        minWordLength: 3,
        maxWordLength: Math.min(gridSize, 6),
      },
      wordPool,
      excludeWords,
    );
    if (fallback) return fallback;

    const rng = createRng(`${seed}-empty`);
    const grid = fillEmpty(
      Array.from({ length: gridSize }, () => Array(gridSize).fill(null)),
      rng,
    );
    return { grid, words: [], category, seed, gridSize };
  }

  return generatePuzzle(
    category,
    gridSize,
    Math.max(4, wordCount - 2),
    `${seed}-retry-${depth}`,
    {
      ...clamped,
      maxWordLength: Math.max(3, clamped.maxWordLength - 1),
    },
    depth + 1,
    wordPool,
    excludeWords,
  );
}

export function getDailySeed(date: string): string {
  return `daily-${date}`;
}

/** Fixed options so every player gets the same daily board. */
export const DAILY_PUZZLE_CONFIG = {
  gridSize: 10,
  wordCount: 12,
  options: {
    allowBackwards: false,
    minWordLength: 4,
    maxWordLength: 8,
  } satisfies PuzzleOptions,
};
