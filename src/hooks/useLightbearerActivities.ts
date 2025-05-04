
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLightbearerProgress } from './useLightbearerProgress';

export type LightbearerActivity = {
  id: string;
  activity_type: string;
  points: number;
  description: string | null;
  created_at: string;
};

export type ActivityStats = {
  [key: string]: number;
};

export const useLightbearerActivities = () => {
  const { user } = useAuth();
  const { addPoints, refreshStats } = useLightbearerProgress();
  const [activities, setActivities] = useState<LightbearerActivity[]>([]);
  const [stats, setStats] = useState<ActivityStats>({});
  const [loading, setLoading] = useState(true);

  // Points configuration
  const pointsConfig = {
    journal_post: 10,
    circle_post: 15,
    comment: 5,
    journey_completed: 20,
    heart_action: 10
  };

  const fetchActivities = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('lightbearer_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching activities:', error);
        return;
      }
      
      if (data) {
        setActivities(data);
        
        // Calculate stats
        const statsCounts: ActivityStats = {};
        data.forEach((activity) => {
          if (!statsCounts[activity.activity_type]) {
            statsCounts[activity.activity_type] = 0;
          }
          statsCounts[activity.activity_type] += 1;
        });
        
        setStats(statsCounts);
      }
    } catch (error) {
      console.error('Error in fetchActivities:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Define activity functions that add points
  const addJournalPoints = async (description?: string) => {
    const result = await addPoints(
      'journal_post', 
      pointsConfig.journal_post, 
      description || 'Created a journal entry'
    );
    if (result) {
      await fetchActivities();
    }
    return result;
  };

  const addCirclePostPoints = async (description?: string) => {
    const result = await addPoints(
      'circle_post', 
      pointsConfig.circle_post, 
      description || 'Created a post in Sacred Circle'
    );
    if (result) {
      await fetchActivities();
    }
    return result;
  };

  const addCommentPoints = async (description?: string) => {
    const result = await addPoints(
      'comment', 
      pointsConfig.comment, 
      description || 'Left a comment or reply'
    );
    if (result) {
      await fetchActivities();
    }
    return result;
  };

  const addJourneyPoints = async (description?: string) => {
    const result = await addPoints(
      'journey_completed',
      pointsConfig.journey_completed,
      description || 'Completed a sound journey'
    );
    if (result) {
      await fetchActivities();
    }
    return result;
  };

  const addHeartActionPoints = async (description?: string) => {
    const result = await addPoints(
      'heart_action',
      pointsConfig.heart_action,
      description || 'Performed a heart-centered action'
    );
    if (result) {
      await fetchActivities();
    }
    return result;
  };

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user, fetchActivities]);

  return {
    activities,
    stats,
    loading,
    pointsConfig,
    addJournalPoints,
    addCirclePostPoints,
    addCommentPoints,
    addJourneyPoints,
    addHeartActionPoints,
    refreshActivities: fetchActivities
  };
};
