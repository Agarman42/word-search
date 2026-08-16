import { describe, expect, it } from 'vitest';
import { getWordsForCategory } from './wordLists';
import { createRng } from './rng';
import { getPackLevelConfig } from './packLevels';
import {
  CURATED_PACK_DEFS,
  CURATED_PACK_IDS,
  getCuratedGridWords,
  toGridForm,
} from './curatedPacks';

describe('curated family packs', () => {
  it('has exactly four packs with the expected word counts', () => {
    expect(CURATED_PACK_IDS).toEqual([
      'vacation-destinations',
      'stadiums',
      'pet-names',
      'family-member-names',
    ]);
    expect(getCuratedGridWords('vacation-destinations')).toHaveLength(14);
    expect(getCuratedGridWords('stadiums')).toHaveLength(16);
    expect(getCuratedGridWords('pet-names')).toHaveLength(19);
    expect(getCuratedGridWords('family-member-names')).toHaveLength(15);
  });

  it('uses unique grid forms and keeps every word on its grid', () => {
    for (const def of CURATED_PACK_DEFS) {
      const grids = def.displays.map(toGridForm);
      expect(new Set(grids).size).toBe(grids.length);
      expect(Math.max(...grids.map((w) => w.length))).toBeLessThanOrEqual(def.gridSize);
      expect(grids.every((w) => w.length >= 3)).toBe(true);
      expect(grids.every((w) => /^[A-Z]+$/.test(w))).toBe(true);
    }
  });

  it('maps Ka$h, multi-word names, and stadium nicknames to grid form', () => {
    expect(toGridForm('Ka$h')).toBe('KASH');
    expect(toGridForm('New York')).toBe('NEWYORK');
    expect(toGridForm('Dominican Republic')).toBe('DOMINICANREPUBLIC');
    expect(toGridForm('Great American Ball Park')).toBe('GREATAMERICANBALLPARK');
    expect(toGridForm('West Virginia')).toBe('WESTVIRGINIA');
    expect(toGridForm('The Stadium')).toBe('THESTADIUM');
    expect(toGridForm('Milehigh')).toBe('MILEHIGH');
  });

  it('overrides getPackLevelConfig so the full list stays in range', () => {
    for (const def of CURATED_PACK_DEFS) {
      const cfg = getPackLevelConfig(def.id, 0);
      const pool = getCuratedGridWords(def.id);
      expect(cfg.wordCount).toBe(pool.length);
      expect(cfg.gridSize).toBe(def.gridSize);
      expect(cfg.gridSize).toBeGreaterThanOrEqual(Math.max(...pool.map((w) => w.length)));
      expect(cfg.options.minWordLength).toBeLessThanOrEqual(3);
      expect(cfg.options.maxWordLength).toBe(def.gridSize);
      expect(cfg.wordPool).toEqual(pool);

      const picked = getWordsForCategory(
        'animals',
        cfg.wordCount,
        createRng(`curated-${def.id}`),
        cfg.options.minWordLength,
        cfg.options.maxWordLength,
        cfg.wordPool,
      );
      expect(picked).toHaveLength(pool.length);
      expect(picked.sort()).toEqual([...pool].sort());
    }
  });
});
