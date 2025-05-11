import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourney } from '@/context/JourneyContext';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { logTimelineEvent } from '@/services/timeline';
import { useAuth } from '@/context/AuthContext';
import { useChakraActivations } from '@/hooks/useChakraActivations';
import { useLightbearerProgress } from '@/hooks/useLightbearerProgress';
import { toast } from 'sonner';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { supabase } from '@/integrations/supabase/client';

// Phase components
import GroundingPhase from './phases/GroundingPhase';
import AligningPhase from './phases/AligningPhase';
import ActivatingPhase from './phases/ActivatingPhase';
import IntegrationPhase from './phases/IntegrationPhase';
import JourneyProgress from './JourneyProgress';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import useSpiralParams from '@/hooks/useSpiralParams';

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
  const { playAudio, playerState } = useGlobalAudioPlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const phaseTransitionInProgressRef = useRef(false);
  
  // Spiral parameters
  const { getDefaultParamsForChakra } = useSpiralParams();
  const [spiralParams, setSpiralParams] = useState(() => 
    getDefaultParamsForChakra(journeyData.chakra || 'Heart')
  );
  
  // Use a ref for the current phase to prevent issues with stale closures
  const currentPhaseRef = useRef<JourneyPhase>('grounding');
  const [currentPhase, setCurrentPhase] = useState<JourneyPhase>('grounding');
  
  // Single state object for phase completion tracking
  const [phaseCompletion, setPhaseCompletion] = useState({
    grounding: false,
    aligning: false,
    activating: false,
    integration: false
  });
  
  const [reflection, setReflection] = useState('');
  const [audioStarted, setAudioStarted] = useState(false);
  const [eventLogged, setEventLogged] = useState(false);
  const [journeyStartTime] = useState<Date>(new Date());
  const [sessionId] = useState<string>(crypto.randomUUID());

  // Background opacity animation based on scroll
  const backgroundOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const spiralScale = useTransform(scrollY, [0, 300], [1, 1.2]);

  // Generate a chakra-specific background class
  const chakraClass = journeyData.chakra ? 
    `chakra-${journeyData.chakra.toLowerCase().replace(/\s+/g, '-')}` : 
    'chakra-default';

  // Start audio when journey begins
  useEffect(() => {
    if (!audioStarted && journeyData.audioFile) {
      // Start with a delay to allow the visual transition to complete
      setTimeout(() => {
        try {
          const audioUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${journeyData.audioFile}`;
          playAudio({
            title: `${journeyData.title} Soundscape`,
            source: audioUrl,
            artist: "Sacred Shifter",
            frequency: journeyData.frequency,
            chakra: journeyData.chakra
          });
          setAudioStarted(true);
        } catch (error) {
          console.error("Failed to play audio:", error);
          // Continue experience even if audio fails
        }
      }, 2000);
    }
  }, [journeyData, audioStarted, playAudio]);

  // On component mount, record journey start
  useEffect(() => {
    if (user?.id && journeyData.id && !eventLogged) {
      try {
        // Log event with recordActivity for redundancy
        recordActivity('journey_start', {
          journeyId: journeyData.id,
          title: journeyData.title,
          chakra: journeyData.chakra
        });
        
        setEventLogged(true); // Mark that we've logged the event
      } catch (err) {
        console.error("Error logging journey start:", err);
        // Continue with journey experience even if logging fails
      }
    }
    
    // Log mounting of component
    console.log("JourneyExperience component mounted");
    
    return () => {
      console.log("JourneyExperience component unmounting");
    };
  }, [user?.id, journeyData.id, journeyData.title, recordActivity, eventLogged]);

  // Track audio completion
  useEffect(() => {
    // Check if playerState exists and audio playback has completed
    if (playerState && playerState.trackEnded && audioStarted) {
      recordActivity('journey_audio_complete', {
        journeyId: journeyData.id,
        title: journeyData.title
      });
      
      // If user is still in Grounding or Aligning phase, suggest moving forward
      if (currentPhase === 'grounding' || currentPhase === 'aligning') {
        toast.info("Audio completed. Continue to the next phase when ready.", {
          duration: 5000
        });
      }
    }
  }, [playerState, audioStarted, currentPhase, recordActivity, journeyData]);

  // Update currentPhaseRef when currentPhase changes
  useEffect(() => {
    currentPhaseRef.current = currentPhase;
    console.log(`Phase updated to: ${currentPhase}`);
  }, [currentPhase]);

  // Dynamic spiral parameters based on current phase
  useEffect(() => {
    // Adjust spiral parameters based on the current phase
    const baseParams = getDefaultParamsForChakra(journeyData.chakra || 'Heart');
    let phaseParams = {...baseParams};
    
    switch(currentPhase) {
      case 'grounding':
        phaseParams.speed = 0.000025; // Ultra slow for stability
        phaseParams.opacity = 60;
        break;
      case 'aligning':
        phaseParams.speed = 0.00003; // Ultra slow for stability
        phaseParams.strokeWeight = 1.2;
        phaseParams.opacity = 70;
        break;
      case 'activating':
        phaseParams.speed = 0.00004; // Ultra slow for stability
        phaseParams.maxCycles = 5;
        phaseParams.opacity = 80;
        break;
      case 'integration':
        phaseParams.speed = 0.000035; // Ultra slow for stability
        phaseParams.strokeWeight = 1.5;
        phaseParams.opacity = 90;
        break;
      case 'complete':
        phaseParams.speed = 0.000025; // Ultra slow for stability
        phaseParams.maxCycles = 3;
        phaseParams.opacity = 50;
        break;
    }
    
    console.log(`Setting spiral params for phase: ${currentPhase}`, phaseParams);
    setSpiralParams(phaseParams);
  }, [currentPhase, journeyData.chakra, getDefaultParamsForChakra]);

  // Better phase transition handling
  const completePhase = (phase: Exclude<JourneyPhase, 'complete'>) => {
    console.log(`Completing phase: ${phase}, current phase: ${currentPhaseRef.current}`);
    
    if (phaseTransitionInProgressRef.current) {
      console.log("Phase transition already in progress, ignoring request");
      return;
    }
    
    // Block concurrent transitions
    phaseTransitionInProgressRef.current = true;
    
    // Update completion state
    setPhaseCompletion(prev => ({
      ...prev,
      [phase]: true
    }));

    // Record the completion in the timeline
    if (user?.id && journeyData.id) {
      console.log(`Recording activity for phase: ${phase}`);
      
      recordActivity('journey_progress', {
        journeyId: journeyData.id,
        phase,
        completed: true
      });
      
      // For aligning phase, record chakra activation
      if (phase === 'aligning' && journeyData.chakra) {
        console.log(`Recording chakra activation for: ${journeyData.chakra}`);
        
        recordActivation(journeyData.chakra, 'journey', journeyData.id);
        
        // Award points for phase completion
        addPoints('phase_completion', 5, `Completed ${phase} phase of ${journeyData.title}`);
        toast.success(`+5 Light Points for ${phase} phase completion`);
      }
    }

    // Move to next phase with a significant delay to ensure proper transitions
    const phases: JourneyPhase[] = ['grounding', 'aligning', 'activating', 'integration', 'complete'];
    const currentIndex = phases.indexOf(currentPhaseRef.current);
    
    console.log(`Current phase index: ${currentIndex}, current phase: ${currentPhaseRef.current}`);
    
    if (currentIndex < phases.length - 1) {
      console.log(`Transitioning to phase: ${phases[currentIndex + 1]} after delay`);
      
      // CRITICAL FIX: Significantly increased delays to ensure transitions complete properly
      // First delay to allow animations and state updates to complete
      setTimeout(() => {
        const nextPhase = phases[currentIndex + 1];
        console.log(`Setting current phase to: ${nextPhase}`);
        
        // Force a state update with the new phase
        setCurrentPhase(nextPhase);
        
        // Second delay to ensure new phase is fully registered before allowing new transitions
        setTimeout(() => {
          phaseTransitionInProgressRef.current = false;
          console.log("Phase transition lock released");
        }, 1000); // Increased delay before allowing new transitions
      }, 1500); // Increased delay for phase transition
    } else {
      console.log("Already at last phase, not transitioning");
      phaseTransitionInProgressRef.current = false;
    }
  };

  const handleReflectionChange = (text: string) => {
    setReflection(text);
  };

  const saveReflection = async (reflection: string) => {
    if (!user?.id || !reflection.trim()) return;

    try {
      // Save reflection to Supabase
      const { data, error } = await supabase
        .from('session_reflections')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          content: reflection
        })
        .select('id')
        .single();

      if (error) throw error;
      
      // Save journey completion record
      const durationSeconds = Math.floor((new Date().getTime() - journeyStartTime.getTime()) / 1000);

      if (journeyData.id) {
        await supabase
          .from('journey_completions')
          .insert({
            user_id: user.id,
            journey_id: journeyData.id,
            reflection_id: data.id,
            duration_seconds: durationSeconds
          });
      }

      return data.id;
    } catch (error) {
      console.error("Error saving reflection:", error);
      toast.error("Unable to save your reflection");
    }
  };

  const handleJourneyComplete = async () => {
    if (phaseTransitionInProgressRef.current) {
      console.log("Phase transition already in progress, ignoring completion request");
      return;
    }
    
    phaseTransitionInProgressRef.current = true;
    console.log("Handling journey completion");
    
    if (!reflection.trim()) {
      toast.warning("Please share a brief reflection before completing the journey");
      phaseTransitionInProgressRef.current = false;
      return;
    }

    // Show loading toast
    toast.loading("Saving your journey experience...");

    try {
      // Save reflection to database
      const reflectionId = await saveReflection(reflection);

      if (user?.id && journeyData.id) {
        recordActivity('journey_complete', {
          journeyId: journeyData.id,
          reflection,
          reflectionId
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

        // Call the onComplete callback with reflection data
        if (onComplete) {
          onComplete({ 
            reflection,
            reflectionId,
            journeyId: journeyData.id,
            duration: Math.floor((new Date().getTime() - journeyStartTime.getTime()) / 1000)
          });
        }
      }

      toast.dismiss();
      toast.success("Journey experience saved!");
      setCurrentPhase('complete');
    } catch (error) {
      console.error("Error completing journey:", error);
      toast.dismiss();
      toast.error("Error saving your journey experience");
    } finally {
      phaseTransitionInProgressRef.current = false;
    }
  };

  // Map phase to component with key props to force recreation
  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'grounding':
        return (
          <GroundingPhase
            key="grounding-phase"
            onComplete={() => completePhase('grounding')}
            chakra={journeyData.chakra}
            intent={journeyData.intent}
            frequency={journeyData.frequency}
          />
        );
      
      case 'aligning':
        return (
          <AligningPhase
            key="aligning-phase"
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
            key="activating-phase"
            onComplete={() => completePhase('activating')}
            chakra={journeyData.chakra}
            frequency={journeyData.frequency}
            script={journeyData.script}
          />
        );
        
      case 'integration':
        return (
          <IntegrationPhase
            key="integration-phase"
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
            key="complete-phase"
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

  // Use a simple SVG element instead of trying to load external SVG files
  const ScrollReactiveGeometry = () => {
    const geometryOpacity = useTransform(scrollY, [0, 200, 400], [0, 0.5, 0.8]);
    const geometryScale = useTransform(scrollY, [0, 300], [0.8, 1.2]);
    const geometryRotation = useTransform(scrollY, [0, 500], [0, 90]);
    const chakraColor = getChakraColor(journeyData.chakra) || '#8B5CF6';

    return (
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ 
          opacity: geometryOpacity,
          scale: geometryScale,
          rotate: geometryRotation
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96">
            {/* Simple inline SVG for sacred geometry */}
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 200 200" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Base circle */}
              <circle cx="100" cy="100" r="90" fill="none" stroke={chakraColor} strokeWidth="0.5" opacity="0.5" />
              
              {/* Flower of Life pattern */}
              <circle cx="100" cy="100" r="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
              <circle cx="130" cy="100" r="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
              <circle cx="115" cy="126" r="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
              <circle cx="85" cy="126" r="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
              <circle cx="70" cy="100" r="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
              <circle cx="85" cy="74" r="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
              <circle cx="115" cy="74" r="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
              
              {/* Inner details */}
              <path 
                d="M100,20 L180,140 L20,140 Z" 
                fill="none" 
                stroke={chakraColor} 
                strokeWidth="0.3" 
                opacity="0.4"
              />
              
              {/* Chakra-specific element */}
              {journeyData.chakra === 'Crown' && (
                <g opacity="0.6">
                  <circle cx="100" cy="100" r="60" fill="none" stroke="purple" strokeWidth="0.5" />
                  <path d="M70,70 L130,130 M70,130 L130,70" stroke="purple" strokeWidth="0.5" fill="none" />
                </g>
              )}
              {journeyData.chakra === 'Heart' && (
                <g opacity="0.6">
                  <path d="M100,70 L130,100 L100,130 L70,100 Z" stroke="green" strokeWidth="0.5" fill="none" />
                </g>
              )}
              {journeyData.chakra === 'Root' && (
                <g opacity="0.6">
                  <rect x="70" y="70" width="60" height="60" stroke="red" strokeWidth="0.5" fill="none" />
                </g>
              )}
            </svg>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`journey-experience ${chakraClass} min-h-screen flex flex-col relative overflow-y-auto ${className}`}
      style={{ 
        background: `radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,1) 100%)`,
      }}
    >
      {/* Background with chakra-themed glow */}
      <motion.div 
        className={`fixed inset-0 bg-black z-0`}
        style={{ 
          boxShadow: `inset 0 0 150px ${getChakraColor(journeyData.chakra)}`,
          background: `radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,1) 100%)`,
          opacity: backgroundOpacity
        }}
      />

      {/* Spiral Visualizer */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ scale: spiralScale }}
      >
        <SpiralVisualizer 
          params={spiralParams}
          containerId="journey-spiral"
        />
      </motion.div>

      {/* Scroll-reactive geometric forms */}
      <ScrollReactiveGeometry />

      {/* Journey title and progress */}
      <header className="relative z-10 p-4 flex justify-between items-center sticky top-0 bg-black/30 backdrop-blur-sm">
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
