export interface Journey {
  id?: string;
  created_at?: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  user_id?: string;
  is_published?: boolean;
  tags?: string[];
  frequency?: string;
  duration?: string;
  difficulty?: string;
  category?: string;
  image_url?: string;
  is_featured?: boolean;
  needs_moderation?: boolean;
  is_approved?: boolean;
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
  | 'soundscape_volume';

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
  details?: Record<string, any>;
}
