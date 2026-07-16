import { useCallback, useEffect, useState } from 'react';
import type { Achievement, AppState, GameRecord, Settings } from '../types';
import { checkAchievements, updateDailyStreak } from '../lib/achievements';
import {
  loadAppState,
  recordGameCompletion,
  recordWordFound,
  recordWrongAttempt,
  saveAppState,
  toggleFavoriteWord,
  undoWrongAttempt,
  updateSettings,
} from '../lib/storage';

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [unlockQueue, setUnlockQueue] = useState<Achievement[]>([]);

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const patchSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: updateSettings(s.settings, patch) }));
  }, []);

  const onWordFound = useCallback(() => {
    setState((s) => {
      const stats = recordWordFound(s.stats);
      const achievements = checkAchievements(s.achievements, stats, undefined, 1);
      return { ...s, stats, achievements };
    });
  }, []);

  const onWrongAttempt = useCallback(() => {
    setState((s) => ({ ...s, stats: recordWrongAttempt(s.stats) }));
  }, []);

  const onUndoWrong = useCallback(() => {
    setState((s) => ({ ...s, stats: undoWrongAttempt(s.stats) }));
  }, []);

  const onHintUsed = useCallback(() => {
    setState((s) => ({
      ...s,
      achievements: checkAchievements(s.achievements, s.stats, undefined, undefined, {
        hintUsed: true,
      }),
    }));
  }, []);

  const onGameComplete = useCallback((record: GameRecord) => {
    setState((s) => {
      const prevUnlocked = new Set(
        s.achievements.filter((a) => a.unlockedAt).map((a) => a.id),
      );
      let stats = recordGameCompletion(s.stats, record);
      if (record.isDaily) {
        stats = updateDailyStreak(stats);
      }
      const achievements = checkAchievements(s.achievements, stats, record);
      const newUnlocks = achievements.filter(
        (a) => a.unlockedAt && !prevUnlocked.has(a.id),
      );
      if (newUnlocks.length > 0) {
        queueMicrotask(() => setUnlockQueue((q) => [...q, ...newUnlocks]));
      }
      return { ...s, stats, achievements };
    });
  }, []);

  const dismissUnlock = useCallback(() => {
    setUnlockQueue((q) => q.slice(1));
  }, []);

  const onToggleFavorite = useCallback((word: string) => {
    setState((s) => ({ ...s, stats: toggleFavoriteWord(s.stats, word) }));
  }, []);

  return {
    state,
    unlockQueue,
    dismissUnlock,
    patchSettings,
    onWordFound,
    onWrongAttempt,
    onUndoWrong,
    onHintUsed,
    onGameComplete,
    onToggleFavorite,
  };
}