
import { supabase } from '@/integrations/supabase/client';

export interface Journey {
  id: number;
  filename: string;
  title: string;
  veil_locked: boolean;
  audio_filename?: string;
  // Flag for core content journeys (not stored in DB)
  isCoreContent?: boolean;
  // New properties for source identification
  source?: 'core' | 'database';
  isEditable?: boolean;
}

export const fetchJourneys = async (): Promise<Journey[]> => {
  const { data, error } = await supabase
    .from('journeys')
    .select('id, title, filename, veil_locked, audio_filename')
    .order('id');

  if (error) {
    console.error('Error fetching journeys:', error);
    throw error;
  }

  // Mark all database journeys as editable and set source
  const dbJourneys = (data || []).map(journey => ({
    ...journey,
    source: 'database' as const,
    isEditable: true
  }));

  return dbJourneys;
};

export const fetchJourneyBySlug = async (slug: string): Promise<Journey | null> => {
  const { data, error } = await supabase
    .from('journeys')
    .select('id, title, filename, veil_locked, audio_filename')
    .eq('filename', slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching journey with slug ${slug}:`, error);
    throw error;
  }

  if (data) {
    return {
      ...data,
      source: 'database',
      isEditable: true
    };
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
    .select('id, title, filename, veil_locked, audio_filename')
    .single();

  if (error) {
    console.error('Error updating journey:', error);
    throw error;
  }

  return {
    ...data,
    source: 'database',
    isEditable: true
  };
};

export const createJourney = async (journey: Omit<Journey, 'id' | 'created_at' | 'updated_at'>): Promise<Journey> => {
  console.log("Creating new journey with data:", journey);
  
  const { data, error } = await supabase
    .from('journeys')
    .insert({ ...journey })
    .select('id, title, filename, veil_locked, audio_filename')
    .single();

  if (error) {
    console.error('Error creating journey:', error);
    throw error;
  }

  console.log("Journey created successfully:", data);
  return {
    ...data,
    source: 'database',
    isEditable: true
  };
};
