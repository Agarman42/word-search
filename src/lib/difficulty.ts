import type { DifficultyPreset, PuzzleOptions, Settings } from '../types';

export interface DifficultyConfig {
  gridSize: number;
  wordCount: number;
  allowBackwards: boolean;
  minWordLength: number;
  maxWordLength: number;
  label: string;
  desc: string;
}

export const DIFFICULTY_PRESETS: Record<Exclude<DifficultyPreset, 'custom'>, DifficultyConfig> = {
  easy: {
    gridSize: 8,
    wordCount: 8,
    allowBackwards: false,
    minWordLength: 3,
    maxWordLength: 6,
    label: 'Easy',
    desc: '8×8 grid · short words · forward only',
  },
  medium: {
    gridSize: 10,
    wordCount: 12,
    allowBackwards: false,
    minWordLength: 4,
    maxWordLength: 8,
    label: 'Medium',
    desc: '10×10 grid · balanced challenge',
  },
  hard: {
    gridSize: 12,
    wordCount: 15,
    allowBackwards: true,
    minWordLength: 5,
    maxWordLength: 10,
    label: 'Hard',
    desc: '12×12 grid · backwards allowed',
  },
  expert: {
    gridSize: 15,
    wordCount: 18,
    allowBackwards: true,
    minWordLength: 6,
    maxWordLength: 14,
    label: 'Expert',
    desc: '15×15 grid · maximum challenge',
  },
};

export function getPuzzleOptions(settings: Settings): PuzzleOptions {
  if (settings.difficultyPreset !== 'custom') {
    const p = DIFFICULTY_PRESETS[settings.difficultyPreset];
    return {
      allowBackwards: p.allowBackwards,
      minWordLength: p.minWordLength,
      maxWordLength: p.maxWordLength,
    };
  }
  return {
    allowBackwards: settings.allowBackwards,
    minWordLength: 3,
    maxWordLength: 15,
  };
}

export function applyDifficultyPreset(preset: DifficultyPreset): Partial<Settings> {
  if (preset === 'custom') return { difficultyPreset: 'custom' };
  const p = DIFFICULTY_PRESETS[preset];
  return {
    difficultyPreset: preset,
    gridSize: p.gridSize,
    wordCount: p.wordCount,
    allowBackwards: p.allowBackwards,
  };
}

export function getEffectiveGridSettings(settings: Settings): {
  gridSize: number;
  wordCount: number;
} {
  if (settings.gameMode === 'blitz') {
    return { gridSize: 10, wordCount: 20 };
  }
  return { gridSize: settings.gridSize, wordCount: settings.wordCount };
}