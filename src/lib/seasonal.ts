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
    id: 'halloween',
    name: 'Spooky Search',
    icon: '🎃',
    description: 'Haunting holiday words for October nights.',
    color: '#f97316',
    months: [10],
    play: { type: 'category', category: 'holiday' },
    ctaLabel: 'Play Holiday',
  },
  {
    id: 'holiday',
    name: 'Winter Festival',
    icon: '❄️',
    description: 'Festive finds — open a holiday word hunt.',
    color: '#38bdf8',
    months: [12],
    play: { type: 'category', category: 'holiday' },
    ctaLabel: 'Play Holiday',
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