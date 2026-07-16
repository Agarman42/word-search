import { useState } from 'react';
import type { GameRecord } from '../types';
import { APP_NAME } from '../lib/brand';
import { formatTime } from '../lib/gameLogic';
import { copyToClipboard, generateChallengeUrl, generateShareText, shareOrCopy } from '../lib/share';
import { IconSpark, IconStreak } from './Icons';

interface ShareCardProps {
  record: GameRecord;
  dailyNumber?: number;
  seed: string;
  streak?: number;
  onClose: () => void;
}

function ShareGridPreview({ size = 5 }: { size?: number }) {
  const letters = 'WORDSEEKFINDPLAY'.split('');
  return (
    <div className="share-grid-preview" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
      {Array.from({ length: size * size }).map((_, i) => (
        <span
          key={i}
          className={`share-grid-cell ${[0, 1, 2, 3, 5, 6, 7, 10, 11, 12].includes(i) ? 'highlight' : ''}`}
        >
          {letters[i % letters.length]}
        </span>
      ))}
    </div>
  );
}

export function ShareCard({ record, dailyNumber, seed, streak = 0, onClose }: ShareCardProps) {
  const [copied, setCopied] = useState<'share' | 'link' | 'shared' | null>(null);
  const shareText = generateShareText(record, dailyNumber);
  const challengeUrl = generateChallengeUrl(seed, record.category);
  const flawless = record.wrongAttempts === 0;

  const copy = async (text: string, type: 'share' | 'link') => {
    if (type === 'share') {
      const result = await shareOrCopy(text);
      if (result === 'shared') {
        setCopied('shared');
        setTimeout(() => setCopied(null), 2000);
        return;
      }
      if (result === 'copied') {
        setCopied('share');
        setTimeout(() => setCopied(null), 2000);
      }
      return;
    }
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div
      className="share-card-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-card-title"
    >
      <div className="share-card-visual glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="share-visual-card">
          <header className="share-visual-header">
            <span className="share-visual-brand">{APP_NAME}</span>
            {dailyNumber && <span className="share-visual-daily">Daily #{dailyNumber}</span>}
          </header>
          <ShareGridPreview />
          <div className="share-visual-stats">
            <div className="share-visual-stat">
              <span className="share-visual-val">{formatTime(record.timeMs)}</span>
              <span className="share-visual-lbl">Time</span>
            </div>
            <div className="share-visual-stat">
              <span className="share-visual-val">{flawless ? '💎' : record.wrongAttempts}</span>
              <span className="share-visual-lbl">{flawless ? 'Flawless' : 'Misses'}</span>
            </div>
            {streak > 0 && (
              <div className="share-visual-stat">
                <span className="share-visual-val share-streak-val">
                  <IconStreak size={14} /> {streak}
                </span>
                <span className="share-visual-lbl">Streak</span>
              </div>
            )}
          </div>
          {flawless && (
            <div className="share-visual-badge">
              <IconSpark size={14} /> Perfect run
            </div>
          )}
        </div>

        <h3 id="share-card-title">Share your result</h3>
        <pre className="share-preview">{shareText}</pre>
        <div className="share-actions">
          <button className="btn btn-primary btn-glow" onClick={() => copy(shareText, 'share')}>
            {copied === 'shared' ? 'Shared!' : copied === 'share' ? 'Copied!' : 'Share result'}
          </button>
          <button className="btn btn-glass" onClick={() => copy(challengeUrl, 'link')}>
            {copied === 'link' ? 'Copied!' : 'Copy challenge link'}
          </button>
        </div>
        <button className="share-close" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
}