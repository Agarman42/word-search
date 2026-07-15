import { useState } from 'react';
import type { GameRecord } from '../types';
import { copyToClipboard, generateChallengeUrl, generateShareText } from '../lib/share';

interface ShareCardProps {
  record: GameRecord;
  dailyNumber?: number;
  seed: string;
  onClose: () => void;
}

export function ShareCard({ record, dailyNumber, seed, onClose }: ShareCardProps) {
  const [copied, setCopied] = useState<'share' | 'link' | null>(null);
  const shareText = generateShareText(record, dailyNumber);
  const challengeUrl = generateChallengeUrl(seed, record.category);

  const copy = async (text: string, type: 'share' | 'link') => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="share-card-overlay" onClick={onClose}>
      <div className="share-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <h3>Share your result</h3>
        <pre className="share-preview">{shareText}</pre>
        <div className="share-actions">
          <button className="btn btn-primary btn-glow" onClick={() => copy(shareText, 'share')}>
            {copied === 'share' ? 'Copied!' : 'Copy result'}
          </button>
          <button className="btn btn-glass" onClick={() => copy(challengeUrl, 'link')}>
            {copied === 'link' ? 'Copied!' : 'Copy challenge link'}
          </button>
        </div>
        <button className="share-close" onClick={onClose}>Continue</button>
      </div>
    </div>
  );
}