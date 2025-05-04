
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface JourneySoundscape {
  id: string;
  journey_id: number;
  title: string;
  description: string | null;
  file_url: string;
  source_link: string | null;
  source_type: 'file' | 'youtube' | 'external';
  created_at: string;
}

export const fetchJourneySoundscape = async (journeySlug: string): Promise<JourneySoundscape | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_journey_soundscape', { journey_slug: journeySlug });
    
    if (error) {
      console.error('Error fetching journey soundscape:', error);
      return null;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Failed to fetch journey soundscape:', error);
    return null;
  }
};

export const fetchAllSoundscapes = async (): Promise<JourneySoundscape[]> => {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all soundscapes:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch all soundscapes:', error);
    return [];
  }
};

export const createJourneySoundscape = async (soundscape: Omit<JourneySoundscape, 'id' | 'created_at'>): Promise<JourneySoundscape | null> => {
  try {
    const { data, error } = await supabase
      .from('journey_soundscapes')
      .insert([soundscape])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating journey soundscape:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to create journey soundscape:', error);
    throw error;
  }
};

export const updateJourneySoundscape = async (id: string, updates: Partial<JourneySoundscape>): Promise<JourneySoundscape | null> => {
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
  } catch (error) {
    console.error('Failed to update journey soundscape:', error);
    throw error;
  }
};

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
  } catch (error) {
    console.error('Failed to delete journey soundscape:', error);
    throw error;
  }
};

export const uploadSoundscapeFile = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `soundscapes/${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('frequency-assets')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading soundscape file:', uploadError);
      throw uploadError;
    }
    
    return filePath;
  } catch (error) {
    console.error('Failed to upload soundscape file:', error);
    throw error;
  }
};

// YouTube URL utilities
export const extractYoutubeVideoId = (url: string): string | null => {
  // Handle various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const validateYoutubeUrl = (url: string): boolean => {
  const videoId = extractYoutubeVideoId(url);
  return videoId !== null;
};

export const getEmbedUrlFromYoutubeUrl = (url: string): string => {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) {
    return '';
  }
  return `https://www.youtube.com/embed/${videoId}`;
};
