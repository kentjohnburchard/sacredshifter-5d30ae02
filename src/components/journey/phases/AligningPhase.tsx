import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import ReactMarkdown from 'react-markdown';

interface AligningPhaseProps {
  onComplete: () => void;
  chakra?: ChakraTag;
  frequency?: number;
  audioFile?: string;
  script?: string;
}

const AligningPhase: React.FC<AligningPhaseProps> = ({
  onComplete,
  chakra,
  frequency,
  audioFile,
  script
}) => {
  const [showContinue, setShowContinue] = useState(false);
  const [countdown, setCountdown] = useState(30); // 30 seconds alignment period
  
  // Auto-show continue button after timer or when audio ends
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && !showContinue) {
      setShowContinue(true);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, showContinue]);

  const handleComplete = (e: React.MouseEvent) => {
    // Prevent default behavior to avoid page refresh
    e.preventDefault();
    e.stopPropagation(); // Also stop propagation to prevent parent handlers
    
    console.log("AligningPhase handleComplete called");
    onComplete();
  };

  // Allow users to skip ahead
  const handleSkip = () => {
    setCountdown(0);
    setShowContinue(true);
  };

  const chakraColor = chakra ? getChakraColor(chakra) : '#8B5CF6'; // Default purple
  
  // Get chakra-specific guidance text if no script provided
  const getDefaultGuidanceForChakra = () => {
    switch (chakra) {
      case 'Root':
        return "Focus on your Root chakra at the base of your spine. Feel connected to the earth beneath you, anchoring you with stability and security.";
      case 'Sacral':
        return "Draw your attention to your Sacral chakra below your navel. Feel creative energy flowing, bringing passion and emotional fluidity.";
      case 'Solar Plexus':
        return "Center on your Solar Plexus chakra above your navel. Sense your personal power activate, bringing confidence and strength.";
      case 'Heart':
        return "Bring awareness to your Heart chakra in the center of your chest. Feel it opening to unconditional love, compassion, and healing.";
      case 'Throat':
        return "Focus on your Throat chakra at the center of your throat. Feel it clearing, allowing authentic self-expression and truth.";
      case 'Third Eye':
        return "Draw attention to your Third Eye chakra between your eyebrows. Feel it awakening your intuition, inner vision, and higher wisdom.";
      case 'Crown':
        return "Bring awareness to your Crown chakra at the top of your head. Feel it opening to universal consciousness and divine connection.";
      default:
        return "Focus on your breath as you align with your highest vibration. Feel the energy moving through your body, balancing and harmonizing.";
    }
  };

  // Content for display
  const alignmentContent = script || getDefaultGuidanceForChakra();
  
  return (
    <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-white">Align Your Energy</h2>
      
      <div className="mb-8 text-center">
        {chakra && (
          <div 
            className="inline-block px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: `${chakraColor}30`, border: `1px solid ${chakraColor}` }}
          >
            <span className="text-white">{chakra} Chakra</span>
          </div>
        )}
        
        <div className="prose prose-invert max-w-none mb-6">
          <ReactMarkdown>{alignmentContent}</ReactMarkdown>
        </div>
        
        {frequency && (
          <div className="flex justify-center items-center gap-2 text-sm text-white/70 mb-2">
            <Music size={14} />
            <span>{frequency}Hz frequency is now active</span>
          </div>
        )}
        
        {audioFile && (
          <p className="text-purple-300/80 text-sm">
            Audio is playing. Allow the sounds to guide your experience.
          </p>
        )}
      </div>
      
      <div className="flex justify-center mb-6">
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: `${chakraColor}20`,
            border: `3px solid ${chakraColor}50`
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
            borderColor: [
              `${chakraColor}30`,
              `${chakraColor}70`,
              `${chakraColor}30`
            ]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="text-center">
            <div className="text-white text-xl">{countdown}</div>
            <div className="text-white/60 text-xs">seconds</div>
          </div>
        </motion.div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {!showContinue && countdown > 5 && (
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-white/70 hover:text-white"
          >
            Skip Ahead
          </Button>
        )}
        
        {(showContinue || countdown <= 5) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-2"
              style={{ 
                backgroundColor: chakraColor,
                color: 'white'
              }}
            >
              Continue to Activation
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AligningPhase;
