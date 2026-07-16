import { describe, expect, it } from 'vitest';
import { computeMasteryTier, getMasteryProgress } from './mastery';

describe('mastery', () => {
  it('requires 3 completions for bronze', () => {
    expect(computeMasteryTier(0)).toBe('none');
    expect(computeMasteryTier(1)).toBe('none');
    expect(computeMasteryTier(2)).toBe('none');
    expect(computeMasteryTier(3)).toBe('bronze');
  });

  it('progress is non-negative toward bronze', () => {
    const p = getMasteryProgress(1);
    expect(p.tier).toBe('none');
    expect(p.progress).toBeGreaterThanOrEqual(0);
    expect(p.progress).toBeLessThan(100);
  });
});