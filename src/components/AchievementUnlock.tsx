import type { Achievement } from '../types';
import { AchievementIcon } from './Icons';

interface AchievementUnlockProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementUnlock({ achievement, onDismiss }: AchievementUnlockProps) {
  const share = () => {
    const text = `🏅 Unlocked in Lexis: ${achievement.title} — ${achievement.description}`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="unlock-overlay">
      <div className="unlock-card panel-card">
        <div className="unlock-badge-ring">
          <AchievementIcon id={achievement.id} size={48} />
        </div>
        <p className="unlock-eyebrow">Achievement Unlocked</p>
        <h2 className="unlock-title">{achievement.title}</h2>
        <p className="unlock-desc">{achievement.description}</p>
        <div className="unlock-actions">
          <button className="btn btn-glass" onClick={share}>
            Share badge
          </button>
          <button className="btn btn-primary btn-glow" onClick={onDismiss}>
            Nice!
          </button>
        </div>
      </div>
    </div>
  );
}