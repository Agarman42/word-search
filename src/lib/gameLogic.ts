import type { Cell, PlacedWord } from '../types';

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

export function findMatchingWord(
  grid: string[][],
  cells: Cell[],
  placedWords: PlacedWord[],
  foundWords: Set<string>,
): PlacedWord | null {
  if (cells.length < 2) return null;

  const forward = getWordFromCells(grid, cells);
  const reversed = [...cells].reverse();
  const backward = getWordFromCells(grid, reversed);

  for (const placed of placedWords) {
    if (foundWords.has(placed.word)) continue;

    const placedKeys = placed.cells.map(cellKey).join('|');
    const selectedKeys = cells.map(cellKey).join('|');
    const reversedKeys = reversed.map(cellKey).join('|');

    if (
      (placed.word === forward || placed.word === backward) &&
      (selectedKeys === placedKeys || selectedKeys === reversedKeys)
    ) {
      return placed;
    }
  }

  return null;
}

export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
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