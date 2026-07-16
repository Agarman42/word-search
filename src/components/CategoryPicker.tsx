import { CATEGORIES, getSampleWords } from '../lib/wordLists';
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
    <div className="category-grid category-poster-grid">
      {CATEGORIES.map((cat, i) => {
        const tier = mastery[cat.id] ?? 'none';
        const m = MASTERY_INFO[tier];
        const samples = getSampleWords(cat.id, 3).join(' · ');

        return (
          <button
            key={cat.id}
            className="category-poster"
            style={{
              '--cat-color': cat.color,
              '--delay': `${i * 50}ms`,
            } as React.CSSProperties}
            onClick={() => onSelect(cat.id)}
          >
            <div className="category-poster-art">
              <div className="category-poster-glow" />
              <span className="category-poster-icon">
                <CategoryIcon id={cat.id} size={36} />
              </span>
              <span
                className="category-mastery-ring"
                style={{ '--mastery-color': m.color } as React.CSSProperties}
                title={m.label}
              >
                {m.icon}
              </span>
            </div>
            <div className="category-poster-body">
              <span className="category-poster-name">{cat.name}</span>
              <span className="category-poster-samples">{samples}</span>
              <span className="category-poster-meta">
                <span className="category-poster-mastery">{m.label}</span>
                {(completions[cat.id] ?? 0) > 0 && (
                  <span className="category-poster-plays">{completions[cat.id]} played</span>
                )}
              </span>
            </div>
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