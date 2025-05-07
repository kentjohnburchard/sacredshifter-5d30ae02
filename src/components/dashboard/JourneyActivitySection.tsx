
import React, { useEffect, useState } from 'react';
import { fetchJourneyTimeline } from '@/services/timelineService';
import { JourneyTimelineItem } from '@/types/journey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface JourneyActivitySectionProps {
  journeyId?: string;
  limit?: number;
  className?: string;
}

const JourneyActivitySection: React.FC<JourneyActivitySectionProps> = ({ 
  journeyId,
  limit = 5,
  className = ''
}) => {
  const [activities, setActivities] = useState<JourneyTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadActivities = async () => {
      if (!journeyId) return;
      
      setLoading(true);
      try {
        const items = await fetchJourneyTimeline(journeyId, Number(limit));
        setActivities(items);
      } catch (error) {
        console.error("Error loading journey activities:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadActivities();
  }, [journeyId, limit]);
  
  if (loading) {
    return (
      <Card className={`bg-black/40 border-purple-500/20 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-gray-200">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-pulse h-6 w-6 rounded-full bg-purple-500/50"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (activities.length === 0) {
    return (
      <Card className={`bg-black/40 border-purple-500/20 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-gray-200">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">No recent activity for this journey.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`bg-black/40 border-purple-500/20 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-200">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-3">
          {activities.map(activity => (
            <li key={activity.id} className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-purple-500 mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-200">{activity.title}</p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default JourneyActivitySection;
