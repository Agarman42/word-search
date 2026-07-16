import { describe, expect, it } from 'vitest';
import {
  pathContains,
  selectionMatchesWord,
  getRevealCells,
  findMatchingWord,
  SELECTION_GRACE,
} from './gameLogic';
import type { PlacedWord } from '../types';

const cat: PlacedWord = {
  word: 'CAT',
  cells: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
  ],
  direction: 'H',
};

describe('pathContains / selectionMatchesWord', () => {
  it('matches exact forward path', () => {
    expect(pathContains(cat.cells, cat.cells)).toBe(true);
    expect(selectionMatchesWord(cat.cells, cat)).toBe(true);
  });

  it('matches reverse swipe', () => {
    const rev = [...cat.cells].reverse();
    expect(selectionMatchesWord(rev, cat)).toBe(true);
  });

  it('allows grace overshoot at end', () => {
    const over = [...cat.cells, { row: 0, col: 3 }];
    expect(pathContains(over, cat.cells, SELECTION_GRACE)).toBe(true);
    expect(selectionMatchesWord(over, cat)).toBe(true);
  });

  it('rejects too much overshoot', () => {
    const over = [
      ...cat.cells,
      { row: 0, col: 3 },
      { row: 0, col: 4 },
      { row: 0, col: 5 },
    ];
    expect(pathContains(over, cat.cells, SELECTION_GRACE)).toBe(false);
  });

  it('rejects undershoot', () => {
    expect(pathContains(cat.cells.slice(0, 2), cat.cells)).toBe(false);
  });
});

describe('getRevealCells', () => {
  it('returns forward cells for forward swipe', () => {
    expect(getRevealCells(cat, cat.cells)).toEqual(cat.cells);
  });

  it('returns reverse cells for reverse swipe', () => {
    const rev = [...cat.cells].reverse();
    expect(getRevealCells(cat, rev)).toEqual(rev);
  });
});

describe('findMatchingWord', () => {
  it('finds reverse selection', () => {
    const grid = [['C', 'A', 'T']];
    const match = findMatchingWord(grid, [...cat.cells].reverse(), [cat], new Set());
    expect(match?.word).toBe('CAT');
  });

  it('skips already found', () => {
    const grid = [['C', 'A', 'T']];
    const match = findMatchingWord(grid, cat.cells, [cat], new Set(['CAT']));
    expect(match).toBeNull();
  });
});