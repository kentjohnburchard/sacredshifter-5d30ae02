
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserState {
  currentPath: string;
  lastActive: Date;
  communityActivity?: boolean;
}

export interface GuidanceContextType {
  userState: UserState;
  updateUserState?: (state: UserState) => void;
  refreshRecommendations?: () => void;
  // Add other guidance context properties here
}

const defaultUserState: UserState = {
  currentPath: '/',
  lastActive: new Date(),
  communityActivity: false
};

const defaultContext: GuidanceContextType = {
  userState: defaultUserState
};

const GuidanceContext = createContext<GuidanceContextType>(defaultContext);

interface GuidanceProviderProps {
  children: ReactNode;
}

export const GuidanceProvider: React.FC<GuidanceProviderProps> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>(defaultUserState);

  const updateUserState = (newState: UserState) => {
    setUserState(prev => ({ ...prev, ...newState }));
  };

  const refreshRecommendations = () => {
    // Implementation for refreshing recommendations
    console.log('Refreshing guidance recommendations');
  };

  return (
    <GuidanceContext.Provider value={{ 
      userState, 
      updateUserState,
      refreshRecommendations 
    }}>
      {children}
    </GuidanceContext.Provider>
  );
};

export const useGuidance = () => useContext(GuidanceContext);
