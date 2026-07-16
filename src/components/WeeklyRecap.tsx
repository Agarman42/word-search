import { getWeeklyRecap } from '../lib/daily';
import { getCategory } from '../lib/wordLists';
import { getEmptyStatsMessage } from '../lib/microcopy';
import type { Stats } from '../types';
import { CategoryIcon, IconSpark } from './Icons';
import { ScreenHeader } from './ScreenHeader';

interface WeeklyRecapProps {
  stats: Stats;
}

export function WeeklyRecap({ stats }: WeeklyRecapProps) {
  const recap = getWeeklyRecap(stats);
  const isEmpty = stats.totalPuzzlesCompleted === 0;
  const maxDayPuzzles = Math.max(...recap.dayActivity.map((d) => d.puzzles), 1);
  const suggested = getCategory(recap.suggestedCategory);

  return (
    <div className="screen weekly-screen">
      <ScreenHeader title="Weekly Recap" subtitle={`Week of ${recap.weekStart}`} />

      {isEmpty ? (
        <div className="empty-state glass-panel">
          <span className="empty-icon">✦</span>
          <p>{getEmptyStatsMessage()}</p>
        </div>
      ) : (
        <>
          <div className="weekly-hero glass-panel">
            <span className="weekly-hero-value">{recap.wordsFound}</span>
            <span className="weekly-hero-label">Words found this week</span>
          </div>

          <div className="weekly-chart panel-card">
            <h3 className="weekly-chart-title">Activity by day</h3>
            <div className="weekly-chart-bars">
              {recap.dayActivity.map((day) => (
                <div key={day.day} className="weekly-chart-col">
                  <div
                    className="weekly-chart-bar"
                    style={{ height: `${(day.puzzles / maxDayPuzzles) * 100}%` }}
                    title={`${day.puzzles} puzzles`}
                  />
                  <span className="weekly-chart-day">{day.day}</span>
                  {day.puzzles > 0 && (
                    <span className="weekly-chart-count">{day.puzzles}</span>
                  )}
                </div>
              ))}
            </div>
            {recap.bestDay && (
              <p className="weekly-best-day">
                Best day: <strong>{recap.bestDay}</strong>
              </p>
            )}
          </div>

          <div className="weekly-grid">
            <div className="weekly-stat glass-panel">
              <span className="weekly-stat-val">{recap.puzzlesCompleted}</span>
              <span className="weekly-stat-lbl">Puzzles</span>
            </div>
            <div className="weekly-stat glass-panel">
              <span className="weekly-stat-val">{recap.dailiesCompleted}</span>
              <span className="weekly-stat-lbl">Dailies</span>
            </div>
            <div className="weekly-stat glass-panel">
              <span className="weekly-stat-val">{recap.bestStreak}</span>
              <span className="weekly-stat-lbl">Streak</span>
            </div>
            <div className="weekly-stat glass-panel">
              <span className="weekly-stat-val">
                {recap.topCategory ? getCategory(recap.topCategory).icon : '—'}
              </span>
              <span className="weekly-stat-lbl">Top category</span>
            </div>
          </div>

          <div className="weekly-suggest panel-card">
            <IconSpark size={20} />
            <div>
              <span className="weekly-suggest-label">Try tomorrow</span>
              <span className="weekly-suggest-cat">
                <CategoryIcon id={suggested.id} size={16} /> {suggested.name}
              </span>
              <span className="weekly-suggest-desc">Your least-played theme this week</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}