export interface FractalVisual {
  id: string;
  created_at?: string;
  title?: string;
  notes?: string;
  visual_url: string;
  frequency: number;
  prime_number?: number;
  principle?: string;
  formula?: string;
  type?: 'image' | 'animation';
}

export interface FrequencyLibraryItem {
  id: string;
  title: string;
  description?: string;
  frequency: number;
  chakra?: string;
  audio_url?: string;
  url?: string;
  category?: string;
  tags?: string[];
  session_type?: string;
  vibe_profile?: string;
  visual_theme?: string;
  length?: number;
  affirmation?: string;
  created_at?: string;
  updated_at?: string;
  fractal_visual?: FractalVisual;
  duration?: number;
  principle?: string;
  group_id?: string;
  feature?: string;
  type?: string;
}

export interface SavedFrequency {
  id: string;
  user_id: string;
  frequency_id: string;
  created_at?: string;
}
