
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Badge as BadgeIcon, Activity } from "lucide-react";

interface BadgeMetadata {
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  requiredAmount: number;
  icon: string;
}

const LightbearerStatsCard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [lightLevel, setLightLevel] = useState(1);
  const [postsCount, setPostsCount] = useState(0);
  const [rippleReach, setRippleReach] = useState(0);
  const [badges, setBadges] = useState<BadgeMetadata[]>([
    {
      name: "Soul Speaker",
      description: "Make your first 3 sacred posts",
      unlocked: false,
      progress: 0,
      requiredAmount: 3,
      icon: "message-circle"
    },
    {
      name: "Frequency Keeper",
      description: "Complete 5 sound journeys",
      unlocked: false,
      progress: 0,
      requiredAmount: 5,
      icon: "music"
    },
    {
      name: "Wisdom Weaver",
      description: "Connect with 3 community members",
      unlocked: false,
      progress: 0,
      requiredAmount: 3,
      icon: "users"
    }
  ]);
  
  // Animated counter hook
  const useAnimatedCounter = (value: number) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let start = 0;
      const end = value;
      const duration = 1000;
      let timer: number;
      
      // No animation for zero values
      if (end === 0) {
        setCount(0);
        return;
      }
      
      const startTime = Date.now();
      
      const animateCount = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        
        if (elapsed > duration) {
          setCount(end);
        } else {
          const progress = elapsed / duration;
          setCount(Math.round(progress * end));
          timer = requestAnimationFrame(animateCount);
        }
      };
      
      timer = requestAnimationFrame(animateCount);
      return () => cancelAnimationFrame(timer);
    }, [value]);
    
    return count;
  };
  
  const animatedLightLevel = useAnimatedCounter(lightLevel);
  const animatedPostsCount = useAnimatedCounter(postsCount);
  const animatedRippleReach = useAnimatedCounter(rippleReach);
  
  useEffect(() => {
    const fetchLightbearerStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fetching lightbearer stats for user:", user.id);
        
        // Fetch timeline entries count (posts)
        const { data: timelineData, error: timelineError } = await supabase
          .from('timeline_snapshots')
          .select('id')
          .eq('user_id', user.id);
          
        if (timelineError) {
          console.error("Error fetching timeline data:", timelineError);
        }
        
        // Fetch sessions count
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('id')
          .eq('user_id', user.id);
          
        if (sessionsError) {
          console.error("Error fetching sessions data:", sessionsError);
        }
        
        // Calculate stats
        const postCount = timelineData?.length || 0;
        const sessionsCount = sessionsData?.length || 0;
        
        console.log("Stats fetched - Posts:", postCount, "Sessions:", sessionsCount);
        
        // Calculate light level (1-10 based on combined activity)
        const totalActivity = postCount + sessionsCount;
        const calculatedLightLevel = Math.max(1, Math.min(10, Math.floor(totalActivity / 5) + 1));
        
        // Calculate ripple reach (simplified estimation)
        const calculatedRippleReach = postCount * 3 + sessionsCount * 2;
        
        // Update badges progress
        const updatedBadges = [...badges];
        updatedBadges[0].progress = Math.min(postCount, updatedBadges[0].requiredAmount);
        updatedBadges[0].unlocked = postCount >= updatedBadges[0].requiredAmount;
        
        updatedBadges[1].progress = Math.min(sessionsCount, updatedBadges[1].requiredAmount);
        updatedBadges[1].unlocked = sessionsCount >= updatedBadges[1].requiredAmount;
        
        // Set the state with fetched data
        setPostsCount(postCount);
        setLightLevel(calculatedLightLevel);
        setRippleReach(calculatedRippleReach);
        setBadges(updatedBadges);
        
      } catch (error) {
        console.error("Error fetching lightbearer stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLightbearerStats();
  }, [user, badges]);
  
  // Find next badge milestone
  const nextMilestone = badges.find(badge => !badge.unlocked);
  
  // Get current milestone message
  const getMilestoneMessage = () => {
    if (!nextMilestone) return "All current badges achieved";
    
    const remaining = nextMilestone.requiredAmount - nextMilestone.progress;
    return `${remaining} more to earn "${nextMilestone.name}"`;
  };
  
  // Enhanced loading state
  if (loading) {
    return (
      <Card className="h-full border-white/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 animate-pulse">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 font-playfair">
            <Star className="h-5 w-5 text-amber-400" />
            Lightbearer Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg bg-amber-500/10 p-4 h-24"></div>
            <div className="rounded-lg bg-indigo-500/10 p-4 h-24"></div>
            <div className="rounded-lg bg-purple-500/10 p-4 h-24"></div>
          </div>
          <div className="flex justify-around mt-8">
            <div className="w-12 h-12 rounded-full bg-gray-800/40"></div>
            <div className="w-12 h-12 rounded-full bg-gray-800/40"></div>
            <div className="w-12 h-12 rounded-full bg-gray-800/40"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full overflow-hidden border-white/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
      <div className="h-1 bg-gradient-to-r from-amber-500/60 to-orange-500/60" />
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2 font-playfair">
          <Star className="h-5 w-5 text-amber-400" />
          Lightbearer Stats
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Light Level */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-700/10 p-4 text-center"
          >
            <div className="text-sm text-amber-200 mb-1 font-medium">Light Level</div>
            <div className="text-3xl font-bold text-amber-100">{animatedLightLevel}</div>
          </motion.div>
          
          {/* Sacred Posts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-lg bg-gradient-to-br from-indigo-500/10 to-indigo-700/10 p-4 text-center"
          >
            <div className="text-sm text-indigo-200 mb-1 font-medium">Sacred Posts</div>
            <div className="text-3xl font-bold text-indigo-100">{animatedPostsCount}</div>
          </motion.div>
          
          {/* Ripple Reach */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-700/10 p-4 text-center"
          >
            <div className="text-sm text-purple-200 mb-1 font-medium">Ripple Reach</div>
            <div className="text-3xl font-bold text-purple-100">{animatedRippleReach}</div>
          </motion.div>
        </div>
        
        {/* Milestone Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Current Milestone</span>
            <span className="text-xs text-amber-300">{getMilestoneMessage()}</span>
          </div>
        </motion.div>
        
        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4"
        >
          <div className="text-sm text-gray-400 mb-3">Sacred Badges</div>
          <div className="flex justify-around">
            <TooltipProvider>
              {badges.map((badge, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <motion.div 
                      className={`w-12 h-12 flex items-center justify-center rounded-full 
                        ${badge.unlocked 
                          ? 'bg-gradient-to-br from-amber-500/40 to-amber-700/40 text-amber-200' 
                          : 'bg-gray-800/40 text-gray-500'}`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <BadgeIcon className="h-6 w-6" />
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900/90 border-purple-500/30">
                    <div className="text-white font-medium">{badge.name}</div>
                    <div className="text-gray-300 text-xs">{badge.description}</div>
                    <div className="text-amber-300 text-xs mt-1">
                      {badge.unlocked 
                        ? 'Achieved' 
                        : `${badge.progress}/${badge.requiredAmount} completed`}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default LightbearerStatsCard;
