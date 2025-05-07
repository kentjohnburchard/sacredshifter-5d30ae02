
import React, { useEffect, useState } from 'react';
import { fetchJourneyTimeline } from '@/services/timelineService';
import { JourneyTimelineItem } from '@/types/journey';
import TimelineEntryCard from './TimelineEntryCard';
import { useJourney } from '@/context/JourneyContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { normalizeId } from '@/utils/parsers';

interface JourneyTimelineViewProps {
  journeyId?: string;
  autoSync?: boolean; 
  limit?: number;
}

const JourneyTimelineView: React.FC<JourneyTimelineViewProps> = ({ 
  journeyId,
  autoSync = true,
  limit = 10
}) => {
  const [timelineItems, setTimelineItems] = useState<JourneyTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { activeJourney } = useJourney();
  const { user } = useAuth();
  
  // Determine which journey ID to use
  const effectiveJourneyId = autoSync && activeJourney?.id 
    ? activeJourney.id 
    : journeyId;
  
  useEffect(() => {
    loadTimelineData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveJourneyId]);
  
  const loadTimelineData = async () => {
    if (!effectiveJourneyId) {
      setTimelineItems([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await fetchJourneyTimeline(normalizeId(effectiveJourneyId), Number(limit));
      setTimelineItems(data);
    } catch (error) {
      console.error("Error loading timeline data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTimelineData();
    setRefreshing(false);
  };
  
  if (loading) {
    return (
      <div className="space-y-4 min-h-[200px] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-b-2 border-white rounded-full"></div>
      </div>
    );
  }
  
  if (!effectiveJourneyId) {
    return (
      <div className="text-center py-4 text-white/70">
        No journey selected
      </div>
    );
  }
  
  if (timelineItems.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-6 text-white/70">
          <p>No timeline events found for this journey</p>
          <Button 
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white readable-text">Journey Timeline</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="hover:bg-white/10"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {timelineItems.map(item => (
          <TimelineEntryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default JourneyTimelineView;
