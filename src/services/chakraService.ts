
import { supabase } from '@/integrations/supabase/client';
import { ChakraTag } from '@/types/chakras';

export interface UserChakraProgress {
  chakra: ChakraTag;
  count: number;
  percentage: number;
}

export const getUserChakraProgress = async (userId: string): Promise<UserChakraProgress[]> => {
  try {
    const { data, error } = await supabase
      .from('user_chakra_activations')
      .select('chakra_tag')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Count activations by chakra
    const chakraCounts: Record<string, number> = {};
    const allChakras: ChakraTag[] = [
      'Root', 'Sacral', 'Solar Plexus', 'Heart', 
      'Throat', 'Third Eye', 'Crown', 'Transpersonal'
    ];
    
    // Initialize counts
    allChakras.forEach(chakra => {
      chakraCounts[chakra] = 0;
    });
    
    // Update with actual data
    data.forEach(row => {
      const chakra = row.chakra_tag as ChakraTag;
      chakraCounts[chakra] = (chakraCounts[chakra] || 0) + 1;
    });
    
    // Calculate total
    const total = Object.values(chakraCounts).reduce((sum, count) => sum + count, 0);
    
    // Create progress objects
    return allChakras.map(chakra => ({
      chakra,
      count: chakraCounts[chakra] || 0,
      percentage: total > 0 ? Math.round((chakraCounts[chakra] || 0) / total * 100) : 0
    }));
    
  } catch (err) {
    console.error('Error fetching user chakra progress:', err);
    return [];
  }
};

export const updateTimelineEntryChakra = async (entryId: string, chakraTag: ChakraTag | null): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('timeline_snapshots')
      .update({ chakra_tag: chakraTag })
      .eq('id', entryId);
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating entry chakra:', err);
    return false;
  }
};

export const recordChakraActivation = async (
  userId: string,
  chakraTag: ChakraTag,
  activationType: string,
  journeyId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_chakra_activations')
      .insert({
        user_id: userId,
        chakra_tag: chakraTag,
        activation_type: activationType,
        journey_id: journeyId
      });
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error recording chakra activation:', err);
    return false;
  }
};
