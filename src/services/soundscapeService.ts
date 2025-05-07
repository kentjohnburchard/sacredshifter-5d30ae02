
import { supabase } from '@/integrations/supabase/client';

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
