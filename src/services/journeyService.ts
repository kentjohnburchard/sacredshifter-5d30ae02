import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch all journeys from the database
 */
export async function fetchJourneys() {
  try {
    const { data, error } = await supabase
      .from('journeys')
      .select('id, title, filename')
      .order('title', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching journeys:', error);
    return [];
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
