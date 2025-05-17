
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
    
    if (isBreathing) {
      // Set up automatic breathing cycle
      breathTimer = setTimeout(() => {
        if (breathCount < 2) {
          // Continue to the next breath automatically
          setBreathCount(prev => prev + 1);
        } else {
          // After 3 breaths, show continue button
          setBreathCount(3);
          setIsBreathing(false);
          setShowContinue(true);
        }
      }, 6000); // 6 seconds for a complete breath cycle
    }
    
    return () => {
      if (breathTimer) clearTimeout(breathTimer);
    };
  }, [isBreathing, breathCount]);

  const handleStartBreathing = () => {
    setIsBreathing(true);
  };

  const handleComplete = (e?: React.MouseEvent) => {
    // Prevent any default behavior and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Use ref to prevent duplicate calls
    if (completionRef.current) return;
    completionRef.current = true;
    
    console.log("GroundingPhase handleComplete called - completing phase");
    onComplete();
  };

  const chakraColor = chakra ? getChakraColor(chakra) : '#8B5CF6'; // Default purple

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-black/80">
      <div className="max-w-3xl w-full h-full flex flex-col justify-center items-center p-6">
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
        
        <div className="flex justify-center mb-8 relative">
          {/* Large breathing visualizer that fills most of the screen */}
          <div className="relative w-64 h-64 md:w-96 md:h-96">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: `${chakraColor}20`, border: `2px solid ${chakraColor}40` }}
              animate={isBreathing ? 
                { scale: [1, 1.5, 1], opacity: [0.5, 0.7, 0.5] } : 
                { scale: 1, opacity: 0.5 }
              }
              transition={{ duration: 6, ease: "easeInOut", repeat: 0 }}
            />
            
            {/* Larger, more prominent counter */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold">
              {breathCount}/3
            </div>
            
            {/* Additional visual elements to enhance the experience */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `1px solid ${chakraColor}80` }}
              animate={isBreathing ? 
                { scale: [1, 1.7, 1], opacity: [0.3, 0.5, 0.3] } : 
                { scale: 1.2, opacity: 0.3 }
              }
              transition={{ duration: 6, ease: "easeInOut", repeat: 0 }}
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center z-20">
          {breathCount < 3 && !isBreathing && (
            <Button
              onClick={handleStartBreathing}
              className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md mb-4"
              type="button"
            >
              {breathCount === 0 ? "Begin Breathing" : "Continue Breathing"}
            </Button>
          )}
          
          {isBreathing && (
            <div className="text-white text-xl mb-4">
              {breathCount === 0 ? "Inhale..." : breathCount === 1 ? "Deeper..." : "Final breath..."}
            </div>
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
                type="button" 
              >
                Continue to Alignment
                <ChevronRight size={18} />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroundingPhase;
