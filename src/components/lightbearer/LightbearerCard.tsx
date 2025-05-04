
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Award, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import LightProgress from './LightProgress';
import { Button } from '@/components/ui/button';
import { useLightbearerProgress } from '@/hooks/useLightbearerProgress';
import { toast } from 'sonner';

interface LightbearerCardProps {
  className?: string;
}

const LightbearerCard: React.FC<LightbearerCardProps> = ({ className = '' }) => {
  const [expanded, setExpanded] = useState(false);
  const { 
    stats, 
    currentLevel, 
    progressPercentage, 
    loading, 
    recentLevelUp, 
    levels 
  } = useLightbearerProgress();

  if (loading) {
    return (
      <Card className={`${className} h-full overflow-hidden bg-gradient-to-br from-indigo-500/5 to-purple-500/5`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            Lightbearer Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="animate-pulse h-6 bg-gray-200/20 rounded-md w-3/4"></div>
            <div className="animate-pulse h-3 bg-gray-200/20 rounded-full"></div>
            <div className="flex flex-wrap gap-2">
              <div className="animate-pulse h-6 w-16 bg-gray-200/20 rounded-full"></div>
              <div className="animate-pulse h-6 w-16 bg-gray-200/20 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || !currentLevel) {
    return (
      <Card className={`${className} h-full overflow-hidden bg-gradient-to-br from-indigo-500/5 to-purple-500/5`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            Lightbearer Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to load your Lightbearer status. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate points needed for next level
  const pointsForNextLevel = currentLevel.next_threshold 
    ? currentLevel.next_threshold - stats.light_points 
    : 0;

  return (
    <Card className={`${className} relative overflow-hidden transition-all duration-300 ${recentLevelUp ? 'ring-2 ring-purple-500/50 shadow-lg' : ''}`}>
      {/* Background glow effect on level up */}
      {recentLevelUp && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 animate-pulse pointer-events-none" />
      )}

      <div className="relative z-10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            Lightbearer Level
          </CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>Your spiritual journey progress</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Level title with badge */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  {currentLevel.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Level {currentLevel.level_num}
                </p>
              </div>
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30"
              >
                {stats.light_points} Points
              </Badge>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Progress to Next Level</span>
                <span>{progressPercentage}%</span>
              </div>
              <LightProgress 
                percentage={progressPercentage} 
                size="md"
                recentLevelUp={recentLevelUp}
              />
              
              {currentLevel.next_threshold && (
                <p className="text-xs text-muted-foreground text-right">
                  {pointsForNextLevel} points needed
                </p>
              )}
            </div>
            
            {/* Badges section */}
            {stats.earned_badges && stats.earned_badges.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Earned Badges:</p>
                <div className="flex flex-wrap gap-2">
                  {stats.earned_badges.map((badge, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-200/90"
                    >
                      <Award className="w-3.5 h-3.5 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground pt-2">
                Continue your journey to earn sacred badges
              </p>
            )}
            
            {/* Expanded content */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-3">
                    <h4 className="text-sm font-medium">Lightbearer Journey</h4>
                    <div className="space-y-3 max-h-48 overflow-auto pr-2">
                      {levels.map((level) => (
                        <div 
                          key={level.level_num}
                          className={`flex items-center justify-between rounded-md p-2 text-sm ${
                            level.level_num === stats.light_level 
                              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30' 
                              : level.level_num < stats.light_level
                                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10'
                                : 'bg-gray-500/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {level.level_num <= stats.light_level ? (
                              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold">{level.level_num}</span>
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-gray-500/30 flex items-center justify-center">
                                <span className="text-gray-400 text-[8px] font-bold">{level.level_num}</span>
                              </div>
                            )}
                            <span className={level.level_num <= stats.light_level ? 'text-white' : 'text-gray-400'}>
                              {level.title}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">{level.threshold}+ pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </div>
      
      {/* Level up celebration modal */}
      <AnimatePresence>
        {recentLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => toast.dismiss()}
          >
            <motion.div 
              className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-lg max-w-md text-center border border-indigo-400"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
                  <Star className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-xl font-semibold mb-2 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                ✨ You've Ascended to {currentLevel.title}! ✨
              </motion.h2>
              
              <motion.p 
                className="text-gray-300 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Your light continues to illuminate the path for others. Continue your sacred journey.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  onClick={() => toast.dismiss()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  Continue My Journey
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default LightbearerCard;
