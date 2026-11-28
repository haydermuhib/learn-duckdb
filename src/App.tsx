import { useState, useEffect, useRef } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { LandingPage } from './components/landing/LandingPage';
import { StudioLayout } from './components/studio/StudioLayout';
import { PlaygroundLayout } from './components/playground/PlaygroundLayout';
import { CheatSheetPage } from './components/cheatsheet/CheatSheetPage';

const VIEW_TRANSITION = { duration: 0.2, delay: 0, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

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
      const hash = window.location.hash;
      if (hash === '#cheatsheet' || hash === '#cheat-sheet') {
        setHasVisitedCheatSheet(true);
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
      } else if (!hash || hash === '#') {
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
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToLanding = () => {
    setView('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-canvas text-ink selection:bg-duck selection:text-ink">
        {view === 'landing' && (
          <LandingPage
            onStartLearning={handleStartLearning}
            onOpenPlayground={handleOpenPlayground}
            onOpenCheatSheet={handleOpenCheatSheet}
          />
        )}
        {view === 'studio' && (
          <motion.div
            key="studio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={VIEW_TRANSITION}
          >
            <StudioLayout
              onBackToLanding={handleBackToLanding}
              initialExerciseId={selectedExerciseId}
              onSwitchToPlayground={handleOpenPlayground}
              onSwitchToCheatSheet={handleOpenCheatSheet}
            />
          </motion.div>
        )}
        {view === 'playground' && (
          <motion.div
            key="playground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={VIEW_TRANSITION}
          >
            <PlaygroundLayout
              onBackToLanding={handleBackToLanding}
              onSwitchToExercises={() => handleStartLearning()}
              onOpenCheatSheet={returnToCheatSheet ? handleBackToCheatSheet : handleOpenCheatSheet}
              initialQuery={playgroundInitialQuery}
            />
          </motion.div>
        )}
        {hasVisitedCheatSheet && (
          <motion.div
            animate={{ opacity: view === 'cheatsheet' ? 1 : 0 }}
            transition={VIEW_TRANSITION}
            style={{ display: view === 'cheatsheet' ? 'block' : 'none' }}
          >
            <CheatSheetPage
              onBackToHome={handleBackToLanding}
              onOpenPlayground={(query) => handleOpenPlayground(query, true)}
              onStartLearning={() => handleStartLearning()}
            />
          </motion.div>
        )}
      </div>
    </MotionConfig>
  );
}

export default App;
