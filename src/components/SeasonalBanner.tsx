import { useState } from 'react';
import { getActiveSeason } from '../lib/seasonal';
import { dismissSeason, isSeasonDismissed } from '../lib/seasonalDismiss';

export function SeasonalBanner() {
  const season = getActiveSeason();
  const [dismissed, setDismissed] = useState(() =>
    season ? isSeasonDismissed(season.id) : true,
  );

  if (!season || dismissed) return null;

  return (
    <div
      className="seasonal-banner glass-panel"
      style={{ '--season-color': season.color } as React.CSSProperties}
    >
      <span className="seasonal-icon">{season.icon}</span>
      <div className="seasonal-text">
        <span className="seasonal-name">{season.name}</span>
        <span className="seasonal-desc">{season.description}</span>
      </div>
      <button
        className="seasonal-dismiss"
        onClick={() => {
          dismissSeason(season.id);
          setDismissed(true);
        }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}