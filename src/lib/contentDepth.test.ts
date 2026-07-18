import { describe, expect, it } from 'vitest';
import { formatWordFloor, getContentDepth } from './contentDepth';

describe('contentDepth', () => {
  it('floors word counts to a stable “N+” claim', () => {
    expect(formatWordFloor(3651)).toBe('3,600+');
    expect(formatWordFloor(99)).toBe('0+');
    expect(formatWordFloor(100)).toBe('100+');
  });

  it('derives home line from live banks and packs', () => {
    const d = getContentDepth();
    expect(d.categoryCount).toBeGreaterThanOrEqual(16);
    expect(d.uniqueWords).toBeGreaterThanOrEqual(3000);
    expect(d.packLevels).toBeGreaterThanOrEqual(100);
    expect(d.homeLine).toMatch(/\d+ categories · [\d,]+?\+ words · \d+ pack levels/);
  });
});
