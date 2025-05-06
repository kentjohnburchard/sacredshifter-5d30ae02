
import { supabase } from '@/integrations/supabase/client';
import { TimelineEntry, JourneyTimelineEvent } from '@/types/journey';

export const logTimelineEvent = async (
  userId: string | undefined, 
  component: string, 
  action: JourneyTimelineEvent, 
  journeyId: string,
  details: Record<string, any> = {}
): Promise<void> => {
  if (!userId) return;
  
  try {
    const title = formatTimelineTitle(component, action, details);
    
    const { error } = await supabase
      .from('timeline_snapshots')
      .insert({
        user_id: userId,
        title,
        tag: action,
        notes: JSON.stringify({
          ...details,
          component,
          journeyId,
          action
        })
      });
    
    if (error) {
      console.error('Error logging timeline event:', error);
    }
  } catch (err) {
    console.error('Failed to log timeline event:', err);
  }
};

// Helper to format human-readable timeline titles
export const formatTimelineTitle = (
  component: string,
  action: JourneyTimelineEvent,
  details: Record<string, any>
): string => {
  switch (action) {
    case 'spiral_toggle':
      return `Spiral visualization ${details.enabled ? 'enabled' : 'disabled'}`;
    case 'spiral_param_change':
      return `Spiral parameters updated`;
    case 'soundscape_play':
      return `${details.title || 'Soundscape'} started playing`;
    case 'soundscape_pause':
      return `${details.title || 'Soundscape'} paused`;
    case 'soundscape_volume':
      return `Soundscape volume ${details.muted ? 'muted' : `set to ${Math.round(details.volume * 100)}%`}`;
    case 'journey_progress':
      return `Journey progress: ${details.stage || 'in progress'}`;
    default:
      return `${component}: ${action.replace(/_/g, ' ')}`;
  }
};

// Fetch timeline entries for a specific journey
export const fetchJourneyTimeline = async (
  userId: string | undefined, 
  journeyId: string | undefined
): Promise<any[]> => {
  if (!userId || !journeyId) return [];

  try {
    const { data, error } = await supabase
      .from('timeline_snapshots')
      .select('*')
      .eq('user_id', userId)
      .like('notes', `%${journeyId}%`)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching journey timeline:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Failed to fetch journey timeline:', err);
    return [];
  }
};

// Fetch all timeline entries for a user, grouped by journey
export const fetchUserTimeline = async (
  userId: string | undefined,
  filter?: string
): Promise<any[]> => {
  if (!userId) return [];
  
  try {
    let query = supabase
      .from('timeline_snapshots')
      .select('*')
      .eq('user_id', userId);
      
    if (filter) {
      query = query.eq('tag', filter);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user timeline:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Failed to fetch user timeline:', err);
    return [];
  }
};
