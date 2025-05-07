
import React, { useState, useEffect } from 'react';
import { fetchJourneyTimeline } from '@/services/timelineService';
import { JourneyTimelineItem } from '@/types/journey';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!journeyId) return;
    
    const loadTimeline = async () => {
      setLoading(true);
      try {
        const items = await fetchJourneyTimeline(journeyId, limit);
        setTimelineItems(items);
      } catch (error) {
        console.error("Error loading timeline:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTimeline();
    
    // Set up auto refresh if enabled
    let intervalId: NodeJS.Timeout | null = null;
    if (autoSync) {
      intervalId = setInterval(loadTimeline, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [journeyId, limit, autoSync]);

  // Format the timestamp for better readability
  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'Unknown time';
    }
  };

  return (
    <div className="journey-timeline bg-black/50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white">Journey Timeline</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-white hover:bg-white/10"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-5 w-5 border-2 border-purple-500 rounded-full border-t-transparent"></div>
        </div>
      ) : timelineItems.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-3">No timeline events yet</p>
      ) : (
        <div className={`space-y-2 ${expanded ? '' : 'max-h-40 overflow-y-auto custom-scrollbar'}`}>
          {timelineItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`
                p-2 rounded-md text-sm
                ${index === 0 ? 'bg-purple-900/20' : 'bg-gray-800/30'}
                border ${item.chakra_tag ? 'border-purple-500/30' : 'border-gray-700/30'}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="font-medium text-white">{item.title}</div>
                <div className="text-xs text-gray-400">{formatTimeAgo(item.created_at)}</div>
              </div>
              
              {item.tag && (
                <div className="text-xs text-purple-300 mt-1">{item.tag}</div>
              )}
              
              {item.chakra_tag && (
                <div className="mt-1 flex items-center">
                  <div className="px-2 py-0.5 bg-purple-900/30 text-xs rounded-full text-purple-200">
                    {item.chakra_tag}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JourneyTimelineView;
