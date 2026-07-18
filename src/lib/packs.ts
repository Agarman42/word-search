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
  {
    id: 'lab-coat',
    name: 'Lab Coat',
    icon: '🔬',
    description: 'Science terms — 10 experiments in words',
    category: 'science',
    color: '#06b6d4',
    coverGradient: 'linear-gradient(135deg, #0e7490 0%, #22d3ee 50%, #06b6d4 100%)',
    puzzleCount: 10,
  },
  {
    id: 'symphony-hall',
    name: 'Symphony Hall',
    icon: '🎻',
    description: 'Music & melody across 10 movements',
    category: 'music',
    color: '#e11d48',
    coverGradient: 'linear-gradient(135deg, #9f1239 0%, #fb7185 50%, #e11d48 100%)',
    puzzleCount: 10,
  },
  {
    id: 'wild-trails',
    name: 'Wild Trails',
    icon: '🌲',
    description: 'Nature words on 10 forest paths',
    category: 'nature',
    color: '#65a30d',
    coverGradient: 'linear-gradient(135deg, #3f6212 0%, #84cc16 50%, #65a30d 100%)',
    puzzleCount: 10,
  },
  {
    id: 'star-voyager',
    name: 'Star Voyager',
    icon: '🚀',
    description: 'Space odyssey — 10 cosmic puzzles',
    category: 'space',
    color: '#4f46e5',
    coverGradient: 'linear-gradient(135deg, #312e81 0%, #818cf8 50%, #4f46e5 100%)',
    puzzleCount: 10,
  },
  {
    id: 'page-turner',
    name: 'Page Turner',
    icon: '📖',
    description: 'Literary finds in 10 chapters',
    category: 'books',
    color: '#b45309',
    coverGradient: 'linear-gradient(135deg, #78350f 0%, #f59e0b 50%, #b45309 100%)',
    puzzleCount: 10,
  },
  {
    id: 'long-words',
    name: 'Long Words',
    icon: '📏',
    description: '8–15 letter science words — 10 epic hunts',
    category: 'science',
    color: '#7c3aed',
    coverGradient: 'linear-gradient(135deg, #5b21b6 0%, #a78bfa 50%, #7c3aed 100%)',
    puzzleCount: 10,
  },
  {
    id: 'spooky-search',
    name: 'Spooky Search',
    icon: '🎃',
    description: '5 haunted hunts for October nights',
    category: 'holiday',
    color: '#f97316',
    coverGradient: 'linear-gradient(135deg, #9a3412 0%, #fb923c 50%, #f97316 100%)',
    puzzleCount: 5,
  },
  {
    id: 'winter-fest',
    name: 'Winter Festival',
    icon: '❄️',
    description: '5 festive levels of holiday cheer',
    category: 'holiday',
    color: '#38bdf8',
    coverGradient: 'linear-gradient(135deg, #0369a1 0%, #7dd3fc 50%, #38bdf8 100%)',
    puzzleCount: 5,
  },
  {
    id: 'myths-legends',
    name: 'Myths & Legends',
    icon: '⚡',
    description: '10 mythic word hunts across Olympus and beyond',
    category: 'mythology',
    color: '#8b5cf6',
    coverGradient: 'linear-gradient(135deg, #5b21b6 0%, #c4b5fd 50%, #8b5cf6 100%)',
    puzzleCount: 10,
  },
  {
    id: 'time-capsule',
    name: 'Time Capsule',
    icon: '🏛️',
    description: '10 historical eras to uncover',
    category: 'history',
    color: '#a16207',
    coverGradient: 'linear-gradient(135deg, #713f12 0%, #fbbf24 50%, #a16207 100%)',
    puzzleCount: 10,
  },
  {
    id: 'passport-stamps',
    name: 'Passport Stamps',
    icon: '✈️',
    description: '10 travel destinations in the grid',
    category: 'travel',
    color: '#0ea5e9',
    coverGradient: 'linear-gradient(135deg, #0369a1 0%, #7dd3fc 50%, #0ea5e9 100%)',
    puzzleCount: 10,
  },
  {
    id: 'digital-frontier',
    name: 'Digital Frontier',
    icon: '💻',
    description: '10 tech-themed word challenges',
    category: 'technology',
    color: '#64748b',
    coverGradient: 'linear-gradient(135deg, #334155 0%, #94a3b8 50%, #64748b 100%)',
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