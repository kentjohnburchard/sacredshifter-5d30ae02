
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLightbearerProgress } from '@/hooks/useLightbearerProgress';
import { Star, Shield, Sparkles, Sun, Moon, Undo2 } from 'lucide-react';

const LightbearerPage: React.FC = () => {
  const { stats, progressPercentage, loading, currentLevel } = useLightbearerProgress();

  // Get appropriate alignment icon
  const getAlignmentIcon = (alignment: string | null | undefined) => {
    if (!alignment) return null;
    
    switch(alignment.toLowerCase()) {
      case 'light': return <Sun className="h-4 w-4 text-yellow-400" />;
      case 'shadow': return <Moon className="h-4 w-4 text-indigo-400" />;
      case 'unity': return <Undo2 className="h-4 w-4 text-purple-400" />;
      default: return null;
    }
  };

  return (
    <Layout 
      pageTitle="Lightbearer Progress | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
    >
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            Your Lightbearer Journey
          </h1>
          
          <p className="text-gray-400 mb-8 max-w-3xl">
            Track your spiritual evolution, unlock sacred knowledge, and align with cosmic frequencies 
            as you progress through your unique soul journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Soul Progression Card */}
            <div className="md:col-span-2">
              <Card className="border-white/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 overflow-hidden">
                <CardHeader className="p-6 border-b border-white/10">
                  <CardTitle className="text-2xl font-medium flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Soul Progression
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  {loading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-8 bg-indigo-200/10 rounded-md w-1/3"></div>
                      <div className="h-2 bg-indigo-200/20 rounded-full"></div>
                      <div className="h-24 bg-indigo-200/10 rounded-md"></div>
                    </div>
                  ) : stats ? (
                    <div className="space-y-8">
                      {/* Level Display */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping opacity-30"></div>
                            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 border border-purple-400/30">
                              <span className="text-2xl font-bold text-white">
                                {stats.lightbearer_level || 1}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-medium text-white">
                              {stats.ascension_title || "Seeker"}
                            </h3>
                            {stats.soul_alignment && (
                              <div className="flex items-center mt-1 text-sm text-gray-300">
                                {getAlignmentIcon(stats.soul_alignment)}
                                <span className="ml-1">{stats.soul_alignment || "Light"} Alignment</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {stats.frequency_signature && (
                          <div className="bg-indigo-900/30 px-4 py-2.5 rounded-md border border-indigo-400/20">
                            <p className="text-sm text-gray-400 mb-1">Frequency Signature</p>
                            <p className="font-mystical text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-200">
                              {stats.frequency_signature}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Progress to Next Level */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to Next Level</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        {currentLevel && currentLevel.next_threshold && (
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{stats.light_points} points</span>
                            <span>{currentLevel.next_threshold} points</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Soul Badges */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium flex items-center gap-1.5">
                          <Shield className="h-4 w-4 text-indigo-400" />
                          Soul Badges
                        </h4>
                        
                        {stats.badges && stats.badges.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {stats.badges.map((badge, index) => (
                              <Badge 
                                key={index} 
                                className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-white"
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 px-4 border border-dashed border-indigo-500/20 rounded-md bg-indigo-500/5">
                            <p className="text-gray-400 text-sm">
                              Complete sacred activities to earn Soul Badges on your journey
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-400">
                        Soul progression data not available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Stat Summary Card */}
            <Card className="border-white/20 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
              <CardHeader className="p-6 border-b border-white/10">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Lightbearer Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-24 bg-blue-200/10 rounded-md"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-900/20 p-4 rounded-md border border-blue-500/20">
                        <p className="text-sm text-gray-400 mb-1">Soul Points</p>
                        <p className="text-xl font-medium text-white">{stats?.light_points || 0}</p>
                      </div>
                      
                      <div className="bg-purple-900/20 p-4 rounded-md border border-purple-500/20">
                        <p className="text-sm text-gray-400 mb-1">Badges Earned</p>
                        <p className="text-xl font-medium text-white">{stats?.badges?.length || 0}</p>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-900/20 p-4 rounded-md border border-indigo-500/20">
                      <h4 className="text-sm font-medium mb-3 text-white">Upcoming Milestones</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                          <span>Unlock Cosmic Realms at Level 5</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                          <span>Earn "Visionary" title at 1000 points</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span>Unlock Sacred Geometry at Level 8</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LightbearerPage;
