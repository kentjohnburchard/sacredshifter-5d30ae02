
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

export const fetchJourneySoundscape = async (journeySlug: string): Promise<JourneySoundscape | null> => {
  try {
    // First check if there's a mapping in journey_audio_mappings
    const { data: journey, error: journeyError } = await supabase
      .from('journeys')
      .select('id, filename, title')
      .eq('filename', journeySlug)
      .maybeSingle();
    
    if (journeyError) {
      console.error(`Error getting journey with slug ${journeySlug}:`, journeyError);
      return null;
    }
    
    if (journey) {
      // Get audio mapping if available
      const { data: audioMapping, error: mappingError } = await supabase
        .from('journey_audio_mappings')
        .select('*')
        .eq('journey_id', journey.id)
        .eq('is_enabled', true)
        .maybeSingle();
      
      if (!mappingError && audioMapping && audioMapping.audio_filename) {
        return {
          journey_id: journey.id.toString(),
          title: `${journey.title} Soundscape`,
          file_url: getAudioFileUrl(audioMapping.audio_filename),
          source_type: 'file',
          created_at: audioMapping.created_at
        };
      }
    }
    
    // Try the original database method if mapping not available
    const { data: soundscape } = await supabase.rpc('get_journey_soundscape', {
      journey_slug: journeySlug
    });
    
    if (soundscape) {
      return {
        id: soundscape.id,
        journey_id: soundscape.journey_id?.toString(),
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
  journeyId: number, 
  data: Omit<JourneySoundscape, 'id' | 'journey_id' | 'created_at'>
): Promise<JourneySoundscape | null> => {
  try {
    const { data: result, error } = await supabase
      .from('journey_soundscapes')
      .insert({
        journey_id: journeyId,
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
      journey_id: result.journey_id?.toString(),
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
