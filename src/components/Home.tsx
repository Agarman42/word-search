import type { Stats } from '../types';
import { todayString } from '../lib/rng';
import { formatDuration } from '../lib/gameLogic';
import { getDailyCommentary, getDailyNumber, getDailyCategory } from '../lib/daily';
import { LogoMark } from './Icons';
import { SeasonalBanner } from './SeasonalBanner';
import { ThemeToggle } from './ThemeToggle';
import { InstallPrompt } from './InstallPrompt';

interface HomeProps {
  stats: Stats;
  lightBackground: boolean;
  onToggleLight: (light: boolean) => void;
  onPlay: () => void;
  onDaily: () => void;
  onPacks: () => void;
  onAtlas: () => void;
  onWeekly: () => void;
  onAchievements: () => void;
  dailyCompleted: boolean;
  canInstall: boolean;
  onInstall: () => void;
  onDismissInstall: () => void;
}

export function Home({
  stats,
  lightBackground,
  onToggleLight,
  onPlay,
  onDaily,
  onPacks,
  onAtlas,
  onWeekly,
  onAchievements,
  dailyCompleted,
  canInstall,
  onInstall,
  onDismissInstall,
}: HomeProps) {
  const today = todayString();
  const dailyCat = getDailyCategory(today);
  const commentary = getDailyCommentary(today, dailyCat);

  return (
    <div className="screen home-screen">
      <div className="home-top-bar">
        <ThemeToggle
          lightBackground={lightBackground}
          onChange={onToggleLight}
          compact
        />
      </div>

      {canInstall && (
        <InstallPrompt onInstall={onInstall} onDismiss={onDismissInstall} />
      )}

      <SeasonalBanner />

      <header className="hero">
        <div className="hero-logo">
          <LogoMark size={60} />
          <div className="hero-logo-ring" />
        </div>
        <p className="hero-eyebrow">Premium Word Search</p>
        <h1 className="hero-title">Lexis</h1>
        <p className="hero-subtitle">
          Swipe. Discover. Master every category.
        </p>
        <div className="hero-divider" />
      </header>

      <div className="home-actions">
        <button className="btn btn-primary btn-large btn-glow" onClick={onPlay}>
          <span className="btn-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l11-6.5L8 5.5z" />
            </svg>
          </span>
          <span className="btn-text">
            <span className="btn-label">Play Now</span>
            <span className="btn-sublabel">Choose a category</span>
          </span>
          <span className="btn-arrow">→</span>
        </button>

        <button
          className={`btn btn-glass btn-large daily-btn ${dailyCompleted ? 'completed' : ''}`}
          onClick={onDaily}
        >
          <span className="btn-icon-wrap daily-icon-wrap">☀️</span>
          <span className="btn-text">
            <span className="btn-label">Daily #{getDailyNumber(today)}</span>
            <span className="btn-sublabel">
              {dailyCompleted ? 'Completed today' : commentary}
            </span>
          </span>
          {stats.dailyStreak > 0 ? (
            <span className="streak-badge">🔥 {stats.dailyStreak}</span>
          ) : (
            <span className="btn-arrow">→</span>
          )}
        </button>
      </div>

      <div className="home-quick-links">
        <button className="quick-link glass-panel" onClick={onPacks}>
          <span className="quick-link-icon">📦</span>
          <span className="quick-link-label">Packs</span>
        </button>
        <button className="quick-link glass-panel" onClick={onAtlas}>
          <span className="quick-link-icon">🗺️</span>
          <span className="quick-link-label">Atlas</span>
        </button>
        <button className="quick-link glass-panel" onClick={onWeekly}>
          <span className="quick-link-icon">📅</span>
          <span className="quick-link-label">Weekly</span>
        </button>
        <button className="quick-link glass-panel" onClick={onAchievements}>
          <span className="quick-link-icon">🏅</span>
          <span className="quick-link-label">Awards</span>
        </button>
      </div>

      <p className="section-label">Your progress</p>
      <div className="home-stats-grid">
        <div className="stat-card glass-panel">
          <span className="stat-icon">🧩</span>
          <span className="stat-value">{stats.totalPuzzlesCompleted}</span>
          <span className="stat-label">Puzzles</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-icon">✦</span>
          <span className="stat-value">{stats.totalWordsFound}</span>
          <span className="stat-label">Words Found</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-icon">⏳</span>
          <span className="stat-value stat-value-sm">{formatDuration(stats.totalPlayTimeMs)}</span>
          <span className="stat-label">Play Time</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{stats.dailyStreak}</span>
          <span className="stat-label">Day Streak</span>
        </div>
      </div>

      <div className="home-tip glass-panel">
        <div className="tip-glow" />
        <span className="tip-icon">✦</span>
        <p>Press and swipe across letters to find words — horizontal, vertical, diagonal{stats.totalPuzzlesCompleted > 5 ? ', and backwards in hard mode' : ''}.</p>
      </div>
    </div>
  );
}