import { describe, expect, it } from 'vitest';
import { getWordsForCategory } from './wordLists';
import { createRng } from './rng';

describe('getWordsForCategory', () => {
  it('avoids recently seen words when the bank is large enough', () => {
    const rng = createRng('anti-repeat-a');
    const first = getWordsForCategory('animals', 12, rng, 4, 10);
    expect(first.length).toBe(12);

    const rng2 = createRng('anti-repeat-b');
    const second = getWordsForCategory('animals', 12, rng2, 4, 10, undefined, first);
    const overlap = second.filter((w) => first.includes(w));
    expect(overlap.length).toBe(0);
  });

  it('falls back to excluded words only when the fresh pool is exhausted', () => {
    const tiny = ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF'];
    const rng = createRng('tiny-pool');
    const picked = getWordsForCategory('animals', 5, rng, 3, 3, tiny, tiny.slice(0, 4));
    expect(picked.length).toBe(5);
    // Must include some recycled words once fresh (EEE/FFF) are not enough
    const recycled = picked.filter((w) => tiny.slice(0, 4).includes(w));
    expect(recycled.length).toBeGreaterThan(0);
  });
});
