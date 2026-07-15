import type { Stats } from '../types';
import { CATEGORIES } from '../lib/wordLists';
import { formatDuration, formatTime } from '../lib/gameLogic';
import { ScreenHeader } from './ScreenHeader';
import { getEmptyStatsMessage } from '../lib/microcopy';

interface StatsPanelProps {
  stats: Stats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const accuracy =
    stats.totalWordsFound + stats.totalWrongAttempts > 0
      ? Math.round(
          (stats.totalWordsFound / (stats.totalWordsFound + stats.totalWrongAttempts)) * 100,
        )
      : 100;

  const isEmpty = stats.totalPuzzlesCompleted === 0;

  return (
    <div className="screen stats-screen">
      <ScreenHeader title="Statistics" subtitle="Your journey so far" />

      {isEmpty && (
        <div className="empty-state glass-panel">
          <span className="empty-icon">✦</span>
          <p>{getEmptyStatsMessage()}</p>
        </div>
      )}

      <div className="stats-hero-grid">
        <div className="stat-hero-card">
          <span className="stat-hero-value">{stats.totalPuzzlesCompleted}</span>
          <span className="stat-hero-label">Puzzles Completed</span>
        </div>
        <div className="stat-hero-card">
          <span className="stat-hero-value">{stats.totalWordsFound}</span>
          <span className="stat-hero-label">Words Found</span>
        </div>
        <div className="stat-hero-card">
          <span className="stat-hero-value">{accuracy}%</span>
          <span className="stat-hero-label">Accuracy</span>
        </div>
        <div className="stat-hero-card">
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
            <div className="record-row highlight">
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
                <span className="cat-stat-icon">{cat.icon}</span>
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
                  <span>{cat?.icon} {game.isDaily ? 'Daily' : cat?.name}</span>
                  <span className="recent-meta">
                    {formatTime(game.timeMs)} · {game.wordCount} words
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}