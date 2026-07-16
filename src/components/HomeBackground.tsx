const DECO_GRID = [
  'LEXISFINDSWORDS',
  'SEARCHPLAYGRID',
  'SWIPEDIAGONAL',
  'PUZZLEDAILYFUN',
  'MASTERDISCOVER',
  'ANIMALSFOODFUN',
  'PREMIUMLEXISX',
];

const HIGHLIGHTS: { word: string; row: number; col: number; dir: [number, number] }[] = [
  { word: 'LEXIS', row: 0, col: 0, dir: [0, 1] },
  { word: 'FIND', row: 0, col: 5, dir: [0, 1] },
  { word: 'SWIPE', row: 2, col: 0, dir: [0, 1] },
  { word: 'PLAY', row: 1, col: 6, dir: [0, 1] },
];

function isHighlighted(row: number, col: number): boolean {
  for (const h of HIGHLIGHTS) {
    for (let i = 0; i < h.word.length; i++) {
      const r = h.row + h.dir[0] * i;
      const c = h.col + h.dir[1] * i;
      if (r === row && c === col) return true;
    }
  }
  return false;
}

export function HomeBackground() {
  return (
    <div className="home-bg" aria-hidden="true">
      <div className="home-bg-grid">
        {DECO_GRID.map((row, r) =>
          row.split('').map((letter, c) => (
            <span
              key={`${r}-${c}`}
              className={`home-bg-cell ${isHighlighted(r, c) ? 'highlighted' : ''}`}
            >
              {letter}
            </span>
          )),
        )}
      </div>
      <div className="home-bg-fade" />
      <div className="home-bg-accent-line" />
    </div>
  );
}