
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChakraTag, getChakraColor } from '@/types/chakras';

interface GroundingPhaseProps {
  onComplete: () => void;
  chakra?: ChakraTag;
  intent?: string;
  frequency?: number;
}

const BreathCircle: React.FC<{ state: 'inhale' | 'hold' | 'exhale'; chakra?: ChakraTag }> = ({ 
  state, 
  chakra 
}) => {
  const chakraColor = getChakraColor(chakra) || '#FFFFFF';
  
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="absolute rounded-full"
        animate={{
          scale: state === 'inhale' ? [1, 1.7] : 
                 state === 'hold' ? 1.7 : 
                 state === 'exhale' ? [1.7, 1] : 1,
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: state === 'inhale' ? 4 : 
                   state === 'hold' ? 2 : 
                   state === 'exhale' ? 6 : 1,
          ease: state === 'exhale' ? 'easeInOut' : 'easeOut',
        }}
        style={{
          backgroundColor: chakraColor + '15',
          border: `2px solid ${chakraColor}60`,
          boxShadow: `0 0 30px ${chakraColor}40`,
          width: '200px',
          height: '200px',
        }}
      />
      <motion.div
        className="absolute rounded-full"
        animate={{
          scale: state === 'inhale' ? [1, 1.5] : 
                 state === 'hold' ? 1.5 : 
                 state === 'exhale' ? [1.5, 1] : 1,
        }}
        transition={{
          duration: state === 'inhale' ? 4 : 
                   state === 'hold' ? 2 : 
                   state === 'exhale' ? 6 : 1,
          ease: state === 'exhale' ? 'easeInOut' : 'easeOut',
        }}
        style={{
          backgroundColor: chakraColor + '30',
          width: '100px',
          height: '100px',
        }}
      />
    </div>
  );
};

const GroundingPhase: React.FC<GroundingPhaseProps> = ({ 
  onComplete,
  chakra,
  intent,
  frequency
}) => {
  const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [autoProgress, setAutoProgress] = useState(true);
  const chakraColor = getChakraColor(chakra) || '#FFFFFF';
  
  // Handle breath cycle
  useEffect(() => {
    if (!autoProgress) return;
    
    const cycle = async () => {
      // Inhale
      setBreathState('inhale');
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Hold
      setBreathState('hold');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Exhale
      setBreathState('exhale');
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      // Increment count
      setBreathCount(prev => prev + 1);
    };
    
    const timer = setTimeout(cycle, 500);
    return () => clearTimeout(timer);
  }, [breathCount, autoProgress]);
  
  // Complete after 3 breaths
  useEffect(() => {
    if (breathCount >= 3 && autoProgress) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [breathCount, onComplete, autoProgress]);
  
  const getBreathInstructions = () => {
    switch(breathState) {
      case 'inhale':
        return "Breathe in slowly...";
      case 'hold':
        return "Hold your breath...";
      case 'exhale':
        return "Exhale fully...";
      default:
        return "Prepare to breathe...";
    }
  };
  
  const progressPercentage = Math.min((breathCount / 3) * 100, 100);
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Grounding Phase</h2>
        <p className="text-white/70 max-w-md mx-auto">
          {intent || "Take a moment to center yourself and connect with your breath."}
        </p>
        {frequency && (
          <p className="text-white/50 text-sm mt-2">
            Preparing for {frequency}Hz frequency
          </p>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative mb-12"
      >
        <BreathCircle state={breathState} chakra={chakra} />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-medium"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            repeat: Infinity,
            duration: 3
          }}
        >
          {getBreathInstructions()}
        </motion.div>
      </motion.div>
      
      <div className="w-full max-w-md px-4">
        <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: chakraColor }}
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="mt-2 text-white/60 text-sm flex justify-between">
          <span>Breath {Math.min(breathCount, 3)} of 3</span>
          <button 
            onClick={() => {
              setAutoProgress(false);
              onComplete();
            }} 
            className="text-white/80 hover:text-white underline"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroundingPhase;
