
import React, { useState, useEffect } from 'react';
import { useJourney } from '@/context/JourneyContext';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { logTimelineEvent } from '@/services/timelineService';
import { useAuth } from '@/context/AuthContext';
import { useChakraActivations } from '@/hooks/useChakraActivations';
import { Journey } from '@/types/journey';

// Phase components
import GroundingPhase from './phases/GroundingPhase';
import AligningPhase from './phases/AligningPhase';
import ActivatingPhase from './phases/ActivatingPhase';
import IntegrationPhase from './phases/IntegrationPhase';
import JourneyProgress from './JourneyProgress';

// Types for journey phases
export type JourneyPhase = 'grounding' | 'aligning' | 'activating' | 'integration' | 'complete';

export interface JourneyExperienceProps {
  journeyData: {
    title: string;
    intent?: string;
    script?: string; // Markdown content
    frequency?: number;
    chakra?: ChakraTag;
    audioFile?: string;
    id?: string;
  };
  onComplete?: (reflectionData: any) => void;
  className?: string;
}

const JourneyExperience: React.FC<JourneyExperienceProps> = ({
  journeyData,
  onComplete,
  className = ''
}) => {
  const { user } = useAuth();
  const { recordActivity } = useJourney();
  const { recordActivation } = useChakraActivations();
  const [currentPhase, setCurrentPhase] = useState<JourneyPhase>('grounding');
  const [phaseCompletion, setPhaseCompletion] = useState({
    grounding: false,
    aligning: false,
    activating: false,
    integration: false
  });
  const [reflection, setReflection] = useState('');

  // Generate a chakra-specific background class
  const chakraClass = journeyData.chakra ? `chakra-${journeyData.chakra.toLowerCase().replace(/\s+/g, '-')}` : 'chakra-default';

  // On component mount, record journey start
  useEffect(() => {
    if (user?.id && journeyData.id) {
      recordActivity('journey_start', {
        journeyId: journeyData.id,
        title: journeyData.title
      });
    }
  }, [user?.id, journeyData.id, journeyData.title, recordActivity]);

  const completePhase = (phase: Exclude<JourneyPhase, 'complete'>) => {
    // Update completion state
    setPhaseCompletion(prev => ({ ...prev, [phase]: true }));

    // Record the completion in the timeline
    if (user?.id && journeyData.id) {
      recordActivity('journey_progress', {
        journeyId: journeyData.id,
        phase,
        completed: true
      });
      
      // For aligning phase, record chakra activation
      if (phase === 'aligning' && journeyData.chakra) {
        recordActivation(journeyData.chakra, 'journey', journeyData.id);
      }
    }

    // Move to next phase
    const phases: JourneyPhase[] = ['grounding', 'aligning', 'activating', 'integration', 'complete'];
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1]);
    }
  };

  const handleReflectionChange = (text: string) => {
    setReflection(text);
  };

  const handleJourneyComplete = () => {
    if (user?.id && journeyData.id) {
      recordActivity('journey_complete', {
        journeyId: journeyData.id,
        reflection
      });
    }

    if (onComplete) {
      onComplete({ reflection });
    }

    setCurrentPhase('complete');
  };

  return (
    <div className={`journey-experience ${chakraClass} min-h-screen flex flex-col relative ${className}`}>
      {/* Background with chakra-themed glow */}
      <div 
        className={`absolute inset-0 bg-black z-0`}
        style={{ 
          boxShadow: `inset 0 0 150px ${getChakraColor(journeyData.chakra)}`,
          background: `radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,1) 100%)`
        }}
      />

      {/* Journey title and progress */}
      <header className="relative z-10 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">{journeyData.title}</h1>
        <JourneyProgress currentPhase={currentPhase} />
      </header>

      {/* Main content area */}
      <main className="flex-grow relative z-10 flex items-center justify-center">
        {currentPhase === 'grounding' && (
          <GroundingPhase
            onComplete={() => completePhase('grounding')}
            chakra={journeyData.chakra}
            intent={journeyData.intent}
            frequency={journeyData.frequency}
          />
        )}

        {currentPhase === 'aligning' && (
          <AligningPhase
            onComplete={() => completePhase('aligning')}
            chakra={journeyData.chakra}
            frequency={journeyData.frequency}
            audioFile={journeyData.audioFile}
            script={journeyData.script}
          />
        )}

        {currentPhase === 'activating' && (
          <ActivatingPhase
            onComplete={() => completePhase('activating')}
            chakra={journeyData.chakra}
            frequency={journeyData.frequency}
            script={journeyData.script}
          />
        )}

        {currentPhase === 'integration' && (
          <IntegrationPhase
            onComplete={handleJourneyComplete}
            chakra={journeyData.chakra}
            reflection={reflection}
            onReflectionChange={handleReflectionChange}
            journeyData={journeyData}
          />
        )}

        {currentPhase === 'complete' && (
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold mb-4 text-white">Journey Complete</h2>
            <p className="text-lg text-white/80 mb-6">
              Thank you for completing this sacred journey. Your energy has shifted.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default JourneyExperience;
