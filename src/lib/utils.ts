
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "0:00";
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getFrequencyDescription(frequency: number | string | undefined): string {
  if (!frequency) return "Unknown frequency";
  
  // Convert to number if it's a string
  const freq = typeof frequency === 'string' ? parseFloat(frequency) : frequency;
  
  // Solfeggio frequencies and their meanings
  const solfeggioMeanings: Record<number, string> = {
    396: "Liberation from fear and guilt",
    417: "Facilitating change and undoing situations",
    528: "Transformation and DNA repair",
    639: "Connection and relationships",
    741: "Awakening intuition",
    852: "Returning to spiritual order",
    963: "Divine consciousness and enlightenment"
  };
  
  // Try to find exact match
  if (solfeggioMeanings[freq]) {
    return solfeggioMeanings[freq];
  }
  
  // General frequency ranges and meanings
  if (freq < 100) {
    return "Very low frequency - Grounding and foundation";
  } else if (freq < 300) {
    return "Low frequency - Security and physical healing";
  } else if (freq < 500) {
    return "Mid frequency - Personal power and transformation";
  } else if (freq < 700) {
    return "Heart frequency - Love and connection";
  } else if (freq < 900) {
    return "High frequency - Expression and clarity";
  } else {
    return "Very high frequency - Spiritual awareness";
  }
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
