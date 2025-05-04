
import { supabase } from '@/integrations/supabase/client';

export interface Journey {
  id: number;
  filename: string;
  title: string;
  tags?: string;
  content?: string;
  veil_locked: boolean;
  visual_effects?: string;
  strobe_patterns?: string;
  assigned_songs?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  // New fields
  intent?: string;
  sound_frequencies?: string;
  script?: string;
  duration?: string;
  notes?: string;
  env_lighting?: string;
  env_temperature?: string;
  env_incense?: string;
  env_posture?: string;
  env_tools?: string;
  recommended_users?: string;
}

export const fetchJourneys = async (): Promise<Journey[]> => {
  const { data, error } = await supabase
    .from('journeys')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching journeys:', error);
    throw error;
  }

  return data || [];
};

export const fetchJourneyBySlug = async (slug: string): Promise<Journey | null> => {
  const { data, error } = await supabase
    .from('journeys')
    .select('*')
    .eq('filename', slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching journey with slug ${slug}:`, error);
    throw error;
  }

  return data;
};

export const updateJourney = async (journey: Partial<Journey> & { id: number }): Promise<Journey> => {
  console.log("Updating journey with data:", journey);
  
  const { data, error } = await supabase
    .from('journeys')
    .update({
      ...journey,
      updated_at: new Date().toISOString(),
    })
    .eq('id', journey.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating journey:', error);
    throw error;
  }

  return data;
};

export const createJourney = async (journey: Omit<Journey, 'id' | 'created_at' | 'updated_at'>): Promise<Journey> => {
  console.log("Creating new journey with data:", journey);
  
  const { data, error } = await supabase
    .from('journeys')
    .insert({ ...journey })
    .select()
    .single();

  if (error) {
    console.error('Error creating journey:', error);
    throw error;
  }

  console.log("Journey created successfully:", data);
  return data;
};
