interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallPrompt({ onInstall, onDismiss }: InstallPromptProps) {
  return (
    <div className="install-prompt glass-panel">
      <div className="install-prompt-text">
        <span className="install-icon">📲</span>
        <div>
          <span className="install-title">Install Lexis</span>
          <span className="install-desc">Add to your home screen for the best experience</span>
        </div>
      </div>
      <div className="install-actions">
        <button className="btn btn-primary btn-glow install-btn" onClick={onInstall}>
          Install
        </button>
        <button className="install-dismiss" onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  );
}