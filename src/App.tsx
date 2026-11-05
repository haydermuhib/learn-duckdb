import React, { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { StudioLayout } from './components/studio/StudioLayout';

export function App() {
  const [view, setView] = useState<'landing' | 'studio'>('landing');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>(undefined);

  const handleStartLearning = (exerciseId?: string) => {
    setSelectedExerciseId(exerciseId);
    setView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-duck selection:text-ink">
      {view === 'landing' ? (
        <LandingPage onStartLearning={handleStartLearning} />
      ) : (
        <StudioLayout
          onBackToLanding={handleBackToLanding}
          initialExerciseId={selectedExerciseId}
        />
      )}
    </div>
  );
}

export default App;
