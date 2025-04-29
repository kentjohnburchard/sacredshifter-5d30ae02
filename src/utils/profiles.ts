
import { supabase } from "@/integrations/supabase/client";
import { ExtendedProfile } from "@/types/supabaseCustomTypes";

export type ProfileType = ExtendedProfile;

export const fetchProfile = async (userId: string): Promise<ProfileType> => {
  console.log("Fetching profile for user:", userId);
  
  try {
    // Try to fetch the profile from the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.log("Error fetching profile, or profile not found:", profileError);
    }
    
    // If we found a profile, return it
    if (profileData) {
      console.log("Profile found:", profileData);
      return profileData as ProfileType;
    }
    
    // If no profile was found, create a default profile
    console.log("No profile found, creating default profile");
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
    
    // Check if the user exists in user_credits as a fallback
    const { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .select('user_id')
      .eq('user_id', userId)
      .single();
    
    if (creditsError) {
      console.log("User not found in user_credits either:", creditsError);
    } else {
      console.log("User found in user_credits, but no profile exists");
    }
    
    // Attempt to create a profile for this user
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([{ 
        id: userId,
        display_name: "Sacred Explorer",
        bio: null,
        interests: ["Meditation", "Sound Healing"],
        onboarding_completed: false
      }])
      .select();
    
    if (insertError) {
      console.error("Failed to create profile:", insertError);
    } else if (newProfile && newProfile.length > 0) {
      console.log("Created new profile:", newProfile[0]);
      return newProfile[0] as ProfileType;
    }
    
    return defaultProfile;
  } catch (error) {
    console.error("Error in fetchProfile:", error);
    // Return a default profile if there's an error
    return {
      id: userId,
      full_name: null,
      display_name: "Sacred Explorer",
      bio: null,
      avatar_url: null,
      onboarding_completed: false,
      initial_mood: null,
      primary_intention: null,
      energy_level: null,
      interests: ["Meditation", "Sound Healing"],
      updated_at: new Date().toISOString()
    };
  }
};

export const updateProfile = async (userId: string, updates: Partial<ProfileType>) => {
  try {
    console.log("Updating profile for user:", userId, "with:", updates);
    
    // Update in the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    
    if (error) {
      console.error("Error updating profile:", error);
      
      // If the update failed, try inserting instead (in case the profile doesn't exist)
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId, ...updates }])
        .select();
      
      if (insertError) {
        console.error("Failed to create profile:", insertError);
        throw insertError;
      }
      
      return { success: true, data: insertData };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateProfile:", error);
    throw error;
  }
};

export const checkOnboardingStatus = async (userId: string): Promise<boolean> => {
  try {
    // Check if the user has a profile and if onboarding is completed
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
    
    return data?.onboarding_completed || false;
  } catch (error) {
    console.error("Error in checkOnboardingStatus:", error);
    // Default to not completed if there's an error
    return false;
  }
};
