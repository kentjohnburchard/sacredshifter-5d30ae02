
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useJourney } from '@/context/JourneyContext';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { supabase } from '@/integrations/supabase/client';

export type VisualTheme = 
  | 'cymaticGrid' 
  | 'starlightField' 
  | 'fractalOcean' 
  | 'merkabaChamber'
  | 'sacredSpiral'
  | 'chakraField'
  | 'cosmicCollision'
  | 'default';

export interface VisualThemeParams {
  theme: VisualTheme;
  chakraTag?: ChakraTag;
  intensity: number; // 1-5
  colorScheme: string;
  frequency?: number;
  animated: boolean;
  audioReactive?: boolean;
}

interface VisualThemeContextType {
  currentTheme: VisualThemeParams;
  setTheme: (theme: Partial<VisualThemeParams>) => void;
  getChakraTheme: (chakra: ChakraTag) => VisualThemeParams;
  toggleVisuals: () => void;
  areVisualsEnabled: boolean;
}

const defaultTheme: VisualThemeParams = {
  theme: 'default',
  intensity: 3,
  colorScheme: '#9b87f5',
  animated: true
};

// Predefined themes mapped to chakras
const chakraThemeMapping: Record<ChakraTag, Partial<VisualThemeParams>> = {
  'Root': { theme: 'chakraField', colorScheme: '#ea384c', intensity: 3 },
  'Sacral': { theme: 'cymaticGrid', colorScheme: '#ff7e47', intensity: 3 },
  'Solar Plexus': { theme: 'sacredSpiral', colorScheme: '#ffd034', intensity: 4 },
  'Heart': { theme: 'fractalOcean', colorScheme: '#4ade80', intensity: 3 },
  'Throat': { theme: 'cymaticGrid', colorScheme: '#48cae7', intensity: 2 },
  'Third Eye': { theme: 'merkabaChamber', colorScheme: '#7e69ab', intensity: 4 },
  'Crown': { theme: 'starlightField', colorScheme: '#9b87f5', intensity: 5 },
  'Transpersonal': { theme: 'cosmicCollision', colorScheme: '#e5deff', intensity: 5 }
};

const VisualThemeContext = createContext<VisualThemeContextType>({
  currentTheme: defaultTheme,
  setTheme: () => {},
  getChakraTheme: () => defaultTheme,
  toggleVisuals: () => {},
  areVisualsEnabled: true
});

export const useVisualTheme = () => useContext(VisualThemeContext);

export const VisualThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { activeJourney, getJourneyChakra } = useJourney();
  const [currentTheme, setCurrentTheme] = useState<VisualThemeParams>(defaultTheme);
  const [visualsEnabled, setVisualsEnabled] = useState<boolean>(true);
  const [journeyTheme, setJourneyTheme] = useState<VisualThemeParams | null>(null);

  // Get theme for a specific chakra
  const getChakraTheme = (chakra: ChakraTag): VisualThemeParams => {
    const chakraTheme = chakraThemeMapping[chakra] || {};
    return {
      ...defaultTheme,
      ...chakraTheme,
      colorScheme: getChakraColor(chakra)
    };
  };

  // Fetch visual theme for current journey from database
  useEffect(() => {
    if (!activeJourney?.id || !visualsEnabled) return;

    const fetchJourneyVisualTheme = async () => {
      try {
        const { data, error } = await supabase
          .from('journey_visual_params')
          .select('params')
          .eq('journey_id', activeJourney.id.toString())
          .single();

        if (error) {
          console.error('Error fetching visual theme:', error);
          return;
        }

        if (data?.params) {
          // If journey has custom visual settings, use those
          // Fix the type issue by explicitly casting the params
          const typedParams = data.params as unknown as VisualThemeParams;
          setJourneyTheme({
            ...defaultTheme,
            ...typedParams
          });
        } else {
          // Otherwise, use chakra-based theme
          const journeyChakra = getJourneyChakra();
          if (journeyChakra) {
            setJourneyTheme(getChakraTheme(journeyChakra));
          }
        }
      } catch (err) {
        console.error('Failed to fetch journey visual theme:', err);
      }
    };

    fetchJourneyVisualTheme();
  }, [activeJourney?.id, visualsEnabled, getJourneyChakra]);

  // Apply journey theme when it changes
  useEffect(() => {
    if (journeyTheme && visualsEnabled) {
      setCurrentTheme(journeyTheme);
    } else {
      setCurrentTheme(defaultTheme);
    }
  }, [journeyTheme, visualsEnabled]);

  // Handler for theme updates
  const setTheme = (themeUpdate: Partial<VisualThemeParams>) => {
    setCurrentTheme(prev => ({ ...prev, ...themeUpdate }));
  };

  // Toggle visuals on/off
  const toggleVisuals = () => {
    setVisualsEnabled(prev => !prev);
  };

  return (
    <VisualThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      getChakraTheme,
      toggleVisuals,
      areVisualsEnabled: visualsEnabled
    }}>
      {children}
    </VisualThemeContext.Provider>
  );
};
