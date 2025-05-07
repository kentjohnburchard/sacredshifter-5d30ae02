
import React, { useState, useEffect } from 'react';
import { JourneyTimelineItem } from '@/types/journey';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, Clock } from 'lucide-react';

interface JourneyTimelineViewProps {
  journeyId?: string;
  autoSync?: boolean;
  limit?: number;
}

const JourneyTimelineView: React.FC<JourneyTimelineViewProps> = ({ 
  journeyId, 
  autoSync = false,
  limit = 10 
}) => {
  const { user } = useAuth();
  const [timelineItems, setTimelineItems] = useState<JourneyTimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Only fetch timeline if we have both a user and journey ID
    if (!user?.id || !journeyId) return;
    
    const fetchTimeline = async () => {
      setLoading(true);
      
      try {
        // Fetch timeline items from the database
        const { data, error } = await supabase
          .from('timeline_snapshots')
          .select('*')
          .eq('user_id', user.id)
          .eq('journey_id', journeyId)
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) {
          console.error('Error fetching timeline:', error);
          return;
        }
        
        setTimelineItems(data || []);
      } catch (err) {
        console.error('Error in fetchTimeline:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeline();
  }, [journeyId, user?.id, limit]);
  
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Invalid time';
    }
  };
  
  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Get icon based on action type
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'journey_start':
        return '▶️';
      case 'journey_complete':
        return '✅';
      case 'soundscape_play':
        return '🔊';
      case 'soundscape_pause':
        return '⏸️';
      case 'spiral_toggle':
        return '🌀';
      default:
        return '📝';
    }
  };

  return (
    <div className="timeline-view">
      <h3 className="text-lg font-semibold mb-4 text-white">Journey Timeline</h3>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      ) : timelineItems.length === 0 ? (
        <p className="text-center text-gray-400 py-4">No activity recorded yet.</p>
      ) : (
        <div className="space-y-4">
          {timelineItems.map((item) => (
            <div key={item.id} className="bg-black/50 rounded-lg p-3 border border-purple-500/30">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  <span className="mr-2">{getActionIcon(item.action || '')}</span>
                  <span className="font-medium text-white">{item.title}</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> {formatTime(item.created_at)}
                </div>
              </div>
              
              <div className="text-xs text-gray-400 flex items-center">
                <CalendarDays className="h-3 w-3 mr-1" />
                {formatDate(item.created_at)}
              </div>
              
              {item.notes && (
                <p className="text-sm text-gray-300 mt-2">{item.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JourneyTimelineView;
