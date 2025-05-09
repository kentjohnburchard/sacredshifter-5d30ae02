import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourney } from '@/context/JourneyContext';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { logTimelineEvent } from '@/services/timelineService';
import { useAuth } from '@/context/AuthContext';
import { useChakraActivations } from '@/hooks/useChakraActivations';
import { useLightbearerProgress } from '@/hooks/useLightbearerProgress';
import { Journey } from '@/types/journey';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recordActivity } = useJourney();
  const { recordActivation } = useChakraActivations();
  const { addPoints } = useLightbearerProgress();
  const { playAudio } = useGlobalAudioPlayer();
  
  const [currentPhase, setCurrentPhase] = useState<JourneyPhase>('grounding');
  const [phaseCompletion, setPhaseCompletion] = useState({
    grounding: false,
    aligning: false,
    activating: false,
    integration: false
  });
  const [reflection, setReflection] = useState('');
  const [audioStarted, setAudioStarted] = useState(false);

  // Generate a chakra-specific background class
  const chakraClass = journeyData.chakra ? `chakra-${journeyData.chakra.toLowerCase().replace(/\s+/g, '-')}` : 'chakra-default';

  // Start audio when journey begins
  useEffect(() => {
    if (!audioStarted && journeyData.audioFile) {
      // Start with a delay to allow the visual transition to complete
      setTimeout(() => {
        const audioUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${journeyData.audioFile}`;
        playAudio({
          title: `${journeyData.title} Soundscape`,
          source: audioUrl,
          artist: "Sacred Shifter",
          frequency: journeyData.frequency,
          chakra: journeyData.chakra
        });
        setAudioStarted(true);
      }, 2000);
    }
  }, [journeyData, audioStarted, playAudio]);

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
        
        // Award points for phase completion
        addPoints('phase_completion', 5, `Completed ${phase} phase of ${journeyData.title}`);
        toast.success(`+5 Light Points for ${phase} phase completion`);
      }
    }

    // Move to next phase with a slight delay for transition effect
    const phases: JourneyPhase[] = ['grounding', 'aligning', 'activating', 'integration', 'complete'];
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < phases.length - 1) {
      // Small delay for better transitions
      setTimeout(() => {
        setCurrentPhase(phases[currentIndex + 1]);
      }, 300);
    }
  };

  const handleReflectionChange = (text: string) => {
    setReflection(text);
  };

  const handleJourneyComplete = async () => {
    if (user?.id && journeyData.id) {
      recordActivity('journey_complete', {
        journeyId: journeyData.id,
        reflection
      });
      
      // Award points for journey completion
      const pointValue = 15; // Base points for completing a journey
      const journeyCompletionEvent = await addPoints(
        'journey_complete', 
        pointValue, 
        `Completed journey: ${journeyData.title}`
      );
      
      // Show toast with points
      if (journeyCompletionEvent) {
        toast.success(`+${pointValue} Light Points for completing journey`);
        
        // Show level up notification if applicable
        if (journeyCompletionEvent.leveled_up) {
          toast.success(`Level Up! You are now level ${journeyCompletionEvent.new_level}`, {
            duration: 5000,
            className: "bg-purple-700 border-yellow-400 border-2"
          });
        }
      }
    }

    if (onComplete) {
      onComplete({ reflection });
    }

    setCurrentPhase('complete');
  };

  // Map phase to component
  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'grounding':
        return (
          <GroundingPhase
            onComplete={() => completePhase('grounding')}
            chakra={journeyData.chakra}
            intent={journeyData.intent}
            frequency={journeyData.frequency}
          />
        );
      
      case 'aligning':
        return (
          <AligningPhase
            onComplete={() => completePhase('aligning')}
            chakra={journeyData.chakra}
            frequency={journeyData.frequency}
            audioFile={journeyData.audioFile}
            script={journeyData.script}
          />
        );
      
      case 'activating':
        return (
          <ActivatingPhase
            onComplete={() => completePhase('activating')}
            chakra={journeyData.chakra}
            frequency={journeyData.frequency}
            script={journeyData.script}
          />
        );
        
      case 'integration':
        return (
          <IntegrationPhase
            onComplete={handleJourneyComplete}
            chakra={journeyData.chakra}
            reflection={reflection}
            onReflectionChange={handleReflectionChange}
            journeyData={journeyData}
          />
        );
      
      case 'complete':
        return (
          <motion.div 
            className="text-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Journey Complete</h2>
            <p className="text-lg text-white/80 mb-6">
              Thank you for completing this sacred journey. Your energy has shifted.
            </p>
            
            <div className="max-w-md mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/journey-index')}
                className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors"
              >
                Browse Journeys
              </button>
              
              <button 
                onClick={() => navigate('/sacred-circle')}
                className="px-6 py-3 bg-indigo-700 hover:bg-indigo-600 text-white rounded-md transition-colors"
              >
                Visit Sacred Circle
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div 
      className={`journey-experience ${chakraClass} min-h-screen flex flex-col relative ${className}`}
      style={{ 
        background: `radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,1) 100%)`,
      }}
    >
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
      <main className="flex-grow relative z-10 flex items-center justify-center p-4">
        <motion.div 
          key={currentPhase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl mx-auto"
        >
          {renderCurrentPhase()}
        </motion.div>
      </main>
    </div>
  );
};

export default JourneyExperience;
