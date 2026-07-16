import type { ComponentType } from 'react';
import type { Screen } from '../types';
import { IconHome, IconPlay, IconSettings, IconStats } from './Icons';

interface NavigationProps {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NAV_ITEMS: { id: Screen; label: string; Icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'puzzles', label: 'Puzzles', Icon: IconPlay },
  { id: 'stats', label: 'Stats', Icon: IconStats },
  { id: 'settings', label: 'Settings', Icon: IconSettings },
];

const PUZZLE_SCREENS: Screen[] = ['puzzles', 'categories', 'packs', 'atlas', 'weekly', 'achievements'];

function resolveNavScreen(screen: Screen): Screen {
  if (screen === 'home' || screen === 'stats' || screen === 'settings') return screen;
  if (PUZZLE_SCREENS.includes(screen)) return 'puzzles';
  return 'home';
}

export function Navigation({ screen, onNavigate }: NavigationProps) {
  if (screen === 'game') return null;

  const navScreen = resolveNavScreen(screen);
  const activeIndex = NAV_ITEMS.findIndex((n) => n.id === navScreen);

  return (
    <nav className="bottom-nav-dock">
      <div className="bottom-nav nav-4">
        <div
          className="nav-indicator"
          style={{ '--nav-index': activeIndex, '--nav-count': 4 } as React.CSSProperties}
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