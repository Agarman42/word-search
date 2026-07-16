import { APP_NAME } from './brand';

const ONBOARDING_KEY = 'lexis-onboarding-v2';

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

export type OnboardingStepType = 'welcome' | 'demo-swipe' | 'demo-wrong' | 'explore';

export const ONBOARDING_STEPS: {
  type: OnboardingStepType;
  title: string;
  body: string;
}[] = [
  {
    type: 'welcome',
    title: `Welcome to ${APP_NAME}`,
    body: 'A premium word search built for swipe-and-find gameplay on any device.',
  },
  {
    type: 'demo-swipe',
    title: 'Swipe to find words',
    body: 'Press a letter and drag in a straight line to highlight a word.',
  },
  {
    type: 'demo-wrong',
    title: 'Made a mistake?',
    body: 'Wrong swipes can be undone before they count against you.',
  },
  {
    type: 'explore',
    title: 'Explore & progress',
    body: 'Pick categories, complete daily challenges, unlock the Atlas, and climb mastery tiers.',
  },
];