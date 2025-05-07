
import { supabase } from '@/integrations/supabase/client';

export interface JourneySoundscape {
  id: string;
  journey_id: number | string;
  title: string;
  description: string | null;
  file_url: string;
  source_link: string | null;
  source_type: 'file' | 'youtube';
  created_at: string;
  chakra_tag?: string | null;
}

export async function fetchJourneySoundscape(journeySlug: string): Promise<JourneySoundscape | null> {
  if (!journeySlug) return null;
  
  try {
    // First get the journey ID from the filename
    const { data: journeyData, error: journeyError } = await supabase
      .from('journeys')
      .select('id')
      .eq('filename', journeySlug)
      .single();
    
    if (journeyError || !journeyData) {
      console.error('Error fetching journey by slug:', journeyError);
      return null;
    }
    
    // Then get the soundscape using the journey ID
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .select('id, journey_id, title, description, file_url, source_link, source_type, created_at, chakra_tag')
      .eq('journey_id', journeyData.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching journey soundscape:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      journey_id: data.journey_id,
      title: data.title,
      description: data.description,
      file_url: data.file_url,
      source_link: data.source_link,
      source_type: (data.source_type || (data.source_link ? 'youtube' : 'file')) as 'file' | 'youtube',
      created_at: data.created_at,
      chakra_tag: data.chakra_tag || null
    };
  } catch (error) {
    console.error('Error in fetchJourneySoundscape:', error);
    return null;
  }
}

/**
 * Validates if a URL is a valid YouTube URL
 */
export function validateYoutubeUrl(url: string): boolean {
  // Simple regex to match common YouTube URL formats
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return regex.test(url);
}

interface SoundscapeData {
  title: string;
  description?: string;
  journey_id: string | number;
  file_url: string;
  source_link?: string;
  source_type: 'file' | 'youtube';
  chakra_tag?: string;
}

export async function createJourneySoundscape(
  data: SoundscapeData
): Promise<JourneySoundscape | null> {
  try {
    const { data: result, error } = await supabase
      .from('journey_soundscapes')
      .insert([
        {
          journey_id: Number(data.journey_id),
          title: data.title,
          file_url: data.file_url,
          description: data.description,
          source_link: data.source_link,
          source_type: data.source_type,
          chakra_tag: data.chakra_tag
        }
      ])
      .select('id, journey_id, title, description, file_url, source_link, source_type, created_at, chakra_tag')
      .single();
    
    if (error) {
      console.error('Error creating journey soundscape:', error);
      return null;
    }
    
    return {
      id: result.id,
      journey_id: result.journey_id,
      title: result.title,
      description: result.description,
      file_url: result.file_url,
      source_link: result.source_link,
      source_type: result.source_type as 'file' | 'youtube',
      created_at: result.created_at,
      chakra_tag: result.chakra_tag
    };
  } catch (error) {
    console.error('Error in createJourneySoundscape:', error);
    return null;
  }
}

export async function updateJourneySoundscape(
  id: string,
  data: Partial<SoundscapeData>
): Promise<JourneySoundscape | null> {
  try {
    // Convert journey_id to number if present
    const updateData = {
      ...data,
      journey_id: data.journey_id ? Number(data.journey_id) : undefined
    };

    const { data: result, error } = await supabase
      .from('journey_soundscapes')
      .update(updateData)
      .eq('id', id)
      .select('id, journey_id, title, description, file_url, source_link, source_type, created_at, chakra_tag')
      .single();
    
    if (error) {
      console.error('Error updating journey soundscape:', error);
      return null;
    }
    
    return {
      id: result.id,
      journey_id: result.journey_id,
      title: result.title,
      description: result.description,
      file_url: result.file_url,
      source_link: result.source_link,
      source_type: result.source_type as 'file' | 'youtube',
      created_at: result.created_at,
      chakra_tag: result.chakra_tag
    };
  } catch (error) {
    console.error('Error in updateJourneySoundscape:', error);
    return null;
  }
}

export async function deleteJourneySoundscape(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('journey_soundscapes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting journey soundscape:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteJourneySoundscape:', error);
    return false;
  }
}
