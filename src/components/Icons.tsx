import type { CategoryId } from '../types';

interface IconProps {
  size?: number;
  className?: string;
}

export function IconHome({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPlay({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 5.5v13l11-6.5L8 5.5z" fill="currentColor" />
    </svg>
  );
}

export function IconStats({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 20V10M12 20V4M18 20v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconTrophy({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 4h8v3a4 4 0 01-8 0V4zM6 4H4v1a3 3 0 003 3M18 4h2v1a3 3 0 01-3 3M9 14h6M10 18h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 14v4" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconSettings({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconBack({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconHint({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSun({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconStreak({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2c1 3 4 5 4 9a4 4 0 01-8 0c0-4 3-6 4-9z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M8 21h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconPack({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 7.5L12 3l8 4.5v9L12 21l-8-4.5v-9z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M12 12v9M4 7.5L12 12l8-4.5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCalendar({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconPuzzle({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 4h2a2 2 0 004 0h2v2a2 2 0 000 4v2h-2a2 2 0 00-4 0H8v-2a2 2 0 000-4V4z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStar({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.9 6.9L22 10.3l-5.2 4.5L18.2 22 12 18.3 5.8 22l1.4-7.2L2 10.3l7.1-1.4L12 2z" />
    </svg>
  );
}

export function IconDiamond({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 8h16L12 21 4 8zM2 8h20L12 3 2 8z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSpark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
    </svg>
  );
}

export function IconContinue({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4v6l4-2M12 20a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CategoryIcon({ id, size = 24, className }: { id: CategoryId; size?: number; className?: string }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', className };
  switch (id) {
    case 'animals':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
          <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M5 10l-2-1M19 10l2-1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case 'food':
      return (
        <svg {...props}>
          <path d="M12 3v8M8 7c0-2 1.8-3 4-3s4 1 4 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M6 11h12v2a6 6 0 01-12 0v-2z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case 'sports':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.75" />
          <path d="M4 12h16M12 4c2 2.5 3 5.5 3 8s-1 5.5-3 8M12 4c-2 2.5-3 5.5-3 8s1 5.5 3 8" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      );
    case 'movies':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M3 10h18M8 6v12M16 6v12" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      );
    case 'geography':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.75" />
          <path d="M4 12h16M12 4a12 12 0 010 16M12 4a12 12 0 000 16" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      );
    case 'kids':
      return (
        <svg {...props}>
          <path d="M12 4c2 0 3 1.5 3 3.5S14 11 12 11 9 9.5 9 7.5 10 4 12 4z" stroke="currentColor" strokeWidth="1.75" />
          <path d="M6 20c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="17" cy="7" r="2" fill="currentColor" />
        </svg>
      );
    case 'holiday':
      return (
        <svg {...props}>
          <path d="M12 3v18M8 7h8M7 12h10M8 17h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M12 3l-1 3h2l-1-3z" fill="currentColor" />
        </svg>
      );
    default:
      return <IconPuzzle size={size} className={className} />;
  }
}

export function AchievementIcon({ id, size = 28, className }: { id: string; size?: number; className?: string }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', className };
  switch (id) {
    case 'first_word':
    case 'words_50':
    case 'words_200':
    case 'words_500':
      return (
        <svg {...props}>
          <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.75" />
          <path d="M14.5 14.5L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'first_puzzle':
    case 'puzzles_10':
    case 'puzzles_50':
      return <IconPuzzle size={size} className={className} />;
    case 'perfect':
      return <IconDiamond size={size} className={className} />;
    case 'streak_3':
    case 'streak_7':
    case 'streak_30':
    case 'daily_7':
      return <IconCalendar size={size} className={className} />;
    case 'speed_5':
    case 'speed_3':
    case 'speed_2':
    case 'blitz_5':
    case 'blitz_10':
      return <IconStreak size={size} className={className} />;
    case 'all_categories':
      return <CategoryIcon id="geography" size={size} className={className} />;
    case 'favorites_5':
      return <IconStar size={size} className={className} />;
    case 'pack_complete':
      return <IconPack size={size} className={className} />;
    case 'hint_used':
      return <IconHint size={size} className={className} />;
    case 'mastery_gold':
      return <IconTrophy size={size} className={className} />;
    default:
      return <IconSpark size={size} className={className} />;
  }
}

export function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="2" y="2" width="44" height="44" rx="14" fill="#fafafa" />
      <rect x="2" y="2" width="44" height="44" rx="14" stroke="#1e1b4b" strokeWidth="1.5" />
      <text x="24" y="33" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="26" fontWeight="600" fill="#1e1b4b">L</text>
    </svg>
  );
}