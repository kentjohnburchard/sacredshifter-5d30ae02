
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
 * Checks if a string is a valid UUID format
 */
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Creates a deterministic UUID-like string from a numeric ID
 * This allows us to use numeric IDs in the timeline_snapshots table
 * IMPORTANT: This has been modified to return a proper UUID format
 */
const createPseudoUUID = (numericId: string | number): string => {
  // Instead of creating a journey- prefixed string, we'll create a proper UUID
  // Using a deterministic method based on the numeric ID
  const id = String(numericId).padStart(8, '0');
  return `a0000000-${id.slice(0, 4)}-${id.slice(4, 8)}-0000-000000000000`;
};

/**
 * Safely formats journey ID to ensure compatibility with the database
 * If it's a valid UUID, it returns it directly
 * If it's a numeric ID, it converts it to a valid UUID format
 * Returns null if the ID is invalid or missing
 */
const formatJourneyId = (id?: string | number): string | null => {
  if (!id) return null;
  
  const strId = String(id).trim();
  
  // If it's already a valid UUID, use it directly
  if (isValidUUID(strId)) {
    return strId;
  }
  
  // For numeric IDs, create a deterministic UUID
  if (/^\d+$/.test(strId)) {
    return createPseudoUUID(strId);
  }
  
  // Handle journey- prefixed IDs (from previous implementation)
  if (strId.startsWith('journey-')) {
    console.warn(`Converting journey-prefixed ID to UUID format: ${strId}`);
    const numPart = strId.replace('journey-', '').split('-')[0].replace(/^0+/, '');
    if (numPart && /^\d+$/.test(numPart)) {
      return createPseudoUUID(numPart);
    }
  }
  
  console.warn(`Invalid journey ID format: ${strId}, cannot log timeline event`);
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
      
      // If we can't generate a valid UUID, don't include journey_id in the insert
      if (journey_id === null) {
        console.log(`Cannot log timeline event with journey ID - invalid format for ${sanitizedDetails.journeyId}`);
        // Continue with the insert but without the journey_id
      }
    }
    
    // Ensure tag is valid
    const validTag = tag ? String(tag).replace(/_/g, ' ') : 'event';
    
    // Build the insert record
    const insertRecord = {
      user_id: userId,
      tag: validTag,
      title: sanitizedDetails.title || validTag,
      component: sanitizedDetails.component,
      notes: sanitizedDetails.notes,
      frequency: sanitizedDetails.frequency,
      chakra: sanitizedDetails.chakra,
      details: sanitizedDetails
    };
    
    // Only include journey_id if it's valid
    if (journey_id !== null) {
      // @ts-ignore: Adding journey_id to the object
      insertRecord.journey_id = journey_id;
    }
    
    const { error } = await supabase
      .from('timeline_snapshots')
      .insert(insertRecord);
    
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
