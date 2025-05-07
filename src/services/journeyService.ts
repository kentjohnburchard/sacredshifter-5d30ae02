
import { supabase } from '@/integrations/supabase/client';
import { Journey } from '@/types/journey';

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
    id: String(journey.id),
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
      id: String(data.id),
      source: 'database',
      isEditable: true
    };
  }
  
  return data;
};

export const updateJourney = async (journey: Partial<Journey> & { id: string }): Promise<Journey> => {
  console.log("Updating journey with data:", journey);
  
  const { data, error } = await supabase
    .from('journeys')
    .update({
      ...journey,
      updated_at: new Date().toISOString(),
      id: parseInt(journey.id) // Convert string id to number for database
    })
    .eq('id', parseInt(journey.id))
    .select('id, title, filename, veil_locked, audio_filename')
    .single();

  if (error) {
    console.error('Error updating journey:', error);
    throw error;
  }

  return {
    ...data,
    id: String(data.id),
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
    id: String(data.id),
    source: 'database',
    isEditable: true
  };
};
