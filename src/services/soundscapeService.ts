
import { supabase } from '@/integrations/supabase/client';
import { getAudioFileUrl } from './journeyAudioService';

export interface JourneySoundscape {
  id?: string;
  journey_id?: string;
  title: string;
  description?: string;
  file_url: string;
  source_type: 'file' | 'youtube';
  source_link?: string;
  created_at?: string;
  chakra_tag?: string;
}

// Regex pattern to validate YouTube URLs
const YOUTUBE_URL_PATTERN = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;

// Validate YouTube URL format
export const validateYoutubeUrl = (url: string): boolean => {
  return YOUTUBE_URL_PATTERN.test(url);
};

export const fetchJourneySoundscape = async (journeySlug: string): Promise<JourneySoundscape | null> => {
  try {
    // First check if there's a journey with this slug
    const { data: journey, error: journeyError } = await supabase
      .from('journeys')
      .select('id, filename, title, audio_filename')
      .eq('filename', journeySlug)
      .maybeSingle();
    
    if (journeyError) {
      console.error(`Error getting journey with slug ${journeySlug}:`, journeyError);
      return null;
    }
    
    if (journey && journey.audio_filename) {
      return {
        journey_id: String(journey.id),
        title: `${journey.title} Soundscape`,
        file_url: getAudioFileUrl(journey.audio_filename),
        source_type: 'file',
      };
    }
    
    // Try the journey_soundscapes table as fallback
    const { data: soundscape } = await supabase.rpc('get_journey_soundscape', {
      journey_slug: journeySlug
    });
    
    if (soundscape) {
      return {
        id: soundscape.id,
        journey_id: soundscape.journey_id ? String(soundscape.journey_id) : undefined,
        title: soundscape.title,
        description: soundscape.description,
        file_url: soundscape.file_url,
        source_type: soundscape.source_link ? 'youtube' : 'file',
        source_link: soundscape.source_link,
        created_at: soundscape.created_at,
      };
    }
    
    return null;
  } catch (err) {
    console.error(`Error fetching soundscape for journey ${journeySlug}:`, err);
    return null;
  }
};

export const createJourneySoundscape = async (
  data: Omit<JourneySoundscape, 'id' | 'created_at'> & { journey_id: string }
): Promise<JourneySoundscape | null> => {
  try {
    const { data: result, error } = await supabase
      .from('journey_soundscapes')
      .insert({
        journey_id: parseInt(data.journey_id),
        title: data.title,
        description: data.description || null,
        file_url: data.file_url,
        source_link: data.source_type === 'youtube' ? data.source_link : null,
        chakra_tag: data.chakra_tag || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating journey soundscape:', error);
      return null;
    }
    
    return {
      id: result.id,
      journey_id: String(result.journey_id),
      title: result.title,
      description: result.description,
      file_url: result.file_url,
      source_type: result.source_link ? 'youtube' : 'file',
      source_link: result.source_link,
      created_at: result.created_at,
      chakra_tag: result.chakra_tag
    };
  } catch (err) {
    console.error('Error in createJourneySoundscape:', err);
    return null;
  }
};

export const updateJourneySoundscape = async (
  id: string,
  data: Partial<Omit<JourneySoundscape, 'id' | 'created_at'>> & { journey_id?: string }
): Promise<JourneySoundscape | null> => {
  try {
    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.file_url) updateData.file_url = data.file_url;
    if (data.journey_id) updateData.journey_id = parseInt(data.journey_id);
    if (data.chakra_tag !== undefined) updateData.chakra_tag = data.chakra_tag;
    
    if (data.source_type) {
      updateData.source_link = data.source_type === 'youtube' && data.source_link ? data.source_link : null;
    }
    
    const { data: result, error } = await supabase
      .from('journey_soundscapes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating journey soundscape:', error);
      return null;
    }
    
    return {
      id: result.id,
      journey_id: String(result.journey_id),
      title: result.title,
      description: result.description,
      file_url: result.file_url,
      source_type: result.source_link ? 'youtube' : 'file',
      source_link: result.source_link,
      created_at: result.created_at,
      chakra_tag: result.chakra_tag
    };
  } catch (err) {
    console.error('Error in updateJourneySoundscape:', err);
    return null;
  }
};

export const deleteJourneySoundscape = async (id: string): Promise<boolean> => {
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
  } catch (err) {
    console.error('Error in deleteJourneySoundscape:', err);
    return false;
  }
};
