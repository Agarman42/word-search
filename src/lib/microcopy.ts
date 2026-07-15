export function getCompletionMessage(wrongAttempts: number, timeMs: number): string {
  if (wrongAttempts === 0 && timeMs < 120000) return 'Sharp eyes. Flawless speed.';
  if (wrongAttempts === 0) return 'Every letter accounted for.';
  if (timeMs < 180000) return 'Quick thinking — well played.';
  if (wrongAttempts <= 2) return 'Nearly flawless. Impressive.';
  return 'Puzzle conquered. Onward.';
}

export function getWordFoundMessage(word: string): string {
  const short = ['Nice.', 'Got it.', 'Sharp.', 'Found.'];
  const long = ['Excellent find.', 'Well spotted.', 'There it is.'];
  return word.length >= 7
    ? long[word.charCodeAt(0) % long.length]
    : short[word.charCodeAt(0) % short.length];
}

export function getEmptyStatsMessage(): string {
  return 'Your legend starts with one swipe.';
}

export function getBlitzEndMessage(found: number, highScore: number): string {
  if (found >= highScore && found > 0) return 'New blitz record!';
  if (found >= 10) return 'Blazing speed!';
  if (found >= 5) return 'Solid sprint.';
  return 'Keep practicing — beat your best.';
}