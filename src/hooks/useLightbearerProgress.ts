
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LightbearerLevel, LightbearerStats, LevelUpEvent } from '@/types/lightbearer';
import { toast } from 'sonner';

export const useLightbearerProgress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LightbearerStats | null>(null);
  const [levels, setLevels] = useState<LightbearerLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<LightbearerLevel | null>(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [recentLevelUp, setRecentLevelUp] = useState<boolean>(false);

  // Fetch all level thresholds
  const fetchLevels = async () => {
    try {
      const { data, error } = await supabase
        .from('lightbearer_levels')
        .select('*')
        .order('level_num', { ascending: true });

      if (error) {
        console.error('Error fetching lightbearer levels:', error);
        return;
      }

      if (data) {
        setLevels(data);
      }
    } catch (error) {
      console.error('Error in fetchLevels:', error);
    }
  };

  // Fetch user's lightbearer stats
  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('light_points, light_level, earned_badges, last_level_up, lightbearer_level, badges')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching lightbearer stats:', error);
        return;
      }
      
      if (data) {
        setStats({
          light_points: data.light_points || 0,
          light_level: data.light_level || 1,
          earned_badges: data.earned_badges || [],
          last_level_up: data.last_level_up,
          // Include the new fields with fallbacks
          lightbearer_level: data.lightbearer_level || 1,
          badges: data.badges || []
        });
      }
    } catch (error) {
      console.error('Error in fetchUserStats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage towards next level
  const calculateProgress = () => {
    if (!stats || !levels.length) return 0;
    
    const userLevel = stats.light_level;
    const userPoints = stats.light_points;
    
    const currentLevelData = levels.find(level => level.level_num === userLevel);
    if (!currentLevelData) return 0;
    
    setCurrentLevel(currentLevelData);
    
    // If at max level
    if (currentLevelData.next_threshold === null) {
      return 100;
    }
    
    const currentThreshold = currentLevelData.threshold;
    const nextThreshold = currentLevelData.next_threshold;
    
    if (nextThreshold === null || nextThreshold === currentThreshold) return 100;
    
    const pointsInCurrentLevel = userPoints - currentThreshold;
    const pointsNeededForNextLevel = nextThreshold - currentThreshold;
    
    const progress = Math.min(Math.floor((pointsInCurrentLevel / pointsNeededForNextLevel) * 100), 100);
    return progress;
  };

  // Add points to user (calls the Supabase function)
  const addPoints = async (
    activityType: string, 
    points: number, 
    description?: string
  ): Promise<LevelUpEvent | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .rpc('add_lightbearer_points', {
          user_id: user.id,
          activity_type: activityType,
          points: points,
          description: description || null
        });
      
      if (error) {
        console.error('Error adding lightbearer points:', error);
        toast.error('Failed to add lightbearer points');
        return null;
      }
      
      if (data) {
        // Refresh stats
        fetchUserStats();
        
        // Check if leveled up
        if (typeof data === 'object' && data !== null && 'leveled_up' in data) {
          const responseData = data as LevelUpEvent;
          const hasLeveledUp = responseData.leveled_up;
          
          if (hasLeveledUp) {
            // If leveled up, update the lightbearer_level in the profile as well
            if (responseData.new_level) {
              try {
                await supabase
                  .from('profiles')
                  .update({ 
                    lightbearer_level: responseData.new_level,
                    // We could also update ascension_title here based on level
                  })
                  .eq('id', user.id);
              } catch (updateError) {
                console.error('Error updating lightbearer_level:', updateError);
              }
            }
            
            setRecentLevelUp(true);
            // Reset after 5 seconds
            setTimeout(() => setRecentLevelUp(false), 5000);
          }
        }
        
        return data as LevelUpEvent;
      }
      
      return null;
    } catch (error) {
      console.error('Error in addPoints:', error);
      toast.error('Failed to add lightbearer points');
      return null;
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  useEffect(() => {
    if (stats && levels.length > 0) {
      const progress = calculateProgress();
      setProgressPercentage(progress);
    }
  }, [stats, levels]);

  return {
    stats,
    levels,
    currentLevel,
    progressPercentage,
    loading,
    recentLevelUp,
    addPoints,
    refreshStats: fetchUserStats,
  };
};
