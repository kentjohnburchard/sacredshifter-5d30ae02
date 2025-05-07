
import { supabase } from '@/integrations/supabase/client';

export interface JourneySoundscape {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  source_link?: string;
}

/**
 * Fetches soundscape data for a journey by slug
 */
export async function fetchJourneySoundscape(journeySlug: string): Promise<JourneySoundscape | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_journey_soundscape', { journey_slug: journeySlug });
    
    if (error) {
      console.error("Error fetching journey soundscape:", error);
      return null;
    }

    if (data && data.length > 0) {
      return data[0] as JourneySoundscape;
    }

    // No soundscape found for this journey
    return null;
  } catch (err) {
    console.error("Error in fetchJourneySoundscape:", err);
    return null;
  }
}
