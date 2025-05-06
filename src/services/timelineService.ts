import { supabase } from '@/integrations/supabase/client';
import { JourneyTimelineItem } from '@/types/journey';
import { ChakraTag } from '@/types/chakras';

export const fetchUserTimeline = async (
  userId: string,
  tag?: string
): Promise<JourneyTimelineItem[]> => {
  try {
    let query = supabase
      .from('timeline_snapshots')
      .select('*')
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

    return data as unknown as JourneyTimelineItem[];
  } catch (err) {
    console.error('Error in fetchUserTimeline:', err);
    return [];
  }
};

export const fetchJourneyTimeline = async (
  userId: string,
  journeyId: string
): Promise<JourneyTimelineItem[]> => {
  try {
    const { data: directMatches, error: directError } = await supabase
      .from('timeline_snapshots')
      .select('*')
      .eq('user_id', userId)
      .eq('journey_id', journeyId)
      .order('created_at', { ascending: false });

    if (directError) {
      console.error('Error fetching journey timeline:', directError);
      return [];
    }

    const { data: allEntries, error: allError } = await supabase
      .from('timeline_snapshots')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('Error fetching all timeline entries:', allError);
      return directMatches as unknown as JourneyTimelineItem[] || [];
    }

    const notesMatches: JourneyTimelineItem[] = [];

    if (allEntries) {
      for (const entry of allEntries) {
        if (!entry.notes || typeof entry.notes !== 'string') {
          continue;
        }

        if (entry.notes.includes(journeyId)) {
          try {
            const notesObj = JSON.parse(entry.notes);
            if (
              notesObj &&
              typeof notesObj === 'object' &&
              notesObj.journeyId === journeyId
            ) {
              notesMatches.push(entry as JourneyTimelineItem);
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }

    const uniqueEntries = [...(directMatches || [])];

    for (const match of notesMatches) {
      if (!uniqueEntries.some(entry => entry.id === match.id)) {
        uniqueEntries.push(match);
      }
    }

    return uniqueEntries as JourneyTimelineItem[];
  } catch (err) {
    console.error('Error in fetchJourneyTimeline:', err);
    return [];
  }
};

export const createTimelineEntry = async (
  userId: string,
  title: string,
  tag: string,
  notes: any,
  chakraTag?: ChakraTag
): Promise<JourneyTimelineItem | null> => {
  try {
    const { data, error } = await supabase
      .from('timeline_snapshots')
      .insert({
        user_id: userId,
        title,
        tag,
        notes: typeof notes === 'string' ? notes : JSON.stringify(notes),
        chakra_tag: chakraTag
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating timeline entry:', error);
      return null;
    }

    return data as JourneyTimelineItem;
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
          : updates.notes
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

export const deleteTimelineEntry = async (entryId: string): Promise<boolean> => {
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
              ...details
            })
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
