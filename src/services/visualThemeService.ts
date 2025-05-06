
import { supabase } from '@/integrations/supabase/client';
import { VisualThemeParams } from '@/context/VisualThemeContext';
import { ChakraTag } from '@/types/chakras';

export interface JourneyVisualParams {
  journeyId: string;
  params: VisualThemeParams;
}

/**
 * Get visual parameters for a specific journey
 */
export const getJourneyVisualParams = async (journeyId: string): Promise<VisualThemeParams | null> => {
  try {
    const { data, error } = await supabase
      .from('journey_visual_params')
      .select('params')
      .eq('journey_id', journeyId)
      .single();
    
    if (error) {
      console.error('Error fetching journey visual params:', error);
      return null;
    }
    
    return data?.params || null;
  } catch (err) {
    console.error('Failed to get journey visual params:', err);
    return null;
  }
};

/**
 * Save visual parameters for a specific journey
 */
export const saveJourneyVisualParams = async (journeyId: string, params: VisualThemeParams): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('journey_visual_params')
      .upsert({ 
        journey_id: journeyId,
        params,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'journey_id'
      });
    
    if (error) {
      console.error('Error saving journey visual params:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Failed to save journey visual params:', err);
    return false;
  }
};

/**
 * Get recommend visual theme based on chakra tag
 */
export const getRecommendedVisualThemeForChakra = (chakraTag: ChakraTag): Partial<VisualThemeParams> => {
  const chakraThemes: Record<ChakraTag, Partial<VisualThemeParams>> = {
    'Root': { theme: 'chakraField', colorScheme: '#ea384c', intensity: 3 },
    'Sacral': { theme: 'cymaticGrid', colorScheme: '#ff7e47', intensity: 3 },
    'Solar Plexus': { theme: 'sacredSpiral', colorScheme: '#ffd034', intensity: 4 },
    'Heart': { theme: 'fractalOcean', colorScheme: '#4ade80', intensity: 3 },
    'Throat': { theme: 'cymaticGrid', colorScheme: '#48cae7', intensity: 2 },
    'Third Eye': { theme: 'merkabaChamber', colorScheme: '#7e69ab', intensity: 4 },
    'Crown': { theme: 'starlightField', colorScheme: '#9b87f5', intensity: 5 },
    'Transpersonal': { theme: 'cosmicCollision', colorScheme: '#e5deff', intensity: 5 }
  };
  
  return chakraThemes[chakraTag] || { theme: 'default', intensity: 3 };
};
