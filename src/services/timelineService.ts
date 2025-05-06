import { supabase } from '@/integrations/supabase/client';
import { JourneyTimelineItem } from '@/types/journey';
import { ChakraTag } from '@/types/chakras';

/** 👇 Lightweight raw database type to avoid deep instantiation issues */
interface RawTimelineRow {
  id: string;
  user_id: string;
  title: string;
  tag: string | null;
  notes: string | null;
  chakra_tag?: ChakraTag | null;
  created_at: string;
  journey_id?: string | null;
  component?: string | null;
  action?: string | null;
  details?: any;
}

/** 🔧 Sanitizes raw DB rows into proper app-facing types */
function sanitizeTimeline(data: RawTimelineRow[]): JourneyTimelineItem[] {
  return data.map((item) => ({
    id: item.id,
    user_id: item.user_id,
    title: item.title,
    tag: item.tag || '',
    notes: item.notes,
    chakra_tag: item.chakra_tag ?? undefined,
    created_at: item.created_at,
    journey_id: item.journey_id ?? undefined,
    component: item.component ?? undefined,
    action: item.action ?? undefined,
    details: item.details,
  }));
}

export const fetchUserTimeline = async (
  userId: string,
  tag?: string
): Promise<JourneyTimelineItem[]> => {
  try {
    let query = supabase
      .from('timeline_snapshots')
      .select<RawTimelineRow[]>('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (tag) {
      query = query.ilike('tag', `%${tag}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching timeline:', error);
      return [];
    }

    return sanitizeTimeline(data ?? []);
  } catch (err) {
    console.error('Error in fetchUserTimeline:', err);
    return [];
  }
};

const processJourneyNotes = (entry: RawTimelineRow, journeyId: string): boolean => {
  if (!entry.notes || typeof entry.notes !== 'string') return false;
  if (!entry.notes.includes(journeyId)) return false;

  try {
    const parsed = JSON.parse(entry.notes);
    return parsed && typeof parsed === 'object' && parsed.journeyId === journeyId;
  } catch {
    return false;
  }
};

export const fetchJourneyTimeline = async (
  userId: string,
  journeyId: string
): Promise<JourneyTimelineItem[]> => {
  try {
    const { data: directMatches, error: directError } = await supabase
      .from('timeline_snapshots')
      .select<RawTimelineRow[]>('*')
      .eq('user_id', userId)
      .eq('journey_id', journeyId)
      .order('created_at', { ascending: false });

    if (directError) {
      console.error('Error fetching direct journey timeline:', directError);
      return [];
    }

    const typedDirectMatches = sanitizeTimeline(directMatches ?? []);

    const { data: allEntries, error: allError } = await supabase
      .from('timeline_snapshots')
      .select<RawTimelineRow[]>('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('Error fetching all timeline entries:', allError);
      return typedDirectMatches;
    }

    const notesMatches = (allEntries ?? [])
      .filter((entry) => processJourneyNotes(entry, journeyId))
      .map((entry) => sanitizeTimeline([entry])[0]);

    const merged: JourneyTimelineItem[] = [...typedDirectMatches];

    for (const match of notesMatches) {
      if (!merged.find((item) => item.id === match.id)) {
        merged.push(match);
      }
    }

    return merged;
  } catch (err) {
    console.error('Error in fetchJourneyTimeline:', err);
    return [];
  }
};

export const createTimelineEntry = async (
  userId: string,
  title: string,
  tag: string,
  notes: string | Record<string, any>,
  chakraTag?: ChakraTag,
  journeyId?: string
): Promise<JourneyTimelineItem | null> => {
  try {
    const formattedNotes =
      typeof notes === 'string' ? notes : JSON.stringify(notes);

    const entryData = {
      user_id: userId,
      title,
      tag,
      notes: formattedNotes,
      chakra_tag: chakraTag ?? null,
      journey_id: journeyId ?? null,
    };

    const { data, error } = await supabase
      .from('timeline_snapshots')
      .insert(entryData)
      .select<RawTimelineRow>()
      .single();

    if (error) {
      console.error('Error creating timeline entry:', error);
      return null;
    }

    return sanitizeTimeline([data])[0];
  } catch (err) {
    console.error('Error in createTimelineEntry:', err);
    return null;
  }
};

export const updateTimelineEntry = async (
  entryId: string,
  updates: {
    title?: string;
    tag?: string;
    notes?: any;
    chakra_tag?: ChakraTag | null;
  }
): Promise<boolean> => {
  try {
    const formattedUpdates = {
      ...updates,
      notes:
        updates.notes && typeof updates.notes !== 'string'
          ? JSON.stringify(updates.notes)
          : updates.notes,
    };

    const { error } = await supabase
      .from('timeline_snapshots')
      .update(formattedUpdates)
      .eq('id', entryId);

    if (error) {
      console.error('Error updating timeline entry:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in updateTimelineEntry:', err);
    return false;
  }
};

export const deleteTimelineEntry = async (
  entryId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('timeline_snapshots')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Error deleting timeline entry:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in deleteTimelineEntry:', err);
    return false;
  }
};

export const logTimelineEvent = async (
  userId: string,
  category: string,
  action: string,
  journeyId?: string,
  details?: any
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('timeline_snapshots').insert({
      user_id: userId,
      title: `${category}: ${action}`,
      tag: category,
      notes:
        typeof details === 'string'
          ? details
          : JSON.stringify({
              action,
              journeyId,
              ...details,
            }),
    });

    if (error) {
      console.error('Error logging timeline event:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in logTimelineEvent:', err);
    return false;
  }
};
