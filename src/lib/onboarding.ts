const ONBOARDING_KEY = 'lexis-onboarding-v1';

export function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === 'done';
  } catch {
    return true;
  }
}

export function markOnboardingComplete(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, 'done');
  } catch {
    /* ignore */
  }
}

export const ONBOARDING_STEPS = [
  {
    icon: '✦',
    title: 'Welcome to Lexis',
    body: 'A premium word search built for swipe-and-find gameplay on any device.',
  },
  {
    icon: '👆',
    title: 'Swipe to find words',
    body: 'Press a letter and drag in a straight line — horizontal, vertical, or diagonal — to highlight a word.',
  },
  {
    icon: '🎯',
    title: 'Explore & progress',
    body: 'Pick categories, complete daily challenges, unlock the Atlas, and climb mastery tiers.',
  },
];