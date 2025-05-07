
import { supabase } from '@/integrations/supabase/client';
import { JourneyTimelineItem } from '@/types/journey';
import { normalizeId } from '@/utils/parsers';

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
      .select('*')
      .eq('journey_id', journeyId)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
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
      details: item.details
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
      .select()
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
      details: data.details
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
      .select('*')
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
      query = query.limit(limit);
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
      details: item.details
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
