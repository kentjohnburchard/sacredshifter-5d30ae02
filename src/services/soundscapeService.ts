
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export interface JourneySoundscape {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  source_link?: string;
  source_type?: string;
  journey_id?: string | number;
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

// Stub functions to satisfy TypeScript - these are marked for removal
// but adding them temporarily to fix build errors
export function createJourneySoundscape(data: any): Promise<JourneySoundscape | null> {
  console.warn('createJourneySoundscape is deprecated');
  return Promise.resolve(null);
}

export function updateJourneySoundscape(id: string, data: any): Promise<JourneySoundscape> {
  console.warn('updateJourneySoundscape is deprecated');
  return Promise.resolve({ id, title: '', file_url: '' });
}

export function deleteJourneySoundscape(id: string): Promise<boolean> {
  console.warn('deleteJourneySoundscape is deprecated');
  return Promise.resolve(true);
}

export function validateYoutubeUrl(url: string): boolean {
  console.warn('validateYoutubeUrl is deprecated');
  return false;
}
