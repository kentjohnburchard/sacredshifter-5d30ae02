
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
  energy_level: number | null;
  interests: string[];
  updated_at: string;
  // New soul progression fields
  lightbearer_level: number;
  ascension_title: string;
  soul_alignment: 'Light' | 'Shadow' | 'Unity';
  frequency_signature: string;
  badges: string[];
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
  // New default values for soul progression fields
  lightbearer_level: 1,
  ascension_title: "Seeker",
  soul_alignment: "Light" as 'Light',
  frequency_signature: "",
  badges: [],
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
  light_points: 0,
  // New soul progression fields with default values
  lightbearer_level: 1,
  ascension_title: "Seeker",
  soul_alignment: "Light" as 'Light',
  frequency_signature: "",
  badges: [],
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
    light_points: 0,
    // New soul progression fields with default values
    lightbearer_level: 1,
    ascension_title: "Seeker",
    soul_alignment: "Light" as 'Light',
    frequency_signature: "",
    badges: [],
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
    
    if (data) {
      // Ensure the data conforms to ExtendedProfile type, with proper number conversion
      return {
        id: data.id,
        full_name: data.full_name,
        display_name: data.display_name || "Lightbearer",
        bio: data.bio,
        avatar_url: data.avatar_url,
        onboarding_completed: Boolean(data.onboarding_completed),
        initial_mood: data.initial_mood,
        primary_intention: data.primary_intention,
        energy_level: data.energy_level !== null 
          ? (typeof data.energy_level === 'string' 
              ? parseInt(data.energy_level, 10) 
              : Number(data.energy_level)) 
          : null,
        interests: Array.isArray(data.interests) ? data.interests : [],
        updated_at: data.updated_at || new Date().toISOString(),
        earned_badges: Array.isArray(data.earned_badges) ? data.earned_badges : [],
        light_level: Number(data.light_level) || 1,
        light_points: Number(data.light_points) || 0,
        last_level_up: data.last_level_up,
        // New soul progression fields with graceful fallbacks to defaults
        lightbearer_level: Number(data.lightbearer_level) || 1,
        ascension_title: data.ascension_title || "Seeker",
        soul_alignment: (data.soul_alignment as 'Light' | 'Shadow' | 'Unity') || "Light",
        frequency_signature: data.frequency_signature || "",
        badges: Array.isArray(data.badges) ? data.badges : [],
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchProfile:', error);
    return null;
  }
};

// Update the updateProfile function to handle the new fields
export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  try {
    // Ensure energy_level is properly typed when sent to Supabase
    const processedUpdates = { 
      ...updates,
      // Convert energy_level to a number if it exists and isn't already a number
      ...(updates.energy_level !== undefined && {
        energy_level: typeof updates.energy_level === 'string' 
          ? parseInt(updates.energy_level, 10) 
          : updates.energy_level
      })
    };
    
    const { error } = await supabase
      .from('profiles')
      .update(processedUpdates)
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
