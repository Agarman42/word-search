import type { Cell, PlacedWord } from '../types';

/** Extra cells allowed before/after a word when swiping (mobile forgiveness). */
export const SELECTION_GRACE = 2;

export function cellKey(cell: Cell): string {
  return `${cell.row},${cell.col}`;
}

export function cellsEqual(a: Cell, b: Cell): boolean {
  return a.row === b.row && a.col === b.col;
}

export function getLineCells(start: Cell, end: Cell, gridSize: number): Cell[] {
  const dr = end.row - start.row;
  const dc = end.col - start.col;

  if (dr === 0 && dc === 0) return [start];

  let stepR = 0;
  let stepC = 0;
  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  if (dr === 0) {
    stepC = Math.sign(dc);
  } else if (dc === 0) {
    stepR = Math.sign(dr);
  } else if (absDr === absDc) {
    stepR = Math.sign(dr);
    stepC = Math.sign(dc);
  } else if (absDr > absDc) {
    stepR = Math.sign(dr);
  } else {
    stepC = Math.sign(dc);
  }

  const length = stepR !== 0 && stepC !== 0 ? Math.max(absDr, absDc) : stepR !== 0 ? absDr : absDc;

  const cells: Cell[] = [];
  for (let i = 0; i <= length; i++) {
    const r = start.row + stepR * i;
    const c = start.col + stepC * i;
    if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
      cells.push({ row: r, col: c });
    }
  }

  return cells;
}

export function getWordFromCells(grid: string[][], cells: Cell[]): string {
  return cells.map((c) => grid[c.row][c.col]).join('');
}

/**
 * True if `needle` appears as a contiguous run inside `haystack`.
 * Allows `haystack` to be up to `grace` cells longer (overshoot at either end).
 */
export function pathContains(
  haystack: Cell[],
  needle: Cell[],
  grace: number = SELECTION_GRACE,
): boolean {
  if (needle.length < 2) return false;
  if (haystack.length < needle.length) return false;
  if (haystack.length > needle.length + grace) return false;

  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let match = true;
    for (let j = 0; j < needle.length; j++) {
      if (!cellsEqual(haystack[i + j], needle[j])) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}

/**
 * Whether the selection covers this placed word (forward or reverse),
 * with a little room for overshooting start/end on mobile.
 */
export function selectionMatchesWord(
  selected: Cell[],
  placed: PlacedWord,
  grace: number = SELECTION_GRACE,
): boolean {
  if (selected.length < 2) return false;
  const forward = placed.cells;
  const reverse = [...placed.cells].reverse();
  return pathContains(selected, forward, grace) || pathContains(selected, reverse, grace);
}

/** Cells in the order the player swiped through the word (forward or reverse). */
export function getRevealCells(match: PlacedWord, selected: Cell[]): Cell[] {
  const forward = match.cells;
  const reverse = [...match.cells].reverse();

  if (pathContains(selected, forward, SELECTION_GRACE)) return forward;
  if (pathContains(selected, reverse, SELECTION_GRACE)) return reverse;

  // Fallback: first selected cell that belongs to the word decides direction
  const firstHit = selected.find((c) =>
    match.cells.some((m) => cellsEqual(m, c)),
  );
  if (firstHit && cellsEqual(firstHit, reverse[0])) return reverse;
  return forward;
}

export function findMatchingWord(
  _grid: string[][],
  cells: Cell[],
  placedWords: PlacedWord[],
  foundWords: Set<string>,
  grace: number = SELECTION_GRACE,
): PlacedWord | null {
  if (cells.length < 2) return null;

  for (const placed of placedWords) {
    if (foundWords.has(placed.word)) continue;
    if (selectionMatchesWord(cells, placed, grace)) {
      return placed;
    }
  }

  return null;
}

export function formatTime(ms: number): string {
  const totalSec = Math.floor(Math.max(0, ms) / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function formatDuration(ms: number): string {
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  const min = Math.floor(ms / 60000);
  const sec = Math.round((ms % 60000) / 1000);
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}