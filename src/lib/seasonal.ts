import type { CategoryId } from '../types';
import { getPack } from './packs';

export interface SeasonalEvent {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  months: number[];
  /** Primary action for the home announcement. */
  play: SeasonalPlayTarget;
  ctaLabel: string;
}

export type SeasonalPlayTarget =
  | { type: 'category'; category: CategoryId }
  | { type: 'pack'; packId: string };

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'new-year',
    name: 'Fresh Start',
    icon: '✨',
    description: 'New year energy — explore science discoveries.',
    color: '#a78bfa',
    months: [1],
    play: { type: 'category', category: 'science' },
    ctaLabel: 'Play Science',
  },
  {
    id: 'hearts',
    name: 'Heart Month',
    icon: '💕',
    description: 'Sweet finds — play a music-themed puzzle.',
    color: '#fb7185',
    months: [2],
    play: { type: 'category', category: 'music' },
    ctaLabel: 'Play Music',
  },
  {
    id: 'spring',
    name: 'Spring Bloom',
    icon: '🌸',
    description: 'Fresh nature hunts — play a spring-themed puzzle.',
    color: '#f472b6',
    months: [3, 4, 5],
    play: { type: 'category', category: 'nature' },
    ctaLabel: 'Play Nature',
  },
  {
    id: 'summer',
    name: 'Summer Quest',
    icon: '☀️',
    description: 'Dive into 10 ocean word hunts — your summer pack.',
    color: '#fbbf24',
    months: [6, 7, 8],
    play: { type: 'pack', packId: 'ocean-creatures' },
    ctaLabel: 'Start quest',
  },
  {
    id: 'back-to-school',
    name: 'Back to School',
    icon: '📚',
    description: 'September pages — dive into bookish word hunts.',
    color: '#f59e0b',
    months: [9],
    play: { type: 'category', category: 'books' },
    ctaLabel: 'Play Books',
  },
  {
    id: 'halloween',
    name: 'Spooky Search',
    icon: '🎃',
    description: '5 haunted word hunts — limited October pack.',
    color: '#f97316',
    months: [10],
    play: { type: 'pack', packId: 'spooky-search' },
    ctaLabel: 'Start Spooky pack',
  },
  {
    id: 'gratitude',
    name: 'Harvest Hunt',
    icon: '🍂',
    description: 'November thanks — food-themed word feasts.',
    color: '#ea580c',
    months: [11],
    play: { type: 'category', category: 'food' },
    ctaLabel: 'Play Food',
  },
  {
    id: 'holiday',
    name: 'Winter Festival',
    icon: '❄️',
    description: '5 festive levels of holiday cheer.',
    color: '#38bdf8',
    months: [12],
    play: { type: 'pack', packId: 'winter-fest' },
    ctaLabel: 'Start Winter pack',
  },
];

export function getActiveSeason(date: Date = new Date()): SeasonalEvent | null {
  const month = date.getMonth() + 1;
  return SEASONAL_EVENTS.find((e) => e.months.includes(month)) ?? null;
}

/** Resolve where the seasonal CTA should start (next pack level if in progress). */
export function resolveSeasonalPlay(
  season: SeasonalEvent,
  packProgress: Partial<Record<string, number>>,
): { type: 'category'; category: CategoryId } | { type: 'pack'; packId: string; level: number; category: CategoryId } | null {
  if (season.play.type === 'category') {
    return { type: 'category', category: season.play.category };
  }

  const pack = getPack(season.play.packId);
  if (!pack) return null;

  const progress = packProgress[pack.id] ?? 0;
  if (progress >= pack.puzzleCount) {
    // Pack done — fall back to themed category free play
    return { type: 'category', category: pack.category };
  }

  return {
    type: 'pack',
    packId: pack.id,
    level: Math.min(progress, pack.puzzleCount - 1),
    category: pack.category,
  };
}