import { useEffect, useState } from 'react';
import type { CategoryId, PuzzleTab, Stats } from '../types';
import { CategoryPicker } from './CategoryPicker';
import { PuzzlePacks } from './PuzzlePacks';
import { Atlas } from './Atlas';
import { ScreenHeader } from './ScreenHeader';

interface PuzzleHubProps {
  stats: Stats;
  initialTab?: PuzzleTab;
  onSelectCategory: (cat: CategoryId) => void;
  onSelectPack: (packId: string, level: number, category: CategoryId) => void;
}

const TABS: { id: PuzzleTab; label: string; icon: string }[] = [
  { id: 'categories', label: 'Categories', icon: '🎯' },
  { id: 'packs', label: 'Packs', icon: '📦' },
  { id: 'atlas', label: 'Atlas', icon: '🗺️' },
];

export function PuzzleHub({
  stats,
  initialTab = 'categories',
  onSelectCategory,
  onSelectPack,
}: PuzzleHubProps) {
  const [tab, setTab] = useState<PuzzleTab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div className="screen puzzles-screen">
      <ScreenHeader title="Puzzles" subtitle="Categories, packs, and your atlas" />

      <div className="puzzle-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`puzzle-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="puzzle-tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="puzzle-tab-panel" role="tabpanel">
        {tab === 'categories' && (
          <CategoryPicker
            embedded
            completions={stats.categoryCompletions}
            mastery={stats.categoryMastery}
            onSelect={onSelectCategory}
          />
        )}
        {tab === 'packs' && (
          <PuzzlePacks embedded stats={stats} onSelectPack={onSelectPack} />
        )}
        {tab === 'atlas' && (
          <Atlas embedded stats={stats} onSelectCategory={onSelectCategory} />
        )}
      </div>
    </div>
  );
}