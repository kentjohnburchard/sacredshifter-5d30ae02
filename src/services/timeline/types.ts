
/**
 * Timeline service types
 */

export interface TimelineEventDetails {
  journeyId?: string;
  title?: string;
  component?: string;
  notes?: string;
  frequency?: number;
  chakra?: string;
  [key: string]: any;
}

export interface TimelineItem {
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
  details?: any;
}
