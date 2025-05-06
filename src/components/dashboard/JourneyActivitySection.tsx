
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchUserTimeline } from '@/services/timelineService';
import { JourneyTimelineItem } from '@/types/journey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Play, 
  BarChart, 
  Volume2,
  LineChart,
  CalendarDays 
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import ChakraTag from '@/components/chakra/ChakraTag';
import { getUserChakraProgress } from '@/services/chakraService';
import { ChakraTag as ChakraTagType } from '@/types/chakras';

// Define interfaces for our parsed JSON structures
interface JourneyNotes {
  journeyId?: string;
  journeyTitle?: string;
  chakra?: ChakraTagType;
  error?: string;
  [key: string]: any; // Allow for other properties
}

interface ChakraProgress {
  chakra: ChakraTagType;
  count: number;
  percentage: number;
}

const JourneyActivitySection: React.FC = () => {
  const { user } = useAuth();
  const [timelineEntries, setTimelineEntries] = useState<JourneyTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [chakraProgress, setChakraProgress] = useState<ChakraProgress[]>([]);
  
  useEffect(() => {
    const fetchTimeline = async () => {
      if (!user?.id) {
        setTimelineEntries([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await fetchUserTimeline(user.id, activeFilter === 'all' ? undefined : activeFilter);
        setTimelineEntries(data.slice(0, 20)); // Limit to 20 most recent entries
        
        // Fetch chakra progress
        const progress = await getUserChakraProgress(user.id);
        setChakraProgress(progress);
      } catch (error) {
        console.error('Error fetching timeline:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeline();
  }, [user?.id, activeFilter]);
  
  // Group entries by journey - with error handling for JSON parsing
  const entriesByJourney = timelineEntries.reduce((acc, entry) => {
    let notes: JourneyNotes = {};
    // Add proper error handling for JSON parsing
    if (entry.notes) {
      try {
        notes = JSON.parse(entry.notes) as JourneyNotes;
      } catch (error) {
        console.error(`Failed to parse notes for entry ${entry.id}:`, error);
        notes = { journeyId: 'unknown', error: 'Invalid JSON' };
      }
    }
    
    const journeyId = notes.journeyId || 'unknown';
    
    if (!acc[journeyId]) {
      acc[journeyId] = [];
    }
    
    acc[journeyId].push(entry);
    return acc;
  }, {} as Record<string, JourneyTimelineItem[]>);
  
  const eventTypeIcon = (tag: string) => {
    if (tag.includes('spiral')) return <LineChart className="h-4 w-4 text-blue-400" />;
    if (tag.includes('soundscape')) return <Volume2 className="h-4 w-4 text-green-400" />;
    if (tag.includes('journey')) return <Play className="h-4 w-4 text-purple-400" />;
    return <Activity className="h-4 w-4 text-gray-400" />;
  };
  
  // Get chakra from entry
  const getEntryChakra = (entry: JourneyTimelineItem): ChakraTagType | undefined => {
    if (entry.chakra_tag) return entry.chakra_tag as ChakraTagType;
    
    if (entry.notes) {
      try {
        const parsedNotes = JSON.parse(entry.notes) as JourneyNotes;
        return parsedNotes.chakra;
      } catch (e) {
        // Parse error, ignore
      }
    }
    return undefined;
  };
  
  if (loading) {
    return (
      <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Journey Activity</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-b-2 border-purple-500 rounded-full"></div>
          <span className="ml-2">Loading activity...</span>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-purple-400" />
          Journey Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveFilter}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="spiral">Spiral</TabsTrigger>
            <TabsTrigger value="soundscape">Audio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ActivityTimeline entries={timelineEntries} />
          </TabsContent>
          
          <TabsContent value="spiral">
            <ActivityTimeline 
              entries={timelineEntries.filter(entry => entry.tag.includes('spiral'))}
            />
          </TabsContent>
          
          <TabsContent value="soundscape">
            <ActivityTimeline 
              entries={timelineEntries.filter(entry => entry.tag.includes('soundscape'))}
            />
          </TabsContent>
        </Tabs>
        
        {timelineEntries.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-purple-300 mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Journey Summary
            </h3>
            
            <div className="space-y-4">
              {Object.entries(entriesByJourney).map(([journeyId, entries]) => {
                // Safe extraction of journey info with error handling
                let journeyTitle = 'Unknown Journey';
                let journeyChakra: ChakraTagType | undefined;
                
                try {
                  if (entries[0]?.notes) {
                    const journeyInfo = JSON.parse(entries[0].notes) as JourneyNotes;
                    journeyTitle = journeyInfo.journeyTitle || 'Unknown Journey';
                    journeyChakra = journeyInfo.chakra;
                  }
                } catch (error) {
                  console.error(`Failed to parse journey info for ${journeyId}:`, error);
                }
                
                return (
                  <div key={journeyId} className="bg-black/60 rounded-lg p-3 border border-purple-900/30">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white text-sm">{journeyTitle}</h4>
                      {journeyChakra && <ChakraTag chakra={journeyChakra} size="sm" />}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <div className="flex items-center">
                        <LineChart className="h-3 w-3 mr-1" />
                        {entries.filter(e => e.tag.includes('spiral')).length} spiral events
                      </div>
                      <div className="flex items-center">
                        <Volume2 className="h-3 w-3 mr-1" />
                        {entries.filter(e => e.tag.includes('soundscape')).length} audio events
                      </div>
                      <div className="text-xs">
                        {entries.length} total
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {chakraProgress.length > 0 && (
          <div className="mt-8 border-t border-gray-800 pt-4">
            <h3 className="text-sm font-medium text-purple-300 mb-3">Chakra Activity</h3>
            <div className="space-y-3">
              {chakraProgress
                .filter(item => item.count > 0)
                .sort((a, b) => b.count - a.count)
                .slice(0, 4)
                .map(item => (
                  <div key={item.chakra} className="flex items-center gap-3">
                    <ChakraTag chakra={item.chakra} showTooltip={false} />
                    <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: getChakraProgressColor(item.chakra)
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">{item.percentage}%</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper to get chakra color for progress bar
const getChakraProgressColor = (chakra: ChakraTagType): string => {
  switch(chakra) {
    case 'Root': return '#ea384c';
    case 'Sacral': return '#ff7e47';
    case 'Solar Plexus': return '#ffd034';
    case 'Heart': return '#4ade80';
    case 'Throat': return '#48cae7';
    case 'Third Eye': return '#7e69ab';
    case 'Crown': return '#9b87f5';
    case 'Transpersonal': return '#e5deff';
    default: return '#9ca3af';
  }
};

const ActivityTimeline: React.FC<{ entries: JourneyTimelineItem[] }> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No activity recorded yet.</p>
      </div>
    );
  }
  
  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = format(new Date(entry.created_at), 'yyyy-MM-dd');
    
    if (!acc[date]) {
      acc[date] = [];
    }
    
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, JourneyTimelineItem[]>);
  
  return (
    <div className="space-y-6">
      {Object.entries(entriesByDate).map(([date, dateEntries]) => (
        <div key={date} className="space-y-2">
          <h3 className="text-sm font-medium text-purple-200">
            {format(new Date(date), 'EEEE, MMMM d')}
          </h3>
          <div className="space-y-2">
            {dateEntries.map(entry => {
              // Safe parsing of notes with error handling
              let parsedNotes: JourneyNotes = {};
              if (entry.notes) {
                try {
                  parsedNotes = JSON.parse(entry.notes) as JourneyNotes;
                } catch (error) {
                  console.error(`Failed to parse notes for timeline entry ${entry.id}:`, error);
                }
              }
              
              return (
                <div key={entry.id} className="flex items-center gap-3 p-2 bg-gray-900/40 rounded-md">
                  <div className="flex-shrink-0">
                    {entry.tag.includes('spiral') ? (
                      <LineChart className="h-4 w-4 text-blue-400" />
                    ) : entry.tag.includes('soundscape') ? (
                      <Volume2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <Activity className="h-4 w-4 text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{entry.title}</p>
                    <div className="flex items-center gap-2">
                      {parsedNotes.journeyTitle && (
                        <p className="text-xs text-gray-400 truncate">{parsedNotes.journeyTitle}</p>
                      )}
                      {parsedNotes.chakra && (
                        <ChakraTag chakra={parsedNotes.chakra} size="sm" />
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-500">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JourneyActivitySection;
