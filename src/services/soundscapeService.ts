
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch soundscape for a journey by its slug
 */
export async function fetchJourneySoundscape(journeySlug: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_journey_soundscape', { journey_slug: journeySlug });
    
    if (error) throw error;
    
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching journey soundscape:', error);
    return null;
  }
}
