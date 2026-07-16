import type { CategoryId } from '../types';

export interface PuzzlePack {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: CategoryId;
  color: string;
  coverGradient: string;
  puzzleCount: number;
}

export const PUZZLE_PACKS: PuzzlePack[] = [
  {
    id: 'ocean-creatures',
    name: 'Ocean Creatures',
    icon: '🐋',
    description: 'Dive deep — 10 aquatic word hunts',
    category: 'animals',
    color: '#0891b2',
    coverGradient: 'linear-gradient(135deg, #0e7490 0%, #22d3ee 55%, #0891b2 100%)',
    puzzleCount: 10,
  },
  {
    id: 'world-kitchen',
    name: 'World Kitchen',
    icon: '🍜',
    description: 'Global flavors across 10 puzzles',
    category: 'food',
    color: '#ef4444',
    coverGradient: 'linear-gradient(135deg, #b91c1c 0%, #fb923c 50%, #ef4444 100%)',
    puzzleCount: 10,
  },
  {
    id: 'champion-league',
    name: 'Champion League',
    icon: '🏆',
    description: 'Sports words — 10 competitive rounds',
    category: 'sports',
    color: '#22c55e',
    coverGradient: 'linear-gradient(135deg, #15803d 0%, #4ade80 50%, #22c55e 100%)',
    puzzleCount: 10,
  },
  {
    id: 'silver-screen',
    name: 'Silver Screen',
    icon: '🎥',
    description: 'Movie magic in 10 acts',
    category: 'movies',
    color: '#a855f7',
    coverGradient: 'linear-gradient(135deg, #6b21a8 0%, #c084fc 50%, #a855f7 100%)',
    puzzleCount: 10,
  },
  {
    id: 'wonders-of-earth',
    name: 'Wonders of Earth',
    icon: '🗺️',
    description: 'Geography trek — 10 destinations',
    category: 'geography',
    color: '#3b82f6',
    coverGradient: 'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 50%, #3b82f6 100%)',
    puzzleCount: 10,
  },
];

export function getPackSeed(packId: string, level: number): string {
  return `pack-${packId}-level-${level}`;
}

export function getPackShuffleSeed(packId: string, level: number, variant: number): string {
  return `pack-${packId}-level-${level}-shuffle-${variant}`;
}

export function getPack(packId: string): PuzzlePack | undefined {
  return PUZZLE_PACKS.find((p) => p.id === packId);
}