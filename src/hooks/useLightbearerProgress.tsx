
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LightbearerLevel, LightbearerStats } from "@/types/lightbearer";

export const useLightbearerProgress = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<LightbearerStats | null>(null);
  const [currentLevel, setCurrentLevel] = useState<LightbearerLevel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [recentLevelUp, setRecentLevelUp] = useState<boolean>(false);

  useEffect(() => {
    const fetchLightbearerData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user profile with lightbearer data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (!profile) {
          throw new Error("Profile not found");
        }

        // Check if user recently leveled up (within the last day)
        const lastLevelUp = profile.last_level_up 
          ? new Date(profile.last_level_up) 
          : null;
        
        const recentLevelUp = lastLevelUp 
          ? (new Date().getTime() - lastLevelUp.getTime()) < 86400000 // 24 hours
          : false;

        // Fetch level thresholds from database
        const { data: levels, error: levelsError } = await supabase
          .from('lightbearer_levels')
          .select('*')
          .order('level_num', { ascending: true });

        if (levelsError) {
          throw levelsError;
        }

        // Determine current level
        const currentLevel = levels.find(level => 
          level.level_num === profile.lightbearer_level
        ) || levels[0];

        // Calculate progress percentage to next level
        let progressPercentage = 100; // Default to 100% if at max level
        
        if (currentLevel && currentLevel.next_threshold) {
          const pointsInCurrentLevel = profile.light_points - (currentLevel.threshold || 0);
          const pointsRequiredForNextLevel = (currentLevel.next_threshold || 0) - (currentLevel.threshold || 0);
          
          progressPercentage = Math.min(
            Math.round((pointsInCurrentLevel / pointsRequiredForNextLevel) * 100),
            100
          );
        }

        // Create stats object
        const stats: LightbearerStats = {
          light_points: profile.light_points || 0,
          light_level: profile.light_level || 1,
          earned_badges: profile.earned_badges || [],
          last_level_up: profile.last_level_up,
          lightbearer_level: profile.lightbearer_level || 1,
          badges: profile.badges || [],
          ascension_title: profile.ascension_title || 'Seeker',
          soul_alignment: profile.soul_alignment || 'Light',
          frequency_signature: profile.frequency_signature || '',
        };

        setStats(stats);
        setCurrentLevel(currentLevel);
        setProgressPercentage(progressPercentage);
        setRecentLevelUp(recentLevelUp);
      } catch (err: any) {
        console.error("Error in useLightbearerProgress:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLightbearerData();
  }, [user]);

  return {
    stats,
    currentLevel,
    progressPercentage,
    loading,
    error,
    recentLevelUp
  };
};
