import type { CategoryId, Cell, PlacedWord, Puzzle, PuzzleOptions } from '../types';
import { createRng } from './rng';
import { getWordsForCategory } from './wordLists';

const FORWARD_DIRS: { dr: number; dc: number; name: string }[] = [
  { dr: 0, dc: 1, name: 'right' },
  { dr: 1, dc: 0, name: 'down' },
  { dr: 1, dc: 1, name: 'down-right' },
  { dr: 1, dc: -1, name: 'down-left' },
];

const BACKWARD_DIRS: { dr: number; dc: number; name: string }[] = [
  { dr: 0, dc: -1, name: 'left' },
  { dr: -1, dc: 0, name: 'up' },
  { dr: -1, dc: -1, name: 'up-left' },
  { dr: -1, dc: 1, name: 'up-right' },
];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MAX_ATTEMPTS = 120;
const MAX_DEPTH = 8;

function getDirections(allowBackwards: boolean) {
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

function tryPlace(
  category: CategoryId,
  gridSize: number,
  wordCount: number,
  seed: string,
  options: PuzzleOptions,
  wordPool?: string[],
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
  );
  if (words.length === 0) return null;

  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  const directions = getDirections(clamped.allowBackwards);

  let best: { grid: (string | null)[][]; placed: PlacedWord[] } | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const attemptRng = createRng(`${seed}-attempt-${attempt}`);
    const grid: (string | null)[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(null),
    );
    const placed: PlacedWord[] = [];

    for (const word of sortedWords) {
      const dirs = [...directions].sort(() => attemptRng() - 0.5);
      let placedWord = false;

      const positions: { r: number; c: number; dr: number; dc: number; name: string }[] = [];
      for (const { dr, dc, name } of dirs) {
        for (let r = 0; r < gridSize; r++) {
          for (let c = 0; c < gridSize; c++) {
            if (canPlace(grid, word, r, c, dr, dc)) {
              positions.push({ r, c, dr, dc, name });
            }
          }
        }
      }

      positions.sort(() => attemptRng() - 0.5);

      for (const pos of positions) {
        if (canPlace(grid, word, pos.r, pos.c, pos.dr, pos.dc)) {
          const cells = placeWord(grid, word, pos.r, pos.c, pos.dr, pos.dc);
          placed.push({ word, cells, direction: pos.name });
          placedWord = true;
          break;
        }
      }

      if (!placedWord) break;
    }

    if (!best || placed.length > best.placed.length) {
      best = { grid, placed };
    }

    if (placed.length === sortedWords.length) {
      const fillRng = createRng(`${seed}-fill-${attempt}`);
      return {
        grid: fillEmpty(grid, fillRng),
        words: placed,
        category,
        seed,
        gridSize,
      };
    }
  }

  // Accept partial placement if we got most words
  if (best && best.placed.length >= Math.max(4, Math.floor(sortedWords.length * 0.7))) {
    const fillRng = createRng(`${seed}-fill-partial`);
    return {
      grid: fillEmpty(best.grid, fillRng),
      words: best.placed,
      category,
      seed,
      gridSize,
    };
  }

  return null;
}

export function generatePuzzle(
  category: CategoryId,
  gridSize: number,
  wordCount: number,
  seed: string,
  options: PuzzleOptions = { allowBackwards: false, minWordLength: 3, maxWordLength: 15 },
  depth = 0,
  wordPool?: string[],
): Puzzle {
  const clamped = clampOptions(gridSize, options);
  const result = tryPlace(category, gridSize, wordCount, seed, clamped, wordPool);
  if (result) return result;

  if (depth >= MAX_DEPTH) {
    // Last resort: fewer, shorter words
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
    );
    if (fallback) return fallback;

    // Empty-safe minimal puzzle
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