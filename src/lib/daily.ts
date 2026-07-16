import type { CategoryId, Stats } from '../types';

const DAILY_CATEGORIES: CategoryId[] = [
  'animals', 'food', 'sports', 'movies', 'geography', 'kids', 'holiday',
  'science', 'music', 'nature', 'space', 'books',
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const COMMENTARY: Record<CategoryId, string[]> = {
  animals: [
    'Creatures great and small await your keen eye.',
    'The wild kingdom hides in plain sight today.',
    'Track the beasts woven through the grid.',
  ],
  food: [
    'A feast of flavors scattered across the board.',
    'Every bite-sized word is hiding in plain sight.',
    "Today's menu: delicious discoveries only.",
  ],
  sports: [
    'Athletic action packed into every line.',
    'Champions find words under pressure.',
    "Game day energy fuels today's puzzle.",
  ],
  movies: [
    'Silver screen secrets lie in the letters.',
    'Scene by scene, word by word.',
    "Today's feature: a blockbuster grid.",
  ],
  geography: [
    'Journey across lands without leaving your seat.',
    'Landmarks and locales woven into the maze.',
    'Explore the world one word at a time.',
  ],
  kids: [
    'Playful words for curious minds.',
    'Fun and friendly finds await.',
    'A puzzle sized for wonder.',
  ],
  holiday: [
    'Festive cheer sparkles in every corner.',
    "Celebrate with today's hidden treasures.",
    "Season's greetings — now go find them.",
  ],
  science: [
    "Hypothesize, then hunt — today's lab is the grid.",
    'Microscopes not required; curiosity is.',
    'Elements of surprise in every line.',
  ],
  music: [
    'Find the rhythm hidden in the letters.',
    'From sonatas to solos — words await.',
    "Today's puzzle hits all the right notes.",
  ],
  nature: [
    'Wander wild paths through the letter maze.',
    'Weather, woodlands, and wonder today.',
    "Nature's vocabulary is vast — start here.",
  ],
  space: [
    'Launch into a cosmic word expedition.',
    'Stars align when you find them all.',
    'Orbital thinking helps on this grid.',
  ],
  books: [
    'Turn the page — every line tells a story.',
    'Plot twists hide in plain sight today.',
    'A literary hunt across the board.',
  ],
};

export function getDailyCategory(dateStr: string): CategoryId {
  const d = new Date(dateStr + 'T12:00:00');
  return DAILY_CATEGORIES[d.getDay() % DAILY_CATEGORIES.length];
}

export function getDailyNumber(dateStr: string): number {
  const epoch = new Date('2026-01-01T12:00:00').getTime();
  const d = new Date(dateStr + 'T12:00:00').getTime();
  return Math.floor((d - epoch) / 86400000) + 1;
}

export function getDailyCommentary(dateStr: string, category: CategoryId): string {
  const day = new Date(dateStr + 'T12:00:00').getDay();
  const lines = COMMENTARY[category];
  return lines[day % lines.length];
}

export function getDailyTitle(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return `${DAY_NAMES[d.getDay()]}'s Challenge`;
}

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dayNum = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dayNum}`;
}

export interface WeeklyDayActivity {
  day: string;
  puzzles: number;
  words: number;
}

export interface WeeklyRecapData {
  weekStart: string;
  wordsFound: number;
  puzzlesCompleted: number;
  dailiesCompleted: number;
  bestStreak: number;
  topCategory: CategoryId | null;
  dayActivity: WeeklyDayActivity[];
  bestDay: string | null;
  suggestedCategory: CategoryId;
}

export function getWeeklyRecap(stats: Stats): WeeklyRecapData {
  const weekStart = stats.weekStartDate ?? getWeekStart();
  const weekGames = stats.recentGames.filter((g) => {
    const d = new Date(g.completedAt).toISOString().slice(0, 10);
    return d >= weekStart;
  });

  const dailies = stats.completedDailyDates.filter((d) => d >= weekStart).length;

  let topCategory: CategoryId | null = null;
  let topCount = 0;
  for (const g of weekGames) {
    const c = stats.categoryCompletions[g.category] ?? 0;
    if (c > topCount) {
      topCount = c;
      topCategory = g.category;
    }
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayActivity: WeeklyDayActivity[] = dayLabels.map((day) => ({
    day,
    puzzles: 0,
    words: 0,
  }));

  for (const g of weekGames) {
    const d = new Date(g.completedAt);
    const idx = d.getDay();
    dayActivity[idx].puzzles += 1;
    dayActivity[idx].words += g.wordsFound ?? g.wordCount;
  }

  let bestDay: string | null = null;
  let bestDayCount = 0;
  for (const entry of dayActivity) {
    if (entry.puzzles > bestDayCount) {
      bestDayCount = entry.puzzles;
      bestDay = entry.day;
    }
  }

  let suggestedCategory: CategoryId = DAILY_CATEGORIES[0];
  let fewest = Infinity;
  for (const cat of DAILY_CATEGORIES) {
    const count = stats.categoryCompletions[cat] ?? 0;
    if (count < fewest) {
      fewest = count;
      suggestedCategory = cat;
    }
  }

  return {
    weekStart,
    wordsFound: stats.weekWordsFound,
    puzzlesCompleted: weekGames.length,
    dailiesCompleted: dailies,
    bestStreak: stats.dailyStreak,
    topCategory,
    dayActivity,
    bestDay,
    suggestedCategory,
  };
}