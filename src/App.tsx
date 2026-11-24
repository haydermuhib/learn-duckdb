import { useState, useEffect, useRef } from 'react';
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
  const [returnToCheatSheet, setReturnToCheatSheet] = useState(false);

  const [hasVisitedCheatSheet, setHasVisitedCheatSheet] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#cheatsheet' || window.location.hash === '#cheat-sheet';
    }

    return false;
  });

  const cheatSheetScrollRef = useRef<number>(0);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#cheatsheet' || window.location.hash === '#cheat-sheet') {
        setHasVisitedCheatSheet(true);
        setView('cheatsheet');
        requestAnimationFrame(() => {
          if (cheatSheetScrollRef.current > 0) {
            window.scrollTo({ top: cheatSheetScrollRef.current, behavior: 'instant' });
          }
        });
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

  const handleOpenPlayground = (queryOrEvent?: unknown, fromCheatSheet = false) => {
    const safeQuery = typeof queryOrEvent === 'string' ? queryOrEvent : undefined;

    if (view === 'cheatsheet' || fromCheatSheet) {
      cheatSheetScrollRef.current = window.scrollY;
      setReturnToCheatSheet(true);
    } else {
      setReturnToCheatSheet(false);
    }

    setPlaygroundInitialQuery(safeQuery);
    setView('playground');
    window.location.hash = '#playground';
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToCheatSheet = () => {
    setHasVisitedCheatSheet(true);
    setView('cheatsheet');
    window.location.hash = '#cheatsheet';
    setReturnToCheatSheet(false);
    requestAnimationFrame(() => {
      window.scrollTo({ top: cheatSheetScrollRef.current, behavior: 'instant' });
    });
  };

  const handleOpenCheatSheet = () => {
    setHasVisitedCheatSheet(true);
    setView('cheatsheet');
    window.location.hash = '#cheatsheet';
    setReturnToCheatSheet(false);
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
          onSwitchToCheatSheet={handleOpenCheatSheet}
        />
      )}
      {view === 'playground' && (
        <PlaygroundLayout
          onBackToLanding={handleBackToLanding}
          onSwitchToExercises={() => handleStartLearning()}
          onOpenCheatSheet={returnToCheatSheet ? handleBackToCheatSheet : handleOpenCheatSheet}
          initialQuery={playgroundInitialQuery}
        />
      )}
      {hasVisitedCheatSheet && (
        <div style={{ display: view === 'cheatsheet' ? 'block' : 'none' }}>
          <CheatSheetPage
            onBackToHome={handleBackToLanding}
            onOpenPlayground={(query) => handleOpenPlayground(query, true)}
            onStartLearning={() => handleStartLearning()}
          />
        </div>
      )}
    </div>
  );
}

export default App;
