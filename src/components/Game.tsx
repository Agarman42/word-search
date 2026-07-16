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
import { getPack, getPackSeed } from '../lib/packs';
import { AchievementIcon, CategoryIcon, IconBack, IconDiamond, IconHint, IconPack, IconSpark } from './Icons';
import { Grid, getFoundColor, getFoundPattern } from './Grid';
import { WordList } from './WordList';
import { ShareCard } from './ShareCard';
import { ToastDock, type ToastItem } from './ToastDock';
import { CountUp } from './CountUp';

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
  newAchievement?: Achievement | null;
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
  newAchievement,
}: GameProps) {
  const isPack = packId != null && packLevel != null;
  const pack = isPack ? getPack(packId) : undefined;
  const theme = CATEGORY_THEMES[category];

  const mode: GameMode = isDaily ? 'daily' : isPack ? 'relaxed' : settings.gameMode;
  const isBlitz = mode === 'blitz';
  const isZen = mode === 'zen';
  const isCoop = mode === 'coop';
  const [replayKey, setReplayKey] = useState(0);

  const seed = useMemo(() => {
    if (isPack) return getPackSeed(packId!, packLevel!);
    if (challengeSeed) return challengeSeed;
    if (isDaily) return getDailySeed(todayString());
    return `${category}-${Date.now()}-${Math.random()}-${replayKey}`;
  }, [category, isDaily, challengeSeed, isPack, packId, packLevel, replayKey]);

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
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    };
  }, []);

  const finishGame = useCallback(
    (wordsFoundCount: number, timeUp = false) => {
      const timeMs = isBlitz ? BLITZ_DURATION_MS : Date.now() - startTime.current;
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

  useEffect(() => {
    if (completed || isBlitz) return;
    if (mode === 'relaxed' || isZen) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime.current);
    }, 100);
    return () => clearInterval(interval);
  }, [mode, completed, isBlitz, isZen]);

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
      content: <span>Wrong swipe</span>,
      action: { label: 'Undo', onClick: handleUndo },
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
            <span className="game-chip count-chip">{foundWords.size}/{puzzle.words.length}</span>
          </div>
        </div>
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

      <ToastDock toasts={toasts} />

      <div className="game-play-area">
        <div className="game-board-wrap">
          <Grid
            grid={puzzle.grid}
            placedWords={puzzle.words}
            foundWords={foundWords}
            foundPatterns={foundPatterns}
            settings={settings}
            category={category}
            hintCell={hintCell}
            onWordFound={handleWordFound}
            onWrongAttempt={handleWrong}
          />
        </div>

        <WordList
          words={puzzle.words}
          foundWords={foundWords}
          settings={settings}
          zenMode={isZen}
          hintWord={hintWord}
          favoriteWords={favoriteWords}
          onToggleFavorite={onToggleFavorite}
        />
      </div>

      {completed && (
        <div className="game-complete-overlay">
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="confetti-piece" style={{ '--i': i } as React.CSSProperties} />
            ))}
          </div>
          <div className="game-complete-card glass-panel">
            <div className="complete-badge"><IconSpark size={24} /></div>
            <h2 className="display-font">{isBlitz ? 'Blitz Over' : 'Puzzle Complete'}</h2>
            <p className="complete-subtitle">{completionMsg}</p>
            <p className="complete-time display-font">
              {isBlitz ? (
                <><CountUp value={foundWords.size} /> words</>
              ) : (
                formatTime(elapsed)
              )}
            </p>
            {wrongAttempts === 0 && !isBlitz && (
              <p className="complete-perfect">
                <IconDiamond size={16} />
                Flawless — no mistakes
              </p>
            )}
            {newAchievement && (
              <div className="complete-achievement panel-card">
                <AchievementIconInline id={newAchievement.id} title={newAchievement.title} />
              </div>
            )}
            <div className="complete-stats">
              <div className="complete-stat">
                <span className="complete-stat-val"><CountUp value={foundWords.size} /></span>
                <span className="complete-stat-lbl">Words</span>
              </div>
              <div className="complete-stat">
                <span className="complete-stat-val"><CountUp value={wrongAttempts} /></span>
                <span className="complete-stat-lbl">Misses</span>
              </div>
            </div>
            <div className="complete-actions">
              {isDaily && (
                <button className="btn btn-glass" onClick={() => setShowShare(true)}>
                  Share result
                </button>
              )}
              {!isDaily && !isPack && (
                <button
                  className="btn btn-glass"
                  onClick={() => navigator.clipboard.writeText(generateChallengeUrl(seed, category))}
                >
                  Copy challenge link
                </button>
              )}
              {!isDaily && (
                <button
                  className="btn btn-glass"
                  onClick={() => {
                    setReplayKey((k) => k + 1);
                    setCompleted(false);
                    setFoundWords(new Map());
                    setFoundPatterns(new Map());
                    setWrongAttempts(0);
                    setHintUsed(false);
                    setHintCell(null);
                    setHintWord(null);
                    startTime.current = Date.now();
                    blitzEnded.current = false;
                  }}
                >
                  Play again
                </button>
              )}
              <button className="btn btn-primary btn-glow" onClick={onBack}>
                {isPack ? 'Back to packs' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
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
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

function AchievementIconInline({ id, title }: { id: string; title: string }) {
  return (
    <div className="complete-achievement-inner">
      <AchievementIcon id={id} size={28} />
      <span>New: <strong>{title}</strong></span>
    </div>
  );
}

function cellMatchesHint(word: PlacedWord, hint: Cell): boolean {
  return word.cells.some((c) => c.row === hint.row && c.col === hint.col);
}