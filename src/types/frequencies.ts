
export interface FrequencyLibraryItem {
  id: string;
  title: string;
  frequency: number;
  description?: string;
  chakra: string;
  color?: string;
  length?: number;
  audio_url?: string;
  affirmation?: string;
  benefits?: string[];
  created_at?: string;
  user_id?: string;
  tags?: string[];
  vibe_profile?: string;
}

export interface UserSavedFrequency {
  id: string;
  user_id: string;
  frequency_id: string;
  created_at: string;
  notes?: string;
  frequency: FrequencyLibraryItem;
}
