/**
 * Maps frequency values to their corresponding audio tracks in Supabase storage
 */

import { isPrime } from './primeCalculations';
// import { calculatePrimeFactors } from './primeCalculations'; - REMOVED

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
  },
  639: {
    frequency: 639,
    pureTone: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/639Hz_pure_tone.mp3",
    ambient: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/639Hz_Connection.mp3",
    affirmation: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/639Hz_Connection_affirmations.mp3",
    displayName: "Connection Frequency",
    description: "Heart Chakra frequency that harmonizes relationships and connections"
  },
  741: {
    frequency: 741,
    pureTone: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/741Hz_pure_tone.mp3",
    ambient: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/741Hz_Expression.mp3",
    affirmation: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/741Hz_Expression_affirmations.mp3",
    displayName: "Expression Frequency",
    description: "Throat Chakra frequency that awakens intuition and expression"
  },
  852: {
    frequency: 852,
    pureTone: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/852Hz_pure_tone.mp3",
    ambient: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/852Hz_Intuition.mp3",
    affirmation: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/852Hz_Intuition_affirmations.mp3",
    displayName: "Intuition Frequency",
    description: "Third Eye Chakra frequency that awakens spiritual insight"
  },
  963: {
    frequency: 963,
    pureTone: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/963Hz_pure_tone.mp3",
    ambient: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/963Hz_Consciousness.mp3",
    affirmation: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/963Hz_Consciousness_affirmations.mp3",
    displayName: "Divine Frequency",
    description: "Crown Chakra frequency that connects to higher consciousness and divine wisdom"
  }
};

/**
 * Gets the audio URL for a specific frequency and sound mode
 * Falls back to generated tone if the audio file isn't available
 */
export const getFrequencyAudioUrl = (frequency: number, mode: SoundMode = 'ambient'): string => {
  // Look up in our predefined tracks
  const track = frequencyTracks[frequency];
  
  if (track) {
    return track[mode] || track.pureTone;
  }
  
  // If we don't have this frequency in our map, return a generic URL pattern
  return `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${frequency}Hz_pure_tone.mp3`;
};

/**
 * Gets frequency track information by frequency
 */
export const getFrequencyTrackInfo = (frequency: number): FrequencyTrack | undefined => {
  return frequencyTracks[frequency];
};

/**
 * Generate a frequency description based on its value and mathematical properties
 */
export const getFrequencyDescription = (frequency: number): string => {
  // Check if it's in our predefined catalog
  if (frequencyTracks[frequency]) {
    return frequencyTracks[frequency].description;
  }
  
  // Generate descriptions for non-catalog frequencies
  let description = `${frequency}Hz frequency`;
  
  // Add mathematical properties to the description
  if (isPrime(frequency)) {
    description += " (Prime Frequency)";
  } else {
    // Replace calculatePrimeFactors with simple message
    description += " (Compound Frequency)";
  }
  
  return description;
};
