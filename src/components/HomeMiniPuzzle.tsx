import { useCallback, useRef, useState } from 'react';
import { cellKey, findMatchingWord, getLineCells } from '../lib/gameLogic';
import type { Cell, PlacedWord } from '../types';

const MINI_GRID = [
  ['W', 'O', 'R', 'D', 'X'],
  ['S', 'E', 'E', 'K', 'Y'],
  ['F', 'I', 'N', 'D', 'Z'],
  ['A', 'B', 'C', 'M', 'N'],
  ['P', 'Q', 'T', 'U', 'V'],
];

const MINI_WORDS: PlacedWord[] = [
  {
    word: 'WORD',
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ],
    direction: 'H',
  },
  {
    word: 'SEEK',
    cells: [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ],
    direction: 'H',
  },
  {
    word: 'FIND',
    cells: [
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
    ],
    direction: 'H',
  },
];

export function HomeMiniPuzzle() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [currentCells, setCurrentCells] = useState<Cell[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [shaking, setShaking] = useState(false);
  const pointerIdRef = useRef<number | null>(null);
  const gridSize = 5;

  const getCellFromPoint = useCallback((clientX: number, clientY: number): Cell | null => {
    const el = gridRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const gap = 2;
    const cellSize = (rect.width - gap * (gridSize - 1)) / gridSize;
    const col = Math.floor((clientX - rect.left) / (cellSize + gap));
    const row = Math.floor((clientY - rect.top) / (cellSize + gap));
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return null;
    return { row, col };
  }, []);

  const handleUp = () => {
    if (!selecting) return;
    setSelecting(false);
    pointerIdRef.current = null;

    const match = findMatchingWord(MINI_GRID, currentCells, MINI_WORDS, found);
    if (match) {
      const next = new Set(found);
      next.add(match.word);
      setFound(next);
    } else if (currentCells.length >= 2) {
      setShaking(true);
      setTimeout(() => setShaking(false), 350);
    }

    setStartCell(null);
    setCurrentCells([]);
  };

  const selectedSet = new Set(currentCells.map(cellKey));
  const foundCells = new Set<string>();
  for (const word of found) {
    const placed = MINI_WORDS.find((w) => w.word === word);
    placed?.cells.forEach((c) => foundCells.add(cellKey(c)));
  }

  const allFound = found.size === MINI_WORDS.length;

  return (
    <div className="home-mini-puzzle">
      <p className="home-mini-hint">
        {allFound ? 'Nice swipes! Ready for a full puzzle?' : 'Try swiping WORD on the mini grid'}
      </p>
      <div
        ref={gridRef}
        className={`home-mini-grid ${shaking ? 'mini-shake' : ''}`}
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        onPointerDown={(e) => {
          const cell = getCellFromPoint(e.clientX, e.clientY);
          if (!cell) return;
          e.preventDefault();
          gridRef.current?.setPointerCapture(e.pointerId);
          pointerIdRef.current = e.pointerId;
          setSelecting(true);
          setStartCell(cell);
          setCurrentCells([cell]);
        }}
        onPointerMove={(e) => {
          if (!selecting || !startCell || pointerIdRef.current !== e.pointerId) return;
          const cell = getCellFromPoint(e.clientX, e.clientY);
          if (!cell) return;
          setCurrentCells(getLineCells(startCell, cell, gridSize));
        }}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      >
        {MINI_GRID.map((row, r) =>
          row.map((letter, c) => {
            const key = cellKey({ row: r, col: c });
            return (
              <div
                key={key}
                className={[
                  'home-mini-cell',
                  selectedSet.has(key) && 'selecting',
                  foundCells.has(key) && 'found',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {letter}
              </div>
            );
          }),
        )}
      </div>
      <div className="home-mini-words">
        {MINI_WORDS.map((w) => (
          <span key={w.word} className={found.has(w.word) ? 'found' : ''}>
            {w.word}
          </span>
        ))}
      </div>
    </div>
  );
}