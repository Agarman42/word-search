import type { WordLengthPreset } from '../types';

export interface WordLengthConfig {
  min: number;
  max: number;
  label: string;
  desc: string;
}

export const WORD_LENGTH_PRESETS: Record<WordLengthPreset, WordLengthConfig> = {
  short: {
    min: 3,
    max: 5,
    label: 'Short',
    desc: '3–5 letters — quick finds',
  },
  mixed: {
    min: 4,
    max: 8,
    label: 'Mixed',
    desc: '4–8 letters — balanced',
  },
  long: {
    min: 6,
    max: 10,
    label: 'Long',
    desc: '6–10 letters — tougher hunts',
  },
  epic: {
    min: 8,
    max: 15,
    label: 'Epic',
    desc: '8–15 letters — maximum length',
  },
};

export function getWordLengthRange(preset: WordLengthPreset): { min: number; max: number } {
  const p = WORD_LENGTH_PRESETS[preset];
  return { min: p.min, max: p.max };
}