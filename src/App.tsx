import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { StudioLayout } from './components/studio/StudioLayout';
import { PlaygroundLayout } from './components/playground/PlaygroundLayout';

export function App() {
  const [view, setView] = useState<'landing' | 'studio' | 'playground'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#playground') return 'playground';
      if (window.location.hash === '#studio') return 'studio';
    }
    return 'landing';
  });
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>(undefined);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#playground') {
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

  const handleOpenPlayground = () => {
    setView('playground');
    window.location.hash = '#playground';
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
        />
      )}
    </div>
  );
}

export default App;
