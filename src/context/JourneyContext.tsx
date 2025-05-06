
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChakraTag } from '@/types/chakras';

// Journey interface
export interface Journey {
  id: string | number;
  filename?: string;
  title: string;
  tags?: string;
  content?: string;
  veil_locked?: boolean;
  sound_frequencies?: string;
  description?: string;
  intent?: string;
  duration?: string;
  chakra?: string;
  chakra_tag?: ChakraTag;
}

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
    setActiveJourney(journey);
    // Additional logic for journey start can be added here
  };

  // Complete the current journey
  const completeJourney = () => {
    console.log('Completing journey:', activeJourney?.title);
    setActiveJourney(null);
    // Additional logic for journey completion can be added here
  };

  // Reset the current journey
  const resetJourney = () => {
    console.log('Resetting journey');
    setActiveJourney(null);
    // Additional reset logic can be added here
  };

  // Record user activity within a journey
  const recordActivity = (action: string, details?: Record<string, any>) => {
    if (activeJourney) {
      console.log(`Recording activity: ${action}`, details);
      // Implementation for recording activity
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
      return activeJourney.chakra_tag;
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
