import type { CategoryId } from '../types';
import { FEATURED_NEW_PACK_IDS } from '../lib/newPacksWave';
import { getPack } from '../lib/packs';

interface NewPacksPopupProps {
  onSelectPack: (packId: string, level: number, category: CategoryId) => void;
  onDismiss: () => void;
}

export function NewPacksPopup({ onSelectPack, onDismiss }: NewPacksPopupProps) {
  const packs = FEATURED_NEW_PACK_IDS.map((id) => getPack(id)).filter(
    (p): p is NonNullable<typeof p> => !!p,
  );

  return (
    <div
      className="new-packs-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-packs-title"
      onClick={onDismiss}
    >
      <div className="new-packs-card panel-card" onClick={(e) => e.stopPropagation()}>
        <header className="new-packs-header">
          <div className="new-packs-heading">
            <p className="new-packs-eyebrow">Just added</p>
            <h2 id="new-packs-title" className="display-font">
              Four new hunts
            </h2>
            <p className="new-packs-lede">
              Vacation spots, stadiums, pets, and family — each hunt uses every name on the list.
            </p>
          </div>
          <button type="button" className="new-packs-close" onClick={onDismiss} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="new-packs-grid">
          {packs.map((pack, i) => (
            <button
              key={pack.id}
              type="button"
              className="new-packs-tile"
              style={
                {
                  '--pack-color': pack.color,
                  '--pack-cover': pack.coverGradient,
                  '--delay': `${i * 70}ms`,
                } as React.CSSProperties
              }
              onClick={() => onSelectPack(pack.id, 0, pack.category)}
            >
              <span className="new-packs-tile-art" aria-hidden="true">
                <span className="new-packs-tile-emoji">{pack.icon}</span>
              </span>
              <span className="new-packs-tile-body">
                <span className="new-packs-tile-name">{pack.name}</span>
                <span className="new-packs-tile-desc">{pack.description}</span>
              </span>
              <span className="new-packs-tile-go" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>

        <button type="button" className="btn btn-glass new-packs-later" onClick={onDismiss}>
          Maybe later
        </button>
      </div>
    </div>
  );
}
