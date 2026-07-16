import { ONBOARDING_STEPS } from '../lib/onboarding';
import { OnboardingDemo } from './OnboardingDemo';

interface HowToPlayProps {
  onClose: () => void;
}

export function HowToPlay({ onClose }: HowToPlayProps) {
  const swipeStep = ONBOARDING_STEPS.find((s) => s.type === 'demo-swipe');
  const wrongStep = ONBOARDING_STEPS.find((s) => s.type === 'demo-wrong');

  return (
    <div className="how-to-play-overlay" onClick={onClose}>
      <div className="how-to-play-card panel-card" onClick={(e) => e.stopPropagation()}>
        <header className="how-to-play-header">
          <h2 className="display-font">How to play</h2>
          <button className="how-to-play-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <section className="how-to-play-section">
          <h3>Swipe to find words</h3>
          <p>{swipeStep?.body}</p>
          <OnboardingDemo mode="swipe" />
        </section>

        <section className="how-to-play-section">
          <h3>Not a word on the list?</h3>
          <p>{wrongStep?.body}</p>
          <OnboardingDemo mode="wrong" />
        </section>

        <section className="how-to-play-section how-to-play-tips">
          <h3>Quick tips</h3>
          <ul>
            <li>Daily puzzles refresh every day — great for building a streak.</li>
            <li>Misses affect accuracy and the Flawless badge, but never block completion.</li>
            <li>Tap a word in the list to see where it hides on the grid.</li>
            <li>Add WordSeek to your home screen for the fastest launch.</li>
          </ul>
        </section>

        <button className="btn btn-primary btn-glow how-to-play-done" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}