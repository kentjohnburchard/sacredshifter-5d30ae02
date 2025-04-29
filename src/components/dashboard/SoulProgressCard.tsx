
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLightbearerProgress } from '@/hooks/useLightbearerProgress';
import { Star, Shield, Sparkles } from 'lucide-react';

const SoulProgressCard: React.FC = () => {
  const { stats, progressPercentage, loading } = useLightbearerProgress();

  if (loading) {
    return (
      <Card className="border-white/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
        <CardHeader className="p-4">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            Soul Progression
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            <div className="h-5 bg-indigo-200/10 rounded animate-pulse"></div>
            <div className="h-2 bg-indigo-200/20 rounded animate-pulse"></div>
            <div className="h-8 bg-indigo-200/10 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="border-white/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
        <CardHeader className="p-4">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            Soul Progression
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-sm text-center text-gray-400 py-4">
            Soul progression data not available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure we have default values for missing properties
  const lightbearerLevel = stats.lightbearer_level || stats.light_level || 1;
  const soulBadges = stats.badges || stats.earned_badges || [];
  const lightPoints = stats.light_points || 0;

  return (
    <Card className="border-white/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          Soul Progression
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          {/* Lightbearer Level */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              Lightbearer Level
            </span>
            <Badge 
              variant="outline" 
              className="bg-indigo-500/20 border-indigo-400/30 text-indigo-200"
            >
              Level {lightbearerLevel}
            </Badge>
          </div>

          {/* Soul Points Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-400">Soul Points</span>
              <span className="text-gray-300">{lightPoints} points</span>
            </div>
            <Progress value={progressPercentage || 0} className="h-2" />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-400">{progressPercentage || 0}% to next level</span>
            </div>
          </div>

          {/* Soul Badges */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                Soul Badges
              </span>
              <span className="text-xs text-gray-400">
                {soulBadges.length || 0} unlocked
              </span>
            </div>
            
            {soulBadges && soulBadges.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {soulBadges.map((badge, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="bg-purple-500/10 border-purple-400/30 text-purple-200 text-xs"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-xs text-center text-gray-400 p-2 border border-dashed border-gray-700/50 rounded-md">
                Complete sacred activities to unlock soul badges
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoulProgressCard;
