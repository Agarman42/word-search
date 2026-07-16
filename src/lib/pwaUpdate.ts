import { registerSW } from 'virtual:pwa-register';

type UpdateListener = (reload: () => void) => void;

let notifyUpdate: UpdateListener | null = null;
let pendingReload: (() => void) | null = null;

/**
 * Register the service worker and surface updates without reinstalling the PWA.
 * Call once at app start. When a new build is available, listeners get a reload().
 */
export function initPwaUpdates(): void {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      const reload = () => {
        void updateSW(true);
      };
      pendingReload = reload;
      notifyUpdate?.(reload);
    },
    onOfflineReady() {
      /* App shell cached — silent is fine */
    },
    onRegisteredSW(_url, registration) {
      if (!registration) return;

      // Check for updates periodically and when the app is reopened
      const check = () => {
        void registration.update();
      };
      setInterval(check, 30 * 60 * 1000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
      window.addEventListener('focus', check);
    },
  });
}

export function onPwaUpdateAvailable(listener: UpdateListener): () => void {
  notifyUpdate = listener;
  if (pendingReload) listener(pendingReload);
  return () => {
    if (notifyUpdate === listener) notifyUpdate = null;
  };
}