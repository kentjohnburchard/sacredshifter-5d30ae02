
import { useState } from 'react';
import { ChakraTag } from '@/types/chakras';
import { Journey } from '@/types/journey';
import { normalizeStringArray, normalizeId } from '@/utils/parsers';
import { logTimelineEvent } from '@/services/timeline';

/**
 * Hook for managing journey activity tracking
 */
export const useJourneyActivity = () => {
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);

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
    
    // Log journey start to timeline
    try {
      recordActivity('journey_start', {
        journeyId: processedJourney.id,
        title: processedJourney.title,
        chakra: processedJourney.chakra_tag || processedJourney.chakra
      });
    } catch (error) {
      console.warn('Failed to record journey start:', error);
      // Don't show errors to the user for timeline logging
    }
  };

  // Complete the current journey
  const completeJourney = () => {
    if (!activeJourney) return;
    
    console.log('Completing journey:', activeJourney.title);
    
    // Log journey completion to timeline
    try {
      recordActivity('journey_complete', {
        journeyId: activeJourney.id,
        title: activeJourney.title,
        chakra: activeJourney.chakra_tag || activeJourney.chakra
      });
    } catch (error) {
      console.warn('Failed to record journey completion:', error);
    }
    
    setActiveJourney(null);
  };

  // Reset the current journey
  const resetJourney = () => {
    console.log('Resetting journey');
    setActiveJourney(null);
  };

  // Record user activity within a journey
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
    
    console.log(`Recording activity: ${action}`, {
      journeyId,
      details
    });
    
    // Log the timeline event using the timeline service with proper error handling
    try {
      logTimelineEvent(action as any, {
        journeyId,
        title: details?.title || activeJourney?.title,
        ...details
      }).catch(error => {
        // Handle silently - don't block the user experience for logging errors
        console.warn('Failed to log timeline event:', error);
      });
    } catch (error) {
      console.warn('Error in recordActivity:', error);
      // Don't rethrow the error - allow the app to continue even if logging fails
    }
  };

  // Get chakra tag for current journey
  const getJourneyChakra = (): ChakraTag | undefined => {
    if (!activeJourney) return undefined;
    
    // Check for explicit chakra_tag
    if (activeJourney.chakra_tag) {
      return activeJourney.chakra_tag as ChakraTag;
    }
    
    // Check the older chakra field
    if (activeJourney.chakra) {
      // Try to convert string to ChakraTag
      const chakra = activeJourney.chakra.trim();
      if (['Root', 'Sacral', 'Solar Plexus', 'Heart', 
           'Throat', 'Third Eye', 'Crown', 'Transpersonal'].includes(chakra)) {
        return chakra as ChakraTag;
      }
    }
    
    return undefined;
  };
  
  // Update chakra tag for current journey
  const updateJourneyChakra = (chakra: ChakraTag) => {
    if (activeJourney) {
      setActiveJourney({
        ...activeJourney,
        chakra_tag: chakra,
        chakra: chakra // Update both for backward compatibility
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
