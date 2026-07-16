import type { CategoryId, GameRecord } from '../types';
import { APP_NAME } from './brand';
import { formatTime } from './gameLogic';

export function generateShareText(record: GameRecord, dailyNumber?: number): string {
  const emoji = record.wrongAttempts === 0 ? '💎' : '✦';
  const time = formatTime(record.timeMs);
  const mistakes = record.wrongAttempts === 0 ? 'flawless' : `${record.wrongAttempts} miss${record.wrongAttempts > 1 ? 'es' : ''}`;

  if (record.isDaily && dailyNumber) {
    const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
    return `${APP_NAME} Daily #${dailyNumber} ${emoji}\n${time} · ${mistakes}\n${url}`;
  }

  return `${APP_NAME} ${record.category} ${emoji}\n${time} · ${record.wordCount} words · ${mistakes}`;
}

export function generateChallengeUrl(seed: string, category: CategoryId): string {
  const base = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const payload = btoa(JSON.stringify({ seed, category }));
  return `${base}#challenge=${payload}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}