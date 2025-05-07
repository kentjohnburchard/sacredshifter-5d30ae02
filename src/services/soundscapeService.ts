
import { supabase } from '@/integrations/supabase/client';

export interface JourneySoundscape {
  id: string;
  journey_id: number | string;
  title: string;
  description: string | null;
  file_url: string;
  source_link: string | null;
  created_at: string;
}

export async function fetchJourneySoundscape(journeySlug: string): Promise<JourneySoundscape | null> {
  if (!journeySlug) return null;
  
  try {
    const { data, error } = await supabase
      .rpc('get_journey_soundscape', { journey_slug: journeySlug });
    
    if (error) {
      console.error('Error fetching journey soundscape:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // Extract the first item from the array
    const item = data[0];
    
    return {
      id: item.id,
      journey_id: item.journey_id,
      title: item.title,
      description: item.description,
      file_url: item.file_url,
      source_link: item.source_link,
      created_at: item.created_at
    };
  } catch (error) {
    console.error('Error in fetchJourneySoundscape:', error);
    return null;
  }
}

export async function createJourneySoundscape(
  journeyId: number | string,
  title: string,
  fileUrl: string,
  description?: string,
  sourceLink?: string
): Promise<JourneySoundscape | null> {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .insert([
        {
          journey_id: Number(journeyId),
          title,
          file_url: fileUrl,
          description,
          source_link: sourceLink
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating journey soundscape:', error);
      return null;
    }
    
    return {
      id: data.id,
      journey_id: data.journey_id,
      title: data.title,
      description: data.description,
      file_url: data.file_url,
      source_link: data.source_link,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Error in createJourneySoundscape:', error);
    return null;
  }
}
