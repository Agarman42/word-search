import { useState } from 'react';
import type { Achievement, Stats } from '../types';
import { APP_NAME } from '../lib/brand';
import { getAchievementHint } from '../lib/achievementProgress';
import { shareOrCopy } from '../lib/share';
import { AchievementIcon } from './Icons';
import { ScreenHeader } from './ScreenHeader';

interface AchievementsPanelProps {
  achievements: Achievement[];
  stats: Stats;
  embedded?: boolean;
}

export function AchievementsPanel({ achievements, stats, embedded }: AchievementsPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const unlocked = achievements.filter((a) => a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);
  const pct = Math.round((unlocked.length / achievements.length) * 100);

  const shareAchievement = async (a: Achievement) => {
    const text = `I unlocked "${a.title}" in ${APP_NAME}! ${a.description}`;
    const result = await shareOrCopy(text);
    if (result !== 'failed') {
      setCopiedId(a.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const header = !embedded && (
    <ScreenHeader
      title="Achievements"
      subtitle={`${unlocked.length} of ${achievements.length} unlocked (${pct}%)`}
    />
  );

  return (
    <div className={embedded ? 'achievements-embedded' : 'screen achievements-screen'}>
      {header}

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
          <h3>Unlocked — tap to share</h3>
          <div className="achievement-gallery">
            {unlocked.map((a) => (
              <button
                key={a.id}
                className="achievement-gallery-card panel-card unlocked"
                onClick={() => shareAchievement(a)}
              >
                <span className="achievement-gallery-icon">
                  <AchievementIcon id={a.id} size={32} />
                </span>
                <span className="achievement-gallery-title">{a.title}</span>
                <span className="achievement-gallery-share">
                  {copiedId === a.id ? 'Copied!' : 'Share'}
                </span>
              </button>
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