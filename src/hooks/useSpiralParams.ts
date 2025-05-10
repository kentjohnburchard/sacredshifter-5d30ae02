
import { useState, useEffect } from 'react';
import { fetchSpiralParams } from '@/services/spiralParamService';
import { ChakraTag } from '@/types/chakras';

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
export const paramsCache: Record<string, SpiralParams> = {};

// Chakra color mappings for default parameters
const chakraColorMap: Record<ChakraTag, string> = {
  'Root': '255,50,50', // Red
  'Sacral': '255,150,50', // Orange
  'Solar Plexus': '255,255,50', // Yellow
  'Heart': '50,255,50', // Green
  'Throat': '50,150,255', // Blue
  'Third Eye': '75,0,255', // Indigo
  'Crown': '200,100,255' // Violet
};

/**
 * Hook to get spiral parameters for a journey
 */
export const useSpiralParams = () => {
  // Set default params with verified sacred geometry values
  const [params, setParams] = useState<SpiralParams>({
    coeffA: 1.2,
    coeffB: 0.9,
    coeffC: 0.6,
    freqA: 4.1,
    freqB: 3.6,
    freqC: 2.8,
    color: '180,180,255', // Default blue
    opacity: 80,
    strokeWeight: 0.5,
    maxCycles: 5,
    speed: 0.0003 // Extremely slow for meditative unfolding
  });

  const getDefaultParamsForChakra = (chakra: ChakraTag): SpiralParams => {
    // Create chakra-specific parameters
    const chakraParams: SpiralParams = {
      ...params,
      color: chakraColorMap[chakra] || '180,180,255'
    };
    
    // Customize based on chakra
    switch(chakra) {
      case 'Root':
        return {
          ...chakraParams,
          coeffA: 1.5,
          coeffB: 1.2,
          freqA: 3.0,
          freqB: 2.0,
          maxCycles: 3
        };
      case 'Sacral':
        return {
          ...chakraParams,
          coeffA: 1.3,
          coeffB: 1.1,
          freqA: 3.5,
          freqB: 2.5,
          maxCycles: 4
        };
      case 'Solar Plexus':
        return {
          ...chakraParams,
          coeffA: 1.2,
          coeffB: 1.0,
          freqA: 4.0,
          freqB: 3.0,
          maxCycles: 4
        };
      case 'Heart':
        return {
          ...chakraParams,
          coeffA: 1.1,
          coeffB: 0.9,
          freqA: 4.5,
          freqB: 3.5,
          maxCycles: 5
        };
      case 'Throat':
        return {
          ...chakraParams,
          coeffA: 1.0,
          coeffB: 0.8,
          freqA: 5.0,
          freqB: 4.0,
          maxCycles: 5
        };
      case 'Third Eye':
        return {
          ...chakraParams,
          coeffA: 0.9,
          coeffB: 0.7,
          freqA: 5.5,
          freqB: 4.5,
          maxCycles: 6
        };
      case 'Crown':
        return {
          ...chakraParams,
          coeffA: 0.8,
          coeffB: 0.6,
          freqA: 6.0,
          freqB: 5.0,
          maxCycles: 7
        };
      default:
        return chakraParams;
    }
  };

  return {
    params,
    setParams,
    getDefaultParamsForChakra
  };
};

// Export the default hook directly
export default useSpiralParams;
