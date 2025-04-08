
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
  type?: string;
  chakra?: string;
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
  visual_url?: string;
}

export interface SavedFrequency {
  id: string;
  user_id: string;
  frequency_id: string;
  created_at?: string;
  notes?: string;
}

// Adding UserSavedFrequency type for the SavedFrequenciesViewer component
export interface UserSavedFrequency {
  id: string;
  user_id: string;
  frequency_id: string;
  frequency: FrequencyLibraryItem;
  created_at?: string;
  notes?: string;
}

// Adding JourneyPhase type for the BecomeTheOneJourney component
export interface JourneyPhase {
  id: string;
  title: string;
  description: string;
  frequency?: number;
  chakra?: string;
  duration?: number;
  audioUrl?: string;
  visualUrl?: string;
}
