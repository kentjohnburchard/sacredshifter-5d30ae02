
export interface FrequencyLibraryItem {
  id: string;
  title: string;
  frequency: number;
  description?: string;
  chakra: string;
  color?: string;
  length?: number;
  audio_url?: string;
  url?: string; // Added for compatibility
  visual_url?: string; // Added for visual thumbnails
  affirmation?: string;
  benefits?: string[];
  created_at?: string;
  user_id?: string;
  tags?: string[];
  vibe_profile?: string;
  principle?: string; // Added for Hermetic principle association
  fractal_visual?: FractalVisual; // Reference to associated fractal visual
}

export interface UserSavedFrequency {
  id: string;
  user_id: string;
  frequency_id: string;
  created_at: string;
  notes?: string;
  frequency: FrequencyLibraryItem;
}

export interface FractalVisual {
  id: string;
  frequency: number;
  chakra?: string;
  principle?: string;
  visual_url: string;
  type?: string;
  prime_number?: number;
  title?: string;
  notes?: string;
  formula?: string;
  created_at?: string;
}
