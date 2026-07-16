import { useEffect, useState } from 'react';
import type { CategoryId, PuzzleTab, Screen } from './types';
import { todayString } from './lib/rng';
import { useAppState } from './hooks/useAppState';
import { getDailyCategory } from './lib/daily';
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

export default function App() {
  const {
    state,
    patchSettings,
    onWordFound,
    onWrongAttempt,
    onUndoWrong,
    onHintUsed,
    onGameComplete,
    onToggleFavorite,
  } = useAppState();
  const [screen, setScreen] = useState<Screen>('home');
  const [puzzleTab, setPuzzleTab] = useState<PuzzleTab>('categories');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [isDaily, setIsDaily] = useState(false);
  const [challengeSeed, setChallengeSeed] = useState<string | undefined>();
  const [packSession, setPackSession] = useState<{ packId: string; level: number } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => !hasCompletedOnboarding());
  const [showDailyNudge, setShowDailyNudge] = useState(false);

  const { lightBackground } = state.settings;
  const { canInstall, install, dismiss } = useInstallPrompt();
  const dailyCompleted = state.stats.completedDailyDates.includes(todayString());

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', !lightBackground);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', lightBackground ? '#ffffff' : '#030306');
  }, [lightBackground]);

  useEffect(() => {
    const challenge = parseChallengeFromHash();
    if (challenge) {
      setActiveCategory(challenge.category);
      setChallengeSeed(challenge.seed);
      setIsDaily(false);
      setPackSession(null);
      setScreen('game');
      clearChallengeHash();
    }
  }, []);

  useEffect(() => {
    if (!showOnboarding && shouldShowDailyNudge(dailyCompleted, state.stats.totalPuzzlesCompleted)) {
      setShowDailyNudge(true);
    }
  }, [showOnboarding, dailyCompleted, state.stats.totalPuzzlesCompleted]);

  const startGame = (category: CategoryId, daily = false, seed?: string) => {
    setActiveCategory(category);
    setIsDaily(daily);
    setChallengeSeed(seed);
    setPackSession(null);
    setScreen('game');
  };

  const startPackGame = (packId: string, level: number, category: CategoryId) => {
    setActiveCategory(category);
    setPackSession({ packId, level });
    setIsDaily(false);
    setChallengeSeed(undefined);
    setScreen('game');
  };

  const goToPuzzles = (tab: PuzzleTab = 'categories') => {
    setPuzzleTab(tab);
    setScreen('puzzles');
  };

  const handleBack = () => {
    const wasPack = !!packSession;
    setActiveCategory(null);
    setIsDaily(false);
    setChallengeSeed(undefined);
    setPackSession(null);
    if (wasPack) {
      setPuzzleTab('packs');
      setScreen('puzzles');
    } else {
      setScreen('home');
    }
  };

  const handleDaily = () => {
    startGame(getDailyCategory(todayString()), true);
  };

  const handleInstall = async () => {
    const accepted = await install();
    if (accepted) dismiss();
  };

  const handleNavigate = (target: Screen) => {
    if (target === 'categories' || target === 'atlas' || target === 'packs') {
      const tab: PuzzleTab =
        target === 'packs' ? 'packs' : target === 'atlas' ? 'atlas' : 'categories';
      goToPuzzles(tab);
      return;
    }
    setScreen(target);
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
      <main key={screen} className="app-main screen-enter">
        {screen === 'home' && (
          <Home
            stats={state.stats}
            lightBackground={lightBackground}
            onToggleLight={(v) => patchSettings({ lightBackground: v })}
            onPlay={() => goToPuzzles('categories')}
            onDaily={handleDaily}
            onPacks={() => goToPuzzles('packs')}
            onWeekly={() => setScreen('weekly')}
            onAchievements={() => setScreen('achievements')}
            dailyCompleted={dailyCompleted}
            showDailyNudge={showDailyNudge}
            onDismissDailyNudge={() => setShowDailyNudge(false)}
            canInstall={canInstall}
            onInstall={handleInstall}
            onDismissInstall={dismiss}
          />
        )}
        {screen === 'puzzles' && (
          <PuzzleHub
            stats={state.stats}
            initialTab={puzzleTab}
            onSelectCategory={(cat) => startGame(cat)}
            onSelectPack={startPackGame}
          />
        )}
        {screen === 'weekly' && <WeeklyRecap stats={state.stats} />}
        {screen === 'game' && activeCategory && (
          <Game
            category={activeCategory}
            settings={state.settings}
            isDaily={isDaily}
            challengeSeed={challengeSeed}
            packId={packSession?.packId}
            packLevel={packSession?.level}
            onBack={handleBack}
            onComplete={onGameComplete}
            onWordFound={onWordFound}
            onWrongAttempt={onWrongAttempt}
            onUndoWrong={onUndoWrong}
            onHintUsed={onHintUsed}
            onToggleFavorite={onToggleFavorite}
            favoriteWords={state.stats.favoriteWords}
            blitzHighScore={state.stats.blitzHighScore}
          />
        )}
        {screen === 'settings' && (
          <Settings settings={state.settings} onChange={patchSettings} />
        )}
        {screen === 'stats' && <StatsPanel stats={state.stats} />}
        {screen === 'achievements' && (
          <AchievementsPanel achievements={state.achievements} />
        )}
      </main>
      <VersionFooter />
      <Navigation screen={screen} onNavigate={handleNavigate} />
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}