import type { CategoryId } from '../types';

export interface CategoryTheme {
  tint: string;
  accent: string;
  bar: string;
  foundColors: string[];
}

export const CATEGORY_THEMES: Record<CategoryId, CategoryTheme> = {
  animals: {
    tint: 'rgba(245, 158, 11, 0.06)',
    accent: '#d97706',
    bar: '#f59e0b',
    foundColors: ['#fde68a', '#bbf7d0', '#d9f99d', '#fef08a', '#fed7aa', '#fde047'],
  },
  food: {
    tint: 'rgba(239, 68, 68, 0.06)',
    accent: '#dc2626',
    bar: '#ef4444',
    foundColors: ['#fecaca', '#fed7aa', '#fde68a', '#fbcfe8', '#fdba74', '#fca5a5'],
  },
  sports: {
    tint: 'rgba(34, 197, 94, 0.06)',
    accent: '#16a34a',
    bar: '#22c55e',
    foundColors: ['#bbf7d0', '#a7f3d0', '#86efac', '#bef264', '#d9f99d', '#99f6e4'],
  },
  movies: {
    tint: 'rgba(168, 85, 247, 0.06)',
    accent: '#9333ea',
    bar: '#a855f7',
    foundColors: ['#e9d5ff', '#ddd6fe', '#fbcfe8', '#bfdbfe', '#c4b5fd', '#f5d0fe'],
  },
  geography: {
    tint: 'rgba(59, 130, 246, 0.06)',
    accent: '#2563eb',
    bar: '#3b82f6',
    foundColors: ['#bfdbfe', '#a5f3fc', '#bae6fd', '#c7d2fe', '#93c5fd', '#7dd3fc'],
  },
  kids: {
    tint: 'rgba(236, 72, 153, 0.06)',
    accent: '#db2777',
    bar: '#ec4899',
    foundColors: ['#fbcfe8', '#fecdd3', '#fde68a', '#bbf7d0', '#ddd6fe', '#fed7aa'],
  },
  holiday: {
    tint: 'rgba(20, 184, 166, 0.06)',
    accent: '#0d9488',
    bar: '#14b8a6',
    foundColors: ['#99f6e4', '#fde68a', '#fecaca', '#bbf7d0', '#a5f3fc', '#fbcfe8'],
  },
};

export function getCategoryFoundColor(category: CategoryId, index: number): string {
  const palette = CATEGORY_THEMES[category].foundColors;
  return palette[index % palette.length];
}