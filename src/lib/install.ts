const INSTALL_DISMISS_KEY = 'lexis-install-dismissed-at';
const COMPLETE_NUDGE_DISMISS_KEY = 'lexis-install-complete-nudge';
const DISMISS_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isInstallDismissed(): boolean {
  try {
    // Legacy permanent dismiss
    if (localStorage.getItem('lexis-install-dismissed') === '1') {
      localStorage.removeItem('lexis-install-dismissed');
      localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()));
    }
    const raw = localStorage.getItem(INSTALL_DISMISS_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    if (Date.now() - at > DISMISS_TTL_MS) {
      localStorage.removeItem(INSTALL_DISMISS_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function dismissInstallPrompt(): void {
  try {
    localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function isCompleteNudgeDismissed(): boolean {
  try {
    return localStorage.getItem(COMPLETE_NUDGE_DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissCompleteNudge(): void {
  try {
    localStorage.setItem(COMPLETE_NUDGE_DISMISS_KEY, '1');
  } catch {
    /* ignore */
  }
}

export type InstallMode = 'native' | 'ios';

export function getInstallMode(hasNativePrompt: boolean): InstallMode | null {
  if (isStandaloneMode() || isInstallDismissed()) return null;
  if (hasNativePrompt) return 'native';
  if (isIOS()) return 'ios';
  return null;
}