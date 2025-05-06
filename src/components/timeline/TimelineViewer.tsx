import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import ChakraTag from '@/components/chakra/ChakraTag';
import { ChakraTag as ChakraTagType } from '@/types/chakras';
import { Button } from '@/components/ui/button';
import { Edit2, Sparkles, Music, Play, Activity } from 'lucide-react';

interface TimelineViewerProps {
  activeTagFilter: string;
  chakraFilter: ChakraTagType[];
  onEdit: (entry: any) => void;
}

interface TimelineEntry {
  id: string;
  created_at: string;
  title: string;
  tag: string;
  chakra_tag?: string;
  notes?: string;
  user_id: string;
}

const TimelineViewer: React.FC<TimelineViewerProps> = ({ 
  activeTagFilter, 
  chakraFilter,
  onEdit
}) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!user) return;

      setLoading(true);
      try {
        let query = supabase
          .from('timeline_snapshots')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (activeTagFilter !== 'all') {
          query = query.ilike('tag', `%${activeTagFilter}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching timeline:', error);
          return;
        }

        // Apply chakra filter client-side since we may not have chakra_tag data yet
        let filteredData = data;
        if (chakraFilter.length > 0) {
          filteredData = data.filter(entry => {
            // If entry has no chakra_tag, try to parse it from notes
            let entryChakra = entry.chakra_tag;
            if (!entryChakra && entry.notes) {
              try {
                const parsedNotes = JSON.parse(entry.notes);
                entryChakra = parsedNotes.chakra;
              } catch (e) {
                // Parse error, ignore
              }
            }
            
            return entryChakra && chakraFilter.includes(entryChakra as ChakraTagType);
          });
        }

        setEntries(filteredData as TimelineEntry[]);
      } catch (err) {
        console.error('Error in timeline fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [user, activeTagFilter, chakraFilter]);

  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = format(new Date(entry.created_at), 'yyyy-MM-dd');
    
    if (!acc[date]) {
      acc[date] = [];
    }
    
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimelineEntry[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin h-6 w-6 border-b-2 border-purple-500 rounded-full mr-3"></div>
        <div>Loading your timeline...</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center p-12">
        <h3 className="text-xl font-medium mb-2">No timeline entries found</h3>
        <p className="text-gray-400 mb-4">
          {chakraFilter.length > 0 
            ? 'Try adjusting your chakra filter to see more entries.' 
            : activeTagFilter !== 'all' 
              ? 'Try selecting "All Events" to see your complete timeline.' 
              : 'Your journey is just beginning. Create a new journey to start building your timeline.'}
        </p>
      </div>
    );
  }

  const getEntryIcon = (tag: string) => {
    if (tag.includes('spiral')) return <Sparkles className="h-5 w-5 text-blue-400" />;
    if (tag.includes('soundscape')) return <Music className="h-5 w-5 text-green-400" />;
    if (tag.includes('journey')) return <Play className="h-5 w-5 text-purple-400" />;
    return <Activity className="h-5 w-5 text-gray-400" />;
  };

  const getChakraFromEntry = (entry: TimelineEntry): string | undefined => {
    // If entry has chakra_tag directly, use it
    if (entry.chakra_tag) return entry.chakra_tag;
    
    // Otherwise try to parse from notes
    if (entry.notes) {
      try {
        const parsedNotes = JSON.parse(entry.notes);
        return parsedNotes.chakra;
      } catch (e) {
        // Parse error, ignore
      }
    }
    return undefined;
  };

  return (
    <div className="space-y-6">
      {Object.entries(entriesByDate).map(([date, dayEntries]) => (
        <div key={date} className="space-y-2">
          <h3 className="text-md font-medium text-white mb-2">
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="space-y-3">
            {dayEntries.map(entry => (
              <div 
                key={entry.id} 
                className="flex items-start bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex-shrink-0 mr-3 mt-1">
                  {getEntryIcon(entry.tag)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-white">{entry.title}</h4>
                      <p className="text-sm text-gray-400">
                        {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(entry)}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full
                      ${entry.tag.includes('spiral') ? 'bg-blue-500/20 text-blue-300' : ''}
                      ${entry.tag.includes('soundscape') ? 'bg-green-500/20 text-green-300' : ''}
                      ${entry.tag.includes('journey') ? 'bg-purple-500/20 text-purple-300' : ''}
                      ${!entry.tag.includes('spiral') && !entry.tag.includes('soundscape') && !entry.tag.includes('journey') ? 'bg-gray-500/20 text-gray-300' : ''}
                    `}>
                      {entry.tag}
                    </span>
                    
                    {getChakraFromEntry(entry) && (
                      <ChakraTag chakra={getChakraFromEntry(entry)} size="sm" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineViewer;
