import { APP_NAME } from '../lib/brand';
import type { InstallMode } from '../lib/install';

interface InstallPromptProps {
  mode: InstallMode;
  onInstall?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
  showDismiss?: boolean;
}

export function InstallPrompt({
  mode,
  onInstall,
  onDismiss,
  compact,
  showDismiss = true,
}: InstallPromptProps) {
  const isIOS = mode === 'ios';

  return (
    <div className={`install-prompt glass-panel ${compact ? 'install-prompt-compact' : ''}`}>
      <div className="install-prompt-text">
        <span className="install-icon">{isIOS ? '📱' : '📲'}</span>
        <div>
          <span className="install-title">
            {isIOS ? `Add ${APP_NAME} to Home Screen` : `Install ${APP_NAME}`}
          </span>
          <span className="install-desc">
            {isIOS
              ? 'Tap Share, then "Add to Home Screen" for full-screen play'
              : 'Add to your home screen for the best experience'}
          </span>
        </div>
      </div>
      <div className="install-actions">
        {!isIOS && onInstall && (
          <button className="btn btn-primary btn-glow install-btn" onClick={onInstall}>
            Install
          </button>
        )}
        {isIOS && (
          <span className="install-ios-steps">
            <span>① Share</span>
            <span>② Add to Home Screen</span>
          </span>
        )}
        {showDismiss && onDismiss && (
          <button className="install-dismiss" onClick={onDismiss} aria-label="Dismiss">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}