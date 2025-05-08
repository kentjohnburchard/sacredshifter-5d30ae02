
import { useState, useEffect } from 'react';

/**
 * Hook to get spiral parameters for a journey
 * Simplified version that returns default parameters
 */
const useSpiralParams = (journeyId?: string) => {
  const [params, setParams] = useState({
    coeffA: 4,
    coeffB: 4,
    coeffC: 1.3,
    freqA: 44,
    freqB: -17,
    freqC: -54,
    color: '180,180,255', // Default blue
    opacity: 80,
    strokeWeight: 0.5,
    maxCycles: 5,
    speed: 0.001
  });

  useEffect(() => {
    if (journeyId) {
      console.log(`Loading spiral params for journey: ${journeyId}`);
      
      // In a real implementation, this would fetch parameters from an API
      // For now, returning slightly randomized defaults for different journeys
      const hash = journeyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      setParams({
        coeffA: 3 + (hash % 5),
        coeffB: 3 + ((hash * 2) % 5),
        coeffC: 1 + (hash % 2),
        freqA: 40 + (hash % 20),
        freqB: -20 + (hash % 10),
        freqC: -60 + (hash % 20),
        color: `${100 + (hash % 155)},${100 + ((hash * 2) % 155)},${100 + ((hash * 3) % 155)}`,
        opacity: 70 + (hash % 30),
        strokeWeight: 0.3 + ((hash % 10) / 10),
        maxCycles: 4 + (hash % 3),
        speed: 0.0005 + ((hash % 10) / 10000)
      });
    }
  }, [journeyId]);

  return params;
};

export default useSpiralParams;
