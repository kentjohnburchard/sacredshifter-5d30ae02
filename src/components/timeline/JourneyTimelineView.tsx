
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { JourneyTimelineItem } from '@/types/journey';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchTimelineItems = async () => {
    if (!journeyId) return;
    
    setIsLoading(true);
    try {
      // This would typically fetch from your API or Supabase
      // For now, we'll create mock timeline items
      const mockTimelineItems: JourneyTimelineItem[] = [
        {
          id: '1',
          user_id: 'current-user',
          title: 'Journey Started',
          tag: 'journey_start',
          created_at: new Date().toISOString(),
          journey_id: journeyId,
          action: 'start'
        },
        {
          id: '2',
          user_id: 'current-user',
          title: 'Spiral Activated',
          tag: 'spiral_toggle',
          created_at: new Date(Date.now() - 60000).toISOString(),
          journey_id: journeyId,
          action: 'enable',
          details: { enabled: true }
        },
        {
          id: '3',
          user_id: 'current-user',
          title: 'Audio Started',
          tag: 'soundscape_play',
          created_at: new Date(Date.now() - 120000).toISOString(),
          journey_id: journeyId,
          action: 'play'
        }
      ];
      
      setTimelineItems(mockTimelineItems.slice(0, limit));
    } catch (error) {
      console.error('Error fetching timeline items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineItems();
    
    // Set up polling if autoSync is enabled
    let interval: NodeJS.Timeout | null = null;
    if (autoSync) {
      interval = setInterval(fetchTimelineItems, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [journeyId, autoSync, limit]);

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      
      const diffSeconds = Math.floor(diffMs / 1000);
      if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
      
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes < 60) return `${diffMinutes} min ago`;
      
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 24) return `${diffHours} hours ago`;
      
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return `${diffDays} days ago`;
    } catch (e) {
      return 'unknown time';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white readable-text">Journey Timeline</h3>
        <Button 
          onClick={fetchTimelineItems} 
          size="sm" 
          variant="ghost" 
          className="text-purple-200"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {timelineItems.length === 0 ? (
        <p className="text-sm text-white/60 readable-text-light">No timeline events yet.</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {timelineItems.map(item => (
            <div 
              key={item.id} 
              className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-md p-2"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-white">{item.title}</h4>
                <span className="text-xs text-white/60">{formatTimeAgo(item.created_at)}</span>
              </div>
              <div className="text-xs text-white/70 mt-1">
                {item.tag} {item.action && `- ${item.action}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JourneyTimelineView;
