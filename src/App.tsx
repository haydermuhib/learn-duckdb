import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { StudioLayout } from './components/studio/StudioLayout';
import { PlaygroundLayout } from './components/playground/PlaygroundLayout';
import { CheatSheetPage } from './components/cheatsheet/CheatSheetPage';

export function App() {
  const [view, setView] = useState<'landing' | 'studio' | 'playground' | 'cheatsheet'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#cheatsheet' || window.location.hash === '#cheat-sheet') return 'cheatsheet';
      if (window.location.hash === '#playground') return 'playground';
      if (window.location.hash === '#studio') return 'studio';
    }
    return 'landing';
  });
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>(undefined);
  const [playgroundInitialQuery, setPlaygroundInitialQuery] = useState<string | undefined>(undefined);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#cheatsheet' || window.location.hash === '#cheat-sheet') {
        setView('cheatsheet');
      } else if (window.location.hash === '#playground') {
        setView('playground');
      } else if (window.location.hash === '#studio') {
        setView('studio');
      } else if (!window.location.hash || window.location.hash === '#') {
        setView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleStartLearning = (exerciseId?: string) => {
    setSelectedExerciseId(exerciseId);
    setView('studio');
    window.location.hash = '#studio';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPlayground = (queryOrEvent?: unknown) => {
    const safeQuery = typeof queryOrEvent === 'string' ? queryOrEvent : undefined;
    setPlaygroundInitialQuery(safeQuery);
    setView('playground');
    window.location.hash = '#playground';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCheatSheet = () => {
    setView('cheatsheet');
    window.location.hash = '#cheatsheet';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setView('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-duck selection:text-ink">
      {view === 'landing' && (
        <LandingPage
          onStartLearning={handleStartLearning}
          onOpenPlayground={handleOpenPlayground}
          onOpenCheatSheet={handleOpenCheatSheet}
        />
      )}
      {view === 'studio' && (
        <StudioLayout
          onBackToLanding={handleBackToLanding}
          initialExerciseId={selectedExerciseId}
          onSwitchToPlayground={handleOpenPlayground}
        />
      )}
      {view === 'playground' && (
        <PlaygroundLayout
          onBackToLanding={handleBackToLanding}
          onSwitchToExercises={() => handleStartLearning()}
          initialQuery={playgroundInitialQuery}
        />
      )}
      {view === 'cheatsheet' && (
        <CheatSheetPage
          onBackToHome={handleBackToLanding}
          onOpenPlayground={handleOpenPlayground}
          onStartLearning={() => handleStartLearning()}
        />
      )}
    </div>
  );
}

export default App;
