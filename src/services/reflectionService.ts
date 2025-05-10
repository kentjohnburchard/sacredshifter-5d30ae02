
import { supabase } from '@/integrations/supabase/client';

/**
 * Save a journey reflection to the database
 */
export const saveReflection = async (
  userId: string,
  sessionId: string,
  content: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('session_reflections')
      .insert({
        user_id: userId,
        session_id: sessionId,
        content: content
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    return data?.id || null;
  } catch (error) {
    console.error('Error saving reflection:', error);
    return null;
  }
};

/**
 * Log a journey completion in the database
 */
export const logJourneyCompletion = async (
  userId: string,
  journeyId: string,
  reflectionId: string | null,
  durationSeconds: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('journey_completions')
      .insert({
        user_id: userId,
        journey_id: journeyId,
        reflection_id: reflectionId,
        duration_seconds: durationSeconds
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error logging journey completion:', error);
    return false;
  }
};

/**
 * Get all reflections for a user
 */
export const getUserReflections = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('session_reflections')
      .select(`
        *,
        journey_completions (
          journey_id,
          completed_at,
          duration_seconds
        )
      `)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting user reflections:', error);
    return [];
  }
};

/**
 * Get journey completion history for a user
 */
export const getUserJourneyHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('journey_completions')
      .select(`
        *,
        session_reflections (
          content
        )
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting journey history:', error);
    return [];
  }
};
