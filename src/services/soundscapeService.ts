
import { supabase } from '@/integrations/supabase/client';

// Type definition for JourneySoundscape
export interface JourneySoundscape {
  id?: string;
  journey_id?: string;
  title?: string;
  description?: string;
  file_url?: string;
  source_link?: string;
  source_type?: 'file' | 'youtube';
  created_at?: string;
  chakra_tag?: string;
}

export const fetchJourneySoundscape = async (journeySlug: string) => {
  try {
    // Try to fetch from the journey_soundscapes table using the built-in function
    const { data, error } = await supabase
      .rpc('get_journey_soundscape', { journey_slug: journeySlug });
    
    if (error) {
      console.error('Error fetching journey soundscape:', error);
      throw error;
    }
    
    // If we found a soundscape, return it
    if (data && data.length > 0) {
      return data[0];
    }
    
    // If no soundscape found, check if there's an audio_filename in the journey
    const { data: journeyData, error: journeyError } = await supabase
      .from('journeys')
      .select('audio_filename')
      .eq('filename', journeySlug)
      .single();
    
    if (journeyError) {
      console.error('Error fetching journey audio filename:', journeyError);
      return null;
    }
    
    // If we have an audio_filename, construct a file URL
    if (journeyData?.audio_filename) {
      return {
        id: null,
        title: 'Journey Soundscape',
        description: 'Sacred frequency audio',
        file_url: `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${journeyData.audio_filename}`,
        source_link: null,
        created_at: new Date().toISOString()
      };
    }
    
    // If no soundscape or audio_filename found, return null
    return null;
    
  } catch (err) {
    console.error('Error in fetchJourneySoundscape:', err);
    return null;
  }
};

// New functions needed by SoundscapeManager
export const createJourneySoundscape = async (soundscape: Partial<JourneySoundscape>): Promise<JourneySoundscape | null> => {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .insert(soundscape)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating journey soundscape:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in createJourneySoundscape:', err);
    return null;
  }
};

export const updateJourneySoundscape = async (id: string, updates: Partial<JourneySoundscape>): Promise<JourneySoundscape> => {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating journey soundscape:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in updateJourneySoundscape:', err);
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
      console.error('Error deleting journey soundscape:', error);
      throw error;
    }
  } catch (err) {
    console.error('Error in deleteJourneySoundscape:', err);
    throw err;
  }
};

export const validateYoutubeUrl = (url: string): boolean => {
  // Simple validation for YouTube URLs
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
};
