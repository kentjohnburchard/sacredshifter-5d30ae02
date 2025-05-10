
import { useState } from 'react';
import { ChakraTag } from '@/types/chakras';
import { Journey } from '@/types/journey';
import { normalizeStringArray, normalizeId } from '@/utils/parsers';
import { logTimelineEvent } from '@/services/timeline'; // Fixed import path

/**
 * Hook for managing journey activity tracking
 */
export const useJourneyActivity = () => {
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [activityCache, setActivityCache] = useState<Record<string, number>>({});

  // Check if a journey is currently active
  const isJourneyActive = !!activeJourney;

  // Start a new journey
  const startJourney = (journey: Journey) => {
    console.log('Starting journey:', journey);
    
    // Ensure journey data is properly formatted
    const processedJourney: Journey = {
      ...journey,
      id: normalizeId(journey.id),
      tags: normalizeStringArray(journey.tags)
    };
    
    setActiveJourney(processedJourney);
    
    // Create a unique activity key to prevent duplicate events
    const activityKey = `journey_start_${processedJourney.id}`;
    const now = Date.now();
    
    // Only log if this exact activity hasn't been logged in the past 10 seconds
    if (!activityCache[activityKey] || (now - activityCache[activityKey] > 10000)) {
      try {
        recordActivity('journey_start', {
          journeyId: processedJourney.id,
          title: processedJourney.title,
          chakra: processedJourney.chakra // Use chakra field
        });
        
        // Cache this activity with timestamp
        setActivityCache(prev => ({
          ...prev,
          [activityKey]: now
        }));
      } catch (error) {
        console.warn('Failed to record journey start:', error);
        // Don't show errors to the user for timeline logging
      }
    } else {
      console.log("Skipping duplicate journey_start event");
    }
  };

  // Complete the current journey
  const completeJourney = () => {
    if (!activeJourney) return;
    
    console.log('Completing journey:', activeJourney.title);
    
    const activityKey = `journey_complete_${activeJourney.id}`;
    const now = Date.now();
    
    // Only log if this exact activity hasn't been logged in the past 10 seconds
    if (!activityCache[activityKey] || (now - activityCache[activityKey] > 10000)) {
      try {
        recordActivity('journey_complete', {
          journeyId: activeJourney.id,
          title: activeJourney.title,
          chakra: activeJourney.chakra // Use chakra field
        });
        
        // Cache this activity with timestamp
        setActivityCache(prev => ({
          ...prev,
          [activityKey]: now
        }));
      } catch (error) {
        console.warn('Failed to record journey completion:', error);
      }
    } else {
      console.log("Skipping duplicate journey_complete event");
    }
    
    setActiveJourney(null);
  };

  // Reset the current journey
  const resetJourney = () => {
    console.log('Resetting journey');
    setActiveJourney(null);
  };

  // Record user activity within a journey with deduplication
  const recordActivity = (action: string, details?: Record<string, any>) => {
    // We can record activity even without active journey if journeyId is provided
    if (!activeJourney && !details?.journeyId) {
      console.log("Cannot record activity - no active journey and no journeyId provided");
      return;
    }
    
    // Use provided journeyId or fall back to active journey's ID
    const journeyId = details?.journeyId 
      ? String(details.journeyId) 
      : activeJourney?.id 
        ? String(activeJourney.id) 
        : undefined;
    
    if (!journeyId) {
      console.log("Cannot record activity - no valid journey ID");
      return;
    }
    
    // Create a unique activity key for deduplication
    const activityKey = `${action}_${journeyId}_${details?.title || ''}`;
    const now = Date.now();
    
    // Only log if this exact activity hasn't been logged in the past 5 seconds
    if (!activityCache[activityKey] || (now - activityCache[activityKey] > 5000)) {
      console.log(`Recording activity: ${action}`, {
        journeyId,
        details
      });
      
      // Cache this activity with timestamp
      setActivityCache(prev => ({
        ...prev,
        [activityKey]: now
      }));
      
      // Log the timeline event using the timeline service with proper error handling
      try {
        logTimelineEvent(action as any, {
          journeyId,
          title: details?.title || activeJourney?.title,
          chakra: details?.chakra || activeJourney?.chakra, // Use chakra field
          ...details
        }).catch(error => {
          // Handle silently - don't block the user experience for logging errors
          console.warn('Failed to log timeline event:', error);
        });
      } catch (error) {
        console.warn('Error in recordActivity:', error);
        // Don't rethrow the error - allow the app to continue even if logging fails
      }
    } else {
      console.log(`Skipping duplicate activity: ${action}`);
    }
  };

  // Get chakra tag for current journey
  const getJourneyChakra = (): ChakraTag | undefined => {
    if (!activeJourney) return undefined;
    
    // Check for chakra first, then fall back to chakra_tag for backward compatibility
    if (activeJourney.chakra) {
      // Try to convert string to ChakraTag
      const chakra = activeJourney.chakra.trim();
      if (['Root', 'Sacral', 'Solar Plexus', 'Heart', 
           'Throat', 'Third Eye', 'Crown', 'Transpersonal'].includes(chakra)) {
        return chakra as ChakraTag;
      }
    }
    
    // Check the older chakra_tag field as fallback
    if (activeJourney.chakra_tag) {
      return activeJourney.chakra_tag as ChakraTag;
    }
    
    return undefined;
  };
  
  // Update chakra tag for current journey
  const updateJourneyChakra = (chakra: ChakraTag) => {
    if (activeJourney) {
      setActiveJourney({
        ...activeJourney,
        // Set both properties for compatibility
        chakra: chakra,
        chakra_tag: chakra
      });
    }
  };

  return {
    activeJourney,
    isJourneyActive,
    startJourney,
    completeJourney,
    resetJourney,
    recordActivity,
    getJourneyChakra,
    updateJourneyChakra
  };
};
