import { useState } from 'react';
import { ONBOARDING_STEPS, markOnboardingComplete } from '../lib/onboarding';
import { IconSpark } from './Icons';
import { OnboardingDemo } from './OnboardingDemo';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [demoDone, setDemoDone] = useState(false);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  const next = () => {
    if (isLast) {
      markOnboardingComplete();
      onComplete();
    } else {
      setStep((s) => s + 1);
      setDemoDone(false);
    }
  };

  const canAdvance =
    current.type !== 'demo-swipe' || demoDone;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card glass-panel">
        <div className="onboarding-dots">
          {ONBOARDING_STEPS.map((_, i) => (
            <span key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
        {current.type === 'welcome' && (
          <span className="onboarding-icon"><IconSpark size={36} /></span>
        )}
        <h2 className="display-font">{current.title}</h2>
        <p>{current.body}</p>

        {current.type === 'demo-swipe' && (
          <OnboardingDemo mode="swipe" onSuccess={() => setDemoDone(true)} />
        )}
        {current.type === 'demo-wrong' && (
          <OnboardingDemo mode="wrong" />
        )}

        <div className="onboarding-actions">
          {step > 0 && (
            <button className="btn btn-glass" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}
          <button className="btn btn-primary btn-glow" onClick={next} disabled={!canAdvance}>
            {isLast ? 'Start playing' : current.type === 'demo-swipe' && !demoDone ? 'Find CAT first' : 'Next'}
          </button>
        </div>
        {!isLast && (
          <button
            className="onboarding-skip"
            onClick={() => {
              markOnboardingComplete();
              onComplete();
            }}
          >
            Skip tutorial
          </button>
        )}
      </div>
    </div>
  );
}