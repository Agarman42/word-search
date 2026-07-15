import { getWeeklyRecap } from '../lib/daily';
import { getCategory } from '../lib/wordLists';
import { getEmptyStatsMessage } from '../lib/microcopy';
import type { Stats } from '../types';
import { ScreenHeader } from './ScreenHeader';

interface WeeklyRecapProps {
  stats: Stats;
}

export function WeeklyRecap({ stats }: WeeklyRecapProps) {
  const recap = getWeeklyRecap(stats);
  const isEmpty = stats.totalPuzzlesCompleted === 0;

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
        </>
      )}
    </div>
  );
}