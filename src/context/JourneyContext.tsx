
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChakraTag } from '@/types/chakras';
import { Journey, JourneyPrompt } from '@/types/journey';
import { useJourneyActivity } from '@/hooks/useJourneyActivity';
import { useJourneyPrompts } from '@/hooks/useJourneyPrompts';

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
  const [currentLightbearerCode, setCurrentLightbearerCode] = useState<LightbearerCode | null>(null);
  
  // Use our custom hooks for journey functionality
  const {
    activeJourney,
    isJourneyActive,
    startJourney,
    completeJourney,
    resetJourney,
    recordActivity,
    getJourneyChakra,
    updateJourneyChakra
  } = useJourneyActivity();
  
  const {
    activePrompts,
    fetchPromptsForLocation,
    dismissPrompt,
    completePrompt,
    savePrompt
  } = useJourneyPrompts();

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
