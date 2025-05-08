
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { extractJourneySections } from '@/utils/parseJourneyMarkdown';
import { useLightbearerProgress } from '@/hooks/useLightbearerProgress';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [activationSteps, setActivationSteps] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);
  const [showXpPoints, setShowXpPoints] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);
  
  const { addPoints } = useLightbearerProgress();
  const chakraColor = getChakraColor(chakra) || '#FFFFFF';
  
  // Parse script for activation steps
  useEffect(() => {
    if (script) {
      const sections = extractJourneySections(script);
      
      // Look for an activation section
      const activationContent = sections['activation'] || sections['activating'] || '';
      
      if (activationContent) {
        // Split by lines, filter empty ones, and clean up
        const steps = activationContent.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'));
        
        // Check if lines start with * or - bullets or numbers
        const bulletPattern = /^[*\-]\s+(.+)$/;
        const numberPattern = /^\d+\.\s+(.+)$/;
        
        const extractedSteps: string[] = [];
        
        steps.forEach(line => {
          const bulletMatch = line.match(bulletPattern);
          const numberMatch = line.match(numberPattern);
          
          if (bulletMatch) {
            extractedSteps.push(bulletMatch[1]);
          } else if (numberMatch) {
            extractedSteps.push(numberMatch[1]);
          } else if (line) {
            extractedSteps.push(line);
          }
        });
        
        if (extractedSteps.length > 0) {
          setActivationSteps(extractedSteps);
          return;
        }
      }
    }
    
    // Default steps if none found in the script
    const defaultSteps = [
      "Feel the energy flowing through your body",
      "Visualize a glowing light in the center of your being",
      "Let this light expand outward, filling your entire energy field"
    ];
    
    // Adjust steps based on chakra
    if (chakra) {
      if (chakra === 'Root') {
        defaultSteps.push("Anchor your energy deep into the Earth");
      } else if (chakra === 'Heart') {
        defaultSteps.push("Allow your heart to radiate compassion in all directions");
      } else if (chakra === 'Third Eye') {
        defaultSteps.push("Open your inner vision to receive clarity and insight");
      } else if (chakra === 'Crown') {
        defaultSteps.push("Connect with the infinite wisdom of the cosmos");
      }
    }
    
    setActivationSteps(defaultSteps);
  }, [script, chakra]);
  
  // Handle step progression
  useEffect(() => {
    if (activated) return;
    
    const interval = setInterval(() => {
      if (currentStep < activationSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Final step reached, mark as activated
        setActivated(true);
        clearInterval(interval);
        
        // Award XP after a short delay
        setTimeout(() => {
          const pointsToAward = 50 + Math.floor(Math.random() * 30);
          setXpAwarded(pointsToAward);
          
          addPoints('journey_activation', pointsToAward, `${chakra || 'Energy'} activation journey completed`)
            .then(result => {
              if (result) {
                console.log('Lightbearer points awarded:', result);
                setShowXpPoints(true);
              }
            })
            .catch(error => {
              console.error('Error awarding lightbearer points:', error);
            });
        }, 1500);
      }
    }, 4000); // Show each step for 4 seconds
    
    return () => clearInterval(interval);
  }, [currentStep, activationSteps.length, activated, addPoints, chakra]);
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[60vh] p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
          {activated ? "Activation Complete" : "Activating"}
        </h2>
        
        <p className="text-white/70 mb-2">
          {activated ? 
            `Your ${chakra || 'energy'} frequency is now activated` : 
            `${chakra || 'Energy'} activation in progress`
          }
        </p>
        
        {frequency && (
          <p className="text-white/60 text-sm">
            Frequency: {frequency}Hz
          </p>
        )}
      </motion.div>
      
      {/* Activation steps display */}
      <div className="w-full max-w-lg mx-auto mb-12">
        {!activated ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="text-center p-6 rounded-lg"
              style={{ 
                backgroundColor: `${chakraColor}15`,
                border: `1px solid ${chakraColor}40`,
                boxShadow: `0 0 20px ${chakraColor}30`
              }}
            >
              <p className="text-xl font-medium text-white">
                {activationSteps[currentStep]}
              </p>
              
              {/* Progress indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {activationSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: index === currentStep ? chakraColor : 'rgba(255,255,255,0.3)'
                    }}
                    animate={index === currentStep ? {
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7]
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center p-8 rounded-lg"
            style={{ 
              backgroundColor: `${chakraColor}20`,
              border: `2px solid ${chakraColor}60`,
              boxShadow: `0 0 30px ${chakraColor}40`
            }}
          >
            <div className="flex justify-center mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: chakraColor }}
              >
                <Sparkles className="h-8 w-8 text-black" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">
              {chakra || "Energy"} Field Activated
            </h3>
            
            <p className="text-white/80 mb-4">
              Your energy body has been tuned to this sacred frequency
            </p>
            
            {/* XP points display */}
            {showXpPoints && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="my-4 py-3 px-4 rounded-md bg-white/10 inline-flex items-center gap-2"
              >
                <span className="text-yellow-300 font-bold">+{xpAwarded} XP</span>
                <span className="text-white/80">Lightbearer Progress</span>
              </motion.div>
            )}
            
            <Button
              onClick={onComplete}
              className="mt-2"
              style={{ backgroundColor: chakraColor }}
              variant="secondary"
            >
              Continue to Integration
            </Button>
          </motion.div>
        )}
      </div>
      
      {!activated && (
        <div className="w-full max-w-md flex justify-end px-4">
          <Button
            onClick={() => setActivated(true)}
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            Skip
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActivatingPhase;
