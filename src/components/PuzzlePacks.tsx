import { PUZZLE_PACKS } from '../lib/packs';
import type { CategoryId, Stats } from '../types';
import { IconPack } from './Icons';
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
    <div className="packs-scroll">
      {PUZZLE_PACKS.map((pack) => {
        const progress = stats.packProgress[pack.id] ?? 0;
        const pct = Math.round((progress / pack.puzzleCount) * 100);
        const complete = progress >= pack.puzzleCount;
        const nextLevel = Math.min(progress, pack.puzzleCount - 1);

        return (
          <button
            key={pack.id}
            className={`pack-card-h panel-card ${complete ? 'complete' : ''}`}
            style={{ '--pack-color': pack.color } as React.CSSProperties}
            onClick={() => !complete && onSelectPack(pack.id, nextLevel, pack.category)}
            disabled={complete}
          >
            <PackProgressArc pct={pct} color={pack.color} />
            <div className="pack-h-info">
              <span className="pack-h-name">{pack.name}</span>
              <span className="pack-h-desc">{pack.description}</span>
              <span className="pack-h-progress">
                {complete ? 'Complete' : `${progress}/${pack.puzzleCount}`}
              </span>
            </div>
            <span className="pack-h-icon"><IconPack size={20} /></span>
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