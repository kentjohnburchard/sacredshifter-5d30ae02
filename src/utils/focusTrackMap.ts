
/**
 * Maps frequency values to their corresponding audio tracks in Supabase storage
 */

interface FrequencyTrack {
  frequency: number;
  pureTone: string;
  ambient: string;
  affirmation: string;
  displayName: string;
  description: string;
}

export type SoundMode = 'pureTone' | 'ambient' | 'affirmation';

// Create a map of frequencies to their corresponding audio tracks
export const frequencyTracks: Record<number, FrequencyTrack> = {
  396: {
    frequency: 396,
    pureTone: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/396Hz_pure_tone.mp3",
    ambient: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/396Hz_Liberation_from_Fear.mp3",
    affirmation: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/396Hz_Liberation_affirmations.mp3",
    displayName: "Liberation Tone",
    description: "Helps clear mental blocks and negative thought patterns that interfere with focus"
  },
  432: {
    frequency: 432,
    pureTone: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/432Hz_pure_tone.mp3",
    ambient: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/432Hz_Natural_Harmony.mp3",
    affirmation: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/432Hz_Harmony_affirmations.mp3",
    displayName: "Natural Harmony",
    description: "Aligns with the natural frequency of the universe, promoting a state of relaxed alertness"
  },
  528: {
    frequency: 528,
    pureTone: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/528Hz_pure_tone.mp3",
    ambient: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/528Hz_Transformation.mp3",
    affirmation: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/528Hz_Transformation_affirmations.mp3",
    displayName: "Transformation",
    description: "Promotes clarity of mind and enhanced cognitive function for complex problem-solving"
  }
};

/**
 * Gets the audio URL for a specific frequency and sound mode
 * Falls back to generated tone if the audio file isn't available
 */
export const getFrequencyAudioUrl = (frequency: number, mode: SoundMode = 'pureTone'): string => {
  const track = frequencyTracks[frequency];
  
  if (!track) {
    console.warn(`No track found for frequency ${frequency}Hz`);
    return "";
  }
  
  return track[mode] || track.pureTone;
};

/**
 * Gets frequency track information by frequency
 */
export const getFrequencyTrackInfo = (frequency: number): FrequencyTrack | undefined => {
  return frequencyTracks[frequency];
};
