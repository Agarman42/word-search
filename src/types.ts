export type CategoryId =
  | 'animals'
  | 'food'
  | 'sports'
  | 'movies'
  | 'geography'
  | 'kids'
  | 'holiday'
  | 'science'
  | 'music'
  | 'nature'
  | 'space'
  | 'books';

export type GameMode = 'relaxed' | 'timed' | 'daily' | 'blitz' | 'zen' | 'coop';

export type DifficultyPreset = 'easy' | 'medium' | 'hard' | 'expert' | 'longform' | 'custom';

export type WordLengthPreset = 'short' | 'mixed' | 'long' | 'epic';

export type MasteryTier = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';

export type SoundPack = 'classic' | 'minimal' | 'off';

export type Screen =
  | 'home'
  | 'puzzles'
  | 'categories'
  | 'game'
  | 'settings'
  | 'stats'
  | 'achievements'
  | 'atlas'
  | 'weekly'
  | 'packs';

export type PuzzleTab = 'categories' | 'packs' | 'atlas';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  color: string;
  atlasX: number;
  atlasY: number;
}

export interface Settings {
  gridSize: number;
  wordCount: number;
  gameMode: GameMode;
  difficultyPreset: DifficultyPreset;
  wordLengthPreset: WordLengthPreset;
  allowBackwards: boolean;
  haptics: boolean;
  sound: boolean;
  soundPack: SoundPack;
  reduceMotion: boolean;
  colorblindMode: boolean;
  highContrast: boolean;
  fontScale: number;
  oneHandMode: boolean;
  lightBackground: boolean;
  showFacts: boolean;
}

export interface PuzzleOptions {
  allowBackwards: boolean;
  minWordLength: number;
  maxWordLength: number;
}

export interface Cell {
  row: number;
  col: number;
}

export interface PlacedWord {
  word: string;
  cells: Cell[];
  direction: string;
}

export interface Puzzle {
  grid: string[][];
  words: PlacedWord[];
  category: CategoryId;
  seed: string;
  gridSize: number;
}

export interface GameRecord {
  id: string;
  category: CategoryId;
  mode: GameMode;
  gridSize: number;
  wordCount: number;
  timeMs: number;
  wrongAttempts: number;
  completedAt: number;
  isDaily: boolean;
  wordsFound?: number;
  packId?: string;
  packLevel?: number;
  usedHint?: boolean;
}

export interface Stats {
  totalPuzzlesCompleted: number;
  totalWordsFound: number;
  totalPlayTimeMs: number;
  totalWrongAttempts: number;
  bestTimes: Partial<Record<CategoryId | 'overall', number>>;
  categoryCompletions: Partial<Record<CategoryId, number>>;
  categoryMastery: Partial<Record<CategoryId, MasteryTier>>;
  dailyStreak: number;
  longestDailyStreak: number;
  lastDailyDate: string | null;
  completedDailyDates: string[];
  recentGames: GameRecord[];
  favoriteWords: string[];
  blitzHighScore: number;
  weekWordsFound: number;
  weekStartDate: string | null;
  packProgress: Partial<Record<string, number>>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
}

export interface AppState {
  settings: Settings;
  stats: Stats;
  achievements: Achievement[];
}

export interface ChallengeParams {
  seed: string;
  category: CategoryId;
  /** Encoded so shared puzzles match for every player. */
  gridSize?: number;
  wordCount?: number;
  allowBackwards?: boolean;
  minWordLength?: number;
  maxWordLength?: number;
}

export const DEFAULT_SETTINGS: Settings = {
  gridSize: 10,
  wordCount: 12,
  gameMode: 'relaxed',
  difficultyPreset: 'medium',
  wordLengthPreset: 'mixed',
  allowBackwards: false,
  haptics: true,
  sound: true,
  soundPack: 'classic',
  reduceMotion: false,
  colorblindMode: false,
  highContrast: false,
  fontScale: 1,
  oneHandMode: false,
  lightBackground: true,
  showFacts: true,
};