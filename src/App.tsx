import { useEffect, useState } from 'react';
import type { CategoryId, Screen } from './types';
import { todayString } from './lib/rng';
import { useAppState } from './hooks/useAppState';
import { getDailyCategory } from './lib/daily';
import { parseChallengeFromHash, clearChallengeHash } from './lib/challenge';
import { hasCompletedOnboarding } from './lib/onboarding';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { Home } from './components/Home';
import { CategoryPicker } from './components/CategoryPicker';
import { Game } from './components/Game';
import { Settings } from './components/Settings';
import { StatsPanel } from './components/StatsPanel';
import { AchievementsPanel } from './components/AchievementsPanel';
import { Atlas } from './components/Atlas';
import { WeeklyRecap } from './components/WeeklyRecap';
import { PuzzlePacks } from './components/PuzzlePacks';
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
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [isDaily, setIsDaily] = useState(false);
  const [challengeSeed, setChallengeSeed] = useState<string | undefined>();
  const [packSession, setPackSession] = useState<{ packId: string; level: number } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => !hasCompletedOnboarding());

  const { lightBackground } = state.settings;
  const { canInstall, install, dismiss } = useInstallPrompt();

  useEffect(() => {
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

  const dailyCompleted = state.stats.completedDailyDates.includes(todayString());

  const startGame = (
    category: CategoryId,
    daily = false,
    seed?: string,
  ) => {
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

  const handleBack = () => {
    const wasPack = !!packSession;
    setActiveCategory(null);
    setIsDaily(false);
    setChallengeSeed(undefined);
    setPackSession(null);
    setScreen(wasPack ? 'packs' : 'home');
  };

  const handleDaily = () => {
    startGame(getDailyCategory(todayString()), true);
  };

  const handleInstall = async () => {
    const accepted = await install();
    if (accepted) dismiss();
  };

  return (
    <div
      className={[
        'app',
        state.settings.reduceMotion && 'reduce-motion',
        state.settings.highContrast && 'high-contrast',
        lightBackground ? 'theme-light' : 'theme-dark',
      ].filter(Boolean).join(' ')}
      data-screen={screen}
    >
      <AmbientBackground />
      <main className="app-main">
        {screen === 'home' && (
          <Home
            stats={state.stats}
            lightBackground={lightBackground}
            onToggleLight={(v) => patchSettings({ lightBackground: v })}
            onPlay={() => setScreen('categories')}
            onDaily={handleDaily}
            onPacks={() => setScreen('packs')}
            onAtlas={() => setScreen('atlas')}
            onWeekly={() => setScreen('weekly')}
            onAchievements={() => setScreen('achievements')}
            dailyCompleted={dailyCompleted}
            canInstall={canInstall}
            onInstall={handleInstall}
            onDismissInstall={dismiss}
          />
        )}
        {screen === 'categories' && (
          <CategoryPicker
            completions={state.stats.categoryCompletions}
            mastery={state.stats.categoryMastery}
            onSelect={(cat) => startGame(cat)}
          />
        )}
        {screen === 'packs' && (
          <PuzzlePacks
            stats={state.stats}
            onSelectPack={startPackGame}
          />
        )}
        {screen === 'atlas' && (
          <Atlas
            stats={state.stats}
            onSelectCategory={(cat) => startGame(cat)}
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
      <Navigation screen={screen} onNavigate={setScreen} />
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}