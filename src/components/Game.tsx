import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Achievement, CategoryId, Cell, GameMode, GameRecord, PlacedWord, Puzzle, Settings } from '../types';
import { generatePuzzle, getDailySeed } from '../lib/puzzleGenerator';
import { formatTime } from '../lib/gameLogic';
import { getCategory } from '../lib/wordLists';
import { todayString } from '../lib/rng';
import { playCompleteSound, playHintSound } from '../lib/feedback';
import { getPuzzleOptions, getEffectiveGridSettings } from '../lib/difficulty';
import { getDailyNumber } from '../lib/daily';
import { CATEGORY_THEMES } from '../lib/categoryThemes';
import { getWordFact, getGenericFact } from '../lib/facts';
import { getCompletionMessage, getWordFoundMessage, getBlitzEndMessage } from '../lib/microcopy';
import { generateChallengeUrl } from '../lib/share';
import { getPack, getPackSeed, getPackShuffleSeed } from '../lib/packs';
import { CategoryIcon, IconBack, IconHint, IconPack, IconShuffle, IconSpark } from './Icons';
import { ThemeToggle } from './ThemeToggle';
import { Grid, getFoundColor, getFoundPattern } from './Grid';
import { WordList } from './WordList';
import { ShareCard } from './ShareCard';
import { ToastDock, type ToastItem } from './ToastDock';
import { GameComplete } from './GameComplete';
import { GridSkeleton } from './GridSkeleton';
import type { InstallMode } from '../lib/install';

interface GameProps {
  category: CategoryId;
  settings: Settings;
  isDaily: boolean;
  challengeSeed?: string;
  packId?: string;
  packLevel?: number;
  onBack: () => void;
  onComplete: (record: GameRecord) => void;
  onWordFound: () => void;
  onWrongAttempt: () => void;
  onUndoWrong?: () => void;
  onHintUsed?: () => void;
  onToggleFavorite: (word: string) => void;
  favoriteWords: string[];
  blitzHighScore: number;
  dailyStreak: number;
  totalPuzzlesCompleted: number;
  newAchievement?: Achievement | null;
  showInstallNudge?: boolean;
  installMode?: InstallMode | null;
  onInstall?: () => void;
  onDismissInstall?: () => void;
  onToggleLight: (light: boolean) => void;
  initialLayoutKey?: number;
  /** After complete: next pack level, new free-play layout, or exit daily. */
  onContinueNext: () => void;
  hasNextPackLevel?: boolean;
}

const BLITZ_DURATION_MS = 60000;
const UNDO_DELAY_MS = 2500;

const MODE_LABELS: Record<GameMode, string> = {
  relaxed: 'Relaxed',
  timed: 'Timed',
  daily: 'Daily',
  blitz: 'Blitz',
  zen: 'Zen',
  coop: 'Co-op',
};

export function Game({
  category,
  settings,
  isDaily,
  challengeSeed,
  packId,
  packLevel,
  onBack,
  onComplete,
  onWordFound,
  onWrongAttempt,
  onUndoWrong,
  onHintUsed,
  onToggleFavorite,
  favoriteWords,
  blitzHighScore,
  dailyStreak,
  totalPuzzlesCompleted,
  newAchievement,
  showInstallNudge,
  installMode,
  onInstall,
  onDismissInstall,
  onToggleLight,
  initialLayoutKey = 0,
  onContinueNext,
  hasNextPackLevel = false,
}: GameProps) {
  const isPack = packId != null && packLevel != null;
  const pack = isPack ? getPack(packId) : undefined;
  const theme = CATEGORY_THEMES[category];

  const mode: GameMode = isDaily ? 'daily' : isPack ? 'relaxed' : settings.gameMode;
  const isBlitz = mode === 'blitz';
  const isZen = mode === 'zen';
  const isCoop = mode === 'coop';
  const [layoutKey, setLayoutKey] = useState(initialLayoutKey);
  const sessionSalt = useRef(`${Date.now()}-${Math.random()}`);

  const canShuffle = !isDaily && !challengeSeed;

  const seed = useMemo(() => {
    if (isDaily) return getDailySeed(todayString());
    if (challengeSeed) return challengeSeed;
    if (isPack) {
      if (layoutKey === 0) return getPackSeed(packId!, packLevel!);
      return getPackShuffleSeed(packId!, packLevel!, layoutKey);
    }
    return `${category}-${sessionSalt.current}-layout-${layoutKey}`;
  }, [category, isDaily, challengeSeed, isPack, packId, packLevel, layoutKey]);

  const puzzleOptions = useMemo(() => getPuzzleOptions(settings), [settings]);
  const { gridSize, wordCount } = useMemo(
    () => getEffectiveGridSettings(settings),
    [settings],
  );

  const puzzle: Puzzle = useMemo(
    () => generatePuzzle(category, gridSize, wordCount, seed, puzzleOptions),
    [category, gridSize, wordCount, seed, puzzleOptions],
  );

  const soundSettings = useMemo(
    () => ({ sound: settings.sound, soundPack: settings.soundPack }),
    [settings.sound, settings.soundPack],
  );

  const [foundWords, setFoundWords] = useState<Map<string, string>>(new Map());
  const [foundPatterns, setFoundPatterns] = useState<Map<string, number>>(new Map());
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [blitzRemaining, setBlitzRemaining] = useState(BLITZ_DURATION_MS);
  const [completed, setCompleted] = useState(false);
  const [progressSweep, setProgressSweep] = useState(false);
  const [lastFound, setLastFound] = useState<string | null>(null);
  const [wordFact, setWordFact] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [coopPlayer, setCoopPlayer] = useState(1);
  const [completionMsg, setCompletionMsg] = useState('');
  const [hintCell, setHintCell] = useState<Cell | null>(null);
  const [hintWord, setHintWord] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [gridReady, setGridReady] = useState(false);
  const [pulseCells, setPulseCells] = useState<Cell[]>([]);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTime = useRef(Date.now());
  const blitzEnded = useRef(false);
  const foundCountRef = useRef(0);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingWrongRef = useRef(false);
  const dailyDate = todayString();

  foundCountRef.current = foundWords.size;

  useEffect(() => {
    const mq = window.matchMedia('(orientation: landscape) and (max-height: 520px)');
    const update = () => setIsLandscape(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setGridReady(false);
    const id = requestAnimationFrame(() => setGridReady(true));
    return () => cancelAnimationFrame(id);
  }, [seed, category, gridSize, wordCount]);

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, []);

  const handleWordTap = useCallback((word: PlacedWord) => {
    if (foundWords.has(word.word)) return;
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    setPulseCells(word.cells);
    pulseTimeoutRef.current = setTimeout(() => {
      setPulseCells([]);
      pulseTimeoutRef.current = null;
    }, 1800);
  }, [foundWords]);

  const resetPuzzleState = useCallback(() => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = null;
    pendingWrongRef.current = false;
    setCompleted(false);
    setFoundWords(new Map());
    setFoundPatterns(new Map());
    setWrongAttempts(0);
    setHintUsed(false);
    setHintCell(null);
    setHintWord(null);
    setShowUndo(false);
    setLastFound(null);
    setWordFact(null);
    setPulseCells([]);
    setElapsed(0);
    setBlitzRemaining(BLITZ_DURATION_MS);
    startTime.current = Date.now();
    blitzEnded.current = false;
  }, []);

  const handleNewLayout = useCallback(() => {
    if (!canShuffle) return;
    setLayoutKey((k) => k + 1);
    resetPuzzleState();
  }, [canShuffle, resetPuzzleState]);

  const finishGame = useCallback(
    (wordsFoundCount: number, timeUp = false) => {
      const timeMs = isBlitz ? BLITZ_DURATION_MS : Math.max(0, Date.now() - startTime.current);
      setElapsed(timeMs);
      setProgressSweep(true);
      setTimeout(() => {
        setCompleted(true);
        setProgressSweep(false);
      }, 380);
      setCompletionMsg(
        isBlitz
          ? getBlitzEndMessage(wordsFoundCount, blitzHighScore)
          : getCompletionMessage(wrongAttempts, timeMs),
      );
      playCompleteSound(soundSettings, wordsFoundCount);

      const record: GameRecord = {
        id: `${Date.now()}`,
        category,
        mode,
        gridSize: settings.gridSize,
        wordCount: isBlitz ? wordsFoundCount : puzzle.words.length,
        wordsFound: wordsFoundCount,
        timeMs,
        wrongAttempts,
        completedAt: Date.now(),
        isDaily,
        ...(isPack ? { packId, packLevel } : {}),
        ...(hintUsed ? { usedHint: true } : {}),
      };
      onComplete(record);
      if (isDaily && !timeUp) setShowShare(true);
    },
    [
      isBlitz,
      blitzHighScore,
      wrongAttempts,
      soundSettings,
      settings.gridSize,
      category,
      mode,
      puzzle.words.length,
      isDaily,
      isPack,
      packId,
      packLevel,
      hintUsed,
      onComplete,
    ],
  );

  // Track elapsed for all non-blitz modes (used on completion screen & timed HUD)
  useEffect(() => {
    if (completed || isBlitz) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime.current);
    }, 100);
    return () => clearInterval(interval);
  }, [completed, isBlitz]);

  useEffect(() => {
    if (!isBlitz || completed) return;
    const interval = setInterval(() => {
      const rem = BLITZ_DURATION_MS - (Date.now() - startTime.current);
      setBlitzRemaining(Math.max(0, rem));
      if (rem <= 0 && !blitzEnded.current) {
        blitzEnded.current = true;
        finishGame(foundCountRef.current, true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isBlitz, completed, finishGame]);

  const handleWordFound = useCallback(
    (word: PlacedWord) => {
      if (foundWords.has(word.word)) return;

      const color = getFoundColor(foundWords.size, category);
      const pattern = getFoundPattern(foundWords.size);
      const next = new Map(foundWords);
      const nextPatterns = new Map(foundPatterns);
      next.set(word.word, color);
      nextPatterns.set(word.word, pattern);
      setFoundWords(next);
      setFoundPatterns(nextPatterns);
      setLastFound(word.word);
      onWordFound();

      if (hintWord === word.word || (hintCell && cellMatchesHint(word, hintCell))) {
        setHintCell(null);
        setHintWord(null);
      }

      if (isCoop) setCoopPlayer((p) => (p === 1 ? 2 : 1));

      if (settings.showFacts) {
        const fact = getWordFact(word.word) ?? getGenericFact(category);
        setWordFact(fact);
        setTimeout(() => setWordFact(null), 3500);
      }

      setTimeout(() => setLastFound(null), 1400);

      const total = puzzle.words.length;
      if (!isBlitz && next.size === total) {
        finishGame(total);
      }
    },
    [
      foundWords,
      foundPatterns,
      hintCell,
      hintWord,
      puzzle.words.length,
      onWordFound,
      isCoop,
      settings.showFacts,
      category,
      isBlitz,
      finishGame,
    ],
  );

  const handleWrong = useCallback(() => {
    if (pendingWrongRef.current) return;
    pendingWrongRef.current = true;
    setShowUndo(true);

    undoTimeoutRef.current = setTimeout(() => {
      setWrongAttempts((w) => w + 1);
      onWrongAttempt();
      setShowUndo(false);
      pendingWrongRef.current = false;
      undoTimeoutRef.current = null;
    }, UNDO_DELAY_MS);
  }, [onWrongAttempt]);

  const handleUndo = useCallback(() => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
    setShowUndo(false);
    pendingWrongRef.current = false;
    onUndoWrong?.();
  }, [onUndoWrong]);

  const useHint = useCallback(() => {
    if (hintUsed || completed) return;
    const unfound = puzzle.words.filter((w) => !foundWords.has(w.word));
    if (unfound.length === 0) return;
    const pick = unfound[Math.floor(Math.random() * unfound.length)];
    setHintCell(pick.cells[0]);
    setHintWord(pick.word);
    setHintUsed(true);
    playHintSound(soundSettings);
    onHintUsed?.();
  }, [hintUsed, completed, puzzle.words, foundWords, soundSettings, onHintUsed]);

  const cat = getCategory(category);
  const progress = (foundWords.size / puzzle.words.length) * 100;

  const headerTitle = isDaily
    ? `Daily #${getDailyNumber(dailyDate)}`
    : isPack && pack
      ? pack.name
      : cat.name;

  const headerSub = isPack && pack
    ? `Level ${packLevel! + 1}/${pack.puzzleCount}`
    : null;

  const toasts: ToastItem[] = [];
  if (showUndo) {
    toasts.push({
      id: 'undo',
      priority: 'undo',
      content: (
        <span className="toast-miss-text">
          <strong>Not a word</strong>
          <span className="toast-miss-sub">Won&apos;t count if you dismiss in time</span>
        </span>
      ),
      action: { label: "Don't count it", onClick: handleUndo },
    });
  }
  if (lastFound) {
    toasts.push({
      id: `found-${lastFound}`,
      priority: 'found',
      content: (
        <>
          <IconSpark size={14} className="toast-spark-icon" />
          {getWordFoundMessage(lastFound)} <strong>{lastFound}</strong>
        </>
      ),
    });
  }
  if (wordFact) {
    toasts.push({
      id: 'fact',
      priority: 'fact',
      content: (
        <>
          <span className="fact-label">Did you know?</span>
          <p>{wordFact}</p>
        </>
      ),
    });
  }

  const modeLabel = isPack ? 'Pack' : MODE_LABELS[mode];
  const coopSuffix = isCoop ? ` · P${coopPlayer}` : '';

  return (
    <div
      className={`screen game-screen cat-world-${category} ${isLandscape ? 'landscape-layout' : ''}`}
      style={{ '--cat-tint': theme.tint, '--cat-bar': theme.bar, '--cat-accent': theme.accent } as React.CSSProperties}
    >
      <div className="game-cat-bar" aria-hidden="true" />

      <header className="game-header-compact panel-card">
        <button className="btn-icon-only" onClick={onBack} aria-label="Back">
          <IconBack />
        </button>
        <div className="game-header-center">
          <span className="game-category" title={headerTitle}>
            <span className="game-cat-icon">
              {isPack && pack ? <IconPack size={18} /> : <CategoryIcon id={category} size={18} />}
            </span>
            <span className="game-category-text">
              <span className="game-category-name">{headerTitle}</span>
              {headerSub && <span className="game-category-sub">{headerSub}</span>}
            </span>
          </span>
          <div className="game-header-chips">
            <span className="game-chip mode-chip">{modeLabel}{coopSuffix}</span>
            {layoutKey > 0 && canShuffle && (
              <span className="game-chip shuffle-chip">New layout</span>
            )}
            <span className="game-chip count-chip">{foundWords.size}/{puzzle.words.length}</span>
          </div>
        </div>
        <div className="game-header-actions">
          <ThemeToggle
            lightBackground={settings.lightBackground}
            onChange={onToggleLight}
            compact
          />
          {canShuffle && (
            <button
              className="btn-icon-only btn-shuffle"
              onClick={handleNewLayout}
              disabled={completed}
              aria-label="New layout"
              title="New layout — same theme, fresh puzzle"
            >
              <IconShuffle size={18} />
            </button>
          )}
          <button
            className={`btn-hint-v2 ${hintUsed ? 'used' : ''}`}
            onClick={useHint}
            disabled={hintUsed || completed}
            aria-label="Use hint"
            title={hintUsed ? 'Hint used' : 'Reveal first letter of a word'}
          >
            <span className="hint-ring" />
            <IconHint size={18} />
            {!hintUsed && <span className="hint-label">1</span>}
          </button>
        </div>
      </header>

      <div className={`game-progress-wrap ${progressSweep ? 'sweep' : ''}`} aria-hidden="true">
        <div className="game-progress-segments">
          {puzzle.words.map((_, i) => (
            <span key={i} className={`progress-seg ${i < foundWords.size ? 'filled' : ''}`} />
          ))}
        </div>
        <div className="game-progress-bar">
          <div className="game-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {isBlitz && (
        <div className="game-timer-bar blitz-bar">
          <span className="game-timer blitz-timer">{formatTime(blitzRemaining)}</span>
          <span className="blitz-score">Found: {foundWords.size} · Best: {blitzHighScore}</span>
        </div>
      )}

      {mode === 'timed' && (
        <div className="game-timer-bar">
          <span className="game-timer">{formatTime(elapsed)}</span>
        </div>
      )}

      <ToastDock toasts={toasts} variant="inline" />

      <div className="game-play-area">
        <div className="game-board-wrap">
          {!gridReady ? (
            <GridSkeleton size={gridSize} />
          ) : (
            <Grid
              grid={puzzle.grid}
              placedWords={puzzle.words}
              foundWords={foundWords}
              foundPatterns={foundPatterns}
              settings={settings}
              category={category}
              hintCell={hintCell}
              pulseCells={pulseCells}
              onWordFound={handleWordFound}
              onWrongAttempt={handleWrong}
            />
          )}
        </div>

        <WordList
          words={puzzle.words}
          foundWords={foundWords}
          settings={settings}
          zenMode={isZen}
          hintWord={hintWord}
          favoriteWords={favoriteWords}
          onToggleFavorite={onToggleFavorite}
          onWordTap={handleWordTap}
        />
      </div>

      {completed && (
        <GameComplete
          isBlitz={isBlitz}
          completionMsg={completionMsg}
          elapsedMs={elapsed}
          wordsFound={foundWords.size}
          wrongAttempts={wrongAttempts}
          isPerfect={wrongAttempts === 0 && !isBlitz}
          newAchievement={newAchievement}
          isDaily={isDaily}
          isPack={isPack}
          showInstallNudge={
            showInstallNudge &&
            totalPuzzlesCompleted <= 1 &&
            !isBlitz
          }
          installMode={installMode}
          onInstall={onInstall}
          onDismissInstall={onDismissInstall}
          onShare={isDaily ? () => setShowShare(true) : undefined}
          onCopyChallenge={
            !isDaily && !isPack
              ? () => navigator.clipboard.writeText(generateChallengeUrl(seed, category))
              : undefined
          }
          onPlayAgain={canShuffle ? handleNewLayout : undefined}
          playAgainLabel={isPack ? 'New layout' : 'Play again'}
          onContinue={onContinueNext}
          continueLabel={
            isPack
              ? hasNextPackLevel
                ? 'Next level'
                : 'Back to packs'
              : isDaily
                ? 'Done'
                : 'Next puzzle'
          }
        />
      )}

      {showShare && (
        <ShareCard
          record={{
            id: '',
            category,
            mode,
            gridSize,
            wordCount: puzzle.words.length,
            timeMs: Date.now() - startTime.current,
            wrongAttempts,
            completedAt: Date.now(),
            isDaily: true,
          }}
          dailyNumber={getDailyNumber(dailyDate)}
          seed={seed}
          streak={dailyStreak}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

function cellMatchesHint(word: PlacedWord, hint: Cell): boolean {
  return word.cells.some((c) => c.row === hint.row && c.col === hint.col);
}