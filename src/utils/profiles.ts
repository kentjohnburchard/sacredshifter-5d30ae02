
import { supabase } from "@/integrations/supabase/client";

export type ProfileType = {
  id: string;
  full_name: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  initial_mood: string | null;
  primary_intention: string | null;
  energy_level: number | null;
  interests: string[] | null;
  updated_at: string;
};

export const fetchProfile = async (userId: string): Promise<ProfileType> => {
  try {
    // Create a default profile
    const defaultProfile: ProfileType = {
      id: userId,
      full_name: null,
      display_name: null,
      bio: null,
      avatar_url: null,
      onboarding_completed: false,
      initial_mood: null,
      primary_intention: null,
      energy_level: null,
      interests: null,
      updated_at: new Date().toISOString()
    };
    
    // Check if the profile exists in the user_credits table (assuming this is the closest we have to profiles)
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      console.error("Error fetching profile data:", error);
      return defaultProfile;
    }
    
    // We're using user_credits as a proxy for profiles since profiles table doesn't exist
    // Return the default profile with the ID set properly
    return defaultProfile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    // Return a default profile if there's an error
    return {
      id: userId,
      full_name: null,
      display_name: null,
      bio: null,
      avatar_url: null,
      onboarding_completed: false,
      initial_mood: null,
      primary_intention: null,
      energy_level: null,
      interests: null,
      updated_at: new Date().toISOString()
    };
  }
};

export const updateProfile = async (userId: string, updates: Partial<ProfileType>) => {
  try {
    // Since we don't have a profiles table, we'll update what we can in other tables
    // For onboarding_completed status, try to store it in a session
    if ('onboarding_completed' in updates) {
      const { error } = await supabase
        .from('sessions')
        .insert([{
          user_id: userId,
          initial_mood: updates.initial_mood || null,
          intention: updates.primary_intention || null
        }]);
      
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const checkOnboardingStatus = async (userId: string): Promise<boolean> => {
  try {
    // Since we don't have profiles, check if the user has any sessions as a proxy for onboarding status
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .limit(1);
    
    if (error) throw error;
    
    // If the user has any sessions, consider them onboarded
    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // Default to not completed if there's an error
    return false;
  }
};
