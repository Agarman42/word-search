import type { CategoryId, Settings, Stats } from '../types';
import { todayString } from '../lib/rng';
import { getDailyCommentary, getDailyNumber, getDailyCategory } from '../lib/daily';
import { getContinueLabel, getContinueSession } from '../lib/continueSession';
import { APP_NAME, APP_TAGLINE } from '../lib/brand';
import { getCategory } from '../lib/wordLists';
import { HomeBackground } from './HomeBackground';
import { HomeMiniPuzzle } from './HomeMiniPuzzle';
import { AnnouncementRail } from './AnnouncementRail';
import type { InstallMode } from '../lib/install';
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
  installMode?: InstallMode | null;
  onInstall: () => void;
  onDismissInstall: () => void;
  onSeasonalPlay: () => void;
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
  installMode,
  onInstall,
  onDismissInstall,
  onSeasonalPlay,
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
          installMode={installMode}
          onInstall={onInstall}
          onDismissInstall={onDismissInstall}
          showDailyNudge={showDailyNudge}
          dailyCompleted={dailyCompleted}
          onDaily={onDaily}
          onDismissDailyNudge={onDismissDailyNudge}
          onSeasonalPlay={onSeasonalPlay}
        />

        <div className="home-hero-card panel-card">
          <header className="hero hero-fun">
            <div className="hero-logo">
              <LogoMark size={60} />
              <div className="hero-logo-ring" />
            </div>
            <p className="hero-eyebrow">Swipe · Find · Win</p>
            <h1 className="hero-title display-font">{APP_NAME}</h1>
            <p className="hero-subtitle">{APP_TAGLINE}</p>
          </header>

          <HomeMiniPuzzle />

          <div className="home-hero-cta">
            <button
              className={`btn btn-primary btn-large btn-glow btn-play-hero ${dailyCompleted ? 'pulse-soft' : ''}`}
              onClick={onDaily}
            >
              <span className="btn-icon-wrap"><IconSpark size={20} /></span>
              <span className="btn-text">
                <span className="btn-label">
                  {dailyCompleted ? `Daily #${getDailyNumber(today)} — Done!` : `Play Daily #${getDailyNumber(today)}`}
                </span>
                <span className="btn-sublabel">
                  {dailyCompleted ? 'Come back tomorrow' : commentary}
                </span>
              </span>
              {!dailyCompleted && <span className="btn-arrow">→</span>}
            </button>

            {dailyCompleted ? (
              <button className="btn btn-glass btn-large" onClick={onPlay}>
                <span className="btn-icon-wrap"><IconPlay size={18} /></span>
                <span className="btn-text">
                  <span className="btn-label">Browse puzzles</span>
                  <span className="btn-sublabel">Categories, packs & atlas</span>
                </span>
                <span className="btn-arrow">→</span>
              </button>
            ) : continueSession ? (
              <button
                className="btn btn-glass btn-large home-continue-btn"
                onClick={() => onContinue(continueSession.category)}
              >
                <span className="btn-icon-wrap"><IconContinue size={18} /></span>
                <span className="btn-text">
                  <span className="btn-label">Play again</span>
                  <span className="btn-sublabel">
                    {getContinueLabel(continueSession)} · {continueSession.completedAgo}
                  </span>
                </span>
              </button>
            ) : (
              <button className="btn btn-glass btn-large" onClick={onPlay}>
                <span className="btn-icon-wrap"><IconPlay size={18} /></span>
                <span className="btn-text">
                  <span className="btn-label">Browse puzzles</span>
                  <span className="btn-sublabel">Categories, packs & atlas</span>
                </span>
                <span className="btn-arrow">→</span>
              </button>
            )}
          </div>

          {stats.dailyStreak > 0 && (
            <div className="home-streak-pill">
              <IconStreak size={16} />
              <span>{stats.dailyStreak} day streak — keep it going!</span>
            </div>
          )}
        </div>

        <div className="home-quick-links home-quick-fun">
          <button className="quick-link-fun" onClick={onPlay}>
            <span className="quick-link-icon quick-link-play"><IconPlay size={22} /></span>
            <span className="quick-link-label">Play</span>
          </button>
          <button className="quick-link-fun" onClick={onPacks}>
            <span className="quick-link-icon" style={{ '--qc': '#f59e0b' } as React.CSSProperties}>
              <IconPack size={22} />
            </span>
            <span className="quick-link-label">Packs</span>
          </button>
          <button className="quick-link-fun" onClick={onWeekly}>
            <span className="quick-link-icon" style={{ '--qc': '#0891b2' } as React.CSSProperties}>
              <IconCalendar size={22} />
            </span>
            <span className="quick-link-label">Weekly</span>
          </button>
          <button className="quick-link-fun" onClick={onAchievements}>
            <span className="quick-link-icon" style={{ '--qc': '#db2777' } as React.CSSProperties}>
              <IconTrophy size={22} />
            </span>
            <span className="quick-link-label">Achievements</span>
          </button>
        </div>

        {!isNewPlayer && (
          <div className="home-stats-strip">
            <div className="stat-pill">
              <IconPuzzle size={14} />
              <span className="stat-pill-val">{stats.totalPuzzlesCompleted}</span>
              <span className="stat-pill-lbl">puzzles</span>
            </div>
            <div className="stat-pill">
              <IconSpark size={14} />
              <span className="stat-pill-val">{stats.totalWordsFound}</span>
              <span className="stat-pill-lbl">words</span>
            </div>
            <div className="stat-pill">
              <CategoryIcon id={dailyCat} size={14} />
              <span className="stat-pill-lbl">today: {getCategory(dailyCat).name}</span>
            </div>
          </div>
        )}

        {isNewPlayer && (
          <div className="home-new-player panel-card">
            <IconPuzzle size={32} />
            <p>Your first puzzle is one tap away — daily challenges are a great start.</p>
          </div>
        )}
      </div>
    </div>
  );
}