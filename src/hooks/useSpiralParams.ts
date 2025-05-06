
import { useState, useEffect } from 'react';
import type { SpiralParams } from '@/components/visualizer/SpiralVisualizer';
import { fetchSpiralParams } from '@/services/spiralParamService';

// Default parameters if none are specified
const DEFAULT_PARAMS: SpiralParams = {
  coeffA: 4,
  coeffB: 4,
  coeffC: 1.3,
  freqA: 44,
  freqB: -17,
  freqC: -54
};

// Frequency-specific mappings
const frequencyParamsMap: Record<string, SpiralParams> = {
  // Common Solfeggio frequencies
  '396': {
    coeffA: 3.96,
    coeffB: 4,
    coeffC: 1.2,
    freqA: 39,
    freqB: -20,
    freqC: -40,
    color: '100,120,190',
  },
  '417': {
    coeffA: 4.17,
    coeffB: 3.8,
    coeffC: 1.4,
    freqA: 41,
    freqB: -22,
    freqC: -44,
    color: '200,100,50',
  },
  '528': {
    coeffA: 5.28,
    coeffB: 4.2,
    coeffC: 1.6,
    freqA: 52,
    freqB: -26,
    freqC: -48,
    color: '50,220,100',
  },
  '639': {
    coeffA: 6.39,
    coeffB: 4.5,
    coeffC: 1.8,
    freqA: 63,
    freqB: -30,
    freqC: -52,
    color: '220,50,120',
  },
  '741': {
    coeffA: 7.41,
    coeffB: 5,
    coeffC: 2,
    freqA: 74,
    freqB: -32,
    freqC: -58,
    color: '80,130,240',
  },
  '852': {
    coeffA: 8.52,
    coeffB: 5.5,
    coeffC: 2.2,
    freqA: 85,
    freqB: -34,
    freqC: -62,
    color: '190,190,240',
  },
  '963': {
    coeffA: 9.63,
    coeffB: 6,
    coeffC: 2.4,
    freqA: 96,
    freqB: -38,
    freqC: -68,
    color: '220,180,255',
  },
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
    freqC: -42,
    color: '255,100,150'
  },
  
  // Chakra alignment
  'chakra-alignment': {
    coeffA: 7,
    coeffB: 3,
    coeffC: 2,
    freqA: 56,
    freqB: -28,
    freqC: -38,
    color: '180,120,255'
  },
  
  // Meditation journey
  'meditation': {
    coeffA: 2.5,
    coeffB: 2.5,
    coeffC: 2.5,
    freqA: 20,
    freqB: 20,
    freqC: -40,
    color: '100,150,255'
  },
  
  // Akashic Reconnection
  'akashic-reconnection': {
    coeffA: 6,
    coeffB: 3,
    coeffC: 1.5,
    freqA: 50,
    freqB: -30,
    freqC: -45,
    color: '180,220,255',
    opacity: 90
  },
  
  // Divine Love
  'divine-love': {
    coeffA: 5,
    coeffB: 4.5,
    coeffC: 1.7,
    freqA: 58,
    freqB: -24,
    freqC: -48,
    color: '255,150,200',
    opacity: 85
  },
  
  // Cosmic Alignment
  'cosmic-alignment': {
    coeffA: 8,
    coeffB: 5,
    coeffC: 2.2,
    freqA: 64,
    freqB: -32,
    freqC: -52,
    color: '140,180,255',
    opacity: 80
  },
  
  // Inner Peace
  'inner-peace': {
    coeffA: 3.5,
    coeffB: 3.5,
    coeffC: 1.5,
    freqA: 40,
    freqB: -20,
    freqC: -40,
    color: '200,230,255',
    opacity: 75
  },
  
  // Journey templates matching
  'silent-tune': {
    coeffA: 4.2,
    coeffB: 3.8,
    coeffC: 1.6,
    freqA: 40,
    freqB: -22,
    freqC: -45,
    color: '150,190,255',
    opacity: 80
  },
  
  'chakra-harmony': {
    coeffA: 6,
    coeffB: 4.7,
    coeffC: 2,
    freqA: 60,
    freqB: -30,
    freqC: -50,
    color: '180,120,240',
    opacity: 85
  },
  
  'deep-sleep': {
    coeffA: 3,
    coeffB: 3,
    coeffC: 1.5,
    freqA: 30,
    freqB: -15,
    freqC: -35,
    color: '100,130,220',
    opacity: 70
  },
  
  'focus-flow': {
    coeffA: 5,
    coeffB: 4,
    coeffC: 1.8,
    freqA: 50,
    freqB: -25,
    freqC: -48,
    color: '80,160,255',
    opacity: 75
  },
  
  'anxiety-release': {
    coeffA: 4,
    coeffB: 3.5,
    coeffC: 1.4,
    freqA: 38,
    freqB: -19,
    freqC: -42,
    color: '140,200,230',
    opacity: 80
  },
  
  'creativity-boost': {
    coeffA: 7,
    coeffB: 5,
    coeffC: 2.2,
    freqA: 70,
    freqB: -35,
    freqC: -55,
    color: '220,150,255',
    opacity: 85
  },
  
  'sacred-spectrum': {
    coeffA: 5.28,
    coeffB: 4.2,
    coeffC: 1.7,
    freqA: 52,
    freqB: -26,
    freqC: -48,
    color: '120,180,255',
    opacity: 80
  },
};

export function useSpiralParams(journeyId?: string): SpiralParams {
  const [params, setParams] = useState<SpiralParams>(DEFAULT_PARAMS);
  
  useEffect(() => {
    if (!journeyId) {
      setParams(DEFAULT_PARAMS);
      return;
    }
    
    const loadParams = async () => {
      // First check for direct journey ID match in memory cache
      if (journeyParamsMap[journeyId]) {
        setParams(journeyParamsMap[journeyId]);
        return;
      }
      
      // Then try to load from database
      try {
        const dbParams = await fetchSpiralParams(journeyId);
        if (dbParams) {
          setParams(dbParams);
          return;
        }
      } catch (error) {
        console.error(`Error loading spiral params for journey ${journeyId}:`, error);
      }
      
      // Check if journeyId contains a frequency number
      const frequencyMatch = journeyId.match(/(\d+)(?:hz)?/i);
      if (frequencyMatch) {
        const freq = frequencyMatch[1];
        if (frequencyParamsMap[freq]) {
          setParams(frequencyParamsMap[freq]);
          return;
        }
      }
      
      // Fallback to default
      setParams(DEFAULT_PARAMS);
    };
    
    loadParams();
  }, [journeyId]);
  
  return params;
}

export function addJourneyParams(journeyId: string, params: SpiralParams): void {
  journeyParamsMap[journeyId] = params;
}

export function getAllJourneyParams(): Record<string, SpiralParams> {
  return { ...journeyParamsMap };
}

export type { SpiralParams };
export default useSpiralParams;
