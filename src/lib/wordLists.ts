import type { Category, CategoryId } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'animals', name: 'Animals', icon: '🦁', description: 'Creatures great and small', color: '#f59e0b', atlasX: 22, atlasY: 35 },
  { id: 'food', name: 'Food', icon: '🍕', description: 'Delicious bites from around the world', color: '#ef4444', atlasX: 50, atlasY: 20 },
  { id: 'sports', name: 'Sports', icon: '⚽', description: 'Athletic action and competition', color: '#22c55e', atlasX: 78, atlasY: 40 },
  { id: 'movies', name: 'Movies', icon: '🎬', description: 'Silver screen classics and hits', color: '#a855f7', atlasX: 30, atlasY: 68 },
  { id: 'geography', name: 'Geography', icon: '🌍', description: 'Places, landmarks, and wonders', color: '#3b82f6', atlasX: 68, atlasY: 65 },
  { id: 'kids', name: 'Kids', icon: '🎈', description: 'Fun words for young explorers', color: '#ec4899', atlasX: 15, atlasY: 55 },
  { id: 'holiday', name: 'Holiday', icon: '🎄', description: 'Festive cheer all year round', color: '#14b8a6', atlasX: 55, atlasY: 48 },
];

const WORD_BANKS: Record<CategoryId, string[]> = {
  animals: [
    'TIGER', 'EAGLE', 'WHALE', 'ZEBRA', 'PANDA', 'KOALA', 'OTTER', 'RABBIT',
    'DOLPHIN', 'PENGUIN', 'GIRAFFE', 'CHEETAH', 'LEOPARD', 'BUFFALO', 'COYOTE',
    'FALCON', 'PARROT', 'TURTLE', 'SALMON', 'SPIDER', 'MONKEY', 'DONKEY',
    'CAMEL', 'HORSE', 'SHEEP', 'GOOSE', 'MOOSE', 'BEAVER', 'BADGER', 'FERRET',
    'JAGUAR', 'COUGAR', 'LYNX', 'WALRUS', 'SEAL', 'SHARK', 'CORAL', 'HERON',
    'FINCH', 'ROBIN', 'SNAKE', 'LIZARD', 'GECKO', 'IGUANA', 'BISON', 'ELK',
  ],
  food: [
    'PIZZA', 'PASTA', 'SUSHI', 'TACOS', 'BREAD', 'APPLE', 'MANGO', 'GRAPE',
    'BANANA', 'CHERRY', 'COOKIE', 'WAFFLE', 'PANCAKE', 'BURGER', 'NACHOS',
    'RAMEN', 'CURRY', 'HUMMUS', 'OLIVE', 'BASIL', 'PEACH', 'MELON', 'LEMON',
    'LIME', 'ONION', 'GARLIC', 'CARROT', 'CELERY', 'BUTTER', 'CHEESE', 'YOGURT',
    'HONEY', 'SUGAR', 'FLOUR', 'TOAST', 'BACON', 'STEAK', 'SALAD', 'SOUP',
    'CREAM', 'MUFFIN', 'DONUT', 'BROWNIE', 'TRUFFLE', 'COCOA', 'LATTE', 'MOCHA',
  ],
  sports: [
    'SOCCER', 'TENNIS', 'GOLF', 'RUGBY', 'BOXING', 'HOCKEY', 'SKIING', 'RACING',
    'SURFING', 'ROWING', 'FENCING', 'ARCHERY', 'CYCLING', 'JOGGING', 'SPRINT',
    'MARATHON', 'VOLLEY', 'CRICKET', 'BASEBALL', 'LACROSSE', 'POLO', 'BOWLING',
    'DIVING', 'KAYAK', 'SAILING', 'CLIMBING', 'GYMNAST', 'WRESTLE', 'KARATE',
    'JUDO', 'SUMO', 'RALLY', 'DRIFT', 'SPRINT', 'RELAY', 'MEDAL', 'TROPHY',
    'COACH', 'ARENA', 'STADIUM', 'COURT', 'TRACK', 'RINK', 'FIELD', 'MATCH',
  ],
  movies: [
    'ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'THRILLER', 'FANTASY', 'ROMANCE',
    'SCIFI', 'OSCAR', 'ACTOR', 'SCENE', 'PLOT', 'TITLE', 'CREDIT', 'SCRIPT',
    'CAMERA', 'DIRECT', 'STUDIO', 'PREVIEW', 'SEQUEL', 'REMAKE', 'GENRE',
    'HERO', 'VILLAIN', 'CAST', 'FRAME', 'REEL', 'STAGE', 'CINEMA', 'THEATER',
    'TICKET', 'POPCORN', 'TRAILER', 'PREMIERE', 'BLOCKBUSTER', 'INDIE', 'NOIR',
    'WESTERN', 'MUSICAL', 'ANIMATION', 'DOCUMENTARY', 'ADVENTURE', 'MYSTERY',
  ],
  geography: [
    'AFRICA', 'EUROPE', 'ASIA', 'OCEAN', 'RIVER', 'LAKE', 'DESERT', 'VALLEY',
    'MOUNTAIN', 'ISLAND', 'COAST', 'BEACH', 'JUNGLE', 'FOREST', 'PLAINS',
    'TUNDRA', 'GLACIER', 'VOLCANO', 'CANYON', 'BAY', 'GULF', 'CAPE', 'REEF',
    'PARIS', 'TOKYO', 'CAIRO', 'DELHI', 'SYDNEY', 'LONDON', 'BERLIN', 'ROME',
    'MOSCOW', 'DUBAI', 'SEOUL', 'BRAZIL', 'CANADA', 'MEXICO', 'INDIA', 'CHINA',
    'SPAIN', 'ITALY', 'KENYA', 'PERU', 'CHILE', 'NORWAY', 'SWEDEN', 'POLAND',
  ],
  kids: [
    'BALLOON', 'KITE', 'DOLL', 'TOY', 'GAME', 'PLAY', 'FUN', 'HAPPY',
    'SMILE', 'DANCE', 'SING', 'DRAW', 'PAINT', 'COLOR', 'CRAYON', 'PENCIL',
    'BOOK', 'STORY', 'FAIRY', 'MAGIC', 'DRAGON', 'CASTLE', 'PRINCE', 'PRINCESS',
    'PUPPY', 'KITTEN', 'BUNNY', 'FROG', 'BIRD', 'FISH', 'STAR', 'MOON',
    'SUN', 'CLOUD', 'RAIN', 'SNOW', 'RAINBOW', 'FLOWER', 'TREE', 'GRASS',
    'SCHOOL', 'FRIEND', 'FAMILY', 'PARTY', 'CAKE', 'CANDY', 'PIZZA', 'PIRATE',
  ],
  holiday: [
    'CHRISTMAS', 'EASTER', 'HANUKKAH', 'KWANZAA', 'DIWALI', 'HALLOWEEN',
    'THANKS', 'NEWYEAR', 'VALENTINE', 'MOTHERS', 'FATHERS', 'BIRTHDAY',
    'WREATH', 'ORNAMENT', 'TINSEL', 'STOCKING', 'MISTLETOE', 'HOLLY',
    'PUMPKIN', 'CANDLE', 'FIREWORK', 'PARADE', 'FEAST', 'GIFT', 'CAROL',
    'SNOWMAN', 'SLEIGH', 'REINDEER', 'ELVES', 'ANGEL', 'STAR', 'BELL',
    'TURKEY', 'GRAVY', 'CIDER', 'EGGNOG', 'COOKIE', 'FROSTING', 'SPIRIT',
    'JOY', 'PEACE', 'CHEER', 'MAGIC', 'WONDER', 'CELEBRATE', 'FESTIVE',
  ],
};

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id)!;
}

export function getWordsForCategory(
  category: CategoryId,
  count: number,
  rng: () => number,
  minLen = 3,
  maxLen = 15,
): string[] {
  const bank = WORD_BANKS[category].filter(
    (w) => w.length >= minLen && w.length <= maxLen,
  );
  const pool = [...bank];
  const selected: string[] = [];

  while (selected.length < count && pool.length > 0) {
    const idx = Math.floor(rng() * pool.length);
    selected.push(pool.splice(idx, 1)[0]);
  }

  return selected.sort((a, b) => a.localeCompare(b));
}