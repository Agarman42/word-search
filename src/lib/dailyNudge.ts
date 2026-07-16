const NUDGE_KEY = 'lexis-daily-nudge-dismissed';

export function shouldShowDailyNudge(completedToday: boolean, puzzlesPlayed: number): boolean {
  if (completedToday || puzzlesPlayed > 0) return false;
  try {
    return localStorage.getItem(NUDGE_KEY) !== '1';
  } catch {
    return false;
  }
}

export function dismissDailyNudge(): void {
  try {
    localStorage.setItem(NUDGE_KEY, '1');
  } catch {
    /* ignore */
  }
}