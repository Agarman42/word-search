import type { CategoryId, Settings, Stats } from '../types';
import { todayString } from '../lib/rng';
import { formatDuration } from '../lib/gameLogic';
import { getDailyCommentary, getDailyNumber, getDailyCategory } from '../lib/daily';
import { getContinueLabel, getContinueSession } from '../lib/continueSession';
import { getCategory } from '../lib/wordLists';
import { HomeBackground } from './HomeBackground';
import { AnnouncementRail } from './AnnouncementRail';
import {
  CategoryIcon,
  IconCalendar,
  IconContinue,
  IconPack,
  IconPlay,
  IconPuzzle,
  IconSpark,
  IconStreak,
  IconTrophy,
  LogoMark,
} from './Icons';
import { ThemeToggle } from './ThemeToggle';

interface HomeProps {
  stats: Stats;
  settings: Settings;
  lightBackground: boolean;
  onToggleLight: (light: boolean) => void;
  onPlay: () => void;
  onDaily: () => void;
  onContinue: (category: CategoryId) => void;
  onPacks: () => void;
  onWeekly: () => void;
  onAchievements: () => void;
  dailyCompleted: boolean;
  showDailyNudge: boolean;
  onDismissDailyNudge: () => void;
  canInstall: boolean;
  onInstall: () => void;
  onDismissInstall: () => void;
}

export function Home({
  stats,
  settings,
  lightBackground,
  onToggleLight,
  onPlay,
  onDaily,
  onContinue,
  onPacks,
  onWeekly,
  onAchievements,
  dailyCompleted,
  showDailyNudge,
  onDismissDailyNudge,
  canInstall,
  onInstall,
  onDismissInstall,
}: HomeProps) {
  const today = todayString();
  const dailyCat = getDailyCategory(today);
  const commentary = getDailyCommentary(today, dailyCat);
  const isNewPlayer = stats.totalPuzzlesCompleted === 0;
  const continueSession = getContinueSession(stats, settings);

  return (
    <div className="screen home-screen">
      <HomeBackground />

      <div className="home-content">
        <div className="home-top-bar">
          <ThemeToggle lightBackground={lightBackground} onChange={onToggleLight} compact />
        </div>

        <AnnouncementRail
          canInstall={canInstall}
          onInstall={onInstall}
          onDismissInstall={onDismissInstall}
          showDailyNudge={showDailyNudge}
          dailyCompleted={dailyCompleted}
          onDaily={onDaily}
          onDismissDailyNudge={onDismissDailyNudge}
        />

        <header className="hero hero-premium">
          <div className="hero-logo">
            <LogoMark size={56} />
            <div className="hero-logo-ring" />
          </div>
          <p className="hero-eyebrow">Premium Word Search</p>
          <h1 className="hero-title display-font">Lexis</h1>
          <p className="hero-subtitle">Swipe. Discover. Master every category.</p>
        </header>

        <div className="today-card panel-card">
          <div className="today-card-header">
            <span className="today-label">Today</span>
            {stats.dailyStreak > 0 && (
              <span className="today-streak">
                <IconStreak size={14} /> {stats.dailyStreak} day streak
              </span>
            )}
          </div>
          <h2 className="today-title">
            Daily #{getDailyNumber(today)}
            <span className="today-cat">
              <CategoryIcon id={dailyCat} size={16} /> {getCategory(dailyCat).name}
            </span>
          </h2>
          <p className="today-commentary">
            {dailyCompleted ? 'Completed — great work today!' : commentary}
          </p>
          <button
            className={`btn btn-primary btn-glow today-play-btn ${dailyCompleted ? 'completed' : ''}`}
            onClick={onDaily}
          >
            {dailyCompleted ? 'View daily result' : 'Play Daily'}
          </button>
        </div>

        <div className="home-actions">
          {continueSession && (
            <button
              className="btn btn-primary btn-large btn-glow home-continue-btn"
              onClick={() => onContinue(continueSession.category)}
            >
              <span className="btn-icon-wrap">
                <IconContinue size={18} />
              </span>
              <span className="btn-text">
                <span className="btn-label">Continue</span>
                <span className="btn-sublabel">
                  {getContinueLabel(continueSession)} · {continueSession.completedAgo}
                </span>
              </span>
              <span className="btn-arrow">→</span>
            </button>
          )}

          <button
            className={`btn btn-glass btn-large ${continueSession ? '' : 'btn-primary btn-glow'}`}
            onClick={onPlay}
          >
            <span className="btn-icon-wrap">
              <IconPlay size={18} />
            </span>
            <span className="btn-text">
              <span className="btn-label">Browse Puzzles</span>
              <span className="btn-sublabel">Categories, packs & atlas</span>
            </span>
            <span className="btn-arrow">→</span>
          </button>
        </div>

        <div className="home-quick-links">
          <button className="quick-link panel-card" onClick={onPacks}>
            <span className="quick-link-icon"><IconPack size={22} /></span>
            <span className="quick-link-label">Packs</span>
          </button>
          <button className="quick-link panel-card" onClick={onWeekly}>
            <span className="quick-link-icon"><IconCalendar size={22} /></span>
            <span className="quick-link-label">Weekly</span>
          </button>
          <button className="quick-link panel-card" onClick={onAchievements}>
            <span className="quick-link-icon"><IconTrophy size={22} /></span>
            <span className="quick-link-label">Awards</span>
          </button>
        </div>

        <p className="section-label">Your progress</p>
        {isNewPlayer ? (
          <div className="empty-state panel-card home-empty">
            <span className="empty-icon"><IconPuzzle size={28} /></span>
            <p>Start your first puzzle — stats and streaks will appear here.</p>
          </div>
        ) : (
          <div className="home-stats-grid">
            <div className="stat-card panel-card">
              <span className="stat-icon"><IconPuzzle size={20} /></span>
              <span className="stat-value">{stats.totalPuzzlesCompleted}</span>
              <span className="stat-label">Puzzles</span>
            </div>
            <div className="stat-card panel-card">
              <span className="stat-icon"><IconSpark size={18} /></span>
              <span className="stat-value">{stats.totalWordsFound}</span>
              <span className="stat-label">Words Found</span>
            </div>
            <div className="stat-card panel-card">
              <span className="stat-icon"><IconCalendar size={18} /></span>
              <span className="stat-value stat-value-sm">{formatDuration(stats.totalPlayTimeMs)}</span>
              <span className="stat-label">Play Time</span>
            </div>
            <div className="stat-card panel-card">
              <span className="stat-icon"><IconStreak size={18} /></span>
              <span className="stat-value">{stats.dailyStreak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>
        )}

        <div className="home-tip panel-card">
          <span className="tip-icon"><IconSpark size={14} /></span>
          <p>
            Press and swipe across letters to find words — horizontal, vertical, diagonal
            {stats.totalPuzzlesCompleted > 5 ? ', and backwards in hard mode' : ''}.
          </p>
        </div>
      </div>
    </div>
  );
}