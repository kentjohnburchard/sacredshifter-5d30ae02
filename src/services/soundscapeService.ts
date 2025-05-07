
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions using Supabase-generated types
type JourneySoundscapeRow = Database['public']['Tables']['journey_soundscapes']['Row'];
type JourneySoundscapeInsert = Database['public']['Tables']['journey_soundscapes']['Insert'];
type JourneySoundscapeUpdate = Database['public']['Tables']['journey_soundscapes']['Update'];

// Export the main type for use in components
export type JourneySoundscape = JourneySoundscapeRow;

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
        source_type: 'file',
        created_at: new Date().toISOString(),
        chakra_tag: null,
        journey_id: null,
        updated_at: null
      } as JourneySoundscapeRow;
    }
    
    // If no soundscape or audio_filename found, return null
    return null;
    
  } catch (err) {
    console.error('Error in fetchJourneySoundscape:', err);
    return null;
  }
};

// Create a new journey soundscape
export const createJourneySoundscape = async (soundscape: JourneySoundscapeInsert): Promise<JourneySoundscapeRow | null> => {
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

// Update an existing journey soundscape
export const updateJourneySoundscape = async (id: string, updates: JourneySoundscapeUpdate): Promise<JourneySoundscapeRow> => {
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

// Delete a journey soundscape
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

// Validate YouTube URL format
export const validateYoutubeUrl = (url: string): boolean => {
  // Simple validation for YouTube URLs
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
};
