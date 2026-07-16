import { useState } from 'react';
import type { GameRecord, PuzzleOptions } from '../types';
import { APP_NAME } from '../lib/brand';
import { formatTime } from '../lib/gameLogic';
import {
  copyToClipboard,
  generateChallengeUrl,
  generateShareText,
  shareOrCopy,
} from '../lib/share';
import { renderShareImage } from '../lib/shareImage';
import { IconSpark, IconStreak } from './Icons';

interface ShareCardProps {
  record: GameRecord;
  dailyNumber?: number;
  seed: string;
  streak?: number;
  challengeExtras?: {
    gridSize: number;
    wordCount: number;
    options: PuzzleOptions;
  };
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

export function ShareCard({
  record,
  dailyNumber,
  seed,
  streak = 0,
  challengeExtras,
  onClose,
}: ShareCardProps) {
  const [status, setStatus] = useState<string | null>(null);
  const shareText = generateShareText(record, dailyNumber);
  const challengeUrl = generateChallengeUrl(seed, record.category, challengeExtras);
  const flawless = record.wrongAttempts === 0;

  const flash = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 2200);
  };

  const shareTextResult = async () => {
    const result = await shareOrCopy(shareText);
    flash(result === 'shared' ? 'Shared!' : result === 'copied' ? 'Copied!' : 'Could not share');
  };

  const shareImage = async () => {
    const blob = await renderShareImage(record, dailyNumber, streak);
    if (blob && typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], 'wordseek-daily.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: APP_NAME,
            text: shareText,
          });
          flash('Shared!');
          return;
        }
      } catch {
        /* fall through */
      }
    }
    // Fallback: download
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wordseek-daily.png';
      a.click();
      URL.revokeObjectURL(url);
      flash('Image saved!');
      return;
    }
    await shareTextResult();
  };

  const copyLink = async () => {
    const ok = await copyToClipboard(challengeUrl);
    flash(ok ? 'Link copied!' : 'Copy failed');
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
        {status && <p className="share-status">{status}</p>}
        <div className="share-actions">
          <button className="btn btn-primary btn-glow" onClick={shareImage}>
            Share image
          </button>
          <button className="btn btn-glass" onClick={shareTextResult}>
            Share text
          </button>
          <button className="btn btn-glass" onClick={copyLink}>
            Copy challenge link
          </button>
        </div>
        <button className="share-close" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
}