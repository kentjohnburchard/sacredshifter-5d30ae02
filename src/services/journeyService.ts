
import { supabase } from '@/integrations/supabase/client';

export interface Journey {
  id: number;
  filename: string;
  title: string;
  tags?: string;
  veil_locked: boolean;
  visual_effects?: string;
  strobe_patterns?: string;
  assigned_songs?: string;
  created_at?: string;
  updated_at?: string;
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
  const { data, error } = await supabase
    .from('journeys')
    .insert({ ...journey })
    .select()
    .single();

  if (error) {
    console.error('Error creating journey:', error);
    throw error;
  }

  return data;
};
