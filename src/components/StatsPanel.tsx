import type { Stats } from '../types';
import { CATEGORIES } from '../lib/wordLists';
import { formatDuration, formatTime } from '../lib/gameLogic';
import { getWeeklyWordActivity, getBestCategory } from '../lib/statsActivity';
import { ScreenHeader } from './ScreenHeader';
import { getEmptyStatsMessage } from '../lib/microcopy';
import { CategoryIcon, IconSpark } from './Icons';

interface StatsPanelProps {
  stats: Stats;
  embedded?: boolean;
}

export function StatsPanel({ stats, embedded }: StatsPanelProps) {
  const accuracy =
    stats.totalWordsFound + stats.totalWrongAttempts > 0
      ? Math.round(
          (stats.totalWordsFound / (stats.totalWordsFound + stats.totalWrongAttempts)) * 100,
        )
      : 100;

  const isEmpty = stats.totalPuzzlesCompleted === 0;
  const weekActivity = getWeeklyWordActivity(stats);
  const maxWeek = Math.max(...weekActivity, 1);
  const bestCat = getBestCategory(stats);

  const body = (
    <>
      {isEmpty && (
        <div className="empty-state panel-card stats-empty-chart">
          <span className="empty-icon"><IconSpark size={28} /></span>
          <p>{getEmptyStatsMessage()}</p>
          <div className="sparkline ghost" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="spark-bar" style={{ height: `${20 + i * 8}%` }} />
            ))}
          </div>
        </div>
      )}

      {!isEmpty && (
        <div className="stats-sparkline-card panel-card">
          <span className="sparkline-label">Words found — last 7 days</span>
          <div className="sparkline">
            {weekActivity.map((val, i) => (
              <span
                key={i}
                className="spark-bar"
                style={{ height: `${Math.max(8, (val / maxWeek) * 100)}%` }}
                title={`${val} words`}
              />
            ))}
          </div>
        </div>
      )}

      {bestCat && (
        <div className="best-category-card panel-card">
          <CategoryIcon id={bestCat.id} size={28} />
          <div>
            <span className="best-cat-label">Top category</span>
            <span className="best-cat-name">{bestCat.name}</span>
            <span className="best-cat-count">{bestCat.count} puzzles</span>
          </div>
        </div>
      )}

      <div className="stats-hero-grid">
        <div className="stat-hero-card medal-gold">
          <span className="stat-hero-value">{stats.totalPuzzlesCompleted}</span>
          <span className="stat-hero-label">Puzzles Completed</span>
        </div>
        <div className="stat-hero-card medal-silver">
          <span className="stat-hero-value">{stats.totalWordsFound}</span>
          <span className="stat-hero-label">Words Found</span>
        </div>
        <div className="stat-hero-card">
          <span className="stat-hero-value">{accuracy}%</span>
          <span className="stat-hero-label">Accuracy</span>
        </div>
        <div className="stat-hero-card medal-bronze">
          <span className="stat-hero-value">{stats.dailyStreak}</span>
          <span className="stat-hero-label">Current Streak</span>
        </div>
      </div>

      <section className="stats-section">
        <h3>Records</h3>
        <div className="record-list">
          <div className="record-row">
            <span>Total Play Time</span>
            <span>{formatDuration(stats.totalPlayTimeMs)}</span>
          </div>
          <div className="record-row">
            <span>Longest Streak</span>
            <span>{stats.longestDailyStreak} days</span>
          </div>
          <div className="record-row">
            <span>Daily Challenges</span>
            <span>{stats.completedDailyDates.length}</span>
          </div>
          {stats.bestTimes.overall && (
            <div className="record-row highlight record-gold">
              <span>Best Time (Overall)</span>
              <span>{formatTime(stats.bestTimes.overall)}</span>
            </div>
          )}
        </div>
      </section>

      <section className="stats-section">
        <h3>By Category</h3>
        <div className="category-stats">
          {CATEGORIES.map((cat) => {
            const count = stats.categoryCompletions[cat.id] ?? 0;
            const best = stats.bestTimes[cat.id];
            return (
              <div key={cat.id} className="category-stat-row">
                <span className="cat-stat-icon"><CategoryIcon id={cat.id} size={18} /></span>
                <span className="cat-stat-name">{cat.name}</span>
                <span className="cat-stat-count">{count}</span>
                {best && <span className="cat-stat-best">{formatTime(best)}</span>}
              </div>
            );
          })}
        </div>
      </section>

      {stats.recentGames.length > 0 && (
        <section className="stats-section">
          <h3>Recent Games</h3>
          <div className="recent-games">
            {stats.recentGames.slice(0, 8).map((game) => {
              const cat = CATEGORIES.find((c) => c.id === game.category);
              return (
                <div key={game.id} className="recent-game-row">
                  <span>
                    <CategoryIcon id={game.category} size={16} />{' '}
                    {game.isDaily ? 'Daily' : cat?.name}
                  </span>
                  <span className="recent-meta">
                    {formatTime(game.timeMs)} · {game.wordCount} words
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );

  if (embedded) {
    return <div className="stats-embedded">{body}</div>;
  }

  return (
    <div className="screen stats-screen">
      <ScreenHeader title="Statistics" subtitle="Your journey so far" />
      {body}
    </div>
  );
}