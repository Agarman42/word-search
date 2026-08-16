import { describe, expect, it } from 'vitest';
import { displayWord } from './wordDisplay';

describe('displayWord', () => {
  it('shows human names for curated grid forms', () => {
    expect(displayWord('KASH')).toBe('Ka$h');
    expect(displayWord('NEWYORK')).toBe('New York');
    expect(displayWord('GREATAMERICANBALLPARK')).toBe('Great American Ball Park');
    expect(displayWord('DOMINICANREPUBLIC')).toBe('Dominican Republic');
    expect(displayWord('THESTADIUM')).toBe('The Stadium');
    expect(displayWord('ADAM')).toBe('Adam');
  });

  it('leaves unknown words unchanged', () => {
    expect(displayWord('WHALE')).toBe('WHALE');
  });
});
