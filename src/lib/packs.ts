import type { CategoryId } from '../types';

export interface PuzzlePack {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: CategoryId;
  color: string;
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
    puzzleCount: 10,
  },
  {
    id: 'world-kitchen',
    name: 'World Kitchen',
    icon: '🍜',
    description: 'Global flavors across 10 puzzles',
    category: 'food',
    color: '#ef4444',
    puzzleCount: 10,
  },
  {
    id: 'champion-league',
    name: 'Champion League',
    icon: '🏆',
    description: 'Sports words — 10 competitive rounds',
    category: 'sports',
    color: '#22c55e',
    puzzleCount: 10,
  },
  {
    id: 'silver-screen',
    name: 'Silver Screen',
    icon: '🎥',
    description: 'Movie magic in 10 acts',
    category: 'movies',
    color: '#a855f7',
    puzzleCount: 10,
  },
  {
    id: 'wonders-of-earth',
    name: 'Wonders of Earth',
    icon: '🗺️',
    description: 'Geography trek — 10 destinations',
    category: 'geography',
    color: '#3b82f6',
    puzzleCount: 10,
  },
];

export function getPackSeed(packId: string, level: number): string {
  return `pack-${packId}-level-${level}`;
}

export function getPack(packId: string): PuzzlePack | undefined {
  return PUZZLE_PACKS.find((p) => p.id === packId);
}