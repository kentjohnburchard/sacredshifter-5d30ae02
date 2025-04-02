
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

export const fetchProfile = async (userId: string) => {
  // Use raw query instead of strongly typed query until types are updated
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as ProfileType;
};

export const updateProfile = async (userId: string, updates: Partial<ProfileType>) => {
  // Use raw query instead of strongly typed query until types are updated
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  if (error) throw error;
  return data;
};

export const checkOnboardingStatus = async (userId: string) => {
  try {
    // Use raw query instead of strongly typed query until types are updated
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return (data as any).onboarding_completed as boolean;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // Default to not completed if there's an error
    return false;
  }
};
