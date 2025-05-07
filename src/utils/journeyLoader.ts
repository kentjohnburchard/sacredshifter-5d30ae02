
import { findFrequencyData } from '@/utils/frequencyUtils';
import { Journey } from '@/types/journey';

// Extract frequency value from string like "123 Hz" or "Some text 123hz"
export function extractFrequencyValue(text?: string): number | null {
  if (!text) return null;
  
  const regex = /\b(\d+(?:\.\d+)?)\s*hz\b/i;
  const match = text.match(regex);
  
  if (match && match[1]) {
    return parseFloat(match[1]);
  }
  
  return null;
}

// Fix slugs for URLs
export function fileNameToSlug(filename: string): string {
  return filename
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
}

// Convert slug to more readable title
export function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

// Get frequency from journey content
export function getJourneyFrequency(journey: Journey): number | null {
  if (journey.sound_frequencies) {
    return extractFrequencyValue(journey.sound_frequencies.toString());
  }
  
  return null;
}

// Find recommended visualization for a journey
export function getJourneyVisualization(journey: Journey): string {
  const frequency = getJourneyFrequency(journey);
  
  if (!frequency) return 'default';
  
  const frequencyData = findFrequencyData(frequency);
  
  if (frequencyData?.visualTheme) {
    return frequencyData.visualTheme;
  }
  
  // Default visualization mapping based on frequency ranges
  if (frequency <= 40) return 'earth-tones';
  if (frequency <= 174) return 'fire-essence';
  if (frequency <= 417) return 'solar-radiance';
  if (frequency <= 639) return 'ethereal-mist';
  if (frequency <= 852) return 'ocean-depths';
  
  return 'cosmic-violet';
}
