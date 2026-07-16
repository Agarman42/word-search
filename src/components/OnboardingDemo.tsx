import { useCallback, useRef, useState } from 'react';
import { cellKey, findMatchingWord, getLineCells } from '../lib/gameLogic';
import type { Cell, PlacedWord } from '../types';

const DEMO_GRID = [
  ['C', 'A', 'T', 'X', 'Q'],
  ['R', 'O', 'D', 'G', 'M'],
  ['F', 'I', 'S', 'H', 'P'],
  ['W', 'B', 'N', 'L', 'K'],
  ['Z', 'Y', 'V', 'H', 'J'],
];

const DEMO_WORDS: PlacedWord[] = [
  { word: 'CAT', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }], direction: 'H' },
  { word: 'DOG', cells: [{ row: 1, col: 2 }, { row: 1, col: 1 }, { row: 1, col: 0 }], direction: 'H' },
  { word: 'FISH', cells: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }], direction: 'H' },
];

interface OnboardingDemoProps {
  mode: 'swipe' | 'wrong';
  onSuccess?: () => void;
}

export function OnboardingDemo({ mode, onSuccess }: OnboardingDemoProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [currentCells, setCurrentCells] = useState<Cell[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(false);
  const [done, setDone] = useState(false);
  const pointerIdRef = useRef<number | null>(null);
  const gridSize = 5;

  const getCellFromPoint = useCallback((clientX: number, clientY: number): Cell | null => {
    const el = gridRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const gap = 3;
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

    if (mode === 'wrong') {
      if (currentCells.length >= 2) {
        setWrong(true);
        setTimeout(() => setWrong(false), 600);
      }
      setStartCell(null);
      setCurrentCells([]);
      return;
    }

    const match = findMatchingWord(DEMO_GRID, currentCells, DEMO_WORDS, found);
    if (match) {
      const next = new Set(found);
      next.add(match.word);
      setFound(next);
      if (next.size >= 1) {
        setDone(true);
        onSuccess?.();
      }
    }
    setStartCell(null);
    setCurrentCells([]);
  };

  const selectedSet = new Set(currentCells.map(cellKey));
  const foundCells = new Set<string>();
  for (const word of found) {
    const placed = DEMO_WORDS.find((w) => w.word === word);
    placed?.cells.forEach((c) => foundCells.add(cellKey(c)));
  }

  return (
    <div className="onboarding-demo">
      <p className="onboarding-demo-hint">
        {mode === 'swipe'
          ? done
            ? 'Nice! You found CAT.'
            : 'Try swiping C → A → T on the grid'
          : 'Drag across random letters — see the brief flash? In real puzzles, tap "Don\'t count it" if it wasn\'t a word you meant to find.'}
      </p>
      <div
        ref={gridRef}
        className={`onboarding-demo-grid ${wrong ? 'wrong-flash' : ''}`}
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        onPointerDown={(e) => {
          const cell = getCellFromPoint(e.clientX, e.clientY);
          if (!cell || done) return;
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
        {DEMO_GRID.map((row, r) =>
          row.map((letter, c) => {
            const key = cellKey({ row: r, col: c });
            return (
              <div
                key={key}
                className={[
                  'onboarding-demo-cell',
                  selectedSet.has(key) && 'selecting',
                  foundCells.has(key) && 'found',
                ].filter(Boolean).join(' ')}
              >
                {letter}
              </div>
            );
          }),
        )}
      </div>
      {mode === 'swipe' && (
        <div className="onboarding-demo-words">
          {DEMO_WORDS.map((w) => (
            <span key={w.word} className={found.has(w.word) ? 'found' : ''}>
              {w.word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}