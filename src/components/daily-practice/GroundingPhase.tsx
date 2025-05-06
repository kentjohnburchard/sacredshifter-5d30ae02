
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface GroundingPhaseProps {
  onComplete: () => void;
  skipAnimations?: boolean;
}

const GroundingPhase: React.FC<GroundingPhaseProps> = ({ onComplete, skipAnimations = false }) => {
  const [breathStep, setBreathStep] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(60); // 1 minute total
  const { audioRef, setAudioSource } = useAudioPlayer();

  // Skip animations if needed
  useEffect(() => {
    if (skipAnimations) {
      onComplete();
    }
  }, [skipAnimations, onComplete]);

  // Set up audio
  useEffect(() => {
    setAudioSource('/lovable-uploads/earth_frequency_396hz.mp3');
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [setAudioSource, audioRef]);

  // Timer for phase duration
  useEffect(() => {
    if (skipAnimations) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete, skipAnimations]);

  // Breath animation cycle
  useEffect(() => {
    if (skipAnimations) return;
    
    const breathCycle = async () => {
      // Box breathing cycle (4-4-4-4)
      while (secondsLeft > 0) {
        // Inhale for 4 seconds
        setBreathStep('inhale');
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Hold for 4 seconds
        setBreathStep('hold');
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Exhale for 4 seconds
        setBreathStep('exhale');
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Rest for 4 seconds
        setBreathStep('rest');
        await new Promise(resolve => setTimeout(resolve, 4000));
      }
    };
    
    breathCycle();
  }, [secondsLeft, skipAnimations]);

  return (
    <div className="relative flex flex-col items-center justify-center p-8 min-h-[400px]">
      <h2 className="text-2xl font-bold text-white/90 mb-8">Ground Yourself</h2>
      
      {/* Breath animation */}
      <div className="relative w-48 h-48 mb-8">
        <motion.div 
          className="absolute inset-0 rounded-lg border-2 border-amber-500/50 bg-amber-500/10"
          animate={{
            scale: breathStep === 'inhale' ? 1.2 : 
                  breathStep === 'exhale' ? 0.8 : 1,
            opacity: breathStep === 'rest' ? 0.6 : 1
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
        
        {/* Sacred geometry background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {/* Simple sacred geometry pattern - Flower of Life base */}
            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="20" r="20" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="80" r="20" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="20" cy="50" r="20" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="80" cy="50" r="20" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        
        {/* Breath state text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={breathStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg font-light text-white/90"
            >
              {breathStep === 'inhale' && "Inhale..."}
              {breathStep === 'hold' && "Hold..."}
              {breathStep === 'exhale' && "Exhale..."}
              {breathStep === 'rest' && "Rest..."}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Prompt text */}
      <motion.p 
        className="text-xl text-center text-white/80 max-w-lg"
        animate={{ 
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ 
          duration: 8, 
          ease: "easeInOut", 
          repeat: Infinity 
        }}
      >
        Inhale stability. Exhale distraction. You are here, now.
      </motion.p>
      
      {/* Timer */}
      <div className="absolute bottom-6 right-6 text-sm text-white/50">
        {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default GroundingPhase;
