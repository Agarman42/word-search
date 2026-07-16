import type { CategoryId, MasteryTier, Stats } from '../types';

const TIER_THRESHOLDS: { tier: MasteryTier; completions: number }[] = [
  { tier: 'diamond', completions: 50 },
  { tier: 'gold', completions: 25 },
  { tier: 'silver', completions: 10 },
  { tier: 'bronze', completions: 3 },
];

export const MASTERY_INFO: Record<MasteryTier, { label: string; icon: string; color: string }> = {
  none: { label: 'Uncharted', icon: '○', color: '#5e5e72' },
  bronze: { label: 'Bronze', icon: '🥉', color: '#cd7f32' },
  silver: { label: 'Silver', icon: '🥈', color: '#c0c0c0' },
  gold: { label: 'Gold', icon: '🥇', color: '#ffd700' },
  diamond: { label: 'Diamond', icon: '💎', color: '#22d3ee' },
};

export function computeMasteryTier(completions: number): MasteryTier {
  for (const { tier, completions: min } of TIER_THRESHOLDS) {
    if (completions >= min) return tier;
  }
  return 'none';
}

export function updateCategoryMastery(stats: Stats, category: CategoryId): Stats {
  const completions = stats.categoryCompletions[category] ?? 0;
  const tier = computeMasteryTier(completions);
  if (stats.categoryMastery[category] === tier) return stats;
  return {
    ...stats,
    categoryMastery: { ...stats.categoryMastery, [category]: tier },
  };
}

export function getMasteryProgress(completions: number): { tier: MasteryTier; next: MasteryTier | null; progress: number } {
  const tier = computeMasteryTier(completions);
  if (tier === 'diamond') {
    return { tier, next: null, progress: 100 };
  }
  const nextThresholds: Record<MasteryTier, { next: MasteryTier; min: number; floor: number }> = {
    none: { next: 'bronze', min: 3, floor: 0 },
    bronze: { next: 'silver', min: 10, floor: 3 },
    silver: { next: 'gold', min: 25, floor: 10 },
    gold: { next: 'diamond', min: 50, floor: 25 },
    diamond: { next: 'diamond', min: 50, floor: 50 },
  };
  const { next, min, floor } = nextThresholds[tier];
  const progress = Math.min(100, Math.max(0, ((completions - floor) / (min - floor)) * 100));
  return { tier, next, progress };
}