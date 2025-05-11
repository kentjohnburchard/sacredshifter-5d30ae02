import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import ReactMarkdown from 'react-markdown';

interface ActivatingPhaseProps {
  onComplete: () => void;
  chakra?: ChakraTag;
  frequency?: number;
  script?: string;
}

const ActivatingPhase: React.FC<ActivatingPhaseProps> = ({
  onComplete,
  chakra,
  frequency,
  script
}) => {
  const [activationStep, setActivationStep] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  
  useEffect(() => {
    // Auto-progress through activation steps
    let timer: ReturnType<typeof setTimeout>;
    
    if (activationStep < activationSteps.length - 1) {
      timer = setTimeout(() => {
        setActivationStep(prev => prev + 1);
      }, 10000); // 10 seconds per step
    } else if (activationStep === activationSteps.length - 1 && !showContinue) {
      timer = setTimeout(() => {
        setShowContinue(true);
      }, 10000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [activationStep, showContinue]);
  
  const handleComplete = (e: React.MouseEvent) => {
    // Prevent default behavior to avoid page refresh
    e.preventDefault();
    e.stopPropagation(); // Also stop propagation to prevent parent handlers
    
    console.log("ActivatingPhase handleComplete called");
    onComplete();
  };
  
  const chakraColor = chakra ? getChakraColor(chakra) : '#8B5CF6'; // Default purple
  
  // Get chakra-specific activation steps
  const getActivationStepsForChakra = (): string[] => {
    if (script) {
      // Use script sections if available
      return script.split('\n\n').filter(Boolean).slice(0, 3);
    }
    
    // Otherwise use defaults based on chakra
    switch (chakra) {
      case 'Root':
        return [
          "Visualize a strong red light at the base of your spine.",
          "Feel roots extending from your body deep into the earth.",
          "Sense stability and security flowing through you."
        ];
      case 'Sacral':
        return [
          "Focus on an orange glow in your lower abdomen.",
          "Feel creativity and passion awakening within you.",
          "Allow emotions to flow freely through your body."
        ];
      case 'Solar Plexus':
        return [
          "Envision a bright yellow sun radiating in your upper abdomen.",
          "Feel your personal power and confidence expanding.",
          "Embrace your will and determination being activated."
        ];
      case 'Heart':
        return [
          "Visualize an emerald green light glowing in your chest.",
          "Feel your heart opening to give and receive love.",
          "Allow compassion and healing to radiate from your center."
        ];
      case 'Throat':
        return [
          "See a bright blue light illuminating your throat.",
          "Feel your ability to express your truth strengthening.",
          "Your authentic voice is now being activated."
        ];
      case 'Third Eye':
        return [
          "Envision an indigo light between your eyebrows.",
          "Feel your intuition and inner vision awakening.",
          "Your connection to higher wisdom is activating."
        ];
      case 'Crown':
        return [
          "Visualize a violet or white light above your head.",
          "Feel your connection to universal consciousness opening.",
          "Your highest spiritual awareness is now activating."
        ];
      default:
        return [
          "Feel the energy moving through your entire being.",
          "Your highest vibration is being activated and aligned.",
          "Universal wisdom is flowing through you now."
        ];
    }
  };
  
  const activationSteps = getActivationStepsForChakra();
  
  return (
    <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-white">Activate Your Energy</h2>
      
      <div className="mb-8">
        <div className="w-full bg-white/10 h-1 rounded-full mb-6">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: chakraColor }}
            initial={{ width: "0%" }}
            animate={{ width: `${((activationStep + 1) / activationSteps.length) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        
        <AnimatedContent key={activationStep}>
          <div className="prose prose-invert max-w-none text-center">
            <ReactMarkdown>{activationSteps[activationStep]}</ReactMarkdown>
          </div>
        </AnimatedContent>
      </div>
      
      <div className="flex justify-center items-center">
        {showContinue ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-2"
              style={{ backgroundColor: chakraColor, color: 'white' }}
            >
              Continue to Integration
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        ) : (
          <div className="text-white/70 text-sm">
            {activationStep + 1} of {activationSteps.length}
          </div>
        )}
      </div>
    </div>
  );
};

// Animated content wrapper
const AnimatedContent: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default ActivatingPhase;
