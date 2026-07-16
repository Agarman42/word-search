import { APP_NAME } from './brand';

const ONBOARDING_KEY = 'lexis-onboarding-v3';

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
    body: 'Press a letter and drag in a straight line. Only lines that match a word on the list count as found.',
  },
  {
    type: 'demo-wrong',
    title: 'Highlighted something that isn\'t a word?',
    body: 'No problem — that happens. You\'ll get a quick prompt. Tap "Don\'t count it" and it won\'t touch your stats. Misses only affect accuracy and the Flawless badge. You can always finish the puzzle.',
  },
  {
    type: 'explore',
    title: 'Explore & progress',
    body: 'Pick categories, complete daily challenges, unlock the Atlas, and climb mastery tiers.',
  },
];