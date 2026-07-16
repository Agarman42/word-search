import { useEffect, useRef, useState } from 'react';
import type { CategoryId, ChallengeParams, GameMode, PuzzleTab, Screen } from './types';
import { todayString } from './lib/rng';
import { useAppState } from './hooks/useAppState';
import { getDailyCategory } from './lib/daily';
import { getPack } from './lib/packs';
import { getActiveSeason, resolveSeasonalPlay } from './lib/seasonal';
import { getPostDailyGoal } from './lib/homeGoals';
import { parseChallengeFromHash, clearChallengeHash } from './lib/challenge';
import { hasCompletedOnboarding } from './lib/onboarding';
import { shouldShowDailyNudge } from './lib/dailyNudge';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { Home } from './components/Home';
import { PuzzleHub } from './components/PuzzleHub';
import { Game } from './components/Game';
import { Settings } from './components/Settings';
import { StatsPanel } from './components/StatsPanel';
import { AchievementsPanel } from './components/AchievementsPanel';
import { WeeklyRecap } from './components/WeeklyRecap';
import { Onboarding } from './components/Onboarding';
import { Navigation } from './components/Navigation';
import { AmbientBackground } from './components/AmbientBackground';
import { VersionFooter } from './components/VersionFooter';
import { AchievementUnlock } from './components/AchievementUnlock';
import { UpdateBanner } from './components/UpdateBanner';

type NavDirection = 'forward' | 'back' | 'tab';

const SCREEN_DEPTH: Partial<Record<Screen, number>> = {
  home: 0,
  stats: 0,
  settings: 0,
  puzzles: 1,
  categories: 1,
  packs: 1,
  atlas: 1,
  weekly: 1,
  achievements: 1,
  game: 2,
};

const TAB_SCREENS = new Set<Screen>(['home', 'puzzles', 'stats', 'settings']);

export default function App() {
  const {
    state,
    unlockQueue,
    dismissUnlock,
    patchSettings,
    onWordFound,
    onHintUsed,
    onGameComplete,
    onToggleFavorite,
  } = useAppState();
  const [screen, setScreen] = useState<Screen>('home');
  const [navDirection, setNavDirection] = useState<NavDirection>('forward');
  const [puzzleTab, setPuzzleTab] = useState<PuzzleTab>('categories');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [isDaily, setIsDaily] = useState(false);
  const [challenge, setChallenge] = useState<ChallengeParams | null>(null);
  const [packSession, setPackSession] = useState<{ packId: string; level: number } | null>(null);
  const [initialLayoutKey, setInitialLayoutKey] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(() => !hasCompletedOnboarding());
  const [showDailyNudge, setShowDailyNudge] = useState(false);
  const [returnScreen, setReturnScreen] = useState<Screen>('home');
  const [statsTab, setStatsTab] = useState<'overview' | 'weekly' | 'achievements'>('overview');
  const prevScreen = useRef(screen);

  const { lightBackground } = state.settings;
  const {
    canInstall,
    installMode,
    isStandalone,
    install,
    dismiss,
    canShowCompleteNudge,
    dismissCompleteNudge,
  } = useInstallPrompt();
  const dailyCompleted = state.stats.completedDailyDates.includes(todayString());

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', !lightBackground);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', lightBackground ? '#ffffff' : '#0a0a0f');
  }, [lightBackground]);

  // Prefer OS reduced-motion if user has not customized (we still honor setting when true)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches && !state.settings.reduceMotion) {
      patchSettings({ reduceMotion: true });
    }
    // only on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const parsed = parseChallengeFromHash();
    if (parsed) {
      setActiveCategory(parsed.category);
      setChallenge(parsed);
      setIsDaily(false);
      setPackSession(null);
      setReturnScreen('home');
      setNavDirection('forward');
      setScreen('game');
      clearChallengeHash();
    }
  }, []);

  useEffect(() => {
    if (!showOnboarding && shouldShowDailyNudge(dailyCompleted, state.stats.totalPuzzlesCompleted)) {
      setShowDailyNudge(true);
    }
  }, [showOnboarding, dailyCompleted, state.stats.totalPuzzlesCompleted]);

  const navigateTo = (target: Screen) => {
    const from = prevScreen.current;
    const fromDepth = SCREEN_DEPTH[from] ?? 0;
    const toDepth = SCREEN_DEPTH[target] ?? 0;

    if (TAB_SCREENS.has(target) && TAB_SCREENS.has(from) && target !== from) {
      setNavDirection('tab');
    } else if (toDepth > fromDepth) {
      setNavDirection('forward');
    } else if (toDepth < fromDepth) {
      setNavDirection('back');
    } else {
      setNavDirection('forward');
    }

    prevScreen.current = target;
    setScreen(target);
  };

  const startGame = (
    category: CategoryId,
    daily = false,
    challengeParams: ChallengeParams | null = null,
    layoutKey = 0,
    from: Screen = 'home',
  ) => {
    setActiveCategory(category);
    setIsDaily(daily);
    setChallenge(challengeParams);
    setPackSession(null);
    setInitialLayoutKey(layoutKey);
    setReturnScreen(from);
    navigateTo('game');
  };

  const startPackGame = (packId: string, level: number, category: CategoryId) => {
    setActiveCategory(category);
    setPackSession({ packId, level });
    setIsDaily(false);
    setChallenge(null);
    setInitialLayoutKey(0);
    setReturnScreen('puzzles');
    setPuzzleTab('packs');
    navigateTo('game');
  };

  const goToPuzzles = (tab: PuzzleTab = 'categories') => {
    setPuzzleTab(tab);
    navigateTo('puzzles');
  };

  const handleBack = () => {
    const wasPack = !!packSession;
    const backTo = wasPack ? 'puzzles' : returnScreen;
    setActiveCategory(null);
    setIsDaily(false);
    setChallenge(null);
    setPackSession(null);
    if (wasPack || backTo === 'puzzles') {
      setPuzzleTab(wasPack ? 'packs' : puzzleTab);
      navigateTo('puzzles');
    } else if (backTo === 'weekly' || backTo === 'achievements') {
      navigateTo(backTo);
    } else {
      navigateTo('home');
    }
  };

  const handleMainMenu = () => {
    if (unlockQueue[0]) dismissUnlock();
    setActiveCategory(null);
    setIsDaily(false);
    setChallenge(null);
    setPackSession(null);
    navigateTo('home');
  };

  /** After completing a puzzle: next level / next free puzzle / leave daily. */
  const handleGameContinue = () => {
    if (unlockQueue[0]) dismissUnlock();

    if (packSession) {
      const pack = getPack(packSession.packId);
      if (pack && packSession.level + 1 < pack.puzzleCount) {
        startPackGame(packSession.packId, packSession.level + 1, pack.category);
        return;
      }
      setActiveCategory(null);
      setIsDaily(false);
      setChallenge(null);
      setPackSession(null);
      setPuzzleTab('packs');
      navigateTo('puzzles');
      return;
    }

    if (isDaily) {
      handleMainMenu();
      return;
    }

    if (activeCategory) {
      startGame(activeCategory, false, null, Date.now() % 1_000_000 + 1, returnScreen);
      return;
    }

    handleMainMenu();
  };

  const handleDaily = () => {
    startGame(getDailyCategory(todayString()), true, null, 0, 'home');
  };

  const handleStartMode = (mode: GameMode) => {
    patchSettings({ gameMode: mode });
    const cat = getDailyCategory(todayString());
    startGame(cat, false, null, Date.now() % 1_000_000 + 1, 'home');
  };

  const handlePostDailyGoal = () => {
    const goal = getPostDailyGoal(state.stats);
    if (goal.type === 'pack' && goal.packId != null && goal.packLevel != null) {
      startPackGame(goal.packId, goal.packLevel, goal.category);
    } else {
      startGame(goal.category, false, null, Date.now() % 1_000_000 + 1, 'home');
    }
  };

  const handleSeasonalPlay = () => {
    const season = getActiveSeason();
    if (!season) return;
    const target = resolveSeasonalPlay(season, state.stats.packProgress);
    if (!target) return;
    if (target.type === 'pack') {
      startPackGame(target.packId, target.level, target.category);
    } else {
      startGame(target.category, false, null, 0, 'home');
    }
  };

  const handleInstall = async () => {
    const accepted = await install();
    if (accepted) dismiss();
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    if (state.stats.totalPuzzlesCompleted === 0) {
      handleDaily();
    }
  };

  const handleNavigate = (target: Screen) => {
    if (target === 'categories' || target === 'atlas' || target === 'packs') {
      const tab: PuzzleTab =
        target === 'packs' ? 'packs' : target === 'atlas' ? 'atlas' : 'categories';
      goToPuzzles(tab);
      return;
    }
    if (target === 'weekly') {
      setStatsTab('weekly');
      navigateTo('stats');
      return;
    }
    if (target === 'achievements') {
      setStatsTab('achievements');
      navigateTo('stats');
      return;
    }
    if (target === 'stats') {
      setStatsTab('overview');
    }
    navigateTo(target);
  };

  return (
    <div
      className={[
        'app',
        state.settings.reduceMotion && 'reduce-motion',
        state.settings.highContrast && 'high-contrast',
      ].filter(Boolean).join(' ')}
      data-screen={screen}
    >
      <AmbientBackground />
      <UpdateBanner />
      <main
        key={screen}
        className={`app-main screen-enter screen-${navDirection}`}
      >
        {screen === 'home' && (
          <Home
            stats={state.stats}
            settings={state.settings}
            lightBackground={lightBackground}
            onToggleLight={(v) => patchSettings({ lightBackground: v })}
            onPlay={() => goToPuzzles('categories')}
            onDaily={handleDaily}
            onContinue={(cat) => startGame(cat, false, null, Date.now() % 1_000_000 + 1, 'home')}
            onPacks={() => goToPuzzles('packs')}
            onWeekly={() => {
              setStatsTab('weekly');
              navigateTo('stats');
            }}
            onAchievements={() => {
              setStatsTab('achievements');
              navigateTo('stats');
            }}
            onStartMode={handleStartMode}
            onPostDailyGoal={handlePostDailyGoal}
            dailyCompleted={dailyCompleted}
            showDailyNudge={showDailyNudge}
            onDismissDailyNudge={() => setShowDailyNudge(false)}
            canInstall={canInstall}
            installMode={installMode}
            onInstall={handleInstall}
            onDismissInstall={dismiss}
            onSeasonalPlay={handleSeasonalPlay}
          />
        )}
        {screen === 'puzzles' && (
          <PuzzleHub
            stats={state.stats}
            initialTab={puzzleTab}
            onSelectCategory={(cat) => startGame(cat, false, null, 0, 'puzzles')}
            onShuffleCategory={(cat) =>
              startGame(cat, false, null, Date.now() % 1_000_000 + 1, 'puzzles')
            }
            onSelectPack={startPackGame}
          />
        )}
        {screen === 'game' && activeCategory && (
          <Game
            key={`${activeCategory}-${packSession?.packId ?? ''}-${packSession?.level ?? ''}-${initialLayoutKey}-${isDaily}-${challenge?.seed ?? ''}`}
            category={activeCategory}
            initialLayoutKey={initialLayoutKey}
            settings={state.settings}
            isDaily={isDaily}
            challenge={challenge}
            packId={packSession?.packId}
            packLevel={packSession?.level}
            onBack={() => {
              if (unlockQueue[0]) dismissUnlock();
              handleBack();
            }}
            onComplete={onGameComplete}
            onWordFound={onWordFound}
            onHintUsed={onHintUsed}
            onToggleFavorite={onToggleFavorite}
            favoriteWords={state.stats.favoriteWords}
            blitzHighScore={state.stats.blitzHighScore}
            dailyStreak={state.stats.dailyStreak}
            totalPuzzlesCompleted={state.stats.totalPuzzlesCompleted}
            newAchievement={unlockQueue[0] ?? null}
            showInstallNudge={canShowCompleteNudge}
            installMode={installMode}
            onInstall={handleInstall}
            onDismissInstall={dismissCompleteNudge}
            onToggleLight={(v) => patchSettings({ lightBackground: v })}
            onContinueNext={handleGameContinue}
            onMainMenu={handleMainMenu}
            hasNextPackLevel={
              !!packSession &&
              !!getPack(packSession.packId) &&
              packSession.level + 1 < (getPack(packSession.packId)?.puzzleCount ?? 0)
            }
          />
        )}
        {screen === 'settings' && (
          <Settings
            settings={state.settings}
            onChange={patchSettings}
            showInstallInSettings={!isStandalone && !!installMode}
            installMode={installMode}
            onInstall={handleInstall}
          />
        )}
        {screen === 'stats' && (
          <div className="screen stats-hub-screen">
            <div className="stats-hub-tabs" role="tablist">
              {(
                [
                  { id: 'overview' as const, label: 'Overview' },
                  { id: 'weekly' as const, label: 'Weekly' },
                  { id: 'achievements' as const, label: 'Awards' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  className={`stats-hub-tab ${statsTab === t.id ? 'active' : ''}`}
                  aria-selected={statsTab === t.id}
                  onClick={() => setStatsTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {statsTab === 'overview' && <StatsPanel stats={state.stats} embedded />}
            {statsTab === 'weekly' && (
              <WeeklyRecap
                stats={state.stats}
                embedded
                onPlayCategory={(cat) => startGame(cat, false, null, Date.now() % 1_000_000 + 1, 'stats')}
              />
            )}
            {statsTab === 'achievements' && (
              <AchievementsPanel achievements={state.achievements} stats={state.stats} embedded />
            )}
          </div>
        )}
      </main>
      <VersionFooter />
      <Navigation screen={screen} onNavigate={handleNavigate} />
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      {unlockQueue[0] && screen !== 'game' && (
        <AchievementUnlock achievement={unlockQueue[0]} onDismiss={dismissUnlock} />
      )}
    </div>
  );
}