
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
            setParams(fetchedParams);
          } else {
            console.log("No spiral params found in database. Creating default params for journey:", journeyId);
            
            // Since we know this journey ID is specifically for the "akashic-reconnection" journey
            if (journeyId === '20') {
              console.log('Creating specific params for Akashic Reconnection journey (ID: 20)');
              const akashicParams = {
                coeffA: 0.8,
                coeffB: 1.2,
                coeffC: 0.6,
                freqA: 3.2,
                freqB: 4.1,
                freqC: 2.7,
                color: '220,220,255', // Light blue for Akashic Records
                opacity: 85,
                strokeWeight: 0.7,
                maxCycles: 6,
                speed: 0.0008
              };
              
              // Save the specific params to the database
              await fetchSpiralParams(journeyId, akashicParams);
              
              // Save to memory cache
              paramsCache[journeyId] = akashicParams;
              setParams(akashicParams);
              return;
            }
            
            // If not the specific journey, use hash-based random params as before
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
