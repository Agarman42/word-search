import type { ComponentType } from 'react';
import type { Screen } from '../types';
import { IconHome, IconPlay, IconSettings, IconStats } from './Icons';

interface NavigationProps {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NAV_ITEMS: { id: Screen; label: string; Icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'categories', label: 'Play', Icon: IconPlay },
  { id: 'atlas', label: 'Atlas', Icon: AtlasIcon },
  { id: 'stats', label: 'Stats', Icon: IconStats },
  { id: 'settings', label: 'Settings', Icon: IconSettings },
];

function AtlasIcon({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Navigation({ screen, onNavigate }: NavigationProps) {
  if (screen === 'game') return null;

  const navScreens: Screen[] = NAV_ITEMS.map((n) => n.id);
  const navScreen: Screen =
    screen === 'packs' || screen === 'weekly' || screen === 'achievements'
      ? 'categories'
      : screen;
  const activeIndex = navScreens.includes(navScreen)
    ? navScreens.indexOf(navScreen)
    : 0;

  return (
    <nav className="bottom-nav-dock">
      <div className="bottom-nav">
        <div
          className="nav-indicator"
          style={{ '--nav-index': activeIndex } as React.CSSProperties}
        />
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${navScreen === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            aria-current={navScreen === item.id ? 'page' : undefined}
          >
            <item.Icon size={20} className="nav-svg" />
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}