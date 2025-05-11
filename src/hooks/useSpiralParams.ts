
import { useState, useEffect, useCallback } from 'react';
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

// Ultra-stable default spiral parameters with reduced speeds
const defaultParams: SpiralParams = {
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
  speed: 0.00001 // Ultra slow for maximum stability
};

// Chakra color mappings for default parameters
const chakraColorMap: Partial<Record<ChakraTag, string>> = {
  'Root': '255,50,50', // Red
  'Sacral': '255,150,50', // Orange
  'Solar Plexus': '255,255,50', // Yellow
  'Heart': '50,255,50', // Green
  'Throat': '50,150,255', // Blue
  'Third Eye': '75,0,255', // Indigo
  'Crown': '200,100,255', // Violet
  
  // Adding the missing ChakraTag values
  'Transpersonal': '255,255,255',
  'Cosmic': '255,255,255',
  'Earth Star': '100,70,40',
  'Soul Star': '240,240,255'
};

/**
 * Hook to get spiral parameters for a journey with improved stability
 */
const useSpiralParams = (journeyId?: string) => {
  // Set default params with verified sacred geometry values
  const [params, setParams] = useState<SpiralParams>(defaultParams);

  // Get default parameters for a chakra
  const getDefaultParamsForChakra = useCallback((chakra: ChakraTag): SpiralParams => {
    // Create chakra-specific parameters
    const chakraParams: SpiralParams = {
      ...defaultParams,
      color: chakraColorMap[chakra] || '180,180,255'
    };
    
    // Customize based on chakra - with ultra-slow speeds for all chakras
    switch(chakra) {
      case 'Root':
        return {
          ...chakraParams,
          coeffA: 1.5,
          coeffB: 1.2,
          freqA: 3.0,
          freqB: 2.0,
          maxCycles: 3,
          speed: 0.00001 // Ultra slow for guaranteed stability
        };
      case 'Sacral':
        return {
          ...chakraParams,
          coeffA: 1.3,
          coeffB: 1.1,
          freqA: 3.5,
          freqB: 2.5,
          maxCycles: 4,
          speed: 0.000015 // Ultra slow for guaranteed stability
        };
      case 'Solar Plexus':
        return {
          ...chakraParams,
          coeffA: 1.2,
          coeffB: 1.0,
          freqA: 4.0,
          freqB: 3.0,
          maxCycles: 4,
          speed: 0.000015 // Ultra slow for guaranteed stability
        };
      case 'Heart':
        return {
          ...chakraParams,
          coeffA: 1.1,
          coeffB: 0.9,
          freqA: 4.5,
          freqB: 3.5,
          maxCycles: 5,
          speed: 0.00002 // Ultra slow for guaranteed stability
        };
      case 'Throat':
        return {
          ...chakraParams,
          coeffA: 1.0,
          coeffB: 0.8,
          freqA: 5.0,
          freqB: 4.0,
          maxCycles: 5,
          speed: 0.00002 // Ultra slow for guaranteed stability
        };
      case 'Third Eye':
        return {
          ...chakraParams,
          coeffA: 0.9,
          coeffB: 0.7,
          freqA: 5.5,
          freqB: 4.5,
          maxCycles: 6,
          speed: 0.000025 // Ultra slow for guaranteed stability
        };
      case 'Crown':
        return {
          ...chakraParams,
          coeffA: 0.8,
          coeffB: 0.6,
          freqA: 6.0,
          freqB: 5.0,
          maxCycles: 7,
          speed: 0.000025 // Ultra slow for guaranteed stability
        };
      default:
        return {
          ...chakraParams,
          speed: 0.00001 // Ultra slow default for guaranteed stability
        };
    }
  }, []);

  // If a journey ID is provided, attempt to load custom parameters
  useEffect(() => {
    let isMounted = true;
    
    if (journeyId) {
      // Check cache first
      if (paramsCache[journeyId]) {
        // Still check if we're mounted to prevent React state updates on unmounted components
        if (isMounted) {
          console.log(`Using cached spiral params for journey ${journeyId}`);
          setParams(paramsCache[journeyId]);
        }
        return;
      }

      // Otherwise try to fetch from API
      const fetchParams = async () => {
        try {
          console.log(`Fetching spiral params for journey ${journeyId}`);
          const journeyParams = await fetchSpiralParams(journeyId);
          
          if (journeyParams && isMounted) {
            // Ensure we don't cause rendering loops by enforcing ultra-slow speeds
            // Use ultra-slow speeds for guaranteed stability
            const safeParams = {
              ...journeyParams,
              speed: 0.00001 // Force ultra-slow speed for all journeys
            };
            
            setParams(safeParams);
            // Cache the results
            paramsCache[journeyId] = safeParams;
            console.log(`Cached spiral params for journey ${journeyId}`);
          }
        } catch (error) {
          console.error(`Error loading spiral params for journey ${journeyId}:`, error);
        }
      };

      fetchParams();
    }
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [journeyId]);

  return {
    params,
    setParams,
    getDefaultParamsForChakra
  };
};

// Export the default hook directly
export default useSpiralParams;
