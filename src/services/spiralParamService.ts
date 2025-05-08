
import { supabase } from '@/integrations/supabase/client';
import { SpiralParams } from '@/hooks/useSpiralParams';
import { paramsCache } from '@/hooks/useSpiralParams';

// Define the shape of data returned from the database
interface JourneyVisualParamsRecord {
  id: string;
  journey_id: string;
  params: SpiralParams;
  created_at: string;
  updated_at: string;
}

// Fetch spiral parameters for a specific journey
export const fetchSpiralParams = async (journeyId: string): Promise<SpiralParams | null> => {
  try {
    // First, check if we already have the params in memory
    if (paramsCache[journeyId]) {
      return paramsCache[journeyId];
    }
    
    // If not, fetch from the database
    const { data, error } = await supabase
      .from('journey_visual_params')
      .select('params')
      .eq('journey_id', journeyId)
      .single();
      
    if (error) {
      console.error('Error fetching spiral params:', error);
      return null;
    }
    
    if (data?.params) {
      // Save to memory cache and properly cast the JSON
      const parsedParams = data.params as unknown as SpiralParams;
      paramsCache[journeyId] = parsedParams;
      return parsedParams;
    }
    
    return null;
  } catch (err) {
    console.error('Failed to fetch spiral params:', err);
    return null;
  }
};

// Save spiral parameters for a journey
export const saveSpiralParams = async (journeyId: string, params: SpiralParams): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('journey_visual_params')
      .upsert({
        journey_id: journeyId,
        params: params as unknown as Record<string, any>,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'journey_id'
      });
      
    if (error) {
      console.error('Error saving spiral params:', error);
      return false;
    }
    
    // Update memory cache
    paramsCache[journeyId] = params;
    
    return true;
  } catch (err) {
    console.error('Failed to save spiral params:', err);
    return false;
  }
};

// Bulk fetch spiral parameters for multiple journeys
export const fetchMultipleJourneySpiralParams = async (journeyIds: string[]): Promise<Record<string, SpiralParams>> => {
  try {
    if (!journeyIds.length) return {};
    
    const { data, error } = await supabase
      .from('journey_visual_params')
      .select('journey_id, params')
      .in('journey_id', journeyIds);
      
    if (error) {
      console.error('Error fetching spiral params:', error);
      return {};
    }
    
    const result: Record<string, SpiralParams> = {};
    
    if (data) {
      data.forEach((item: any) => {
        if (item.journey_id && item.params) {
          const parsedParams = item.params as unknown as SpiralParams;
          result[item.journey_id] = parsedParams;
          // Also update memory cache
          paramsCache[item.journey_id] = parsedParams;
        }
      });
    }
    
    return result;
  } catch (err) {
    console.error('Failed to fetch multiple spiral params:', err);
    return {};
  }
};
