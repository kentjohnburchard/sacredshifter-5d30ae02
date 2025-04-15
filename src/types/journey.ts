
// Update JourneySong interface to include optional properties
export interface JourneySong {
  id: string;
  title: string;
  artist?: string;
  audioUrl: string;
  duration?: number;
  chakra?: string;
  frequency?: number;
  description?: string;
  order?: number;
  groupId?: string;
  imageUrl?: string;
}

export interface JourneyTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  chakra?: string;
  frequency?: number;
  imageUrl?: string;
  tags?: string[];
  effects?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Add new interfaces for the enhanced SacredAudioPlayer
export interface JourneyOptions {
  pinkNoise?: boolean;
  lowSensitivity?: boolean;
  headphones?: boolean;
  sleepTimer?: number; // in minutes
}

export interface JourneyProps {
  id?: string;
  title: string;
  audioUrl: string;
  visualTheme?: 'gentle-waves' | 'flower-of-life' | 'merkaba' | 'sri-yantra' | 'vesica-piscis' | 'cosmic-ocean';
  frequencies?: number[]; // e.g. [528, 741, 963]
  chakras?: string[];     // e.g. ['Crown', 'Third Eye', 'Throat']
  affirmation?: string;
  options?: JourneyOptions;
}
