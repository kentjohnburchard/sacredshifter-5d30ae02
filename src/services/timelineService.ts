import { supabase } from '@/integrations/supabase/client';
import { JourneyTimelineItem, JourneyTimelineEvent } from '@/types/journey';

interface CreateTimelineParams {
  title: string;
  tag: string;
  user_id: string;
  notes?: string;
  chakra_tag?: string;
  journey_id?: string;
  component?: string;
  action?: string;
  details?: Record<string, any>;
}

// ✅ Create a new timeline item
export const createTimelineItem = async (params: CreateTimelineParams): Promise<JourneyTimelineItem | null> => {
  try {
    if (!params.title || !params.tag || !params.user_id) {
      console.error('Missing required fields for timeline item');
      return null;
    }

    const { data, error } = await supabase
      .from('timeline_snapshots')
      .insert({
        title: params.title,
        tag: params.tag,
        user_id: params.user_id,
        notes: params.notes,
        chakra: params.chakra_tag,
        journey_id: params.journey_id,
        component: params.component,
        action: params.action,
        details: params.details
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating timeline item:', error);
      return null;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      tag: data.tag || '',
      notes: data.notes,
      chakra_tag: data.chakra,
      created_at: data.created_at,
      journey_id: data.journey_id,
      component: data.component,
      action: data.action,
      details: data.details
    };
  } catch (err) {
    console.error('Error in createTimelineItem:', err);
    return null;
  }
};

// ✅ Alias for compatibility
export const createTimelineEntry = createTimelineItem;

// ✅ Fetch all timeline items (generic)
export const fetchTimelineItems = async (
  userId: string,
  limit = 20,
  chakraTag?: string,
  journeyId?: string
): Promise<JourneyTimelineItem[]> => {
  try {
    let query = supabase
      .from('timeline_snapshots')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (chakraTag) query = query.eq('chakra', chakraTag);
    if (journeyId) query = query.eq('journey_id', journeyId);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching timeline items:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      title: item.title,
      tag: item.tag || '',
      notes: item.notes,
      chakra_tag: item.chakra,
      created_at: item.created_at,
      journey_id: item.journey_id,
      component: item.component,
      action: item.action,
      details: item.details
    }));
  } catch (err) {
    console.error('Error in fetchTimelineItems:', err);
    return [];
  }
};

// ✅ Fetch timeline items for a specific journey
export const fetchJourneyTimeline = async (
  userId: string,
  journeyId: string,
  limit = 20
): Promise<JourneyTimelineItem[]> => {
  return fetchTimelineItems(userId, limit, undefined, journeyId);
};

// ✅ Fetch timeline items for a user
export const fetchUserTimeline = async (
  userId: string,
  filterTag?: string,
  limit = 20
): Promise<JourneyTimelineItem[]> => {
  try {
    let query = supabase
      .from('timeline_snapshots')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (filterTag && filterTag !== 'all') {
      query = query.ilike('tag', `%${filterTag}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user timeline:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      title: item.title,
      tag: item.tag || '',
      notes: item.notes,
      chakra_tag: item.chakra,
      created_at: item.created_at,
      journey_id: item.journey_id,
      component: item.component,
      action: item.action,
      details: item.details
    }));
  } catch (err) {
    console.error('Error fetching user timeline:', err);
    return [];
  }
};

// ✅ Log journey-specific timeline events
export const recordJourneyEvent = async (
  userId: string,
  eventType: JourneyTimelineEvent,
  title: string,
  journeyId: string,
  details?: Record<string, any>
): Promise<JourneyTimelineItem | null> => {
  try {
    let tag: string;

    switch (eventType) {
      case 'journey_start': tag = 'Journey Started'; break;
      case 'journey_complete': tag = 'Journey Completed'; break;
      case 'journey_progress': tag = 'Journey Progress'; break;
      case 'spiral_toggle':
      case 'spiral_param_change': tag = 'Spiral Visualization'; break;
      case 'soundscape_play':
      case 'soundscape_pause':
      case 'soundscape_volume': tag = 'Soundscape'; break;
      default: tag = 'Journey Event';
    }

    return await createTimelineItem({
      title,
      tag,
      user_id: userId,
      journey_id: journeyId,
      component: 'journey',
      action: eventType,
      details
    });
  } catch (err) {
    console.error('Error recording journey event:', err);
    return null;
  }
};

// ✅ Alias
export const logTimelineEvent = recordJourneyEvent;
