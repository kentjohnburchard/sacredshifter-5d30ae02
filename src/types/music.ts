

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

export interface JourneyVisualMapping {
  journeyId: string;
  visualFileName: string;
  visualUrl: string;
  id: string;
  createdAt: string;
}

export interface JourneyFrequency {
  name: string;
  value: string;
  description: string;
}

export interface AudioFunction {
  id: string;
  name: string;
  description: string;
  category: AudioFunctionCategory;
}

export type AudioFunctionCategory = 
  | 'journey'
  | 'interface'
  | 'meditation'
  | 'frequency';

export interface AudioFunctionMapping {
  id: string;
  function_id: string;
  audio_file_name: string;
  audio_url: string | null;
  is_primary: boolean;
  created_at: string;
}

