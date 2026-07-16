import { CATEGORIES } from '../lib/wordLists';
import { MASTERY_INFO, getMasteryProgress } from '../lib/mastery';
import type { CategoryId, Stats } from '../types';
import { ScreenHeader } from './ScreenHeader';

interface AtlasProps {
  stats: Stats;
  onSelectCategory: (category: CategoryId) => void;
  embedded?: boolean;
}

export function Atlas({ stats, onSelectCategory, embedded }: AtlasProps) {
  const exploredCount = CATEGORIES.filter((c) => (stats.categoryCompletions[c.id] ?? 0) > 0).length;

  const content = (
    <>
      <div className="atlas-map glass-panel">
        <div className="atlas-map-bg" />
        {CATEGORIES.map((cat) => {
          const completions = stats.categoryCompletions[cat.id] ?? 0;
          const { tier, progress } = getMasteryProgress(completions);
          const mastery = MASTERY_INFO[tier];
          const explored = completions > 0;

          return (
            <button
              key={cat.id}
              className={`atlas-node ${explored ? 'explored' : 'locked'}`}
              style={{
                left: `${cat.atlasX}%`,
                top: `${cat.atlasY}%`,
                '--node-color': cat.color,
              } as React.CSSProperties}
              onClick={() => onSelectCategory(cat.id)}
              title={cat.name}
            >
              <span className="atlas-node-icon">{cat.icon}</span>
              {explored && <span className="atlas-node-tier">{mastery.icon}</span>}
              <span className="atlas-node-ring" style={{ '--progress': `${progress}%` } as React.CSSProperties} />
            </button>
          );
        })}
      </div>

      <div className="atlas-legend">
        {CATEGORIES.map((cat) => {
          const completions = stats.categoryCompletions[cat.id] ?? 0;
          const { tier, next, progress } = getMasteryProgress(completions);
          const mastery = MASTERY_INFO[tier];

          return (
            <button
              key={cat.id}
              className="atlas-legend-row"
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="atlas-legend-icon">{cat.icon}</span>
              <div className="atlas-legend-info">
                <span className="atlas-legend-name">{cat.name}</span>
                <div className="atlas-legend-bar">
                  <div
                    className="atlas-legend-fill"
                    style={{ width: `${progress}%`, background: mastery.color }}
                  />
                </div>
              </div>
              <span className="atlas-legend-tier">{mastery.icon} {mastery.label}</span>
              {next && <span className="atlas-legend-count">{completions}</span>}
            </button>
          );
        })}
      </div>
    </>
  );

  if (embedded) return <div className="atlas-embedded">{content}</div>;

  return (
    <div className="screen atlas-screen">
      <ScreenHeader
        title="Lexis Atlas"
        subtitle={`${exploredCount} of ${CATEGORIES.length} regions explored`}
      />
      {content}
    </div>
  );
}