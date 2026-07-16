import { APP_NAME } from '../lib/brand';
import { APP_VERSION, BUILD_TIME, formatBuildTime } from '../lib/version';

export function VersionFooter() {
  const isDev = import.meta.env.DEV;

  return (
    <footer className="version-footer version-footer-subtle" aria-label="App version">
      <span className="version-brand">{APP_NAME}</span>
      <span className="version-sep">·</span>
      <span className="version-number">v{APP_VERSION}</span>
      <span className="version-sep">·</span>
      <span className="version-build">{formatBuildTime(BUILD_TIME)}</span>
      {isDev && <span className="version-live" title="Development build">live</span>}
    </footer>
  );
}