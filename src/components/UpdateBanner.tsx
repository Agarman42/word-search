import { useEffect, useState } from 'react';
import { onPwaUpdateAvailable } from '../lib/pwaUpdate';

export function UpdateBanner() {
  const [reload, setReload] = useState<(() => void) | null>(null);

  useEffect(() => {
    return onPwaUpdateAvailable((fn) => setReload(() => fn));
  }, []);

  if (!reload) return null;

  return (
    <div className="update-banner" role="status">
      <span className="update-banner-text">A new version of WordSeek is ready</span>
      <button type="button" className="btn btn-primary btn-sm" onClick={() => reload()}>
        Update now
      </button>
      <button
        type="button"
        className="update-banner-dismiss"
        onClick={() => setReload(null)}
        aria-label="Dismiss"
      >
        Later
      </button>
    </div>
  );
}