import { PUZZLE_PACKS } from '../lib/packs';
import type { CategoryId, Stats } from '../types';
import { ScreenHeader } from './ScreenHeader';

interface PuzzlePacksProps {
  stats: Stats;
  onSelectPack: (packId: string, level: number, category: CategoryId) => void;
  embedded?: boolean;
}

function PackProgressArc({ pct, color }: { pct: number; color: string }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg className="pack-arc" width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      <text x="22" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor">
        {pct}%
      </text>
    </svg>
  );
}

export function PuzzlePacks({ stats, onSelectPack, embedded }: PuzzlePacksProps) {
  const content = (
    <div className="packs-carousel">
      {PUZZLE_PACKS.map((pack) => {
        const progress = stats.packProgress[pack.id] ?? 0;
        const pct = Math.round((progress / pack.puzzleCount) * 100);
        const complete = progress >= pack.puzzleCount;
        const nextLevel = complete ? 0 : Math.min(progress, pack.puzzleCount - 1);

        return (
          <button
            key={pack.id}
            className={`pack-cover-card panel-card ${complete ? 'complete' : ''}`}
            style={{
              '--pack-color': pack.color,
              '--pack-cover': pack.coverGradient,
            } as React.CSSProperties}
            onClick={() => onSelectPack(pack.id, nextLevel, pack.category)}
          >
            <div className="pack-cover-art">
              <span className="pack-cover-emoji">{pack.icon}</span>
              <span className="pack-cover-pattern" aria-hidden="true" />
            </div>
            <div className="pack-cover-body">
              <span className="pack-cover-name">{pack.name}</span>
              <span className="pack-cover-desc">{pack.description}</span>
              <div className="pack-cover-footer">
                <PackProgressArc pct={pct} color={pack.color} />
                <span className="pack-cover-progress">
                  {complete
                    ? 'Complete — tap to replay'
                    : `${progress}/${pack.puzzleCount} levels`}
                </span>
              </div>
            </div>
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