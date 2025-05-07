
import React, { createContext, useContext, useState } from 'react';
import { ColorTheme, VisualizationSettings, VisualizerType } from '@/types/visualization';

interface VisualThemeContextType {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  settings: VisualizationSettings;
  updateSettings: (settings: Partial<VisualizationSettings>) => void;
  reset: () => void;
}

const defaultSettings: VisualizationSettings = {
  activeShapes: ['flower-of-life'],
  speed: 1,
  colorTheme: 'cosmic-violet',
  symmetry: 6,
  mode: '2d',
  mirrorEnabled: true,
  chakraAlignmentMode: false,
  sensitivity: 1,
  brightness: 1,
  showGrid: true,
  gridIntensity: 0.5,
  showPrimeAffirmations: false,
  visualizerType: 'sacred-geometry',
  rotationSpeed: 1
};

const VisualThemeContext = createContext<VisualThemeContextType>({
  theme: 'cosmic-violet',
  setTheme: () => {},
  settings: defaultSettings,
  updateSettings: () => {},
  reset: () => {}
});

export const useVisualTheme = () => useContext(VisualThemeContext);

export const VisualThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ColorTheme>('cosmic-violet');
  const [settings, setSettings] = useState<VisualizationSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<VisualizationSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const reset = () => {
    setTheme('cosmic-violet');
    setSettings(defaultSettings);
  };

  return (
    <VisualThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        settings, 
        updateSettings, 
        reset 
      }}
    >
      {children}
    </VisualThemeContext.Provider>
  );
};
