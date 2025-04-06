import { supabase } from '@/integrations/supabase/client';

/**
 * Utility function to deduplicate and clean up user preferences
 * This should be called once to fix the current issue with duplicate preferences
 */
export const cleanupUserPreferencesData = async (userId: string) => {
  try {
    // Get all preferences for this user
    const { data: userPrefs, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    // If there are multiple records, keep only the most recent one
    if (userPrefs && userPrefs.length > 1) {
      const [mostRecent, ...duplicates] = userPrefs;
      
      // Delete all but the most recent record
      if (duplicates.length > 0) {
        const duplicateIds = duplicates.map(d => d.id);
        const { error: deleteError } = await supabase
          .from('user_preferences')
          .delete()
          .in('id', duplicateIds);
        
        if (deleteError) {
          console.error("Error cleaning up duplicate preferences:", deleteError);
          return false;
        }
        
        console.log(`Cleaned up ${duplicates.length} duplicate preference records`);
      }
    }
    
    return true;
  } catch (err) {
    console.error("Error in cleanupUserPreferencesData:", err);
    return false;
  }
};
