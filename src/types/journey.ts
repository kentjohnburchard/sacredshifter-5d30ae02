
import { ChakraTag } from '@/types/chakras';

export interface Journey {
  id: string;
  title: string;
  filename: string;
  audio_filename?: string;
  veil_locked?: boolean;
  tags?: string;
  intent?: string;
  sound_frequencies?: string;
  script?: string;
  notes?: string;
  duration?: string;
  assigned_songs?: string;
  recommended_users?: string;
  visual_effects?: string;
  strobe_patterns?: string;
  env_lighting?: string;
  env_temperature?: string;
  env_incense?: string;
  env_posture?: string;
  env_tools?: string;
  source?: 'core' | 'database';
  isEditable?: boolean;
  isCoreContent?: boolean;
}

export interface JourneyAwareComponentProps {
  journeyId?: string;
  autoSync?: boolean; // Whether to auto-sync with JourneyContext
}

export interface TimelineEntry {
  component: string;
  action: string;
  journeyId: string;
  details?: Record<string, any>;
  timestamp?: Date;
}

export type JourneyTimelineEvent = 
  | 'spiral_toggle'
  | 'spiral_param_change'
  | 'soundscape_play'
  | 'soundscape_pause'
  | 'soundscape_volume'
  | 'journey_start' 
  | 'journey_progress'
  | 'journey_complete';

export interface JourneyTimelineItem {
  id: string;
  user_id: string;
  title: string;
  tag: string;
  notes?: string;
  chakra_tag?: ChakraTag;
  created_at: string;
  journey_id?: string;
  component?: string;
  action?: string;
  details?: Record<string, any>;
}
