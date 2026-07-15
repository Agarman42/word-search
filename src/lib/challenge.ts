import type { CategoryId, ChallengeParams } from '../types';

const VALID_CATEGORIES = new Set<CategoryId>([
  'animals', 'food', 'sports', 'movies', 'geography', 'kids', 'holiday',
]);

export function parseChallengeFromHash(): ChallengeParams | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  const match = hash.match(/challenge=([^&]+)/);
  if (!match) return null;

  try {
    const decoded = JSON.parse(atob(match[1])) as ChallengeParams;
    if (!decoded.seed || !VALID_CATEGORIES.has(decoded.category)) return null;
    return decoded;
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