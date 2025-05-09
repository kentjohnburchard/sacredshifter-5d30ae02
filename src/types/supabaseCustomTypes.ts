
// Custom type definitions for Supabase data
// Use these instead of modifying the auto-generated types.ts file.

import type { Database } from "@/integrations/supabase/types";

// Export convenient type references
export type Tables = Database['public']['Tables'];
export type Profiles = Tables['profiles']['Row'];
export type UserPreferences = Tables['user_preferences']['Row'];
export type Sessions = Tables['sessions']['Row'];
export type TimelineSnapshots = Tables['timeline_snapshots']['Row'];

// Custom types for the onboarding flow
export interface OnboardingData {
  displayName: string;
  realName?: string;
  pronouns?: string;
  pathChoices?: string[];
  sacredBio?: string;
  earnedBadges?: string[];
  onboardingComplete: boolean;
}

// Extended profile type with any additional fields needed
export interface ExtendedProfile extends Profiles {
  display_name: string | null;
  full_name: string | null;
  bio: string | null;
  initial_mood: string | null;
  primary_intention: string | null;
  energy_level: number | null;
  interests: string[] | null;
  onboarding_completed: boolean;
  is_premium: boolean | null;
  is_lifetime_member: boolean | null;
  role: 'user' | 'admin' | null;
}

// Helper function to convert OnboardingData to database format
export function convertOnboardingDataToProfile(
  userId: string, 
  data: OnboardingData
): Partial<ExtendedProfile> {
  return {
    id: userId,
    display_name: data.displayName,
    full_name: data.realName || null,
    bio: data.sacredBio || null,
    interests: data.pathChoices || null,
    onboarding_completed: data.onboardingComplete,
    updated_at: new Date().toISOString()
  };
}
