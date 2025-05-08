
import { useState, useEffect } from 'react';
import { fetchSpiralParams } from '@/services/spiralParamService';

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
 */
const useSpiralParams = (journeyId?: string) => {
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

  useEffect(() => {
    const getParams = async () => {
      try {
        if (journeyId) {
          console.log(`Loading spiral params for journey ID: ${journeyId} (type: ${typeof journeyId})`);
          
          // Check if we already have cached params
          if (paramsCache[journeyId]) {
            console.log("Using cached spiral params for journey:", journeyId);
            setParams(paramsCache[journeyId]);
            return;
          }
          
          // Try to fetch params from the database
          const fetchedParams = await fetchSpiralParams(journeyId);
          
          if (fetchedParams) {
            console.log("Received spiral params from database:", fetchedParams);
            
            // Normalize the parameters to ensure they work well
            const normalizedParams = {
              ...fetchedParams,
              coeffA: Math.min(Math.max(fetchedParams.coeffA || 1.2, 0.5), 2),
              coeffB: Math.min(Math.max(fetchedParams.coeffB || 0.9, 0.5), 2),
              coeffC: Math.min(Math.max(fetchedParams.coeffC || 0.6, 0.2), 2),
              freqA: Math.min(Math.max(fetchedParams.freqA || 4.1, 1), 8),
              freqB: Math.min(Math.max(fetchedParams.freqB || 3.6, 1), 8),
              freqC: Math.min(Math.max(fetchedParams.freqC || 2.8, 1), 8),
              speed: Math.min(fetchedParams.speed || 0.0003, 0.0005)
            };
            
            setParams(normalizedParams);
          } else {
            console.log("No spiral params found in database. Creating default params for journey:", journeyId);
            
            // Since we know this journey ID is specifically for the "akashic-reconnection" journey
            if (journeyId === '20') {
              console.log('Creating specific params for Akashic Reconnection journey (ID: 20)');
              const akashicParams = {
                coeffA: 1.2,
                coeffB: 0.9, 
                coeffC: 0.6,
                freqA: 4.1,
                freqB: 3.6,
                freqC: 2.8,
                color: '220,220,255', // Light blue for Akashic Records
                opacity: 85,
                strokeWeight: 0.7,
                maxCycles: 6,
                speed: 0.0003
              };
              
              // Save the specific params to the database
              await fetchSpiralParams(journeyId, akashicParams);
              
              // Save to memory cache
              paramsCache[journeyId] = akashicParams;
              setParams(akashicParams);
              return;
            }
            
            // If not the specific journey, create hash-based params with sacred geometry constraints
            const hash = journeyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            
            // Create parameters that will form proper sacred geometry
            const newParams = {
              coeffA: 1.0 + ((hash % 10) / 10), // Range: 1.0-1.9
              coeffB: 0.7 + ((hash * 2) % 10) / 10, // Range: 0.7-1.6
              coeffC: 0.4 + ((hash * 3) % 10) / 20, // Range: 0.4-0.9
              freqA: 3.0 + (hash % 5),  // Range: 3-7
              freqB: 2.5 + ((hash * 2) % 5), // Range: 2.5-6.5
              freqC: 2.0 + ((hash * 3) % 5), // Range: 2-6
              color: `${100 + (hash % 155)},${100 + ((hash * 2) % 155)},${100 + ((hash * 3) % 155)}`,
              opacity: 70 + (hash % 30),
              strokeWeight: 0.3 + ((hash % 10) / 10),
              maxCycles: 4 + (hash % 3),
              speed: 0.0002 + ((hash % 10) / 20000) // Very slow speeds: 0.0002-0.0007
            };
            
            // Save to memory cache
            paramsCache[journeyId] = newParams;
            setParams(newParams);
          }
        }
      } catch (error) {
        console.error("Error in useSpiralParams:", error);
        // Keep using default params on error
      }
    };
    
    getParams();
  }, [journeyId]);

  return params;
};

// Export the interface and hook
export default useSpiralParams;
export { paramsCache };
