
import { supabase } from '@/integrations/supabase/client';
import { Journey } from '@/types/journey';

// Helper function to normalize journey data from database
const normalizeJourneyData = (data: any): Journey => {
  return {
    ...data,
    id: String(data.id),
    tags: typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()) : data.tags || [],
    sound_frequencies: data.sound_frequencies || '',
    assigned_songs: typeof data.assigned_songs === 'string' ? data.assigned_songs.split(',') : data.assigned_songs || [],
    visual_effects: typeof data.visual_effects === 'string' ? data.visual_effects.split(',') : data.visual_effects || [],
    strobe_patterns: typeof data.strobe_patterns === 'string' ? data.strobe_patterns.split(',') : data.strobe_patterns || [],
    recommended_users: typeof data.recommended_users === 'string' ? data.recommended_users.split(',') : data.recommended_users || [],
    source: 'database' as const,
    isEditable: true
  };
};

// Helper function to prepare journey data for database
const prepareJourneyForDb = (journey: Partial<Journey>): Record<string, any> => {
  return {
    ...journey,
    id: journey.id ? parseInt(journey.id) : undefined,
    tags: Array.isArray(journey.tags) ? journey.tags.join(',') : journey.tags,
    assigned_songs: Array.isArray(journey.assigned_songs) ? journey.assigned_songs.join(',') : journey.assigned_songs,
    visual_effects: Array.isArray(journey.visual_effects) ? journey.visual_effects.join(',') : journey.visual_effects,
    strobe_patterns: Array.isArray(journey.strobe_patterns) ? journey.strobe_patterns.join(',') : journey.strobe_patterns,
    recommended_users: Array.isArray(journey.recommended_users) ? journey.recommended_users.join(',') : journey.recommended_users,
  };
};

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
  const dbJourneys = (data || []).map(journey => normalizeJourneyData(journey));

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
    return normalizeJourneyData(data);
  }
  
  return data;
};

export const updateJourney = async (journey: Partial<Journey> & { id: string }): Promise<Journey> => {
  console.log("Updating journey with data:", journey);
  
  const dbJourney = prepareJourneyForDb(journey);
  
  const { data, error } = await supabase
    .from('journeys')
    .update(dbJourney)
    .eq('id', parseInt(journey.id))
    .select('id, title, filename, veil_locked, audio_filename')
    .single();

  if (error) {
    console.error('Error updating journey:', error);
    throw error;
  }

  return normalizeJourneyData(data);
};

export const createJourney = async (journey: Omit<Journey, 'id' | 'created_at' | 'updated_at'>): Promise<Journey> => {
  console.log("Creating new journey with data:", journey);
  
  const dbJourney = prepareJourneyForDb(journey);
  
  const { data, error } = await supabase
    .from('journeys')
    .insert(dbJourney)
    .select('id, title, filename, veil_locked, audio_filename')
    .single();

  if (error) {
    console.error('Error creating journey:', error);
    throw error;
  }

  console.log("Journey created successfully:", data);
  return normalizeJourneyData(data);
};
