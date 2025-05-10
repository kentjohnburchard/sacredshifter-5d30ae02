import { supabase } from '@/integrations/supabase/client';
import { formatJourneyId } from './formatters';
import { TimelineEventDetails } from './types';
import { JourneyTimelineEvent } from '@/types/journey';

/**
 * Log a timeline event for the current user
 * Returns a boolean indicating success or failure
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
      }
    }
    
    // Ensure tag is valid
    const validTag = tag ? String(tag).replace(/_/g, ' ') : 'event';
    
    // Build the insert record
    const insertRecord: Record<string, any> = {
      user_id: userId,
      tag: validTag,
      title: sanitizedDetails.title || validTag,
      component: sanitizedDetails.component,
      notes: sanitizedDetails.notes,
      chakra_tag: sanitizedDetails.chakra,
      details: sanitizedDetails
    };
    
    // Only include journey_id if it's valid
    if (journey_id !== null) {
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

// Keeping this function for backward compatibility
export const recordJourneyEvent = async (
  userId: string,
  tag: string,
  title: string,
  component?: string,
  details?: any
): Promise<boolean> => {
  return createTimelineItem(userId, title, tag, details, undefined, undefined);
};
