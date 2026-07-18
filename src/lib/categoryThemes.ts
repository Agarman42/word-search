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
  science: {
    tint: 'rgba(6, 182, 212, 0.06)',
    accent: '#0891b2',
    bar: '#06b6d4',
    foundColors: ['#a5f3fc', '#bae6fd', '#99f6e4', '#c4b5fd', '#67e8f9', '#e0f2fe'],
  },
  music: {
    tint: 'rgba(225, 29, 72, 0.06)',
    accent: '#be123c',
    bar: '#e11d48',
    foundColors: ['#fecdd3', '#fbcfe8', '#fde68a', '#ddd6fe', '#fda4af', '#f5d0fe'],
  },
  nature: {
    tint: 'rgba(101, 163, 13, 0.06)',
    accent: '#4d7c0f',
    bar: '#65a30d',
    foundColors: ['#d9f99d', '#bbf7d0', '#bef264', '#fde68a', '#86efac', '#ecfccb'],
  },
  space: {
    tint: 'rgba(79, 70, 229, 0.06)',
    accent: '#4338ca',
    bar: '#4f46e5',
    foundColors: ['#c7d2fe', '#ddd6fe', '#a5b4fc', '#bfdbfe', '#e0e7ff', '#818cf8'],
  },
  books: {
    tint: 'rgba(180, 83, 9, 0.06)',
    accent: '#92400e',
    bar: '#b45309',
    foundColors: ['#fed7aa', '#fde68a', '#fecaca', '#fbcfe8', '#fdba74', '#ffedd5'],
  },
  mythology: {
    tint: 'rgba(139, 92, 246, 0.06)',
    accent: '#7c3aed',
    bar: '#8b5cf6',
    foundColors: ['#ddd6fe', '#e9d5ff', '#fbcfe8', '#c4b5fd', '#fde68a', '#f5d0fe'],
  },
  history: {
    tint: 'rgba(161, 98, 7, 0.06)',
    accent: '#854d0e',
    bar: '#a16207',
    foundColors: ['#fde68a', '#fef08a', '#fed7aa', '#fdba74', '#fbbf24', '#fcd34d'],
  },
  travel: {
    tint: 'rgba(14, 165, 233, 0.06)',
    accent: '#0284c7',
    bar: '#0ea5e9',
    foundColors: ['#bae6fd', '#a5f3fc', '#bfdbfe', '#7dd3fc', '#e0f2fe', '#99f6e4'],
  },
  technology: {
    tint: 'rgba(100, 116, 139, 0.06)',
    accent: '#475569',
    bar: '#64748b',
    foundColors: ['#cbd5e1', '#e2e8f0', '#bae6fd', '#c7d2fe', '#a5f3fc', '#f1f5f9'],
  },
};

export function getCategoryFoundColor(category: CategoryId, index: number): string {
  const palette = CATEGORY_THEMES[category].foundColors;
  return palette[index % palette.length];
}