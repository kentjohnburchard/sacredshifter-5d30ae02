
import { supabase } from '@/integrations/supabase/client';

interface JourneySoundscape {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  source_link?: string;
  journey_id?: number;
}

export const fetchJourneySoundscape = async (
  journeySlug: string
): Promise<JourneySoundscape | null> => {
  if (!journeySlug) return null;
  
  try {
    // Try to use the built-in function to get soundscape
    const { data, error } = await supabase.rpc(
      'get_journey_soundscape',
      { journey_slug: journeySlug }
    );
    
    if (error) {
      console.error('Error fetching soundscape with RPC:', error);
      
      // Fallback to direct query if RPC fails
      const { data: manualData, error: manualError } = await supabase
        .from('journey_soundscapes')
        .select('id, journey_id, title, description, file_url, source_link')
        .eq('journey_id', journeySlug)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (manualError) {
        console.error('Error fetching soundscape with manual query:', manualError);
        return null;
      }
      
      return manualData as JourneySoundscape;
    }
    
    return (data && data.length > 0) ? data[0] as JourneySoundscape : null;
  } catch (error) {
    console.error('Error in fetchJourneySoundscape:', error);
    return null;
  }
};

export const fetchAllSoundscapes = async (): Promise<JourneySoundscape[]> => {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .select('id, journey_id, title, description, file_url, source_link')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching all soundscapes:', error);
      return [];
    }
    
    return data as JourneySoundscape[];
  } catch (error) {
    console.error('Error in fetchAllSoundscapes:', error);
    return [];
  }
};
