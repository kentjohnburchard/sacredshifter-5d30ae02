
import { supabase } from '@/integrations/supabase/client';
import { parseJourneyFrontmatter } from '@/utils/journeyLoader';

interface JourneyAudio {
  journey_id: number;
  filename: string;
  frequency: string | null;
  audio_filename: string | null;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Extract frequency information from journey content
 */
export const extractFrequencyFromContent = (content: string | null): string | null => {
  if (!content) return null;
  
  // First try to get it from frontmatter
  try {
    const frontmatter = parseJourneyFrontmatter(content);
    if (frontmatter.frequency) {
      return frontmatter.frequency.toString();
    }
  } catch (err) {
    console.error('Error parsing frontmatter:', err);
  }
  
  // If not in frontmatter, try to find it in content with regex
  const frequencyMatches = content.match(/(\d+)(?:\s*)?(?:hz|Hz|HZ)/g);
  if (frequencyMatches && frequencyMatches.length > 0) {
    // Extract just the number from the first match
    const frequencyMatch = frequencyMatches[0].match(/(\d+)/);
    if (frequencyMatch && frequencyMatch[1]) {
      return `${frequencyMatch[1]}Hz`;
    }
  }
  
  // As a last resort, look for sound_frequencies field text
  const soundFreqMatch = content.match(/sound_frequencies\s*:\s*["']?([^"'\n]+)["']?/i);
  if (soundFreqMatch && soundFreqMatch[1]) {
    return soundFreqMatch[1].trim();
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
 * Get journey audio mapping 
 */
export const getJourneyAudioMapping = async (journeyId: number): Promise<JourneyAudio | null> => {
  try {
    const { data, error } = await supabase
      .from('journey_audio_mappings')
      .select('*')
      .eq('journey_id', journeyId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching journey audio mapping:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getJourneyAudioMapping:', err);
    return null;
  }
};

/**
 * Create or update journey audio mapping
 */
export const updateJourneyAudioMapping = async (
  journeyId: number, 
  audioFilename: string | null,
  isEnabled: boolean = true
): Promise<JourneyAudio | null> => {
  try {
    // Get journey content to extract frequency
    const { data: journey, error: journeyError } = await supabase
      .from('journeys')
      .select('content, filename')
      .eq('id', journeyId)
      .maybeSingle();
    
    if (journeyError) {
      console.error('Error fetching journey:', journeyError);
      return null;
    }
    
    const frequency = extractFrequencyFromContent(journey?.content || null);
    
    // Check if mapping already exists
    const { data: existing } = await supabase
      .from('journey_audio_mappings')
      .select('*')
      .eq('journey_id', journeyId)
      .maybeSingle();
    
    if (existing) {
      // Update existing mapping
      const { data, error } = await supabase
        .from('journey_audio_mappings')
        .update({
          audio_filename: audioFilename,
          is_enabled: isEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('journey_id', journeyId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating journey audio mapping:', error);
        return null;
      }
      
      return data;
    } else {
      // Create new mapping
      const { data, error } = await supabase
        .from('journey_audio_mappings')
        .insert({
          journey_id: journeyId,
          filename: journey?.filename || '',
          frequency,
          audio_filename: audioFilename,
          is_enabled: isEnabled,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating journey audio mapping:', error);
        return null;
      }
      
      return data;
    }
  } catch (err) {
    console.error('Error in updateJourneyAudioMapping:', err);
    return null;
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
