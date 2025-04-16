
export interface SongMapping {
  id: string;
  title: string;
  artist?: string;
  audioUrl?: string;
  duration?: number;
  chakra?: string;
  frequency?: number;
  category?: string;
  description?: string;
  functionality?: AppFunctionality;
  principle?: string;
  tags?: string[];
  url?: string;
  length?: number;
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

export interface FunctionalityMap {
  [key: string]: {
    name: string;
    description: string;
    color: string;
  };
}

export interface AudioFunction {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface AudioFunctionMapping {
  id?: string;
  function_id: string;
  audio_file_name: string;
  audio_url?: string;
  is_primary: boolean;
}

export interface JourneyAudioMapping {
  journey_template_id: string;
  audio_file_name: string;
  audio_url?: string;
  is_primary: boolean;
}
