import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress-fixed";
import { Star, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLightbearerProgress } from "@/hooks/useLightbearerProgress";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LightbearerStatsCard: React.FC = () => {
  const { user } = useAuth();
  const { 
    stats, 
    currentLevel, 
    progressPercentage, 
    loading, 
    recentLevelUp 
  } = useLightbearerProgress();
  
  if (loading) {
    return (
      <Card className="h-full overflow-hidden border-white/20 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
        <div className="h-1 bg-gradient-to-r from-amber-500/60 to-yellow-500/60" />
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            Lightbearer Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="h-[200px] flex flex-col justify-center items-center">
            <div className="w-32 h-6 bg-amber-200/20 rounded mb-3 animate-pulse"></div>
            <div className="w-full h-3 bg-amber-200/10 rounded mb-6 animate-pulse"></div>
            <div className="w-full h-16 bg-amber-200/10 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user || !stats || !currentLevel) {
    return (
      <Card className="h-full overflow-hidden border-white/20 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
        <div className="h-1 bg-gradient-to-r from-amber-500/60 to-yellow-500/60" />
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            Lightbearer Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="h-[200px] flex flex-col justify-center items-center text-center">
            <p className="text-gray-300">Sign in to view your Lightbearer status</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate points needed for next level
  const pointsForNextLevel = currentLevel.next_threshold 
    ? currentLevel.next_threshold - stats.light_points 
    : null;

  return (
    <Link to="/lightbearer">
      <Card className={`h-full overflow-hidden border-white/20 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 hover:from-amber-500/10 hover:to-yellow-500/10 transition-colors ${recentLevelUp ? 'ring-2 ring-amber-500/30 shadow-lg' : ''}`}>
        <div className="h-1 bg-gradient-to-r from-amber-500/60 to-yellow-500/60" />
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            Lightbearer Status
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          <div className="relative">
            {/* Background sacred geometry pattern (subtle) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 space-y-5">
              {/* Level display */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-300">
                    {currentLevel.title}
                  </h3>
                  <span className="text-sm text-amber-200/70">
                    Level {currentLevel.level_num}
                  </span>
                </div>
                  
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <Progress 
                    value={progressPercentage} 
                    className="h-2.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20"
                  />
                  
                  <div className="flex justify-between text-xs text-amber-200/60">
                    <span>{stats.light_points} points</span>
                    {pointsForNextLevel !== null ? (
                      <span>{pointsForNextLevel} until next level</span>
                    ) : (
                      <span>Max level reached!</span>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Badges preview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-200/70 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Recent achievements
                  </span>
                  <span className="text-xs text-amber-200/50">View all →</span>
                </div>
                
                {stats.earned_badges && stats.earned_badges.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {stats.earned_badges.slice(0, 3).map((badge, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-amber-500/10 rounded-md text-xs text-amber-200/90 flex items-center"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {badge}
                      </span>
                    ))}
                    {stats.earned_badges.length > 3 && (
                      <span className="px-2 py-1 bg-amber-500/10 rounded-md text-xs text-amber-200/90">
                        +{stats.earned_badges.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-amber-200/50 italic">
                    Complete activities to earn badges
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default LightbearerStatsCard;
