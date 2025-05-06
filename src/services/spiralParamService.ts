
import { supabase } from '@/integrations/supabase/client';
import { SpiralParams } from '@/components/visualizer/SpiralVisualizer';
import { addJourneyParams, getAllJourneyParams } from '@/hooks/useSpiralParams';

// Fetch spiral parameters for a specific journey
export const fetchSpiralParams = async (journeyId: string): Promise<SpiralParams | null> => {
  try {
    // First, check if we already have the params in memory
    const allParams = getAllJourneyParams();
    if (allParams[journeyId]) {
      return allParams[journeyId];
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
      // Save to memory cache
      addJourneyParams(journeyId, data.params);
      return data.params;
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
        params,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'journey_id'
      });
      
    if (error) {
      console.error('Error saving spiral params:', error);
      return false;
    }
    
    // Update memory cache
    addJourneyParams(journeyId, params);
    
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
    
    data?.forEach(item => {
      if (item.journey_id && item.params) {
        result[item.journey_id] = item.params;
        // Also update memory cache
        addJourneyParams(item.journey_id, item.params);
      }
    });
    
    return result;
  } catch (err) {
    console.error('Failed to fetch multiple spiral params:', err);
    return {};
  }
};
