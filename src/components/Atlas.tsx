import { CATEGORIES } from '../lib/wordLists';
import { MASTERY_INFO, getMasteryProgress } from '../lib/mastery';
import type { CategoryId, Stats } from '../types';
import { CategoryIcon } from './Icons';
import { ScreenHeader } from './ScreenHeader';

const ATLAS_PATHS: [CategoryId, CategoryId][] = [
  ['animals', 'kids'],
  ['animals', 'food'],
  ['food', 'holiday'],
  ['holiday', 'geography'],
  ['geography', 'sports'],
  ['sports', 'movies'],
  ['movies', 'kids'],
];

interface AtlasProps {
  stats: Stats;
  onSelectCategory: (category: CategoryId) => void;
  embedded?: boolean;
}

export function Atlas({ stats, onSelectCategory, embedded }: AtlasProps) {
  const exploredCount = CATEGORIES.filter((c) => (stats.categoryCompletions[c.id] ?? 0) > 0).length;

  const getPos = (id: CategoryId) => {
    const cat = CATEGORIES.find((c) => c.id === id)!;
    return { x: cat.atlasX, y: cat.atlasY };
  };

  const content = (
    <>
      <div className="atlas-map glass-panel">
        <div className="atlas-map-bg" />
        <svg className="atlas-paths" viewBox="0 0 100 100" preserveAspectRatio="none">
          {ATLAS_PATHS.map(([a, b]) => {
            const p1 = getPos(a);
            const p2 = getPos(b);
            const explored =
              (stats.categoryCompletions[a] ?? 0) > 0 &&
              (stats.categoryCompletions[b] ?? 0) > 0;
            return (
              <line
                key={`${a}-${b}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                className={explored ? 'path-explored' : 'path-locked'}
              />
            );
          })}
        </svg>
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
              <span className="atlas-node-icon">
                <CategoryIcon id={cat.id} size={explored ? 18 : 16} />
              </span>
              {explored && <span className="atlas-node-tier">{mastery.label}</span>}
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
              <span className="atlas-legend-icon"><CategoryIcon id={cat.id} size={18} /></span>
              <div className="atlas-legend-info">
                <span className="atlas-legend-name">{cat.name}</span>
                <div className="atlas-legend-bar">
                  <div
                    className="atlas-legend-fill"
                    style={{ width: `${progress}%`, background: mastery.color }}
                  />
                </div>
              </div>
              <span className="atlas-legend-tier">{mastery.label}</span>
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