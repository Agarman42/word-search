import type { Achievement, Stats } from '../types';
import { getAchievementHint } from '../lib/achievementProgress';
import { AchievementIcon } from './Icons';
import { ScreenHeader } from './ScreenHeader';

interface AchievementsPanelProps {
  achievements: Achievement[];
  stats: Stats;
}

export function AchievementsPanel({ achievements, stats }: AchievementsPanelProps) {
  const unlocked = achievements.filter((a) => a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);
  const pct = Math.round((unlocked.length / achievements.length) * 100);

  return (
    <div className="screen achievements-screen">
      <ScreenHeader
        title="Achievements"
        subtitle={`${unlocked.length} of ${achievements.length} unlocked (${pct}%)`}
      />

      <div className="achievement-progress panel-card">
        <div className="achievement-progress-fill" style={{ width: `${pct}%` }} />
        <span className="achievement-progress-label">{pct}% complete</span>
      </div>

      {unlocked.length === 0 && (
        <div className="empty-state panel-card">
          <span className="empty-icon"><AchievementIcon id="first_puzzle" size={28} /></span>
          <p>Play puzzles and complete dailies to unlock your first achievement.</p>
        </div>
      )}

      {unlocked.length > 0 && (
        <section className="achievement-section">
          <h3>Unlocked</h3>
          <div className="achievement-grid">
            {unlocked.map((a) => (
              <div key={a.id} className="achievement-card unlocked panel-card">
                <span className="achievement-icon"><AchievementIcon id={a.id} size={28} /></span>
                <div className="achievement-info">
                  <span className="achievement-title">{a.title}</span>
                  <span className="achievement-desc">{a.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="achievement-section">
        <h3>{unlocked.length > 0 ? 'Locked' : 'All Achievements'}</h3>
        <div className="achievement-grid">
          {(unlocked.length > 0 ? locked : achievements).map((a) => {
            const hint = getAchievementHint(a, stats);
            return (
              <div key={a.id} className={`achievement-card panel-card ${a.unlockedAt ? 'unlocked' : 'locked'}`}>
                <span className="achievement-icon">
                  {a.unlockedAt ? (
                    <AchievementIcon id={a.id} size={28} />
                  ) : (
                    <span className="achievement-lock">🔒</span>
                  )}
                </span>
                <div className="achievement-info">
                  <span className="achievement-title">{a.title}</span>
                  <span className="achievement-desc">{a.description}</span>
                  {!a.unlockedAt && hint && (
                    <span className="achievement-hint">{hint}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}