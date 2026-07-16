import type { CategoryId, PuzzleOptions } from '../types';
import { getPack } from './packs';

export interface PackLevelConfig {
  gridSize: number;
  wordCount: number;
  options: PuzzleOptions;
  /** Optional curated words for this pack (shared across levels; generator still shuffles by seed). */
  wordPool?: string[];
}

/** Per-pack themed word pools (subset of category feel, more authored). */
export const PACK_WORD_POOLS: Partial<Record<string, string[]>> = {
  'ocean-creatures': [
    'WHALE', 'DOLPHIN', 'SHARK', 'CORAL', 'REEF', 'OCTOPUS', 'SQUID', 'CRAB',
    'LOBSTER', 'SEAL', 'WALRUS', 'ORCA', 'MANATEE', 'NARWHAL', 'STINGRAY',
    'JELLYFISH', 'SEAHORSE', 'SALMON', 'TURTLE', 'PENGUIN', 'PELICAN', 'HERON',
    'ANEMONE', 'KRILL', 'PLANKTON', 'CURRENT', 'TIDE', 'WAVE', 'LAGOON', 'ABYSS',
    'STARFISH', 'URCHIN', 'CLAM', 'OYSTER', 'MUSSEL', 'KELP', 'ALGAE', 'WHIRLPOOL',
  ],
  'world-kitchen': [
    'PIZZA', 'SUSHI', 'TACOS', 'RAMEN', 'CURRY', 'HUMMUS', 'PASTA', 'BREAD',
    'CHEESE', 'GARLIC', 'BASIL', 'SPAGHETTI', 'RISOTTO', 'GNOCCHI', 'CROISSANT',
    'BAGUETTE', 'GUACAMOLE', 'AVOCADO', 'NOODLE', 'DUMPLING', 'SAFFRON', 'PAPRIKA',
    'CINNAMON', 'GINGER', 'TURMERIC', 'WASABI', 'SOYSAUCE', 'OLIVE', 'TRUFFLE',
  ],
  'champion-league': [
    'SOCCER', 'TENNIS', 'HOCKEY', 'RUGBY', 'BOXING', 'GOLF', 'SURFING', 'SKIING',
    'MARATHON', 'SPRINT', 'RELAY', 'MEDAL', 'TROPHY', 'STADIUM', 'ARENA', 'COACH',
    'GOALKEEPER', 'STRIKER', 'OLYMPICS', 'CHAMPION', 'PLAYOFF', 'VICTORY', 'ATHLETE',
  ],
  'long-words': [
    'PHOTOSYNTHESIS', 'CHROMOSOME', 'LABORATORY', 'MICROSCOPE', 'EVOLUTION',
    'ATMOSPHERE', 'HYDROSPHERE', 'BIODIVERSITY', 'CHROMATOGRAPHY', 'SPECTROSCOPY',
    'MITOCHONDRIA', 'ENDANGERED', 'EXPERIMENT', 'HYPOTHESIS', 'SCIENTIFIC',
    'MOLECULES', 'RADIATION', 'GRAVITATION', 'TELESCOPE', 'ASTROPHYSICS',
  ],
  'spooky-search': [
    'GHOST', 'WITCH', 'PUMPKIN', 'CANDLE', 'SPIDER', 'SKELETON', 'MONSTER',
    'HAUNTED', 'GOBLIN', 'VAMPIRE', 'ZOMBIE', 'MUMMY', 'BROOM', 'CAULDRON',
    'CANDY', 'MASK', 'COSTUME', 'SPOOKY', 'CREEPY', 'SHADOW', 'NIGHT', 'BAT',
  ],
  'winter-fest': [
    'SNOWMAN', 'SLEIGH', 'REINDEER', 'STOCKING', 'WREATH', 'TINSEL', 'HOLLY',
    'MISTLETOE', 'CAROL', 'GIFT', 'FIREPLACE', 'EVERGREEN', 'CANDLE', 'SNOW',
    'FROST', 'ICICLE', 'COCOA', 'COOKIE', 'CHIMNEY', 'SANTA', 'ELF', 'BELL',
  ],
};

/** Difficulty ramp across pack levels (0-indexed). */
export function getPackLevelConfig(packId: string, level: number): PackLevelConfig {
  const isLong = packId === 'long-words';
  const wordPool = PACK_WORD_POOLS[packId];

  // Levels 0–2 easy, 3–6 medium, 7–9 harder
  let gridSize = 10;
  let wordCount = 10;
  let minLen = 4;
  let maxLen = 8;
  let allowBackwards = false;

  if (level <= 2) {
    gridSize = 8;
    wordCount = 8;
    minLen = 3;
    maxLen = 6;
  } else if (level <= 6) {
    gridSize = 10;
    wordCount = 12;
    minLen = 4;
    maxLen = 8;
  } else {
    gridSize = 12;
    wordCount = 14;
    minLen = 5;
    maxLen = 10;
    allowBackwards = true;
  }

  if (isLong) {
    gridSize = Math.max(gridSize, 12);
    wordCount = Math.min(wordCount, 10);
    minLen = 8;
    maxLen = Math.min(15, gridSize);
    allowBackwards = true;
  }

  return {
    gridSize,
    wordCount,
    options: {
      allowBackwards,
      minWordLength: Math.min(minLen, gridSize),
      maxWordLength: Math.min(maxLen, gridSize),
    },
    wordPool,
  };
}

export function getPackCategory(packId: string): CategoryId {
  return getPack(packId)?.category ?? 'animals';
}