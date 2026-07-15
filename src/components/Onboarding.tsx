import { useState } from 'react';
import { ONBOARDING_STEPS, markOnboardingComplete } from '../lib/onboarding';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  const next = () => {
    if (isLast) {
      markOnboardingComplete();
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card glass-panel">
        <div className="onboarding-dots">
          {ONBOARDING_STEPS.map((_, i) => (
            <span key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
        <span className="onboarding-icon">{current.icon}</span>
        <h2>{current.title}</h2>
        <p>{current.body}</p>
        <div className="onboarding-actions">
          {step > 0 && (
            <button className="btn btn-glass" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}
          <button className="btn btn-primary btn-glow" onClick={next}>
            {isLast ? 'Start playing' : 'Next'}
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