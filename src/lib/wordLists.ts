import type { Category, CategoryId } from '../types';
import { WORD_BANKS } from './wordBanks';

export const CATEGORIES: Category[] = [
  { id: 'animals', name: 'Animals', icon: '🦁', description: 'Creatures great and small', color: '#f59e0b', atlasX: 22, atlasY: 35 },
  { id: 'food', name: 'Food', icon: '🍕', description: 'Delicious bites from around the world', color: '#ef4444', atlasX: 50, atlasY: 20 },
  { id: 'sports', name: 'Sports', icon: '⚽', description: 'Athletic action and competition', color: '#22c55e', atlasX: 78, atlasY: 40 },
  { id: 'movies', name: 'Movies', icon: '🎬', description: 'Silver screen classics and hits', color: '#a855f7', atlasX: 30, atlasY: 68 },
  { id: 'geography', name: 'Geography', icon: '🌍', description: 'Places, landmarks, and wonders', color: '#3b82f6', atlasX: 68, atlasY: 65 },
  { id: 'kids', name: 'Kids', icon: '🎈', description: 'Fun words for young explorers', color: '#ec4899', atlasX: 15, atlasY: 55 },
  { id: 'holiday', name: 'Holiday', icon: '🎄', description: 'Festive cheer all year round', color: '#14b8a6', atlasX: 55, atlasY: 48 },
  { id: 'science', name: 'Science', icon: '🔬', description: 'Labs, life, and the laws of nature', color: '#06b6d4', atlasX: 38, atlasY: 28 },
  { id: 'music', name: 'Music', icon: '🎵', description: 'Instruments, genres, and melody', color: '#e11d48', atlasX: 62, atlasY: 32 },
  { id: 'nature', name: 'Nature', icon: '🌿', description: 'Forests, weather, and wild places', color: '#65a30d', atlasX: 18, atlasY: 72 },
  { id: 'space', name: 'Space', icon: '🚀', description: 'Stars, planets, and cosmic quests', color: '#4f46e5', atlasX: 82, atlasY: 18 },
  { id: 'books', name: 'Books', icon: '📚', description: 'Stories, poets, and literary worlds', color: '#b45309', atlasX: 72, atlasY: 78 },
  { id: 'mythology', name: 'Mythology', icon: '⚡', description: 'Gods, legends, and ancient tales', color: '#8b5cf6', atlasX: 42, atlasY: 82 },
  { id: 'history', name: 'History', icon: '🏛️', description: 'Empires, eras, and events past', color: '#a16207', atlasX: 88, atlasY: 55 },
  { id: 'travel', name: 'Travel', icon: '✈️', description: 'Journeys, destinations, and adventure', color: '#0ea5e9', atlasX: 8, atlasY: 42 },
  { id: 'technology', name: 'Technology', icon: '💻', description: 'Code, gadgets, and digital life', color: '#64748b', atlasX: 92, atlasY: 28 },
];

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id)!;
}

export function getSampleWords(category: CategoryId, count = 3): string[] {
  const bank = WORD_BANKS[category];
  const long = bank.filter((w) => w.length >= 7);
  const pool = long.length >= count ? long : bank;
  return pool.slice(0, count);
}

export function getWordsForCategory(
  category: CategoryId,
  count: number,
  rng: () => number,
  minLen = 3,
  maxLen = 15,
  customPool?: string[],
): string[] {
  const source = customPool?.length ? customPool : WORD_BANKS[category];
  const bank = source.filter((w) => w.length >= minLen && w.length <= maxLen);
  // Fallback to category bank if custom pool too thin for length range
  const effective =
    bank.length >= Math.min(count, 4)
      ? bank
      : WORD_BANKS[category].filter((w) => w.length >= minLen && w.length <= maxLen);
  const pool = [...effective];
  const selected: string[] = [];

  while (selected.length < count && pool.length > 0) {
    const idx = Math.floor(rng() * pool.length);
    selected.push(pool.splice(idx, 1)[0]);
  }

  return selected.sort((a, b) => a.localeCompare(b));
}