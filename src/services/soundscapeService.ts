
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions using Supabase-generated types
type JourneySoundscapeRow = Database['public']['Tables']['journey_soundscapes']['Row'];
type JourneySoundscapeInsert = Database['public']['Tables']['journey_soundscapes']['Insert'];
type JourneySoundscapeUpdate = Database['public']['Tables']['journey_soundscapes']['Update'];

// Export the main type for use in components
export type JourneySoundscape = JourneySoundscapeRow;

/**
 * Type guard to check if an object has all required JourneySoundscape properties
 * @param obj Any object to check
 * @returns Boolean indicating if the object matches the JourneySoundscape shape
 */
function isCompleteSoundscape(obj: any): obj is JourneySoundscape {
  return obj && 
    typeof obj.id === 'string' && 
    typeof obj.file_url === 'string' && 
    typeof obj.title === 'string' &&
    typeof obj.source_type === 'string';
}

/**
 * Create a complete JourneySoundscape object from partial data
 * This ensures all required fields exist even if the database doesn't return them
 */
function createCompleteSoundscape(data: Partial<JourneySoundscape>): JourneySoundscape {
  return {
    id: data.id || null,
    journey_id: data.journey_id || null,
    title: data.title || 'Journey Soundscape',
    description: data.description || null,
    file_url: data.file_url || '',
    source_link: data.source_link || null,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    chakra_tag: data.chakra_tag || null,
    source_type: data.source_type || 'file'
  } as JourneySoundscape; // Type assertion needed because of null values
}

/**
 * Fetches a soundscape for a specific journey
 * IMPORTANT: The database function get_journey_soundscape doesn't return all fields
 * required by the JourneySoundscape type. We explicitly add missing fields.
 */
export const fetchJourneySoundscape = async (journeySlug: string): Promise<JourneySoundscape | null> => {
  try {
    // Try to fetch from the journey_soundscapes table using the built-in function
    const { data, error } = await supabase
      .rpc('get_journey_soundscape', { journey_slug: journeySlug });
    
    if (error) {
      console.error('Error fetching journey soundscape:', error);
      throw error;
    }
    
    // If we found a soundscape, return it with all required fields
    if (data && data.length > 0) {
      // Map DB result to a complete JourneySoundscape object
      return createCompleteSoundscape({
        id: data[0].id,
        journey_id: data[0].journey_id,
        title: data[0].title, 
        description: data[0].description,
        file_url: data[0].file_url,
        source_link: data[0].source_link,
        created_at: data[0].created_at,
        // Add fields missing from the database function
        chakra_tag: null,
        source_type: 'file',
        updated_at: new Date().toISOString()
      });
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
    
    // If we have an audio_filename, construct a file URL and complete soundscape object
    if (journeyData?.audio_filename) {
      return createCompleteSoundscape({
        id: null,
        title: 'Journey Soundscape',
        description: 'Sacred frequency audio',
        file_url: `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${journeyData.audio_filename}`,
        source_link: null,
        source_type: 'file',
        created_at: new Date().toISOString(),
        chakra_tag: null,
        journey_id: null,
        updated_at: new Date().toISOString()
      });
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
    // Ensure required fields are set
    if (!soundscape.title || !soundscape.file_url) {
      throw new Error('Missing required fields for soundscape');
    }
    
    // Ensure source_type is set
    const completeInsert: JourneySoundscapeInsert = {
      ...soundscape,
      source_type: soundscape.source_type || 'file'
    };
    
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .insert(completeInsert)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating journey soundscape:', error);
      throw error;
    }
    
    // Verify we have a complete soundscape object before returning
    return isCompleteSoundscape(data) ? data : createCompleteSoundscape(data);
  } catch (err) {
    console.error('Error in createJourneySoundscape:', err);
    return null;
  }
};

// Update an existing journey soundscape
export const updateJourneySoundscape = async (id: string, updates: JourneySoundscapeUpdate): Promise<JourneySoundscapeRow> => {
  try {
    // Ensure updated_at is always set
    const completeUpdates: JourneySoundscapeUpdate = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .update(completeUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating journey soundscape:', error);
      throw error;
    }
    
    // Verify we have a complete soundscape object before returning
    if (!isCompleteSoundscape(data)) {
      throw new Error('Updated soundscape is missing required fields');
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
