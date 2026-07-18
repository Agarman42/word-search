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
      <div className="update-banner-copy">
        <span className="update-banner-title">Update available</span>
        <span className="update-banner-text">A new version of WordSeek is ready</span>
      </div>
      <div className="update-banner-actions">
        <button type="button" className="btn btn-primary update-banner-btn" onClick={() => reload()}>
          Update now
        </button>
        <button
          type="button"
          className="update-banner-dismiss"
          onClick={() => setReload(null)}
        >
          Later
        </button>
      </div>
    </div>
  );
}