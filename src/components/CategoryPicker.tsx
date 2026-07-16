import { CATEGORIES } from '../lib/wordLists';
import { MASTERY_INFO } from '../lib/mastery';
import type { CategoryId, MasteryTier } from '../types';
import { CategoryIcon } from './Icons';
import { ScreenHeader } from './ScreenHeader';

interface CategoryPickerProps {
  completions: Partial<Record<CategoryId, number>>;
  mastery: Partial<Record<CategoryId, MasteryTier>>;
  onSelect: (category: CategoryId) => void;
  embedded?: boolean;
}

export function CategoryPicker({ completions, mastery, onSelect, embedded }: CategoryPickerProps) {
  const content = (
    <div className="category-grid">
      {CATEGORIES.map((cat, i) => {
        const tier = mastery[cat.id] ?? 'none';
        const m = MASTERY_INFO[tier];
        return (
          <button
            key={cat.id}
            className="category-card"
            style={{
              '--cat-color': cat.color,
              '--delay': `${i * 50}ms`,
            } as React.CSSProperties}
            onClick={() => onSelect(cat.id)}
          >
            <div className="category-glow" />
            <span className="category-icon"><CategoryIcon id={cat.id} size={28} /></span>
            <span className="category-name">{cat.name}</span>
            <span className="category-desc">{cat.description}</span>
            <span className="category-mastery">{m.icon} {m.label}</span>
            {(completions[cat.id] ?? 0) > 0 && (
              <span className="category-plays">{completions[cat.id]} played</span>
            )}
            <span className="category-arrow">→</span>
          </button>
        );
      })}
    </div>
  );

  if (embedded) return content;

  return (
    <div className="screen categories-screen">
      <ScreenHeader title="Categories" subtitle="Pick a theme and start hunting" />
      {content}
    </div>
  );
}