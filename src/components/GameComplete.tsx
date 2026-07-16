import { useState } from 'react';
import type { Achievement, CategoryId } from '../types';
import { formatTime } from '../lib/gameLogic';
import { APP_NAME } from '../lib/brand';
import type { InstallMode } from '../lib/install';
import { AchievementIcon, CategoryIcon, IconDiamond, IconTrophy } from './Icons';
import { CountUp } from './CountUp';
import { InstallPrompt } from './InstallPrompt';

interface GameCompleteProps {
  isBlitz: boolean;
  completionMsg: string;
  elapsedMs: number;
  wordsFound: number;
  wrongAttempts: number;
  isPerfect: boolean;
  newAchievement?: Achievement | null;
  isDaily: boolean;
  isPack: boolean;
  category?: CategoryId;
  confettiColors?: string[];
  showInstallNudge?: boolean;
  installMode?: InstallMode | null;
  onInstall?: () => void;
  onDismissInstall?: () => void;
  onShare?: () => void;
  onCopyChallenge?: () => void | Promise<void>;
  onPlayAgain?: () => void;
  playAgainLabel?: string;
  onContinue: () => void;
  continueLabel?: string;
  onMainMenu: () => void;
}

export function GameComplete({
  isBlitz,
  completionMsg,
  elapsedMs,
  wordsFound,
  wrongAttempts,
  isPerfect,
  newAchievement,
  isDaily,
  isPack,
  category,
  confettiColors,
  showInstallNudge,
  installMode,
  onInstall,
  onDismissInstall,
  onShare,
  onCopyChallenge,
  onPlayAgain,
  playAgainLabel = 'Play again',
  onContinue,
  continueLabel = 'Continue',
  onMainMenu,
}: GameCompleteProps) {
  const [challengeCopied, setChallengeCopied] = useState(false);
  const headline = isBlitz ? 'Blitz complete!' : 'You found them all!';

  const handleCopyChallenge = async () => {
    if (!onCopyChallenge) return;
    await onCopyChallenge();
    setChallengeCopied(true);
    setTimeout(() => setChallengeCopied(false), 2000);
  };

  return (
    <div className="game-complete-overlay">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) => {
          const colors = confettiColors?.length
            ? confettiColors
            : ['#7c3aed', '#0891b2', '#f59e0b', '#ec4899', '#22c55e'];
          const color = colors[i % colors.length];
          return (
            <span
              key={i}
              className="confetti-piece"
              style={{ '--i': i, '--confetti-color': color } as React.CSSProperties}
            />
          );
        })}
      </div>

      <div className="game-complete-card">
        <div className="complete-hero">
          <div className="complete-check-ring">
            {isPerfect ? (
              <IconDiamond size={32} className="complete-check-icon" />
            ) : category ? (
              <CategoryIcon id={category} size={32} className="complete-check-icon" />
            ) : (
              <IconTrophy size={32} className="complete-check-icon" />
            )}
          </div>
          <p className="complete-eyebrow">
            {isBlitz ? "Time's up" : isDaily ? 'Daily complete' : isPack ? 'Level clear' : 'Puzzle solved'}
          </p>
          <h2 className="complete-headline">{headline}</h2>
          <p className="complete-message">{completionMsg}</p>
        </div>

        <div className="complete-hero-stat">
          <span className="complete-hero-value">
            {isBlitz ? <CountUp value={wordsFound} /> : formatTime(elapsedMs)}
          </span>
          <span className="complete-hero-label">
            {isBlitz ? 'words found' : 'your time'}
          </span>
        </div>

        {isPerfect && (
          <div className="complete-flawless-chip">
            <IconDiamond size={14} />
            Flawless run — zero misses
          </div>
        )}

        {newAchievement && (
          <div className="complete-achievement-banner">
            <AchievementIcon id={newAchievement.id} size={24} />
            <div>
              <span className="complete-ach-eyebrow">New achievement</span>
              <span className="complete-ach-title">{newAchievement.title}</span>
            </div>
          </div>
        )}

        {showInstallNudge && installMode && onDismissInstall && (
          <div className="complete-install-nudge">
            <p className="complete-install-label">Enjoying {APP_NAME}? Keep it one tap away.</p>
            <InstallPrompt
              mode={installMode}
              onInstall={installMode === 'native' ? onInstall : undefined}
              onDismiss={onDismissInstall}
              compact
            />
          </div>
        )}

        <div className="complete-stat-row">
          <div className="complete-stat-pill">
            <span className="complete-stat-pill-val"><CountUp value={wordsFound} /></span>
            <span className="complete-stat-pill-lbl">Words</span>
          </div>
          <div className="complete-stat-pill">
            <span className="complete-stat-pill-val"><CountUp value={wrongAttempts} /></span>
            <span className="complete-stat-pill-lbl">Misses</span>
          </div>
        </div>

        <div className="complete-actions">
          {isDaily && onShare && (
            <button className="btn btn-glass btn-complete-secondary" onClick={onShare}>
              Share result
            </button>
          )}
          {!isDaily && !isPack && onCopyChallenge && (
            <button className="btn btn-glass btn-complete-secondary" onClick={handleCopyChallenge}>
              {challengeCopied ? 'Copied!' : 'Copy challenge link'}
            </button>
          )}
          {!isDaily && onPlayAgain && (
            <button className="btn btn-glass btn-complete-secondary" onClick={onPlayAgain}>
              {playAgainLabel}
            </button>
          )}
          <button className="btn btn-primary btn-glow btn-complete-primary" onClick={onContinue}>
            {continueLabel}
          </button>
          <button className="btn btn-glass btn-complete-home" onClick={onMainMenu}>
            Main menu
          </button>
        </div>
      </div>
    </div>
  );
}