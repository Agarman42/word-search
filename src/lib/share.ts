import type { CategoryId, ChallengeParams, GameRecord, PuzzleOptions } from '../types';
import { APP_NAME } from './brand';
import { encodeChallengePayload } from './challenge';
import { formatTime } from './gameLogic';

export function generateShareText(record: GameRecord, dailyNumber?: number): string {
  const emoji = record.wrongAttempts === 0 ? '💎' : '✦';
  const time = formatTime(record.timeMs);
  const mistakes =
    record.wrongAttempts === 0
      ? 'flawless'
      : `${record.wrongAttempts} miss${record.wrongAttempts > 1 ? 'es' : ''}`;

  if (record.isDaily && dailyNumber) {
    const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
    return `${APP_NAME} Daily #${dailyNumber} ${emoji}\n${time} · ${mistakes}\n${url}`;
  }

  return `${APP_NAME} ${record.category} ${emoji}\n${time} · ${record.wordCount} words · ${mistakes}`;
}

export function generateChallengeUrl(
  seed: string,
  category: CategoryId,
  extras?: {
    gridSize: number;
    wordCount: number;
    options: PuzzleOptions;
  },
): string {
  const base =
    typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const payload: ChallengeParams = {
    seed,
    category,
    ...(extras
      ? {
          gridSize: extras.gridSize,
          wordCount: extras.wordCount,
          allowBackwards: extras.options.allowBackwards,
          minWordLength: extras.options.minWordLength,
          maxWordLength: extras.options.maxWordLength,
        }
      : {}),
  };
  return `${base}#challenge=${encodeChallengePayload(payload)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function shareOrCopy(text: string): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch {
      /* fall through to copy */
    }
  }
  const ok = await copyToClipboard(text);
  return ok ? 'copied' : 'failed';
}