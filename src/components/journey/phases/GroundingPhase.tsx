
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChakraTag, getChakraColor } from '@/types/chakras';

interface GroundingPhaseProps {
  onComplete: () => void;
  chakra?: ChakraTag;
  intent?: string;
  frequency?: number;
}

const GroundingPhase: React.FC<GroundingPhaseProps> = ({
  onComplete,
  chakra,
  intent,
  frequency
}) => {
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const completionRef = useRef(false);

  // Breath animation controller
  useEffect(() => {
    let breathTimer: ReturnType<typeof setTimeout>;
    
    if (isBreathing && breathCount < 3) {
      breathTimer = setTimeout(() => {
        setBreathCount(prev => prev + 1);
        setIsBreathing(false);
      }, 6000); // 6 seconds for a complete breath cycle
    } else if (breathCount >= 3 && !showContinue) {
      // Show continue button after 3 breaths
      setShowContinue(true);
    }
    
    return () => {
      if (breathTimer) clearTimeout(breathTimer);
    };
  }, [isBreathing, breathCount, showContinue]);

  const handleStartBreathing = () => {
    setIsBreathing(true);
  };

  const handleComplete = () => {
    // Use ref to prevent duplicate calls
    if (completionRef.current) return;
    completionRef.current = true;
    
    console.log("GroundingPhase handleComplete called - completing phase");
    onComplete();
  };

  const chakraColor = chakra ? getChakraColor(chakra) : '#8B5CF6'; // Default purple

  return (
    <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-white">Ground Your Energy</h2>
      
      <div className="mb-8 text-center">
        {intent && (
          <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4 mb-6">
            <h3 className="text-xl font-medium text-white mb-2">Your Intention</h3>
            <p className="text-white/80 italic">{intent}</p>
          </div>
        )}
        
        <p className="text-lg text-white/90 mb-4">
          Begin by taking three deep breaths to ground your energy and prepare for this experience.
        </p>
        
        {frequency && (
          <div className="flex justify-center items-center gap-2 text-sm text-white/70 mb-4">
            <Info size={14} />
            <span>This journey incorporates {frequency}Hz frequencies</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: `${chakraColor}20`, border: `2px solid ${chakraColor}40` }}
            animate={isBreathing ? 
              { scale: [1, 1.5, 1], opacity: [0.5, 0.7, 0.5] } : 
              { scale: 1, opacity: 0.5 }
            }
            transition={{ duration: 6, ease: "easeInOut", repeat: 0 }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
            {breathCount}/3
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        {breathCount < 3 && (
          <Button
            onClick={handleStartBreathing}
            disabled={isBreathing}
            className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md mb-4"
          >
            {isBreathing ? "Breathe..." : breathCount === 0 ? "Begin Breathing" : "Next Breath"}
          </Button>
        )}
        
        {showContinue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              onClick={handleComplete}
              disabled={completionRef.current}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md"
            >
              Continue to Alignment
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GroundingPhase;
