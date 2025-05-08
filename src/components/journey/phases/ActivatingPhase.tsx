
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import { Button } from '@/components/ui/button';
import { createTone } from '@/utils/audioUtils';
import { Star } from 'lucide-react';

interface ActivatingPhaseProps {
  onComplete: () => void;
  chakra?: ChakraTag;
  frequency?: number;
  script?: string;
}

// Sacred geometry SVG components
const SacredGeometryOverlay: React.FC<{ chakra?: ChakraTag }> = ({ chakra }) => {
  const chakraColor = getChakraColor(chakra) || '#FFFFFF';
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        className="relative"
      >
        <svg
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full max-w-full max-h-full"
        >
          {/* Seed of life pattern */}
          <circle cx="300" cy="300" r="100" stroke={chakraColor} strokeWidth="1" />
          <circle cx="300" cy="200" r="100" stroke={chakraColor} strokeWidth="1" />
          <circle cx="300" cy="400" r="100" stroke={chakraColor} strokeWidth="1" />
          <circle cx="200" cy="300" r="100" stroke={chakraColor} strokeWidth="1" />
          <circle cx="400" cy="300" r="100" stroke={chakraColor} strokeWidth="1" />
          <circle cx="386.6" cy="213.4" r="100" stroke={chakraColor} strokeWidth="1" />
          <circle cx="213.4" cy="213.4" r="100" stroke={chakraColor} strokeWidth="1" />
          <circle cx="213.4" cy="386.6" r="100" stroke={chakraColor} strokeWidth="1" />
          <circle cx="386.6" cy="386.6" r="100" stroke={chakraColor} strokeWidth="1" />
          
          {/* Outer circle */}
          <circle
            cx="300"
            cy="300"
            r="200"
            stroke={chakraColor}
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>
      </motion.div>
    </div>
  );
};

const ActivatingPhase: React.FC<ActivatingPhaseProps> = ({ 
  onComplete,
  chakra,
  frequency,
  script
}) => {
  const [activationStage, setActivationStage] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [showEnergyPulse, setShowEnergyPulse] = useState(false);
  const toneRef = useRef<{ play: () => void; stop: () => void } | null>(null);

  // Auto-progress through activation stages
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setActivationStage(prev => {
        if (prev >= 3) {
          clearInterval(stageInterval);
          setTimeout(() => onComplete(), 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 15000); // Each stage lasts 15 seconds
    
    // Energy level increases over time
    const energyInterval = setInterval(() => {
      setEnergyLevel(prev => Math.min(prev + 1, 100));
      
      // Periodic energy pulses
      if (Math.random() > 0.7) {
        setShowEnergyPulse(true);
        setTimeout(() => setShowEnergyPulse(false), 800);
        
        // Play frequency tone if available
        if (frequency) {
          if (!toneRef.current) {
            toneRef.current = createTone(frequency);
          }
          toneRef.current.play();
        }
      }
    }, 500);
    
    return () => {
      clearInterval(stageInterval);
      clearInterval(energyInterval);
      if (toneRef.current) {
        toneRef.current.stop();
      }
    };
  }, [onComplete, frequency]);

  // Get spiral parameters that evolve with activation stage
  const getSpiralParams = () => {
    const baseParams = {
      coeffA: 1.0 + activationStage * 0.2,
      coeffB: 0.8 + activationStage * 0.1,
      freqA: 3.0 + activationStage * 1.0,
      freqB: 4.0 + activationStage * 0.5,
      color: '255,255,255',
      opacity: 60 + activationStage * 10,
      strokeWeight: 1.0 + activationStage * 0.2,
      maxCycles: 3 + activationStage,
      speed: 0.2 + activationStage * 0.1
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

  // Get activation message based on stage
  const getActivationMessage = () => {
    switch (activationStage) {
      case 0:
        return "Energy Awakening";
      case 1:
        return "Energy Expanding";
      case 2:
        return "Energy Integrating";
      case 3:
        return "Energy Stabilizing";
      default:
        return "Energy Activating";
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[60vh]">
      {/* Background spiral with evolving parameters */}
      <div className="absolute inset-0 z-0">
        <SpiralVisualizer 
          params={getSpiralParams()}
          containerId="activating-spiral"
        />
      </div>
      
      {/* Sacred geometry overlay */}
      <SacredGeometryOverlay chakra={chakra} />
      
      {/* Energy pulse effect */}
      {showEnergyPulse && (
        <motion.div
          initial={{ opacity: 0.8, scale: 0.2 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: `rgba(${getSpiralParams().color}, 0.1)`,
            boxShadow: `0 0 80px rgba(${getSpiralParams().color}, 0.4)`
          }}
        />
      )}
      
      <div className="relative z-10 max-w-md mx-auto text-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold mb-2 text-white">
            {getActivationMessage()}
          </h2>
          
          <p className="text-white/70 mb-6">
            {chakra ? `${chakra} Energy: ${energyLevel}%` : `Energy Level: ${energyLevel}%`}
          </p>
          
          {/* Energy progress bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-6">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${energyLevel}%`,
                backgroundColor: getChakraColor(chakra) || '#FFFFFF'
              }}
            />
          </div>
          
          {/* XP indicators */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            {[...Array(activationStage + 1)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
              >
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>
          
          {frequency && (
            <p className="text-white/60 text-sm mt-6">
              {frequency}Hz • {chakra || 'Sacred'} Frequency Activation
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ActivatingPhase;
