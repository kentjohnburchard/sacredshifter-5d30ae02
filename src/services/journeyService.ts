
import { supabase } from '@/integrations/supabase/client';
import { Journey } from '@/types/journey';

/**
 * Fetch all journeys from the database
 */
export async function fetchJourneys() {
  try {
    const { data, error } = await supabase
      .from('journeys')
      .select('id, title, filename, tags, description, veil_locked, sound_frequencies, intent, chakra_tag')
      .order('title', { ascending: true });
    
    if (error) throw error;
    
    // Ensure all journeys have tags array to satisfy TS requirements
    const journeysWithTags = (data || []).map(journey => ({
      ...journey,
      tags: journey.tags ? 
        (typeof journey.tags === 'string' ? [journey.tags] : journey.tags) : 
        []
    }));
    
    return journeysWithTags as Journey[];
  } catch (error) {
    console.error('Error fetching journeys:', error);
    return [] as Journey[];
  }
}

/**
 * Fetch a specific journey by slug or filename
 */
export async function fetchJourneyBySlug(slug?: string) {
  if (!slug) return null;
  
  try {
    // First try to match by slug
    let { data, error } = await supabase
      .from('journeys')
      .select('*, tags')
      .eq('slug', slug)
      .single();
    
    // If not found by slug, try by filename
    if (!data) {
      const { data: filenameData, error: filenameError } = await supabase
        .from('journeys')
        .select('*, tags')
        .eq('filename', slug)
        .single();
        
      if (filenameError && filenameError.code !== 'PGRST116') {
        throw filenameError;
      }
      
      data = filenameData;
    }
    
    if (data) {
      // Ensure tags are always an array
      return {
        ...data,
        tags: data.tags ? 
          (typeof data.tags === 'string' ? [data.tags] : data.tags) : 
          []
      } as Journey;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching journey by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Create a new journey
 */
export async function createJourney(journeyData: Partial<Journey>) {
  try {
    const { data, error } = await supabase
      .from('journeys')
      .insert(journeyData)
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      tags: data.tags ? 
        (typeof data.tags === 'string' ? [data.tags] : data.tags) : 
        []
    } as Journey;
  } catch (error) {
    console.error('Error creating journey:', error);
    throw error;
  }
}

/**
 * Update an existing journey
 */
export async function updateJourney(id: number | string, journeyData: Partial<Journey>) {
  try {
    const { data, error } = await supabase
      .from('journeys')
      .update(journeyData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      tags: data.tags ? 
        (typeof data.tags === 'string' ? [data.tags] : data.tags) : 
        []
    } as Journey;
  } catch (error) {
    console.error('Error updating journey:', error);
    throw error;
  }
}

/**
 * Fetch soundscapes for a specific journey
 */
export async function fetchJourneySoundscapes(journeyId?: string | number | null) {
  try {
    let query = supabase.from('journey_soundscapes').select('*');
    
    if (journeyId) {
      query = query.eq('journey_id', journeyId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching journey soundscapes:', error);
    return [];
  }
}

/**
 * Create a new soundscape
 */
export async function createJourneySoundscape(soundscapeData: any) {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .insert(soundscapeData)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating soundscape:', error);
    throw error;
  }
}

/**
 * Update an existing soundscape
 */
export async function updateJourneySoundscape(id: string, soundscapeData: any) {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .update(soundscapeData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating soundscape:', error);
    throw error;
  }
}

/**
 * Delete a soundscape
 */
export async function deleteJourneySoundscape(id: string) {
  try {
    const { error } = await supabase
      .from('journey_soundscapes')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting soundscape:', error);
    throw error;
  }
}
