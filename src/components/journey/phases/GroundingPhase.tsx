
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface GroundingPhaseProps {
  onComplete: () => void;
  chakra?: ChakraTag;
  intent?: string;
  frequency?: number;
}

const BreathingCircle: React.FC<{ chakra?: ChakraTag }> = ({ chakra }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(0);
  
  // Breathing timing in seconds
  const timings = {
    inhale: 4,
    hold: 4,
    exhale: 6,
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (phase === 'inhale') {
      timer = setTimeout(() => {
        setPhase('hold');
        setCount(0);
      }, timings.inhale * 1000);
    } else if (phase === 'hold') {
      timer = setTimeout(() => {
        setPhase('exhale');
        setCount(0);
      }, timings.hold * 1000);
    } else if (phase === 'exhale') {
      timer = setTimeout(() => {
        setPhase('inhale');
        setCount(0);
      }, timings.exhale * 1000);
    }
    
    return () => clearTimeout(timer);
  }, [phase]);

  // Update count every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const chakraColor = getChakraColor(chakra) || '#FFFFFF';
  const maxSize = 300; // Maximum size of breathing circle
  const minSize = 100; // Minimum size

  const getSize = () => {
    switch (phase) {
      case 'inhale':
        return minSize + (maxSize - minSize) * (count / timings.inhale);
      case 'hold':
        return maxSize;
      case 'exhale':
        return maxSize - (maxSize - minSize) * (count / timings.exhale);
      default:
        return minSize;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <motion.div 
        className="rounded-full relative"
        style={{
          width: getSize(),
          height: getSize(),
          backgroundColor: `${chakraColor}15`,
          border: `2px solid ${chakraColor}40`,
          boxShadow: `0 0 30px ${chakraColor}30`,
          transition: 'all 1s ease-in-out'
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      />
      
      <div className="mt-10 text-center text-white text-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="capitalize"
          >
            {phase}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const GroundingPhase: React.FC<GroundingPhaseProps> = ({ 
  onComplete,
  chakra,
  intent,
  frequency
}) => {
  const [started, setStarted] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const requiredBreaths = 3; // Number of full breath cycles required
  
  useEffect(() => {
    // If already started, count breath cycles
    if (started) {
      const breathTimer = setInterval(() => {
        setBreathCount(prev => {
          const newCount = prev + 1;
          
          // Auto-complete after required number of breaths
          if (newCount >= requiredBreaths) {
            clearInterval(breathTimer);
            setTimeout(() => onComplete(), 2000); // Delay completion for a smoother transition
          }
          
          return newCount;
        });
      }, 14000); // One full breath cycle (4s inhale + 4s hold + 6s exhale)
      
      return () => clearInterval(breathTimer);
    }
  }, [started, onComplete]);

  // Get spiral parameters based on chakra
  const getSpiralParams = () => {
    const baseParams = {
      coeffA: 0.8,
      coeffB: 1.2,
      freqA: 3.2,
      freqB: 4.1,
      color: '255,255,255',
      opacity: 40,
      strokeWeight: 0.8,
      maxCycles: 3,
      speed: 0.1
    };
    
    if (chakra) {
      // Adjust color based on chakra
      switch (chakra) {
        case 'Root':
          baseParams.color = '255,0,0';
          break;
        case 'Sacral':
          baseParams.color = '255,127,0';
          break;
        case 'Solar Plexus':
          baseParams.color = '255,255,0';
          break;
        case 'Heart':
          baseParams.color = '0,255,0';
          break;
        case 'Throat':
          baseParams.color = '0,255,255';
          break;
        case 'Third Eye':
          baseParams.color = '0,0,255';
          break;
        case 'Crown':
          baseParams.color = '139,0,255';
          break;
        default:
          baseParams.color = '255,255,255';
      }
    }
    
    return baseParams;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[60vh]">
      {/* Background spiral */}
      <div className="absolute inset-0 z-0">
        <SpiralVisualizer 
          params={getSpiralParams()}
          containerId="grounding-spiral"
        />
      </div>
      
      <div className="relative z-10 max-w-md mx-auto text-center p-6">
        {!started ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-white">Prepare to Begin</h2>
            {intent && (
              <p className="text-white/80 mb-6">{intent}</p>
            )}
            <Button 
              onClick={() => setStarted(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Play className="mr-2 h-4 w-4" /> Begin Breathwork
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <h3 className="text-xl font-medium mb-8 text-white">
              Follow the breath...
            </h3>
            
            <BreathingCircle chakra={chakra} />
            
            <div className="mt-8 text-white/70">
              <p>Cycle {breathCount + 1} of {requiredBreaths}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GroundingPhase;
