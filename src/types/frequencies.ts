
export interface FrequencyLibraryItem {
  id: string;
  title: string;
  frequency: number;
  chakra: string;
  description: string | null;
  tags: string[] | null;
  audio_url: string | null;
  visual_theme: string | null;
  length: number | null;
  vibe_profile: string | null;
  affirmation: string | null;
  session_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSavedFrequency {
  id: string;
  user_id: string;
  frequency_id: string;
  created_at: string;
  notes: string | null;
  frequency?: FrequencyLibraryItem;
}
