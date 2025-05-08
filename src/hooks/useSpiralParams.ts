import { useState, useEffect } from 'react';

export interface SpiralParams {
  coeffA: number;
  coeffB: number;
  coeffC: number;
  freqA: number;
  freqB: number;
  freqC: number;
  color: string;
  opacity: number;
  strokeWeight: number;
  maxCycles: number;
  speed: number;
}

// Cache to store params by journey ID
const paramsCache: Record<string, SpiralParams> = {};

/**
 * Hook to get spiral parameters for a journey
 * Simplified version that returns default parameters
 */
const useSpiralParams = (journeyId?: string) => {
  const [params, setParams] = useState<SpiralParams>({
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
    try {
      if (journeyId) {
        console.log(`Loading spiral params for journey: ${journeyId}`);
        
        // Check if we already have cached params
        if (paramsCache[journeyId]) {
          setParams(paramsCache[journeyId]);
          return;
        }
        
        // In a real implementation, this would fetch parameters from an API
        // For now, returning slightly randomized defaults for different journeys
        const hash = journeyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        const newParams = {
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
        };
        
        // Cache the parameters
        paramsCache[journeyId] = newParams;
        setParams(newParams);
      }
    } catch (error) {
      console.error("Error in useSpiralParams:", error);
      // Keep using default params on error
    }
  }, [journeyId]);

  return params;
};

// Export the interface and hook
export default useSpiralParams;
export { paramsCache };
