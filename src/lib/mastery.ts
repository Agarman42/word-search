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
  return completions > 0 ? 'bronze' : 'none';
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
  const tiers = ['none', 'bronze', 'silver', 'gold', 'diamond'] as MasteryTier[];
  const idx = tiers.indexOf(tier);
  const next = idx < tiers.length - 1 ? tiers[idx + 1] : null;
  const currentMin = TIER_THRESHOLDS.find((t) => t.tier === tier)?.completions ?? 0;
  const nextMin = next
    ? TIER_THRESHOLDS.find((t) => t.tier === next)?.completions ?? currentMin + 1
    : currentMin;
  const progress = next
    ? Math.min(100, ((completions - currentMin) / (nextMin - currentMin)) * 100)
    : 100;
  return { tier, next, progress };
}