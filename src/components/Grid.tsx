import { useCallback, useRef, useState } from 'react';
import type { CategoryId, Cell, PlacedWord, Settings } from '../types';
import { cellKey, findMatchingWord, getLineCells } from '../lib/gameLogic';
import {
  playErrorSound,
  playFoundSound,
  playRevealTick,
  triggerHaptic,
  triggerHapticByLength,
  type SoundSettings,
} from '../lib/feedback';

interface GridProps {
  grid: string[][];
  placedWords: PlacedWord[];
  foundWords: Map<string, string>;
  foundPatterns: Map<string, number>;
  settings: Settings;
  category: CategoryId;
  hintCell?: Cell | null;
  onWordFound: (word: PlacedWord) => void;
  onWrongAttempt: () => void;
  onRevealComplete?: (word: PlacedWord) => void;
}

const FOUND_COLORS = [
  'var(--found-1)',
  'var(--found-2)',
  'var(--found-3)',
  'var(--found-4)',
  'var(--found-5)',
  'var(--found-6)',
];

function soundFromSettings(settings: Settings): SoundSettings {
  return { sound: settings.sound, soundPack: settings.soundPack };
}

function cellCenterPercent(cell: Cell, gridSize: number): { x: number; y: number } {
  return {
    x: ((cell.col + 0.5) / gridSize) * 100,
    y: ((cell.row + 0.5) / gridSize) * 100,
  };
}

export function Grid({
  grid,
  placedWords,
  foundWords,
  foundPatterns,
  settings,
  category,
  hintCell,
  onWordFound,
  onWrongAttempt,
  onRevealComplete,
}: GridProps) {
  const gridSize = grid.length;
  const gridRef = useRef<HTMLDivElement>(null);
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [currentCells, setCurrentCells] = useState<Cell[]>([]);
  const [revealingCells, setRevealingCells] = useState<Set<string>>(new Set());
  const [shaking, setShaking] = useState(false);
  const pointerIdRef = useRef<number | null>(null);
  const sound = soundFromSettings(settings);

  const getCellFromPoint = useCallback(
    (clientX: number, clientY: number): Cell | null => {
      const el = gridRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(el).gap) || 3;
      const cellSize = (rect.width - gap * (gridSize - 1)) / gridSize;
      const col = Math.floor((clientX - rect.left) / (cellSize + gap));
      const row = Math.floor((clientY - rect.top) / (cellSize + gap));
      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return null;
      return { row, col };
    },
    [gridSize],
  );

  const runRevealAnimation = useCallback(
    (word: PlacedWord, onDone: () => void) => {
      if (settings.reduceMotion) {
        onDone();
        return;
      }
      const keys = word.cells.map(cellKey);
      let step = 0;
      const interval = setInterval(() => {
        if (step < keys.length) {
          setRevealingCells((prev) => new Set([...prev, keys[step]]));
          playRevealTick(sound, step);
          step++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setRevealingCells(new Set());
            onDone();
          }, 120);
        }
      }, 55);
    },
    [settings.reduceMotion, sound],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    e.preventDefault();
    gridRef.current?.setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;
    setSelecting(true);
    setStartCell(cell);
    setCurrentCells([cell]);
    triggerHaptic(settings.haptics, 'light');
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!selecting || !startCell || pointerIdRef.current !== e.pointerId) return;
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    setCurrentCells(getLineCells(startCell, cell, gridSize));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!selecting || pointerIdRef.current !== e.pointerId) return;
    gridRef.current?.releasePointerCapture(e.pointerId);
    pointerIdRef.current = null;
    setSelecting(false);

    const foundSet = new Set(foundWords.keys());
    const match = findMatchingWord(grid, currentCells, placedWords, foundSet);

    if (match) {
      triggerHapticByLength(settings.haptics, match.word.length);
      runRevealAnimation(match, () => {
        playFoundSound(sound, foundWords.size, match.word.length);
        triggerHaptic(settings.haptics, 'success');
        onWordFound(match);
        onRevealComplete?.(match);
      });
    } else if (currentCells.length >= 2) {
      playErrorSound(sound);
      triggerHaptic(settings.haptics, 'medium');
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      onWrongAttempt();
    }

    setStartCell(null);
    setCurrentCells([]);
  };

  const selectedSet = new Set(currentCells.map(cellKey));
  const hintKey = hintCell ? cellKey(hintCell) : null;
  const foundCellMeta = new Map<string, { color: string; pattern: number }>();
  for (const [word, color] of foundWords) {
    const placed = placedWords.find((p) => p.word === word);
    const pattern = foundPatterns.get(word) ?? 0;
    if (placed) {
      for (const c of placed.cells) {
        foundCellMeta.set(cellKey(c), { color, pattern });
      }
    }
  }

  const foundWordLines = Array.from(foundWords.entries()).map(([word, color]) => {
    const placed = placedWords.find((p) => p.word === word);
    if (!placed || placed.cells.length === 0) return null;
    const start = cellCenterPercent(placed.cells[0], gridSize);
    if (placed.cells.length === 1) {
      return (
        <circle
          key={word}
          cx={start.x}
          cy={start.y}
          r="3"
          fill={color}
          opacity="0.9"
        />
      );
    }
    const end = cellCenterPercent(placed.cells[placed.cells.length - 1], gridSize);
    return (
      <line
        key={word}
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="round"
        opacity="0.88"
      />
    );
  });

  const trailPoints =
    currentCells.length >= 2
      ? currentCells
          .map((c) => {
            const p = cellCenterPercent(c, gridSize);
            return `${p.x},${p.y}`;
          })
          .join(' ')
      : '';

  return (
    <div className={`grid-container cat-bg-${category}`}>
      <div className={`grid-frame ${shaking ? 'shake' : ''}`}>
        <svg className="found-words-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
          {foundWordLines}
        </svg>

        {selecting && currentCells.length >= 2 && (
          <svg className="selection-trail" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trail-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <polyline
              points={trailPoints}
              fill="none"
              stroke="url(#trail-grad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        <div
          ref={gridRef}
          className="grid-board"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            '--font-scale': settings.fontScale,
            touchAction: 'none',
            userSelect: 'none',
          } as React.CSSProperties}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const key = cellKey({ row: r, col: c });
              const isSelected = selectedSet.has(key);
              const meta = foundCellMeta.get(key);
              const isFound = !!meta;
              const isRevealing = revealingCells.has(key);
              const isHint = hintKey === key;
              const staggerDelay = (r * gridSize + c) * 12;

              return (
                <div
                  key={key}
                  className={[
                    'grid-cell',
                    isSelected && 'selecting',
                    isFound && 'found',
                    isRevealing && 'revealing',
                    isHint && 'hint-pulse',
                    isFound && settings.colorblindMode && `cb-pattern-${meta.pattern % 6}`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{
                    animationDelay: `${staggerDelay}ms`,
                    ...(isFound
                      ? { '--found-bg': meta.color, background: meta.color }
                      : {}),
                  } as React.CSSProperties}
                >
                  <span className="grid-letter">{letter}</span>
                  {isFound && settings.colorblindMode && (
                    <span className="cb-overlay" aria-hidden="true" />
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>
      <div className={`category-fx cat-fx-${category}`} aria-hidden="true" />
    </div>
  );
}

export function getFoundColor(index: number): string {
  return FOUND_COLORS[index % FOUND_COLORS.length];
}

export function getFoundPattern(index: number): number {
  return index % 6;
}