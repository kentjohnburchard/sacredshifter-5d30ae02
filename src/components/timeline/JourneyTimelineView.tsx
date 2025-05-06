
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useJourney } from '@/context/JourneyContext';
import { fetchJourneyTimeline } from '@/services/timelineService';
import { JourneyTimelineItem } from '@/types/journey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Clock, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JourneyTimelineViewProps {
  journeyId?: string;
  autoSync?: boolean;
  limit?: number;
  showHeader?: boolean;
}

const JourneyTimelineView: React.FC<JourneyTimelineViewProps> = ({
  journeyId,
  autoSync = true,
  limit = 10,
  showHeader = true
}) => {
  const { user } = useAuth();
  const { activeJourney } = useJourney();
  const [timelineEntries, setTimelineEntries] = useState<JourneyTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Either use provided journeyId or get from context if autoSync is true
  const effectiveJourneyId = journeyId || (autoSync && activeJourney?.id);
  
  useEffect(() => {
    const fetchTimeline = async () => {
      if (!user?.id || !effectiveJourneyId) {
        setTimelineEntries([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await fetchJourneyTimeline(user.id, effectiveJourneyId.toString());
        setTimelineEntries(data.slice(0, limit));
      } catch (error) {
        console.error('Error fetching journey timeline:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeline();
  }, [user?.id, effectiveJourneyId, limit]);
  
  // Filter entries based on active filter
  const filteredEntries = activeFilter === 'all' 
    ? timelineEntries 
    : timelineEntries.filter(entry => entry.tag?.includes(activeFilter));
  
  // Group entries by day for the chronological view
  const groupedByDay = filteredEntries.reduce((acc, entry) => {
    const date = new Date(entry.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, JourneyTimelineItem[]>);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin h-5 w-5 border-b-2 border-purple-500 rounded-full"></div>
        <span className="ml-2">Loading timeline...</span>
      </div>
    );
  }
  
  if (timelineEntries.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-400">No timeline entries found for this journey yet.</p>
      </div>
    );
  }
  
  return (
    <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-purple-400" />
            Journey Timeline
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <Tabs defaultValue="chronological">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="chronological">Chronological</TabsTrigger>
            <TabsTrigger value="spiral">Spiral Events</TabsTrigger>
            <TabsTrigger value="sound">Sound Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chronological" className="space-y-4">
            {Object.entries(groupedByDay).map(([date, entries]) => (
              <div key={date} className="space-y-2">
                <div className="text-sm font-medium text-purple-300">{date}</div>
                <div className="space-y-2">
                  {entries.map(entry => (
                    <TimelineEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="spiral" className="space-y-4">
            {filteredEntries
              .filter(entry => entry.tag?.includes('spiral'))
              .map(entry => (
                <TimelineEntry key={entry.id} entry={entry} />
              ))
            }
          </TabsContent>
          
          <TabsContent value="sound" className="space-y-4">
            {filteredEntries
              .filter(entry => entry.tag?.includes('soundscape'))
              .map(entry => (
                <TimelineEntry key={entry.id} entry={entry} />
              ))
            }
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const TimelineEntry: React.FC<{ entry: JourneyTimelineItem }> = ({ entry }) => {
  const getTagColor = (tag: string) => {
    if (tag.includes('spiral')) return 'bg-blue-500/20 text-blue-300';
    if (tag.includes('soundscape')) return 'bg-green-500/20 text-green-300';
    if (tag.includes('journey')) return 'bg-purple-500/20 text-purple-300';
    return 'bg-gray-500/20 text-gray-300';
  };
  
  const parsedNotes = entry.notes ? JSON.parse(entry.notes) : {};

  return (
    <div className="flex items-start gap-3 p-2 border border-gray-800 rounded-lg bg-black/60">
      <div className="mt-1">
        <Circle className="h-2 w-2 text-purple-500" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm text-white">{entry.title}</div>
        {parsedNotes.details && (
          <div className="text-xs text-gray-400 mt-1">
            {parsedNotes.details}
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(entry.tag)}`}>
            {entry.tag.replace(/_/g, ' ')}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyTimelineView;
