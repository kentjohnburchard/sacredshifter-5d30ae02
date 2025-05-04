
import { supabase } from '@/integrations/supabase/client';

export interface JourneySoundscape {
  id: string;
  title: string;
  description?: string;
  journey_id?: number;
  source_link?: string;
  file_url: string;
  source_type: 'file' | 'youtube' | 'spotify';
  created_at?: string;
  updated_at?: string;
}

export const fetchJourneySoundscape = async (journeySlug: string): Promise<JourneySoundscape | null> => {
  try {
    // First try to get the journey ID by slug
    const { data: journey } = await supabase
      .from('journeys')
      .select('id')
      .eq('filename', journeySlug)
      .maybeSingle();
    
    if (!journey) {
      console.error(`Journey not found with slug: ${journeySlug}`);
      return null;
    }
    
    const { data: soundscape, error } = await supabase
      .from('journey_soundscapes')
      .select('*')
      .eq('journey_id', journey.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching soundscape:', error);
      return null;
    }
    
    if (!soundscape) {
      console.log(`No soundscape found for journey: ${journeySlug}`);
      
      // Try to find a matching soundscape by title similarity
      const { data: journey } = await supabase
        .from('journeys')
        .select('title')
        .eq('filename', journeySlug)
        .maybeSingle();
      
      if (journey?.title) {
        // Search for soundscapes with similar titles
        const { data: similarSoundscapes } = await supabase
          .from('journey_soundscapes')
          .select('*')
          .ilike('title', `%${journey.title.split(' ')[0]}%`)
          .limit(1);
        
        if (similarSoundscapes && similarSoundscapes.length > 0) {
          return similarSoundscapes[0];
        }
      }
      
      // Return a default soundscape if no matches found
      return {
        id: 'default',
        title: journey?.title || 'Meditation Soundscape',
        file_url: '/sounds/focus-ambient.mp3',
        source_type: 'file'
      };
    }
    
    return soundscape;
  } catch (err) {
    console.error("Error in fetchJourneySoundscape:", err);
    return null;
  }
};

export const getAllSoundscapes = async (): Promise<JourneySoundscape[]> => {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .select('*')
      .order('title');
    
    if (error) {
      console.error('Error fetching all soundscapes:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error("Error in getAllSoundscapes:", err);
    throw err;
  }
};

export const createJourneySoundscape = async (soundscape: Omit<JourneySoundscape, 'id' | 'created_at' | 'updated_at'>): Promise<JourneySoundscape> => {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .insert([soundscape])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating soundscape:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error("Error in createJourneySoundscape:", err);
    throw err;
  }
};

export const updateJourneySoundscape = async (id: string, soundscape: Partial<JourneySoundscape>): Promise<JourneySoundscape> => {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .update(soundscape)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating soundscape:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error("Error in updateJourneySoundscape:", err);
    throw err;
  }
};

export const deleteJourneySoundscape = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('journey_soundscapes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting soundscape:', error);
      throw error;
    }
  } catch (err) {
    console.error("Error in deleteJourneySoundscape:", err);
    throw err;
  }
};
