
import { supabase } from '@/integrations/supabase/client';

/**
 * Extract frequency information from journey filename or title
 */
export const extractFrequencyFromContent = (
  title: string | null, 
  filename: string | null
): string | null => {
  if (!title && !filename) return null;
  
  // Check in title first
  if (title) {
    // Look for frequency patterns like 432Hz in the title
    const frequencyMatches = title.match(/(\d+)(?:\s*)?(?:hz|Hz|HZ)/g);
    if (frequencyMatches && frequencyMatches.length > 0) {
      // Extract just the number from the first match
      const frequencyMatch = frequencyMatches[0].match(/(\d+)/);
      if (frequencyMatch && frequencyMatch[1]) {
        return `${frequencyMatch[1]}Hz`;
      }
    }
  }
  
  // Then check in filename
  if (filename) {
    const frequencyMatches = filename.match(/(\d+)(?:\s*)?(?:hz|Hz|HZ)/g);
    if (frequencyMatches && frequencyMatches.length > 0) {
      // Extract just the number from the first match
      const frequencyMatch = frequencyMatches[0].match(/(\d+)/);
      if (frequencyMatch && frequencyMatch[1]) {
        return `${frequencyMatch[1]}Hz`;
      }
    }
  }
  
  return null;
};

/**
 * Find matching audio files based on frequency or journey slug
 */
export const findMatchingAudioFiles = async (frequency: string | null, journeySlug: string): Promise<string[]> => {
  try {
    const matches: string[] = [];
    
    // Clean frequency for filename matching
    const cleanFrequency = frequency?.replace(/\s+/g, '').toLowerCase();
    
    // Check for direct journey slug matches
    if (journeySlug) {
      const { data: slugMatches } = await supabase
        .storage
        .from('frequency-assets')
        .list('', {
          search: journeySlug
        });
      
      if (slugMatches && slugMatches.length > 0) {
        slugMatches
          .filter(file => file.name.endsWith('.mp3'))
          .forEach(file => matches.push(file.name));
      }
    }
    
    // Check for frequency matches if we have a frequency
    if (cleanFrequency) {
      const { data: freqMatches } = await supabase
        .storage
        .from('frequency-assets')
        .list('', {
          search: cleanFrequency
        });
      
      if (freqMatches && freqMatches.length > 0) {
        freqMatches
          .filter(file => file.name.endsWith('.mp3') && !matches.includes(file.name))
          .forEach(file => matches.push(file.name));
      }
    }
    
    return matches;
  } catch (err) {
    console.error('Error finding matching audio files:', err);
    return [];
  }
};

/**
 * Update journey with audio filename
 */
export const updateJourneyAudio = async (
  journeyId: number, 
  audioFilename: string | null
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('journeys')
      .update({ 
        audio_filename: audioFilename,
        updated_at: new Date().toISOString()
      })
      .eq('id', journeyId);
    
    if (error) {
      console.error('Error updating journey audio mapping:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateJourneyAudio:', err);
    return false;
  }
};

/**
 * Get audio file URL from filename
 */
export const getAudioFileUrl = (filename: string): string => {
  if (!filename) return '';
  
  // Check if it's already a full URL
  if (filename.startsWith('http')) {
    return filename;
  }
  
  // Create Supabase storage URL
  return `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${filename}`;
};

/**
 * Get all available audio files from storage
 */
export const getAllAudioFiles = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .storage
      .from('frequency-assets')
      .list('', {
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) {
      console.error('Error listing audio files:', error);
      return [];
    }
    
    return data
      .filter(file => file.name.endsWith('.mp3'))
      .map(file => file.name);
  } catch (err) {
    console.error('Error in getAllAudioFiles:', err);
    return [];
  }
};
