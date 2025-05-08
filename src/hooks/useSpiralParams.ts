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
            
            // Use parameters directly without normalization
            setParams(fetchedParams);
            
            // Save to cache
            paramsCache[journeyId] = fetchedParams;
          } else {
            console.log("No spiral params found in database. Creating default params for journey:", journeyId);
            
            // Since we know this journey ID is specifically for the "akashic-reconnection" journey
            if (journeyId === '20') {
              console.log('Creating specific params for Akashic Reconnection journey (ID: 20)');
              const akashicParams = {
                coeffA: 5,
                coeffB: 3, 
                coeffC: 1.5,
                freqA: 50,
                freqB: -20,
                freqC: -60,
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
            
            // If not the specific journey, create hash-based params
            const hash = journeyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            
            // Create parameters with wider ranges
            const newParams = {
              coeffA: 1.0 + ((hash % 10) / 5), // Range: 1.0-3.0
              coeffB: 0.7 + ((hash * 2) % 10) / 5, // Range: 0.7-2.7
              coeffC: 0.4 + ((hash * 3) % 10) / 10, // Range: 0.4-1.4
              freqA: -10 + (hash % 20),  // Range: -10 to 10
              freqB: -10 + ((hash * 2) % 20), // Range: -10 to 10
              freqC: -10 + ((hash * 3) % 20), // Range: -10 to 10
              color: `${100 + (hash % 155)},${100 + ((hash * 2) % 155)},${100 + ((hash * 3) % 155)}`,
              opacity: 70 + (hash % 30),
              strokeWeight: 0.3 + ((hash % 10) / 10),
              maxCycles: 4 + (hash % 3),
              speed: 0.001 + ((hash % 10) / 1000) // Higher speeds: 0.001-0.011
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
