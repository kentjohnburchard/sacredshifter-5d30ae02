
import { supabase } from '@/integrations/supabase/client';
import { JourneyTimelineEvent } from '@/types/journey';

interface TimelineEventDetails {
  journeyId?: string;
  title?: string;
  component?: string;
  notes?: string;
  frequency?: number;
  chakra?: string;
  [key: string]: any;
}

/**
 * Log a timeline event for the current user
 */
export const logTimelineEvent = async (
  tag: JourneyTimelineEvent,
  details?: TimelineEventDetails
): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.log("Cannot log timeline event - user not authenticated");
      return false;
    }
    
    const userId = userData.user.id;
    
    const { data, error } = await supabase
      .from('timeline_snapshots')
      .insert({
        user_id: userId,
        tag,
        title: details?.title || tag.replace(/_/g, ' '),
        journey_id: details?.journeyId,
        component: details?.component,
        notes: details?.notes,
        frequency: details?.frequency,
        chakra: details?.chakra,
        details: details ? { ...details } : undefined
      });
    
    if (error) {
      console.error('Error logging timeline event:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in logTimelineEvent:', error);
    return false;
  }
};

/**
 * Get timeline events for a specific journey
 */
export const getTimelineEventsForJourney = async (
  journeyId: string,
  limit: number = 10
): Promise<any[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('timeline_snapshots')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('journey_id', journeyId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching timeline events:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getTimelineEventsForJourney:', error);
    return [];
  }
};

/**
 * Create a timeline item for a user
 */
export const createTimelineItem = async (
  userId: string,
  title: string,
  tag: string,
  details: any,
  chakraTag?: string,
  journeyId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('timeline_snapshots')
      .insert({
        user_id: userId,
        title,
        tag,
        details,
        chakra_tag: chakraTag,
        journey_id: journeyId,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error creating timeline item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createTimelineItem:', error);
    return false;
  }
};

/**
 * Record a journey event in the timeline
 */
export const recordJourneyEvent = async (
  userId: string,
  tag: string,
  title: string,
  component?: string,
  details?: any
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('timeline_snapshots')
      .insert({
        user_id: userId,
        tag,
        title,
        component,
        details,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error recording journey event:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in recordJourneyEvent:', error);
    return false;
  }
};

/**
 * Fetch timeline for a specific journey
 */
export const fetchJourneyTimeline = async (
  journeyId: string,
  limit: number = 10
): Promise<any[]> => {
  return getTimelineEventsForJourney(journeyId, limit);
};

/**
 * Fetch user's timeline
 */
export const fetchUserTimeline = async (
  userId: string,
  limit: number = 20
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('timeline_snapshots')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching user timeline:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchUserTimeline:', error);
    return [];
  }
};
