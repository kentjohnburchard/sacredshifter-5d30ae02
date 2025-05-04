
import { supabase } from '@/integrations/supabase/client';

export interface JourneySoundscape {
  id: string;
  journey_id: number | null;
  title: string;
  description?: string;
  file_url: string;
  source_type: 'file' | 'youtube' | 'external';
  source_link?: string;
  created_at?: string;
  updated_at?: string;
}

export const fetchJourneySoundscape = async (
  journeySlug: string
): Promise<JourneySoundscape | null> => {
  // First, try to find a direct mapping
  const { data: journeySoundscape, error: soundscapeError } = await supabase
    .from('journey_soundscapes')
    .select('*')
    .eq('journey_id', parseInt(journeySlug))
    .maybeSingle();

  if (journeySoundscape && !soundscapeError) {
    return journeySoundscape as JourneySoundscape;
  }

  // If no direct mapping, try to find by frequency in journey data
  const { data: journey, error: journeyError } = await supabase
    .from('journeys')
    .select('*')
    .eq('filename', journeySlug)
    .maybeSingle();

  if (journeyError || !journey) {
    console.error('Error fetching journey:', journeyError);
    return null;
  }

  // Extract frequency from tags, title or content if available
  let frequency = null;
  const frequencyRegex = /(\d+)(\.\d+)?hz/i;
  
  // Check in tags
  if (journey.tags) {
    const match = journey.tags.match(frequencyRegex);
    if (match) frequency = match[1];
  }
  
  // Check in title if not found in tags
  if (!frequency && journey.title) {
    const match = journey.title.match(frequencyRegex);
    if (match) frequency = match[1];
  }

  // If frequency found, try to find matching audio
  if (frequency) {
    // Check for direct file match first (e.g., 528hz.mp3)
    const audioUrl = `/audio/${frequency}hz.mp3`;
    
    // Return constructed soundscape object
    return {
      id: `auto-${journeySlug}`,
      journey_id: journey.id,
      title: `${frequency}Hz Frequency`,
      description: `Automatic frequency match for ${journey.title}`,
      file_url: audioUrl,
      source_type: 'file'
    };
  }

  // No mapping found
  return null;
};

// Add a function to get all soundscapes
export const fetchAllJourneySoundscapes = async (): Promise<JourneySoundscape[]> => {
  const { data, error } = await supabase
    .from('journey_soundscapes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching soundscapes:', error);
    throw error;
  }

  return data as JourneySoundscape[];
};

// Added function to create a soundscape
export const createJourneySoundscape = async (soundscape: Omit<JourneySoundscape, 'id' | 'created_at' | 'updated_at'>): Promise<JourneySoundscape> => {
  const { data, error } = await supabase
    .from('journey_soundscapes')
    .insert([soundscape])
    .select()
    .single();

  if (error) {
    console.error('Error creating soundscape:', error);
    throw error;
  }

  return data as JourneySoundscape;
};

// Added function to update a soundscape
export const updateJourneySoundscape = async (id: string, updates: Partial<JourneySoundscape>): Promise<JourneySoundscape> => {
  const { data, error } = await supabase
    .from('journey_soundscapes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating soundscape:', error);
    throw error;
  }

  return data as JourneySoundscape;
};

// Added function to delete a soundscape
export const deleteJourneySoundscape = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('journey_soundscapes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting soundscape:', error);
    throw error;
  }
};

// Added function to validate YouTube URLs
export const extractYoutubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
};

// Added function to validate YouTube URLs
export const validateYoutubeUrl = (url: string): boolean => {
  return !!extractYoutubeVideoId(url);
};

// Mock function for file upload (would typically connect to storage)
export const uploadSoundscapeFile = async (file: File): Promise<string> => {
  // In a real implementation, this would upload to Supabase storage
  console.log('File would be uploaded:', file.name);
  return `/audio/${file.name}`;
};
