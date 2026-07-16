import type { CategoryId, ChallengeParams } from '../types';
import { CATEGORIES } from './wordLists';

const VALID_CATEGORIES = new Set<CategoryId>(CATEGORIES.map((c) => c.id));

export function parseChallengeFromHash(): ChallengeParams | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  const match = hash.match(/challenge=([^&]+)/);
  if (!match) return null;

  try {
    const decoded = JSON.parse(atob(match[1])) as ChallengeParams;
    if (!decoded.seed || !VALID_CATEGORIES.has(decoded.category)) return null;
    return {
      seed: decoded.seed,
      category: decoded.category,
      gridSize: typeof decoded.gridSize === 'number' ? decoded.gridSize : undefined,
      wordCount: typeof decoded.wordCount === 'number' ? decoded.wordCount : undefined,
      allowBackwards: typeof decoded.allowBackwards === 'boolean' ? decoded.allowBackwards : undefined,
      minWordLength: typeof decoded.minWordLength === 'number' ? decoded.minWordLength : undefined,
      maxWordLength: typeof decoded.maxWordLength === 'number' ? decoded.maxWordLength : undefined,
    };
  } catch {
    return null;
  }
}

export function clearChallengeHash(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.hash = '';
  window.history.replaceState(null, '', url.toString());
}

export function encodeChallengePayload(params: ChallengeParams): string {
  return btoa(JSON.stringify(params));
}