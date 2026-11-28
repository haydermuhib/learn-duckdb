import { useState, useEffect, useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import { LandingPage } from './components/landing/LandingPage';
import { StudioLayout } from './components/studio/StudioLayout';
import { PlaygroundLayout } from './components/playground/PlaygroundLayout';
import { CheatSheetPage } from './components/cheatsheet/CheatSheetPage';

export type AppView = 'landing' | 'studio' | 'playground' | 'cheatsheet';

export function App() {
  const [view, setView] = useState<AppView>(() => {
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

  const [visitedViews, setVisitedViews] = useState<Set<AppView>>(() => {
    const initial = new Set<AppView>();
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#cheatsheet' || window.location.hash === '#cheat-sheet') {
        initial.add('cheatsheet');
      } else if (window.location.hash === '#playground') {
        initial.add('playground');
      } else if (window.location.hash === '#studio') {
        initial.add('studio');
      } else {
        initial.add('landing');
      }
    } else {
      initial.add('landing');
    }

    return initial;
  });

  const cheatSheetScrollRef = useRef<number>(0);

  // Track visited views to keep layouts warm in memory
  useEffect(() => {
    setVisitedViews(prev => {
      if (prev.has(view)) return prev;
      const next = new Set(prev);
      next.add(view);

      return next;
    });
  }, [view]);

  // Sync hash and history changes (handles mobile swipe back and browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#cheatsheet' || hash === '#cheat-sheet') {
        setView('cheatsheet');
        requestAnimationFrame(() => {
          if (cheatSheetScrollRef.current > 0) {
            window.scrollTo({ top: cheatSheetScrollRef.current, behavior: 'instant' });
          }
        });
      } else if (hash === '#playground') {
        setView('playground');
      } else if (hash === '#studio') {
        setView('studio');
      } else {
        // Any hash other than specific sub-modes (including #syllabus or empty) goes back home
        setView('landing');
      }
    };

    // If loaded directly at a subview, seed a root history entry so Android back gesture returns home instead of closing
    if (window.location.hash && window.location.hash !== '#' && window.history.length <= 1) {
      window.history.replaceState({ view: 'landing' }, '', window.location.pathname);
      window.history.pushState({ view }, '', window.location.hash);
    }

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [view]);

  const handleStartLearning = (exerciseId?: string) => {
    setSelectedExerciseId(exerciseId);
    setView('studio');
    window.location.hash = '#studio';
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenPlayground = (query?: string, fromCheatSheet = false) => {
    const safeQuery = query && query.trim().length > 0 ? query : undefined;

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
    setView('cheatsheet');
    window.location.hash = '#cheatsheet';
    setReturnToCheatSheet(false);
    requestAnimationFrame(() => {
      window.scrollTo({ top: cheatSheetScrollRef.current, behavior: 'instant' });
    });
  };

  const handleOpenCheatSheet = () => {
    setView('cheatsheet');
    window.location.hash = '#cheatsheet';
    setReturnToCheatSheet(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToLanding = () => {
    setView('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-canvas text-ink selection:bg-duck selection:text-ink relative">
        {visitedViews.has('landing') && (
          <div
            className={`transition-opacity duration-200 ease-out ${
              view === 'landing'
                ? 'opacity-100 visible relative z-10'
                : 'opacity-0 invisible pointer-events-none absolute inset-0 max-h-screen overflow-hidden -z-10'
            }`}
          >
            <LandingPage
              onStartLearning={handleStartLearning}
              onOpenPlayground={handleOpenPlayground}
              onOpenCheatSheet={handleOpenCheatSheet}
            />
          </div>
        )}
        {visitedViews.has('studio') && (
          <div
            className={`transition-opacity duration-200 ease-out ${
              view === 'studio'
                ? 'opacity-100 visible relative z-10'
                : 'opacity-0 invisible pointer-events-none absolute inset-0 max-h-screen overflow-hidden -z-10'
            }`}
          >
            <StudioLayout
              onBackToLanding={handleBackToLanding}
              initialExerciseId={selectedExerciseId}
              onSwitchToPlayground={handleOpenPlayground}
              onSwitchToCheatSheet={handleOpenCheatSheet}
            />
          </div>
        )}
        {visitedViews.has('playground') && (
          <div
            className={`transition-opacity duration-200 ease-out ${
              view === 'playground'
                ? 'opacity-100 visible relative z-10'
                : 'opacity-0 invisible pointer-events-none absolute inset-0 max-h-screen overflow-hidden -z-10'
            }`}
          >
            <PlaygroundLayout
              onBackToLanding={handleBackToLanding}
              onSwitchToExercises={() => handleStartLearning()}
              onOpenCheatSheet={returnToCheatSheet ? handleBackToCheatSheet : handleOpenCheatSheet}
              initialQuery={playgroundInitialQuery}
            />
          </div>
        )}
        {visitedViews.has('cheatsheet') && (
          <div
            className={`transition-opacity duration-200 ease-out ${
              view === 'cheatsheet'
                ? 'opacity-100 visible relative z-10'
                : 'opacity-0 invisible pointer-events-none absolute inset-0 max-h-screen overflow-hidden -z-10'
            }`}
          >
            <CheatSheetPage
              onBackToHome={handleBackToLanding}
              onOpenPlayground={(query) => handleOpenPlayground(query, true)}
              onStartLearning={() => handleStartLearning()}
            />
          </div>
        )}
      </div>
    </MotionConfig>
  );
}

export default App;
