
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { ChakraTag, getChakraInfo, getChakraColor } from '@/types/chakras';
import ChakraIcon from '@/components/chakra/ChakraIcon';

interface AligningPhaseProps {
  chakraTag: ChakraTag;
  onComplete: () => void;
  skipAnimations?: boolean;
}

const AligningPhase: React.FC<AligningPhaseProps> = ({ chakraTag, onComplete, skipAnimations = false }) => {
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const { audioRef, setAudioSource } = useAudioPlayer();
  
  const chakraInfo = getChakraInfo(chakraTag);
  const chakraColor = getChakraColor(chakraTag);

  // Skip animations if needed
  useEffect(() => {
    if (skipAnimations) {
      onComplete();
    }
  }, [skipAnimations, onComplete]);

  // Set up audio for the chakra
  useEffect(() => {
    if (chakraInfo?.frequency) {
      // Load chakra-specific frequency
      setAudioSource(`/lovable-uploads/chakra_${chakraTag.toLowerCase()}_${chakraInfo.frequency}hz.mp3`);
    } else {
      // Default to heart chakra if no frequency found
      setAudioSource('/lovable-uploads/chakra_heart_639hz.mp3');
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [chakraTag, chakraInfo, setAudioSource, audioRef]);

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

  // Breath animation cycle - slightly slower than grounding phase
  useEffect(() => {
    if (skipAnimations) return;
    
    const breathCycle = async () => {
      while (secondsLeft > 0) {
        // Inhale for 5 seconds
        setBreathPhase('inhale');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Exhale for 5 seconds
        setBreathPhase('exhale');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    };
    
    breathCycle();
  }, [secondsLeft, skipAnimations]);

  // Get content based on chakra
  const getChakraPrompt = () => {
    switch(chakraTag) {
      case 'Root':
        return "Feel grounded, stable, and secure. You are supported by the Earth.";
      case 'Sacral':
        return "Connect with your creative energy and emotional flow. Be fluid and expressive.";
      case 'Solar Plexus':
        return "Embody your personal power. Your inner fire guides and empowers you.";
      case 'Heart':
        return "Open to giving and receiving love. You are connected to all things.";
      case 'Throat':
        return "Express your authentic truth. Your voice matters and deserves to be heard.";
      case 'Third Eye':
        return "Trust your intuition and inner vision. See beyond the physical world.";
      case 'Crown':
        return "Connect to your higher consciousness. You are one with divine wisdom.";
      case 'Transpersonal':
        return "Experience universal consciousness. You are connected to all that is.";
      default:
        return "Focus on your energy center. Feel its rhythm align with your breath.";
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-8 min-h-[400px]">
      <h2 className="text-2xl font-bold text-white/90 mb-2">Aligning Your Energy</h2>
      
      <div className="text-lg font-light text-white/70 mb-8 flex items-center gap-2">
        <span>Focus on your</span> 
        <span style={{ color: chakraColor }}>{chakraTag} Chakra</span>
      </div>
      
      {/* Chakra animation */}
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        {/* Pulsing circles */}
        <motion.div 
          className="absolute rounded-full"
          style={{ backgroundColor: `${chakraColor}15` }}
          animate={{
            scale: breathPhase === 'inhale' ? [1, 1.2] : [1.2, 1],
            opacity: breathPhase === 'inhale' ? [0.3, 0.6] : [0.6, 0.3]
          }}
          transition={{ duration: 5, ease: "easeInOut" }}
        />
        
        {/* Chakra icon */}
        <motion.div
          animate={{
            scale: breathPhase === 'inhale' ? [1, 1.1] : [1.1, 1],
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{ 
            scale: { duration: 5, ease: "easeInOut" },
            rotate: { duration: 10, ease: "easeInOut", repeat: Infinity }
          }}
        >
          <ChakraIcon 
            chakra={chakraTag} 
            size={80} 
            className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
          />
        </motion.div>
      </div>
      
      {/* Breath instruction */}
      <div className="mb-6 text-white/80">
        <AnimatePresence mode="wait">
          <motion.div
            key={breathPhase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 1 }}
            className="text-lg"
          >
            {breathPhase === 'inhale' ? "Inhale..." : "Exhale..."}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Chakra prompt */}
      <motion.p 
        className="text-xl text-center text-white/80 max-w-lg"
        style={{ 
          textShadow: `0 0 10px ${chakraColor}40`
        }}
        animate={{ 
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ 
          duration: 6, 
          ease: "easeInOut", 
          repeat: Infinity 
        }}
      >
        {getChakraPrompt()}
      </motion.p>
      
      {/* Timer */}
      <div className="absolute bottom-6 right-6 text-sm text-white/50">
        {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default AligningPhase;
