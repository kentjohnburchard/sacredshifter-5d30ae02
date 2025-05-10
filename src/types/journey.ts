
export interface Journey {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  filename?: string;
  audio_filename?: string;
  veil_locked?: boolean;
  tags: string[]; // Explicitly making this a string array
  intent?: string;
  sound_frequencies?: string;
  duration?: string;
  source?: string;
  isEditable?: boolean;
  isCoreContent?: boolean;
  assigned_songs?: string[];
  recommended_users?: string[];
  visual_effects?: string[];
  strobe_patterns?: string[];
  env_lighting?: string;
  env_temperature?: string;
  env_incense?: string;
  env_posture?: string;
  env_tools?: string;
  script?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  is_published?: boolean;
  frequencies?: string[]; // Changed from frequency to frequencies (array)
  category?: string;
  image_url?: string;
  is_featured?: boolean;
  needs_moderation?: boolean;
  is_approved?: boolean;
  chakra?: string;
  chakra_tag?: string;

  // optional legacy support
  frontmatter?: Record<string, any>;
}

export type JourneyTimelineEvent = 
  | 'journey_start'
  | 'journey_complete'
  | 'journey_progress'
  | 'spiral_toggle'
  | 'spiral_param_change'
  | 'soundscape_play'
  | 'soundscape_pause'
  | 'soundscape_volume'
  | 'daily_practice_start'
  | 'daily_practice_complete'
  | 'daily_practice_step';

// Updated to match Supabase types
export interface JourneyTimelineItem {
  id: string;
  user_id: string;
  title: string;
  tag: string;
  notes?: string;
  chakra_tag?: string;
  created_at: string;
  journey_id?: string;
  component?: string;
  action?: string;
  details?: any; // Changed from Record<string, any> to any to accommodate Json
}

export interface JourneyAwareComponentProps {
  journeyId?: string;
  autoSync?: boolean;
}

// Add JourneyPrompt interface that was missing
export interface JourneyPrompt {
  id: string;
  journey_id: string;
  content: string;
  display_type: 'dialog' | 'tooltip' | 'modal';
  trigger: string;
  location: string;
  active: boolean;
  priority_level?: number;
  saved?: boolean;
}

// Add VisualMapping interface for the JourneyAudioMapper component
export interface VisualMapping {
  id: string;
  journey_template_id: string;
  visual_file_name: string;
  visual_url: string | null;
  created_at: string;
}
