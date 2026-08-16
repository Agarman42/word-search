import type { PuzzleOptions } from '../types';

/** Grid form: uppercase, spaces removed, `$` stripped (Ka$h → KASH). */
export function toGridForm(display: string): string {
  return display.toUpperCase().replace(/[\s$]/g, '');
}

export const CURATED_PACK_IDS = [
  'vacation-destinations',
  'stadiums',
  'pet-names',
  'family-member-names',
] as const;

export type CuratedPackId = (typeof CURATED_PACK_IDS)[number];

export interface CuratedPackDef {
  id: CuratedPackId;
  name: string;
  displays: readonly string[];
  gridSize: number;
  allowBackwards: boolean;
}

export const CURATED_PACK_DEFS: readonly CuratedPackDef[] = [
  {
    id: 'vacation-destinations',
    name: 'Vacation Destinations',
    gridSize: 20,
    allowBackwards: true,
    displays: [
      'Florida',
      'Colorado',
      'Nevada',
      'New York',
      'Connecticut',
      'Massachusetts',
      'West Virginia',
      'Michigan',
      'Canada',
      'Dominican Republic',
      'Mexico',
      'Tennessee',
      'Ohio',
      'Illinois',
    ],
  },
  {
    id: 'stadiums',
    name: 'Stadiums',
    gridSize: 22,
    allowBackwards: true,
    displays: [
      'Wrigley Field',
      'Fenway Park',
      'The Stadium',
      'Comerica Park',
      'Progressive Field',
      'Lucas Oil',
      'Milehigh',
      'Tropicana',
      'Great American Ball Park',
      'Mackey Arena',
      'Ross Ade',
      'Nissan',
      'Spartan',
      'Horseshoe',
      'Gainbridge',
      'Rate Field',
    ],
  },
  {
    id: 'pet-names',
    name: 'Pet names',
    gridSize: 14,
    allowBackwards: true,
    displays: [
      'Kash',
      'King',
      'Mila',
      'Bankers',
      'Diamond',
      'Oreo',
      'Koda',
      'Gracie',
      'Ted',
      'Bear',
      'Tim',
      'Harley',
      'Bella',
      'Boozer',
      'Brody',
      'Bailey',
      'Jax',
      'Ruby',
      'Walter',
    ],
  },
  {
    id: 'family-member-names',
    name: 'Family Member Names',
    gridSize: 12,
    allowBackwards: true,
    displays: [
      'Adam',
      'Angie',
      'Avery',
      'Beth',
      'Jody',
      'Dan',
      'Daniel',
      'Isaiah',
      'Angelina',
      'Aubree',
      'Jordan',
      'Jaiden',
      'Heather',
      'Scott',
      'Dave',
    ],
  },
];

export function getCuratedDef(packId: string): CuratedPackDef | undefined {
  return CURATED_PACK_DEFS.find((d) => d.id === packId);
}

export function isCuratedPack(packId: string | undefined | null): packId is CuratedPackId {
  return !!packId && (CURATED_PACK_IDS as readonly string[]).includes(packId);
}

export function getCuratedGridWords(packId: string): string[] {
  const def = getCuratedDef(packId);
  return def ? def.displays.map(toGridForm) : [];
}

export function getCuratedDisplayMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const def of CURATED_PACK_DEFS) {
    for (const display of def.displays) {
      map[toGridForm(display)] = display;
    }
  }
  return map;
}

export const CURATED_WORD_LABELS = getCuratedDisplayMap();

export function getCuratedLevelConfig(packId: string): {
  gridSize: number;
  wordCount: number;
  options: PuzzleOptions;
  wordPool: string[];
} | null {
  const def = getCuratedDef(packId);
  if (!def) return null;
  const wordPool = def.displays.map(toGridForm);
  return {
    gridSize: def.gridSize,
    wordCount: wordPool.length,
    options: {
      allowBackwards: def.allowBackwards,
      minWordLength: 2,
      maxWordLength: def.gridSize,
    },
    wordPool,
  };
}
