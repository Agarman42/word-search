/** Decorative 9×9 word-search mosaic for the home screen background. */
const SIZE = 9;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const WORDS: { word: string; row: number; col: number; dr: number; dc: number; color: string }[] = [
  { word: 'LEXIS', row: 1, col: 1, dr: 0, dc: 1, color: '#fde68a' },
  { word: 'FIND', row: 3, col: 4, dr: 0, dc: 1, color: '#bbf7d0' },
  { word: 'PLAY', row: 5, col: 1, dr: 0, dc: 1, color: '#bfdbfe' },
  { word: 'FUN', row: 2, col: 6, dr: 1, dc: 0, color: '#fbcfe8' },
  { word: 'SWIPE', row: 6, col: 3, dr: 0, dc: 1, color: '#fed7aa' },
];

function buildGrid(): string[][] {
  const grid: string[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => LETTERS[Math.floor(Math.random() * 26)]),
  );
  for (const w of WORDS) {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.row + w.dr * i;
      const c = w.col + w.dc * i;
      if (r < SIZE && c < SIZE) grid[r][c] = w.word[i];
    }
  }
  return grid;
}

const GRID = buildGrid();

function cellHighlight(row: number, col: number): string | null {
  for (const w of WORDS) {
    for (let i = 0; i < w.word.length; i++) {
      if (w.row + w.dr * i === row && w.col + w.dc * i === col) return w.color;
    }
  }
  return null;
}

function lineSegments(): { x1: number; y1: number; x2: number; y2: number; color: string }[] {
  const cellPct = 100 / SIZE;
  const center = (i: number) => (i + 0.5) * cellPct;
  return WORDS.filter((w) => w.word.length >= 2).map((w) => {
    const end = w.word.length - 1;
    return {
      x1: center(w.col),
      y1: center(w.row),
      x2: center(w.col + w.dc * end),
      y2: center(w.row + w.dr * end),
      color: w.color,
    };
  });
}

const LINES = lineSegments();

export function HomeBackground() {
  return (
    <div className="home-bg" aria-hidden="true">
      <div className="home-bg-glow home-bg-glow-1" />
      <div className="home-bg-glow home-bg-glow-2" />
      <div className="home-bg-glow home-bg-glow-3" />

      <div className="home-bg-puzzle">
        <svg className="home-bg-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          {LINES.map((l, i) => (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={l.color}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.55"
            />
          ))}
        </svg>
        <div className="home-bg-grid">
          {GRID.map((row, r) =>
            row.map((letter, c) => {
              const hi = cellHighlight(r, c);
              return (
                <span
                  key={`${r}-${c}`}
                  className={`home-bg-cell ${hi ? 'highlighted' : ''}`}
                  style={hi ? { '--hi': hi } as React.CSSProperties : undefined}
                >
                  {letter}
                </span>
              );
            }),
          )}
        </div>
      </div>

      <div className="home-bg-fade" />
    </div>
  );
}