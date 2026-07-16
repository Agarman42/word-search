import { PUZZLE_PACKS } from '../lib/packs';
import type { CategoryId, Stats } from '../types';
import { ScreenHeader } from './ScreenHeader';

interface PuzzlePacksProps {
  stats: Stats;
  onSelectPack: (packId: string, level: number, category: CategoryId) => void;
  embedded?: boolean;
}

export function PuzzlePacks({ stats, onSelectPack, embedded }: PuzzlePacksProps) {
  const content = (
    <div className="packs-list">
      {PUZZLE_PACKS.map((pack) => {
        const progress = stats.packProgress[pack.id] ?? 0;
        const pct = Math.round((progress / pack.puzzleCount) * 100);
        const complete = progress >= pack.puzzleCount;
        const nextLevel = Math.min(progress, pack.puzzleCount - 1);

        return (
          <button
            key={pack.id}
            className={`pack-card glass-panel ${complete ? 'complete' : ''}`}
            style={{ '--pack-color': pack.color } as React.CSSProperties}
            onClick={() => !complete && onSelectPack(pack.id, nextLevel, pack.category)}
            disabled={complete}
          >
            <span className="pack-icon">{pack.icon}</span>
            <div className="pack-info">
              <span className="pack-name">{pack.name}</span>
              <span className="pack-desc">{pack.description}</span>
              <div className="pack-progress-bar">
                <div className="pack-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="pack-progress-text">
                {complete ? 'Complete ✓' : `${progress}/${pack.puzzleCount} puzzles`}
              </span>
            </div>
            {!complete && <span className="pack-arrow">→</span>}
          </button>
        );
      })}
    </div>
  );

  if (embedded) return content;

  return (
    <div className="screen packs-screen">
      <ScreenHeader title="Puzzle Packs" subtitle="Curated 10-puzzle series to master" />
      {content}
    </div>
  );
}