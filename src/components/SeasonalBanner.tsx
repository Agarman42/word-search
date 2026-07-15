import { getActiveSeason } from '../lib/seasonal';

export function SeasonalBanner() {
  const season = getActiveSeason();
  if (!season) return null;

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
    </div>
  );
}