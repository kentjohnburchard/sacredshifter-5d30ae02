
import { supabase } from '@/integrations/supabase/client';
import { JourneyTimelineItem, JourneyTimelineEvent } from '@/types/journey';
import { normalizeId } from '@/utils/parsers';

/**
 * Record a journey event in the timeline
 */
export const recordJourneyEvent = async (
  userId: string,
  eventType: JourneyTimelineEvent,
  title: string,
  tag: string,
  details?: Record<string, any>,
  journeyId?: string
): Promise<JourneyTimelineItem | null> => {
  try {
    return await createTimelineItem(
      userId,
      title,
      tag,
      JSON.stringify({ details }),
      undefined,
      journeyId
    );
  } catch (error) {
    console.error('Error recording journey event:', error);
    return null;
  }
};

// Alias for backward compatibility
export const logTimelineEvent = recordJourneyEvent;

/**
 * Fetch timeline items for a specific journey
 */
export async function fetchJourneyTimeline(
  journeyId: string | undefined, 
  limit?: number
): Promise<JourneyTimelineItem[]> {
  if (!journeyId) return [];
  
  try {
    let query = supabase
      .from('timeline_snapshots')
      .select('id, user_id, title, tag, notes, chakra, created_at, journey_id, component, action, details')
      .eq('journey_id', journeyId)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(Number(limit));
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching journey timeline:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      id: normalizeId(item.id),
      user_id: item.user_id,
      title: item.title,
      tag: item.tag || '',
      notes: item.notes,
      chakra_tag: item.chakra || undefined,
      created_at: item.created_at,
      journey_id: item.journey_id,
      component: item.component,
      action: item.action,
      details: parseDetails(item.details)
    }));
  } catch (error) {
    console.error('Error in fetchJourneyTimeline:', error);
    return [];
  }
}

/**
 * Create a new timeline item
 */
export async function createTimelineItem(
  userId: string,
  title: string,
  tag: string,
  notes: Record<string, any> | string,
  chakra?: string,
  journeyId?: string,
): Promise<JourneyTimelineItem> {
  try {
    // Format notes if it's an object
    const notesValue = typeof notes === 'object' ? JSON.stringify(notes) : notes;
    
    const { data, error } = await supabase
      .from('timeline_snapshots')
      .insert({
        user_id: userId,
        title,
        tag,
        notes: notesValue,
        chakra: chakra,
        journey_id: journeyId
      })
      .select('id, user_id, title, tag, notes, chakra, created_at, journey_id, component, action, details')
      .single();
    
    if (error) {
      console.error('Error creating timeline item:', error);
      throw error;
    }
    
    return {
      id: normalizeId(data.id),
      user_id: data.user_id,
      title: data.title,
      tag: data.tag,
      notes: data.notes,
      chakra_tag: data.chakra,
      created_at: data.created_at,
      journey_id: data.journey_id,
      component: data.component,
      action: data.action,
      details: parseDetails(data.details)
    };
  } catch (error) {
    console.error('Error in createTimelineItem:', error);
    throw error;
  }
}

/**
 * Fetch user timeline items
 */
export async function fetchUserTimeline(
  userId: string, 
  limit?: number,
  filters?: {
    tag?: string,
    chakra?: string,
    journeyId?: string
  }
): Promise<JourneyTimelineItem[]> {
  try {
    let query = supabase
      .from('timeline_snapshots')
      .select('id, user_id, title, tag, notes, chakra, created_at, journey_id, component, action, details')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (filters?.tag) {
      query = query.eq('tag', filters.tag);
    }
    
    if (filters?.chakra) {
      query = query.eq('chakra', filters.chakra);
    }
    
    if (filters?.journeyId) {
      query = query.eq('journey_id', filters.journeyId);
    }
    
    if (limit) {
      query = query.limit(Number(limit));
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching user timeline:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      id: normalizeId(item.id),
      user_id: item.user_id,
      title: item.title,
      tag: item.tag,
      notes: item.notes,
      chakra_tag: item.chakra,
      created_at: item.created_at,
      journey_id: item.journey_id,
      component: item.component,
      action: item.action,
      details: parseDetails(item.details)
    }));
  } catch (error) {
    console.error('Error in fetchUserTimeline:', error);
    return [];
  }
}

/**
 * Delete a timeline item
 */
export async function deleteTimelineItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('timeline_snapshots')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting timeline item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteTimelineItem:', error);
    return false;
  }
}

/**
 * Helper function to safely parse details field which could be JSON or other types
 */
function parseDetails(details: any): Record<string, any> {
  if (!details) {
    return {};
  }
  
  if (typeof details === 'string') {
    try {
      return JSON.parse(details);
    } catch (error) {
      console.error('Error parsing details JSON:', error);
      return {};
    }
  }
  
  // If it's already an object, return it
  if (typeof details === 'object') {
    return details;
  }
  
  // For any other type, return an empty object
  return {};
}
