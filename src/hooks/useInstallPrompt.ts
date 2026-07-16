import { useCallback, useEffect, useState } from 'react';
import {
  dismissCompleteNudge as persistCompleteNudgeDismiss,
  dismissInstallPrompt,
  getInstallMode,
  isCompleteNudgeDismissed,
  isInstallDismissed,
  isStandaloneMode,
  type InstallMode,
} from '../lib/install';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(isInstallDismissed);
  const [completeNudgeDismissed, setCompleteNudgeDismissed] = useState(isCompleteNudgeDismissed);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const isStandalone = isStandaloneMode();
  const installMode: InstallMode | null = getInstallMode(!!deferred);
  const canInstall = installMode !== null && !dismissed;
  const canShowCompleteNudge =
    installMode !== null && !completeNudgeDismissed && !isStandalone;

  const install = useCallback(async () => {
    if (!deferred) return false;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    return outcome === 'accepted';
  }, [deferred]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    dismissInstallPrompt();
  }, []);

  const dismissCompleteNudge = useCallback(() => {
    setCompleteNudgeDismissed(true);
    persistCompleteNudgeDismiss();
  }, []);

  return {
    canInstall,
    installMode,
    isStandalone,
    install,
    dismiss,
    canShowCompleteNudge,
    dismissCompleteNudge,
  };
}