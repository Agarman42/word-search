export interface SeasonalEvent {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  months: number[];
}

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'spring',
    name: 'Spring Bloom',
    icon: '🌸',
    description: 'Fresh puzzles blossom all season.',
    color: '#f472b6',
    months: [3, 4, 5],
  },
  {
    id: 'summer',
    name: 'Summer Quest',
    icon: '☀️',
    description: 'Hot streaks and sunny challenges.',
    color: '#fbbf24',
    months: [6, 7, 8],
  },
  {
    id: 'halloween',
    name: 'Spooky Search',
    icon: '🎃',
    description: 'Hauntingly good word hunts.',
    color: '#f97316',
    months: [10],
  },
  {
    id: 'holiday',
    name: 'Winter Festival',
    icon: '❄️',
    description: 'Festive finds all December long.',
    color: '#38bdf8',
    months: [12],
  },
];

export function getActiveSeason(date: Date = new Date()): SeasonalEvent | null {
  const month = date.getMonth() + 1;
  return SEASONAL_EVENTS.find((e) => e.months.includes(month)) ?? null;
}