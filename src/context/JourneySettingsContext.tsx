
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface JourneySettings {
  lowSensitivityMode: boolean;
  useHeadphones: boolean;
  pinkNoise: boolean;
  sleepTimer: number; // 0 means off, otherwise minutes
  saveToTimeline: boolean;
}

interface JourneySettingsContextType {
  settings: JourneySettings;
  updateSettings: (newSettings: Partial<JourneySettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: JourneySettings = {
  lowSensitivityMode: false,
  useHeadphones: true,
  pinkNoise: false,
  sleepTimer: 0,
  saveToTimeline: true
};

const JourneySettingsContext = createContext<JourneySettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {}
});

export const useJourneySettings = () => useContext(JourneySettingsContext);

interface JourneySettingsProviderProps {
  children: ReactNode;
}

export const JourneySettingsProvider: React.FC<JourneySettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<JourneySettings>(() => {
    // Load from sessionStorage if available
    const savedSettings = sessionStorage.getItem('journeySettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  // Save to sessionStorage whenever settings change
  useEffect(() => {
    sessionStorage.setItem('journeySettings', JSON.stringify(settings));
  }, [settings]);
  
  const updateSettings = (newSettings: Partial<JourneySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const resetSettings = () => {
    setSettings(defaultSettings);
  };
  
  return (
    <JourneySettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </JourneySettingsContext.Provider>
  );
};
