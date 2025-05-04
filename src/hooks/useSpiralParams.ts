
import { useState, useEffect } from 'react';
import { SpiralParams } from '@/components/visualizer/SpiralVisualizer';

// Default parameters if none are specified
const DEFAULT_PARAMS: SpiralParams = {
  coeffA: 4,
  coeffB: 4,
  coeffC: 1.3,
  freqA: 44,
  freqB: -17,
  freqC: -54
};

// Mapping of journey IDs/slugs to their specific spiral parameters
const journeyParamsMap: Record<string, SpiralParams> = {
  // Default journey (can be used as fallback)
  'default': DEFAULT_PARAMS,
  
  // Heart opening journey
  'heart-center': {
    coeffA: 3,
    coeffB: 5,
    coeffC: 1.5,
    freqA: 36,
    freqB: -24,
    freqC: -42
  },
  
  // Chakra alignment
  'chakra-alignment': {
    coeffA: 7,
    coeffB: 3,
    coeffC: 2,
    freqA: 56,
    freqB: -28,
    freqC: -38
  },
  
  // Meditation journey
  'meditation': {
    coeffA: 2.5,
    coeffB: 2.5,
    coeffC: 2.5,
    freqA: 20,
    freqB: 20,
    freqC: -40
  },
  
  // Add more journeys as needed
};

export function useSpiralParams(journeyId?: string): SpiralParams {
  const [params, setParams] = useState<SpiralParams>(DEFAULT_PARAMS);
  
  useEffect(() => {
    if (journeyId && journeyParamsMap[journeyId]) {
      setParams(journeyParamsMap[journeyId]);
    } else {
      setParams(DEFAULT_PARAMS);
    }
  }, [journeyId]);
  
  return params;
}

export function addJourneyParams(journeyId: string, params: SpiralParams): void {
  journeyParamsMap[journeyId] = params;
}

export default useSpiralParams;
