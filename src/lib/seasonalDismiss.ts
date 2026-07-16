const PREFIX = 'lexis-season-dismiss-';

export function isSeasonDismissed(seasonId: string): boolean {
  try {
    return localStorage.getItem(`${PREFIX}${seasonId}`) === '1';
  } catch {
    return false;
  }
}

export function dismissSeason(seasonId: string): void {
  try {
    localStorage.setItem(`${PREFIX}${seasonId}`, '1');
  } catch {
    /* ignore */
  }
}