
export interface SongMapping {
  id: string;
  title: string;
  artist?: string;
  frequency?: number;
  chakra?: string;
  functionality: AppFunctionality;
  description?: string;
  duration?: number; // in seconds
  audioUrl?: string;
  visualType?: string;
}

export type AppFunctionality = 
  | 'meditation'
  | 'chakra-healing'
  | 'hermetic-principle'
  | 'frequency-shift'
  | 'journey'
  | 'focus'
  | 'sleep'
  | 'energy-boost'
  | 'heart-opening'
  | 'grounding';

export interface FunctionalityDescription {
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

export type FunctionalityMap = Record<AppFunctionality, FunctionalityDescription>;

export interface JourneyAudioMapping {
  journeyId: string;
  audioFileName: string;
  audioUrl: string;
  isPrimary: boolean;
  id: string;
  createdAt: string;
}

export interface JourneyFrequency {
  name: string;
  value: string;
  description: string;
}
