import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CategoryId, Cell, GameMode, GameRecord, PlacedWord, Puzzle, Settings } from '../types';
import { generatePuzzle, getDailySeed } from '../lib/puzzleGenerator';
import { formatTime } from '../lib/gameLogic';
import { getCategory } from '../lib/wordLists';
import { todayString } from '../lib/rng';
import { playCompleteSound, playHintSound } from '../lib/feedback';
import { getPuzzleOptions, getEffectiveGridSettings } from '../lib/difficulty';
import { getDailyCommentary, getDailyNumber, getDailyTitle } from '../lib/daily';
import { getWordFact, getGenericFact } from '../lib/facts';
import { getCompletionMessage, getWordFoundMessage, getBlitzEndMessage } from '../lib/microcopy';
import { generateChallengeUrl } from '../lib/share';
import { getPack, getPackSeed } from '../lib/packs';
import { IconBack } from './Icons';
import { Grid, getFoundColor, getFoundPattern } from './Grid';
import { WordList } from './WordList';
import { ShareCard } from './ShareCard';

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
}

const BLITZ_DURATION_MS = 60000;
const UNDO_DELAY_MS = 2500;

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
}: GameProps) {
  const isPack = packId != null && packLevel != null;
  const pack = isPack ? getPack(packId) : undefined;

  const mode: GameMode = isDaily ? 'daily' : isPack ? 'relaxed' : settings.gameMode;
  const isBlitz = mode === 'blitz';
  const isZen = mode === 'zen';
  const isCoop = mode === 'coop';

  const seed = useMemo(() => {
    if (isPack) return getPackSeed(packId!, packLevel!);
    if (challengeSeed) return challengeSeed;
    if (isDaily) return getDailySeed(todayString());
    return `${category}-${Date.now()}-${Math.random()}`;
  }, [category, isDaily, challengeSeed, isPack, packId, packLevel]);

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
      setCompleted(true);
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

      const color = getFoundColor(foundWords.size);
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
  const dailyCommentary = isDaily
    ? getDailyCommentary(dailyDate, category)
    : null;

  const headerTitle = isDaily
    ? 'Daily Challenge'
    : isPack && pack
      ? `${pack.name} · ${packLevel! + 1}/${pack.puzzleCount}`
      : cat.name;

  return (
    <div className={`screen game-screen cat-world-${category} ${isLandscape ? 'landscape-layout' : ''}`}>
      {isDaily && dailyCommentary && (
        <div className="daily-commentary glass-panel">
          <span className="daily-tag">{getDailyTitle(dailyDate)} · #{getDailyNumber(dailyDate)}</span>
          <p>{dailyCommentary}</p>
        </div>
      )}

      <header className="game-header-compact panel-card">
        <button className="btn-icon-only" onClick={onBack} aria-label="Back">
          <IconBack />
        </button>
        <div className="game-header-center">
          <span className="game-category">
            <span className="game-cat-icon">{isPack && pack ? pack.icon : cat.icon}</span>
            {headerTitle}
          </span>
          <span className="game-mode-badge">
            {mode === 'relaxed' && (isPack ? 'Pack' : 'Relaxed')}
            {mode === 'timed' && 'Timed'}
            {mode === 'daily' && 'Daily'}
            {mode === 'blitz' && 'Blitz · 60s'}
            {mode === 'zen' && 'Zen'}
            {mode === 'coop' && `Co-op · P${coopPlayer}`}
            {' · '}{foundWords.size}/{puzzle.words.length}
          </span>
        </div>
        <button
          className={`btn-hint ${hintUsed ? 'used' : ''}`}
          onClick={useHint}
          disabled={hintUsed || completed}
          aria-label="Use hint"
          title={hintUsed ? 'Hint used' : 'Reveal first letter of a word'}
        >
          💡
        </button>
      </header>

      <div className="game-progress-bar" aria-hidden="true">
        <div className="game-progress-fill" style={{ width: `${progress}%` }} />
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

      {lastFound && (
        <div className="found-toast" key={lastFound}>
          <span className="toast-spark">✦</span>
          {getWordFoundMessage(lastFound)} <strong>{lastFound}</strong>
        </div>
      )}

      {showUndo && (
        <div className="undo-toast">
          <span>Wrong swipe</span>
          <button className="btn btn-glass undo-btn" onClick={handleUndo}>
            Undo
          </button>
        </div>
      )}

      {wordFact && (
        <div className="fact-toast glass-panel">
          <span className="fact-label">Did you know?</span>
          <p>{wordFact}</p>
        </div>
      )}

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
            <div className="complete-badge">✦</div>
            <h2>{isBlitz ? 'Blitz Over' : 'Puzzle Complete'}</h2>
            <p className="complete-subtitle">{completionMsg}</p>
            <p className="complete-time">
              {isBlitz ? `${foundWords.size} words` : formatTime(elapsed)}
            </p>
            {wrongAttempts === 0 && !isBlitz && (
              <p className="complete-perfect">
                <span className="perfect-icon">💎</span>
                Flawless — no mistakes
              </p>
            )}
            <div className="complete-stats">
              <div className="complete-stat">
                <span className="complete-stat-val">{foundWords.size}</span>
                <span className="complete-stat-lbl">Words</span>
              </div>
              <div className="complete-stat">
                <span className="complete-stat-val">{wrongAttempts}</span>
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

function cellMatchesHint(word: PlacedWord, hint: Cell): boolean {
  return word.cells.some((c) => c.row === hint.row && c.col === hint.col);
}