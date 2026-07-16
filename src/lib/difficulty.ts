import type { DifficultyPreset, PuzzleOptions, Settings } from '../types';
import { getWordLengthRange } from './wordLength';

export interface DifficultyConfig {
  gridSize: number;
  wordCount: number;
  allowBackwards: boolean;
  label: string;
  desc: string;
}

export const DIFFICULTY_PRESETS: Record<Exclude<DifficultyPreset, 'custom'>, DifficultyConfig> = {
  easy: {
    gridSize: 8,
    wordCount: 8,
    allowBackwards: false,
    label: 'Easy',
    desc: '8×8 grid · forward only',
  },
  medium: {
    gridSize: 10,
    wordCount: 12,
    allowBackwards: false,
    label: 'Medium',
    desc: '10×10 grid · balanced challenge',
  },
  hard: {
    gridSize: 12,
    wordCount: 15,
    allowBackwards: true,
    label: 'Hard',
    desc: '12×12 grid · backwards allowed',
  },
  expert: {
    gridSize: 15,
    wordCount: 18,
    allowBackwards: true,
    label: 'Expert',
    desc: '15×15 grid · maximum density',
  },
  longform: {
    gridSize: 14,
    wordCount: 16,
    allowBackwards: true,
    label: 'Long Form',
    desc: '14×14 grid · built for longer words',
  },
};

export function getPuzzleOptions(settings: Settings): PuzzleOptions {
  const { min, max } = getWordLengthRange(settings.wordLengthPreset);
  const allowBackwards =
    settings.difficultyPreset === 'custom'
      ? settings.allowBackwards
      : DIFFICULTY_PRESETS[settings.difficultyPreset].allowBackwards;

  return {
    allowBackwards,
    minWordLength: min,
    maxWordLength: max,
  };
}

export function applyDifficultyPreset(preset: DifficultyPreset): Partial<Settings> {
  if (preset === 'custom') return { difficultyPreset: 'custom' };
  const p = DIFFICULTY_PRESETS[preset];
  const patch: Partial<Settings> = {
    difficultyPreset: preset,
    gridSize: p.gridSize,
    wordCount: p.wordCount,
    allowBackwards: p.allowBackwards,
  };
  if (preset === 'longform') {
    patch.wordLengthPreset = 'long';
  }
  return patch;
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