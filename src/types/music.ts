
export interface JourneyAudioMapping {
  audioFileName: string;
  audioUrl: string;
  isPrimary?: boolean;
  displayOrder?: number;
  displayTitle?: string;
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
  audio_url: string | null;
  is_primary: boolean;
}

export type AppFunctionality = 'meditation' | 'journey' | 'focus' | 'chakra' | 'frequency';

export interface SongMapping {
  id: string;
  title: string;
  artist?: string;
  audioUrl?: string;
  duration?: number;
  functionality: AppFunctionality;
  description?: string;
  chakra?: string;
  frequency?: number;
}

export interface FunctionalityMap {
  [key: string]: AppFunctionality;
}
