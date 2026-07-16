import { describe, expect, it } from 'vitest';
import { addDaysToDateString, todayString } from './rng';

describe('local dates', () => {
  it('formats YYYY-MM-DD', () => {
    expect(todayString(new Date(2026, 6, 16))).toBe('2026-07-16');
  });

  it('adds days across month boundaries', () => {
    expect(addDaysToDateString('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDaysToDateString('2026-07-16', -1)).toBe('2026-07-15');
  });
});