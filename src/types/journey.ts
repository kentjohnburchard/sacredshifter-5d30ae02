
import { Journey } from '@/context/JourneyContext';
import { ChakraTag } from '@/types/chakras';

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
