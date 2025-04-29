import { User } from "@supabase/supabase-js";

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
  // Add the missing properties
  earned_badges: [],
  last_level_up: null,
  light_level: 1,
  light_points: 0
};

export const createProfileFromUser = (
  user: User,
  displayName: string | null = null
): ExtendedProfile => {
  // Also fix the other instance in the file
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
    // Add the missing properties
    earned_badges: [],
    last_level_up: null,
    light_level: 1,
    light_points: 0
  };

  return newProfile;
};

export default defaultProfile;
