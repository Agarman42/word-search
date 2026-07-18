import { describe, expect, it } from 'vitest';
import { directionBalanceScore, generatePuzzle } from './puzzleGenerator';

function countDirs(words: { cells: { row: number; col: number }[] }[]) {
  let H = 0;
  let V = 0;
  let D = 0;
  for (const w of words) {
    if (w.cells.length < 2) continue;
    const dr = Math.sign(w.cells[1].row - w.cells[0].row);
    const dc = Math.sign(w.cells[1].col - w.cells[0].col);
    if (dr === 0) H++;
    else if (dc === 0) V++;
    else D++;
  }
  return { H, V, D };
}

describe('generatePuzzle', () => {
  it('is deterministic for a fixed seed', () => {
    const a = generatePuzzle('animals', 10, 10, 'seed-a', {
      allowBackwards: false,
      minWordLength: 4,
      maxWordLength: 8,
    });
    const b = generatePuzzle('animals', 10, 10, 'seed-a', {
      allowBackwards: false,
      minWordLength: 4,
      maxWordLength: 8,
    });
    expect(a.grid).toEqual(b.grid);
    expect(a.words.map((w) => w.word)).toEqual(b.words.map((w) => w.word));
  });

  it('does not hang when words are longer than grid', () => {
    const start = Date.now();
    const p = generatePuzzle('science', 8, 12, 'epic-tiny', {
      allowBackwards: true,
      minWordLength: 8,
      maxWordLength: 15,
    });
    expect(Date.now() - start).toBeLessThan(5000);
    expect(p.grid.length).toBe(8);
    expect(p.words.every((w) => w.word.length <= 8)).toBe(true);
  });

  it('mixes horizontal, vertical, and diagonal directions', () => {
    // Sample several seeds — none should be 90% one axis
    const seeds = ['mix-1', 'mix-2', 'mix-3', 'mix-4', 'mix-5', 'daily-mix', 'pack-mix'];
    for (const seed of seeds) {
      const p = generatePuzzle('animals', 10, 12, seed, {
        allowBackwards: false,
        minWordLength: 4,
        maxWordLength: 8,
      });
      expect(p.words.length).toBeGreaterThanOrEqual(8);
      const { H, V, D } = countDirs(p.words);
      const total = H + V + D;
      // No single axis should dominate more than ~70%
      expect(H / total).toBeLessThan(0.7);
      expect(V / total).toBeLessThan(0.7);
      // Prefer all three present when possible
      const kindsPresent = [H, V, D].filter((n) => n > 0).length;
      expect(kindsPresent).toBeGreaterThanOrEqual(2);
    }
  });

  it('scores balanced boards higher than skewed ones', () => {
    const balanced = [
      { cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }] }, // H
      { cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }] }, // V
      { cells: [{ row: 0, col: 0 }, { row: 1, col: 1 }] }, // D
      { cells: [{ row: 2, col: 0 }, { row: 2, col: 1 }] }, // H
      { cells: [{ row: 0, col: 2 }, { row: 1, col: 2 }] }, // V
      { cells: [{ row: 0, col: 3 }, { row: 1, col: 2 }] }, // D
    ];
    const horizontal = Array.from({ length: 6 }, () => ({
      cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }],
    }));
    expect(directionBalanceScore(balanced as never)).toBeGreaterThan(
      directionBalanceScore(horizontal as never),
    );
  });
});