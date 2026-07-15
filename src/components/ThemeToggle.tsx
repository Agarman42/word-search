interface ThemeToggleProps {
  lightBackground: boolean;
  onChange: (light: boolean) => void;
  compact?: boolean;
}

export function ThemeToggle({ lightBackground, onChange, compact }: ThemeToggleProps) {
  return (
    <button
      className={`theme-toggle ${lightBackground ? 'is-light' : 'is-dark'} ${compact ? 'compact' : ''}`}
      onClick={() => onChange(!lightBackground)}
      aria-label={lightBackground ? 'Switch to dark background' : 'Switch to light background'}
      title={lightBackground ? 'Dark mode' : 'Light mode'}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb" />
      </span>
      {!compact && (
        <span className="theme-toggle-label">
          {lightBackground ? 'Light background' : 'Dark background'}
        </span>
      )}
      <span className="theme-toggle-icon">{lightBackground ? '☀️' : '🌙'}</span>
    </button>
  );
}