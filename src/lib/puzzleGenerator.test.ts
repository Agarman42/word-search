import { describe, expect, it } from 'vitest';
import { generatePuzzle } from './puzzleGenerator';

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
});