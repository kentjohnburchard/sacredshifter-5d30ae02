
import { supabase } from '@/integrations/supabase/client';
import { Journey } from '@/types/journey';
import { getAllJourneys } from '@/utils/coreJourneyLoader';

// Fetch a specific journey by slug
export async function fetchJourneyBySlug(slug: string): Promise<Journey | null> {
  console.log(`Fetching journey with slug: ${slug}`);
  
  try {
    // Normalize the slug (remove .md extension if present)
    const normalizedSlug = slug.replace(/\.md$/, '');
    
    // First try to get journey from database by slug
    let { data: journeyData, error } = await supabase
      .from('journeys')
      .select('*')
      .eq('slug', normalizedSlug)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching journey from database:', error);
    }
    
    // If found in database, return it
    if (journeyData) {
      console.log('Found journey in database:', journeyData.title);
      return journeyData as Journey;
    }
    
    // If not found in database, try to get from core_content
    console.log('Journey not found in database, checking core_content');
    const coreJourneys = await getAllJourneys([]);
    
    // First try direct match on slug
    let journey = coreJourneys.find(j => j.slug === normalizedSlug);
    
    // Then try to match by filename (with or without .md)
    if (!journey) {
      journey = coreJourneys.find(j => {
        if (!j.filename) return false;
        const cleanFilename = j.filename.replace(/\.md$/, '');
        return cleanFilename === normalizedSlug || 
               // Allow for journey_ prefix in filenames
               cleanFilename === `journey_${normalizedSlug}` ||
               // Try kebab-case conversion from snake_case (without journey_ prefix)
               cleanFilename.replace(/^journey_/, '').replace(/_/g, '-') === normalizedSlug;
      });
    }
    
    // Try matching by ID as string
    if (!journey) {
      journey = coreJourneys.find(j => j.id && j.id.toString() === normalizedSlug);
    }
    
    if (journey) {
      console.log('Found journey in core_content:', journey.title);
      return journey;
    }
    
    console.error(`Journey with slug "${slug}" not found in any source`);
    return null;
  } catch (err) {
    console.error('Error in fetchJourneyBySlug:', err);
    throw err;
  }
}

// Fetch all journeys
export async function fetchJourneys(): Promise<Journey[]> {
  try {
    const { data, error } = await supabase
      .from('journeys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching journeys:', error);
      return [];
    }
    
    return data as Journey[];
  } catch (err) {
    console.error('Error in fetchJourneys:', err);
    return [];
  }
}

// Create a new journey
export async function createJourney(journeyData: Partial<Journey>): Promise<Journey> {
  try {
    const { data, error } = await supabase
      .from('journeys')
      .insert(journeyData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating journey:', error);
      throw error;
    }
    
    return data as Journey;
  } catch (err) {
    console.error('Error in createJourney:', err);
    throw err;
  }
}

// Update an existing journey
export async function updateJourney(id: string | number, journeyData: Partial<Journey>): Promise<Journey> {
  try {
    const { data, error } = await supabase
      .from('journeys')
      .update(journeyData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating journey:', error);
      throw error;
    }
    
    return data as Journey;
  } catch (err) {
    console.error('Error in updateJourney:', err);
    throw err;
  }
}

// Soundscape related functions
interface Soundscape {
  id?: string;
  journey_id: number;
  title: string;
  description?: string;
  file_url: string;
  source_link?: string;
  source_type: 'file' | 'youtube';
}

// Fetch all soundscapes, optionally filtered by journey_id
export async function fetchJourneySoundscapes(journeyId?: string | number | null): Promise<any[]> {
  try {
    let query = supabase
      .from('journey_soundscapes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (journeyId) {
      query = query.eq('journey_id', journeyId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching soundscapes:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in fetchJourneySoundscapes:', err);
    return [];
  }
}

// Create a new soundscape
export async function createJourneySoundscape(soundscapeData: Soundscape): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .insert(soundscapeData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating soundscape:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in createJourneySoundscape:', err);
    throw err;
  }
}

// Update an existing soundscape
export async function updateJourneySoundscape(id: string, soundscapeData: Partial<Soundscape>): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .update(soundscapeData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating soundscape:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in updateJourneySoundscape:', err);
    throw err;
  }
}

// Delete a soundscape
export async function deleteJourneySoundscape(id: string): Promise<void> {
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
    console.error('Error in deleteJourneySoundscape:', err);
    throw err;
  }
}
