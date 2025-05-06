
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserState {
  currentPath: string;
  lastActive: Date;
  communityActivity?: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  chakra?: string;
  actionLabel: string;
  action?: string;
  link?: string;
  priority: number;
}

export interface GuidanceContextType {
  userState: UserState;
  updateUserState?: (state: UserState) => void;
  refreshRecommendations?: () => void;
  
  // Added properties to fix errors
  recommendations: Recommendation[];
  loadingRecommendations: boolean;
  dismissRecommendation: (id: string) => void;
  applyRecommendation: (recommendation: Recommendation) => void;
}

const defaultUserState: UserState = {
  currentPath: '/',
  lastActive: new Date(),
  communityActivity: false
};

const defaultContext: GuidanceContextType = {
  userState: defaultUserState,
  recommendations: [],
  loadingRecommendations: false,
  dismissRecommendation: () => {},
  applyRecommendation: () => {}
};

const GuidanceContext = createContext<GuidanceContextType>(defaultContext);

interface GuidanceProviderProps {
  children: ReactNode;
}

export const GuidanceProvider: React.FC<GuidanceProviderProps> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>(defaultUserState);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);

  const updateUserState = (newState: UserState) => {
    setUserState(prev => ({ ...prev, ...newState }));
  };

  const refreshRecommendations = () => {
    setLoadingRecommendations(true);
    // Implementation for refreshing recommendations
    console.log('Refreshing guidance recommendations');
    
    // Simulate async operation
    setTimeout(() => {
      setLoadingRecommendations(false);
      // You would typically fetch recommendations from an API here
    }, 500);
  };
  
  const dismissRecommendation = (id: string) => {
    console.log(`Dismissing recommendation: ${id}`);
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };
  
  const applyRecommendation = (recommendation: Recommendation) => {
    console.log(`Applying recommendation: ${recommendation.id}`, recommendation);
    // Implementation for applying a recommendation
    // This might involve navigation, showing a modal, etc.
  };

  return (
    <GuidanceContext.Provider value={{ 
      userState, 
      updateUserState,
      refreshRecommendations,
      recommendations,
      loadingRecommendations,
      dismissRecommendation,
      applyRecommendation
    }}>
      {children}
    </GuidanceContext.Provider>
  );
};

export const useGuidance = () => useContext(GuidanceContext);
