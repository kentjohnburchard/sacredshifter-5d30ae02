
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  full_name: string | null;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  initial_mood: string | null;
  primary_intention: string | null;
  energy_level: string | null;
  interests: string[];
  updated_at: string;
}

export interface ExtendedProfile extends Profile {
  earned_badges: string[];
  light_level: number;
  light_points: number;
  last_level_up: string | null;
}

// Also export the Profile type as ProfileType for backward compatibility
export type ProfileType = ExtendedProfile;

export const defaultProfileValues = {
  full_name: null,
  display_name: "Lightbearer",
  bio: null,
  avatar_url: null,
  onboarding_completed: false,
  initial_mood: null,
  primary_intention: null,
  energy_level: null,
  interests: [],
};

// Add the missing properties to the default profile object
const defaultProfile: ExtendedProfile = {
  id: "",
  full_name: null,
  display_name: "Lightbearer",
  bio: null,
  avatar_url: null,
  onboarding_completed: false,
  initial_mood: null,
  primary_intention: null,
  energy_level: null,
  interests: [],
  updated_at: new Date().toISOString(),
  earned_badges: [],
  last_level_up: null,
  light_level: 1,
  light_points: 0
};

export const createProfileFromUser = (
  user: User,
  displayName: string | null = null
): ExtendedProfile => {
  const newProfile: ExtendedProfile = {
    id: user.id,
    full_name: null,
    display_name: displayName || "Lightbearer",
    bio: null,
    avatar_url: null,
    onboarding_completed: false,
    initial_mood: null,
    primary_intention: null,
    energy_level: null,
    interests: [],
    updated_at: new Date().toISOString(),
    earned_badges: [],
    last_level_up: null,
    light_level: 1,
    light_points: 0
  };

  return newProfile;
};

// Add the missing fetchProfile function
export const fetchProfile = async (userId: string): Promise<ExtendedProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    
    return data as ExtendedProfile;
  } catch (error) {
    console.error('Error in fetchProfile:', error);
    return null;
  }
};

// Add the missing updateProfile function
export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
};

// Add the missing checkOnboardingStatus function
export const checkOnboardingStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
    
    return data?.onboarding_completed || false;
  } catch (error) {
    console.error('Error in checkOnboardingStatus:', error);
    return false;
  }
};

export default defaultProfile;
