
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface JourneyContextType {
  currentPath: string;
  setCurrentPath?: (path: string) => void;
  // Add other journey context properties here
}

const defaultContext: JourneyContextType = {
  currentPath: '/',
};

const JourneyContext = createContext<JourneyContextType>(defaultContext);

interface JourneyProviderProps {
  children: ReactNode;
}

export const JourneyProvider: React.FC<JourneyProviderProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState('/');

  return (
    <JourneyContext.Provider value={{ currentPath, setCurrentPath }}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => useContext(JourneyContext);
