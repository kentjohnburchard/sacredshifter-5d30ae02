
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
    // Since we can't use RPC with custom function names due to TypeScript restrictions,
    // we'll use a direct query with proper error handling
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
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
    // Use direct update query instead of RPC
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const checkOnboardingStatus = async (userId: string): Promise<boolean> => {
  try {
    // Use direct query instead of RPC
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.onboarding_completed || false;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // Default to not completed if there's an error
    return false;
  }
};
