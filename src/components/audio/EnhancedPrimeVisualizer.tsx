
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface EnhancedPrimeVisualizerProps {
  primes: number[];
  frequency?: number;
  isPlaying: boolean;
}

const EnhancedPrimeVisualizer: React.FC<EnhancedPrimeVisualizerProps> = ({ 
  primes, 
  frequency,
  isPlaying 
}) => {
  const { liftTheVeil } = useTheme();
  const [latestPrime, setLatestPrime] = useState<number | null>(null);
  const [showPrimeEffect, setShowPrimeEffect] = useState(false);
  
  // Update latest prime when primes array changes
  useEffect(() => {
    if (primes.length > 0) {
      const newPrime = primes[primes.length - 1];
      if (newPrime !== latestPrime) {
        setLatestPrime(newPrime);
        triggerPrimeEffect();
      }
    }
  }, [primes]);
  
  // Trigger the prime effect animation
  const triggerPrimeEffect = () => {
    setShowPrimeEffect(true);
    setTimeout(() => setShowPrimeEffect(false), 2000);
  };
  
  // Get chakra color based on frequency
  const getChakraColor = () => {
    if (!frequency) return 'rgb(138, 43, 226)'; // Default purple
    
    if (frequency < 256) return 'rgb(255, 0, 0)'; // Root - Red
    if (frequency < 396) return 'rgb(255, 165, 0)'; // Sacral - Orange
    if (frequency < 417) return 'rgb(255, 255, 0)'; // Solar Plexus - Yellow
    if (frequency < 528) return 'rgb(0, 255, 0)'; // Heart - Green
    if (frequency < 639) return 'rgb(0, 191, 255)'; // Throat - Blue
    if (frequency < 852) return 'rgb(75, 0, 130)'; // Third Eye - Indigo
    return 'rgb(138, 43, 226)'; // Crown - Violet
  };
  
  // Customize color based on theme and frequency
  const visualizerColor = liftTheVeil 
    ? 'rgba(255, 54, 171, 0.8)' // Pink for lifted veil
    : getChakraColor();
    
  const barCount = 32; // Number of frequency bars
  
  // Generate fake frequency data for visualization
  const generateBars = () => {
    if (!isPlaying) return Array(barCount).fill(5);
    
    return Array(barCount).fill(0).map((_, i) => {
      // Create a varying height pattern
      const center = barCount / 2;
      const distFromCenter = Math.abs(i - center);
      const baseHeight = Math.random() * 30 + 5;
      const heightModifier = 1 - (distFromCenter / center) * 0.5;
      
      return baseHeight * heightModifier;
    });
  };
  
  const barHeights = generateBars();
  
  return (
    <div className="relative">
      {/* Frequency visualization bars */}
      <div className="flex items-end h-16 gap-[1px] mb-1">
        {barHeights.map((height, i) => (
          <motion.div
            key={i}
            initial={{ height: 5 }}
            animate={{ height: `${height}px` }}
            transition={{ duration: 0.1 }}
            style={{ backgroundColor: visualizerColor, opacity: 0.7 + (height / 100) }}
            className="w-1 rounded-t"
          />
        ))}
      </div>
      
      {/* Current frequency display */}
      <div className="flex justify-between items-center text-xs">
        <span className={`font-mono ${liftTheVeil ? 'text-pink-300' : 'text-indigo-300'}`}>
          {frequency ? `${frequency.toFixed(2)} Hz` : 'No frequency'}
        </span>
        {latestPrime && (
          <span className={`font-mono ${liftTheVeil ? 'text-pink-400' : 'text-purple-400'}`}>
            Prime: {latestPrime}
          </span>
        )}
      </div>
      
      {/* Prime number effect overlay */}
      {showPrimeEffect && (
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0.8 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div 
            className={`w-24 h-24 rounded-full flex items-center justify-center
              ${liftTheVeil ? 'bg-pink-500/30' : 'bg-purple-500/30'} backdrop-blur-sm`}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
              className={`text-lg font-bold ${liftTheVeil ? 'text-pink-200' : 'text-purple-200'}`}
            >
              {latestPrime}
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedPrimeVisualizer;
