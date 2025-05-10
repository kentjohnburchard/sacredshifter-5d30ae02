import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChakraTag } from '@/types/chakras';
import { Journey, JourneyTimelineItem } from '@/types/journey';
import { normalizeStringArray, normalizeId } from '@/utils/parsers';
import { logTimelineEvent } from '@/services/timeline';
import { toast } from 'sonner';

// Lightbearer Code interface
export interface LightbearerCode {
  id: string;
  code_name: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: Date;
  chakra_tag?: ChakraTag;
}

// Journey Prompt interface
export interface JourneyPrompt {
  id: string;
  journey_id: string;
  path_pattern: string;
  content: string;
  display_type: 'dialog' | 'tooltip' | 'modal';
  completed: boolean;
  saved: boolean;
  chakra_tag?: ChakraTag;
}

export interface JourneyContextType {
  currentPath: string;
  setCurrentPath?: (path: string) => void;
  
  // Journey management
  activeJourney?: Journey | null;
  isJourneyActive: boolean;
  startJourney: (journey: Journey) => void;
  completeJourney: () => void;
  resetJourney: () => void;
  
  // Activity recording
  recordActivity: (action: string, details?: Record<string, any>) => void;
  
  // Prompt management
  activePrompts: JourneyPrompt[];
  fetchPromptsForLocation: (pathname: string) => void;
  dismissPrompt: (promptId: string) => void;
  completePrompt: (promptId: string) => void;
  savePrompt: (promptId: string) => void;
  
  // Lightbearer code
  currentLightbearerCode?: LightbearerCode | null;
  
  // Chakra related
  getJourneyChakra: () => ChakraTag | undefined;
  updateJourneyChakra?: (chakra: ChakraTag) => void;
}

const defaultContext: JourneyContextType = {
  currentPath: '/',
  isJourneyActive: false,
  activePrompts: [],
  startJourney: () => {},
  completeJourney: () => {},
  resetJourney: () => {},
  recordActivity: () => {},
  fetchPromptsForLocation: () => {},
  dismissPrompt: () => {},
  completePrompt: () => {},
  savePrompt: () => {},
  getJourneyChakra: () => undefined
};

const JourneyContext = createContext<JourneyContextType>(defaultContext);

interface JourneyProviderProps {
  children: ReactNode;
}

export const JourneyProvider: React.FC<JourneyProviderProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [activePrompts, setActivePrompts] = useState<JourneyPrompt[]>([]);
  const [currentLightbearerCode, setCurrentLightbearerCode] = useState<LightbearerCode | null>(null);

  // Check if a journey is currently active
  const isJourneyActive = !!activeJourney;

  // Start a new journey
  const startJourney = (journey: Journey) => {
    console.log('Starting journey:', journey);
    
    // Ensure tags is properly processed as a string array
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

  // Fetch prompts for the current location
  const fetchPromptsForLocation = (pathname: string) => {
    console.log(`Fetching prompts for location: ${pathname}`);
    // Implementation for fetching prompts
    // This would typically involve an API call or checking local data
  };

  // Dismiss a prompt without completing it
  const dismissPrompt = (promptId: string) => {
    console.log(`Dismissing prompt: ${promptId}`);
    setActivePrompts(prev => prev.filter(p => p.id !== promptId));
  };

  // Mark a prompt as completed
  const completePrompt = (promptId: string) => {
    console.log(`Completing prompt: ${promptId}`);
    setActivePrompts(prev => prev.filter(p => p.id !== promptId));
    // Additional logic for recording completion can be added here
  };

  // Save a prompt for later
  const savePrompt = (promptId: string) => {
    console.log(`Saving prompt: ${promptId}`);
    setActivePrompts(prev => 
      prev.map(p => p.id === promptId ? { ...p, saved: true } : p)
    );
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

  return (
    <JourneyContext.Provider value={{ 
      currentPath, 
      setCurrentPath,
      activeJourney,
      isJourneyActive,
      startJourney,
      completeJourney,
      resetJourney,
      recordActivity,
      activePrompts,
      fetchPromptsForLocation,
      dismissPrompt,
      completePrompt,
      savePrompt,
      currentLightbearerCode,
      getJourneyChakra,
      updateJourneyChakra
    }}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => useContext(JourneyContext);
