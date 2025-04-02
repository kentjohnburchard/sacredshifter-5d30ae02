
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
  // Use raw SQL query with RPC to avoid type issues
  const { data, error } = await supabase.rpc('get_profile', { user_id: userId });
  
  if (error) throw error;
  
  // If no data is returned, create a default profile
  if (!data) {
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
  
  return data as ProfileType;
};

export const updateProfile = async (userId: string, updates: Partial<ProfileType>) => {
  // Use raw SQL query with RPC to avoid type issues
  const { data, error } = await supabase.rpc('update_profile', { 
    p_user_id: userId, 
    p_updates: updates 
  });
  
  if (error) throw error;
  return data;
};

export const checkOnboardingStatus = async (userId: string): Promise<boolean> => {
  try {
    // Use raw SQL query with RPC to avoid type issues
    const { data, error } = await supabase.rpc('check_onboarding_status', { user_id: userId });
    
    if (error) throw error;
    
    return data as boolean;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // Default to not completed if there's an error
    return false;
  }
};
