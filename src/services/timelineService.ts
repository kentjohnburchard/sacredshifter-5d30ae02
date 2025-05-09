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
 * Validates if a string is a valid UUID
 */
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Safely formats journey ID to ensure compatibility with the database
 * If it's not a valid UUID, it returns null
 */
const formatJourneyId = (id?: string | number): string | null => {
  if (!id) return null;
  
  const strId = String(id);
  
  // If it's a valid UUID, use it directly
  if (isValidUUID(strId)) {
    return strId;
  }
  
  // For numeric IDs or other formats, we can't use them directly in the timeline_snapshots table
  // as it expects a UUID for journey_id. Return null to indicate this ID can't be used.
  return null;
};

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
    
    // Validate and prepare the data
    const sanitizedDetails = details ? { ...details } : {};
    
    // Ensure we're sending valid types for all fields
    if (sanitizedDetails.frequency && typeof sanitizedDetails.frequency !== 'number') {
      try {
        sanitizedDetails.frequency = parseFloat(sanitizedDetails.frequency as any);
        if (isNaN(sanitizedDetails.frequency)) {
          delete sanitizedDetails.frequency;
        }
      } catch (e) {
        delete sanitizedDetails.frequency;
      }
    }
    
    // Format the journey_id properly for the database
    let journey_id = null;
    if (sanitizedDetails.journeyId) {
      journey_id = formatJourneyId(sanitizedDetails.journeyId);
      // If journey_id isn't a valid UUID, we'll still log the event but without the journey association
      if (!journey_id) {
        console.warn(`Invalid journey ID format: ${sanitizedDetails.journeyId}, timeline event will be logged without journey association`);
      }
    }
    
    // Ensure tag is valid
    const validTag = tag ? String(tag).replace(/_/g, ' ') : 'event';
    
    const { error } = await supabase
      .from('timeline_snapshots')
      .insert({
        user_id: userId,
        tag: validTag,
        title: sanitizedDetails.title || validTag,
        journey_id: journey_id, // Only use journey_id if it's a valid UUID
        component: sanitizedDetails.component,
        notes: sanitizedDetails.notes,
        frequency: sanitizedDetails.frequency,
        chakra: sanitizedDetails.chakra,
        details: sanitizedDetails
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
    
    // Format the journey_id for consistency
    const formattedJourneyId = formatJourneyId(journeyId);
    
    // If the journeyId isn't in UUID format, we can't query by it
    if (!formattedJourneyId) {
      console.warn(`Invalid journey ID format: ${journeyId}, cannot fetch timeline events`);
      return [];
    }
    
    const { data, error } = await supabase
      .from('timeline_snapshots')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('journey_id', formattedJourneyId)
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
    // Format the journey_id if provided
    let journey_id = null;
    if (journeyId) {
      journey_id = formatJourneyId(journeyId);
      if (!journey_id) {
        console.warn(`Invalid journey ID format: ${journeyId}, timeline item will be created without journey association`);
      }
    }
    
    const { error } = await supabase
      .from('timeline_snapshots')
      .insert({
        user_id: userId,
        title,
        tag,
        details,
        chakra_tag: chakraTag,
        journey_id: journey_id,
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
