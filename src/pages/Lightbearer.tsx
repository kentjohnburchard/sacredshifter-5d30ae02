
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import LightbearerCard from '@/components/lightbearer/LightbearerCard';
import MilestoneBadge from '@/components/lightbearer/MilestoneBadge';
import { useLightbearerActivities } from '@/hooks/useLightbearerActivities';
import { Button } from '@/components/ui/button';
import { Activity, Clock, Award, Star, Info } from 'lucide-react';

const Lightbearer = () => {
  const { user } = useAuth();
  const { activities, stats, loading, pointsConfig } = useLightbearerActivities();
  const [activeTab, setActiveTab] = useState('overview');

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout 
      pageTitle="Lightbearer Journey | Sacred Shifter"
      showNavbar={true}
      showContextActions={false}
    >
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Star className="h-7 w-7 text-amber-400" />
              Lightbearer Journey
            </h1>
            <p className="text-muted-foreground max-w-3xl">
              Track your spiritual growth, earn sacred badges, and witness your evolution as you progress on your path of light.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Lightbearer card */}
            <div>
              <LightbearerCard className="sticky top-24" />
            </div>
            
            {/* Right column - Activities and badges */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-400" />
                    How to Earn Light Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-blue-200">Journal Entry</p>
                      <p className="text-2xl font-bold text-blue-300">+{pointsConfig.journal_post}</p>
                      <p className="text-xs text-blue-200/70">points per entry</p>
                    </div>
                    
                    <div className="bg-purple-500/10 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-purple-200">Journey Completed</p>
                      <p className="text-2xl font-bold text-purple-300">+{pointsConfig.journey_completed}</p>
                      <p className="text-xs text-purple-200/70">points per journey</p>
                    </div>

                    <div className="bg-green-500/10 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-green-200">Circle Post</p>
                      <p className="text-2xl font-bold text-green-300">+{pointsConfig.circle_post}</p>
                      <p className="text-xs text-green-200/70">points per post</p>
                    </div>

                    <div className="bg-teal-500/10 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-teal-200">Comment/Reply</p>
                      <p className="text-2xl font-bold text-teal-300">+{pointsConfig.comment}</p>
                      <p className="text-xs text-teal-200/70">points per comment</p>
                    </div>
                    
                    <div className="bg-pink-500/10 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-pink-200">Heart Action</p>
                      <p className="text-2xl font-bold text-pink-300">+{pointsConfig.heart_action}</p>
                      <p className="text-xs text-pink-200/70">points per action</p>
                    </div>
                    
                    <div className="bg-amber-500/10 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-amber-200">And More...</p>
                      <p className="text-sm font-medium text-amber-300 mt-2">Special Events</p>
                      <p className="text-xs text-amber-200/70">Stay engaged for bonuses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Achievements</span>
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span>Activities</span>
                  </TabsTrigger>
                  <TabsTrigger value="journey" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>Journey</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-400" />
                        Your Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-4">
                          <div className="animate-pulse h-16 bg-gray-200/10 rounded-md"></div>
                          <div className="animate-pulse h-16 bg-gray-200/10 rounded-md"></div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-3">Activity Milestones</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-blue-500/10 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-blue-300 flex items-center gap-1">
                                    <Award className="h-4 w-4" /> Journal Entries
                                  </h4>
                                  <span className="text-xl font-semibold text-blue-200">
                                    {stats.journal_post || 0}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-2">
                                    <MilestoneBadge 
                                      type="journal" 
                                      label="First Entry" 
                                      tooltipText={(stats.journal_post || 0) >= 1 ? "Achieved!" : "Create your first journal entry"}
                                    />
                                    <MilestoneBadge 
                                      type="journal" 
                                      label="Regular Scribe" 
                                      tooltipText={(stats.journal_post || 0) >= 5 ? "Achieved!" : `${5 - (stats.journal_post || 0)} more to go`}
                                    />
                                    <MilestoneBadge 
                                      type="journal" 
                                      label="Master Chronicler" 
                                      tooltipText={(stats.journal_post || 0) >= 20 ? "Achieved!" : `${20 - (stats.journal_post || 0)} more to go`}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-purple-500/10 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-purple-300 flex items-center gap-1">
                                    <Award className="h-4 w-4" /> Sound Journeys
                                  </h4>
                                  <span className="text-xl font-semibold text-purple-200">
                                    {stats.journey_completed || 0}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-2">
                                    <MilestoneBadge 
                                      type="journey" 
                                      label="First Journey" 
                                      tooltipText={(stats.journey_completed || 0) >= 1 ? "Achieved!" : "Complete your first sound journey"}
                                    />
                                    <MilestoneBadge 
                                      type="journey" 
                                      label="Sound Explorer" 
                                      tooltipText={(stats.journey_completed || 0) >= 5 ? "Achieved!" : `${5 - (stats.journey_completed || 0)} more to go`}
                                    />
                                    <MilestoneBadge 
                                      type="journey" 
                                      label="Frequency Master" 
                                      tooltipText={(stats.journey_completed || 0) >= 20 ? "Achieved!" : `${20 - (stats.journey_completed || 0)} more to go`}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-green-500/10 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-green-300 flex items-center gap-1">
                                    <Award className="h-4 w-4" /> Circle Posts
                                  </h4>
                                  <span className="text-xl font-semibold text-green-200">
                                    {stats.circle_post || 0}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-2">
                                    <MilestoneBadge 
                                      type="circle" 
                                      label="First Share" 
                                      tooltipText={(stats.circle_post || 0) >= 1 ? "Achieved!" : "Create your first post in Sacred Circle"}
                                    />
                                    <MilestoneBadge 
                                      type="circle" 
                                      label="Community Voice" 
                                      tooltipText={(stats.circle_post || 0) >= 3 ? "Achieved!" : `${3 - (stats.circle_post || 0)} more to go`}
                                    />
                                    <MilestoneBadge 
                                      type="circle" 
                                      label="Wisdom Keeper" 
                                      tooltipText={(stats.circle_post || 0) >= 10 ? "Achieved!" : `${10 - (stats.circle_post || 0)} more to go`}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-teal-500/10 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-teal-300 flex items-center gap-1">
                                    <Award className="h-4 w-4" /> Comments
                                  </h4>
                                  <span className="text-xl font-semibold text-teal-200">
                                    {stats.comment || 0}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-2">
                                    <MilestoneBadge 
                                      type="comment" 
                                      label="First Response" 
                                      tooltipText={(stats.comment || 0) >= 1 ? "Achieved!" : "Write your first comment"}
                                    />
                                    <MilestoneBadge 
                                      type="comment" 
                                      label="Engaged Soul" 
                                      tooltipText={(stats.comment || 0) >= 5 ? "Achieved!" : `${5 - (stats.comment || 0)} more to go`}
                                    />
                                    <MilestoneBadge 
                                      type="comment" 
                                      label="Connection Weaver" 
                                      tooltipText={(stats.comment || 0) >= 15 ? "Achieved!" : `${15 - (stats.comment || 0)} more to go`}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-pink-500/10 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-pink-300 flex items-center gap-1">
                                    <Award className="h-4 w-4" /> Heart Actions
                                  </h4>
                                  <span className="text-xl font-semibold text-pink-200">
                                    {stats.heart_action || 0}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-2">
                                    <MilestoneBadge 
                                      type="heart" 
                                      label="First Heart Gift" 
                                      tooltipText={(stats.heart_action || 0) >= 1 ? "Achieved!" : "Complete your first heart-centered action"}
                                    />
                                    <MilestoneBadge 
                                      type="heart" 
                                      label="Love Transmitter" 
                                      tooltipText={(stats.heart_action || 0) >= 3 ? "Achieved!" : `${3 - (stats.heart_action || 0)} more to go`}
                                    />
                                    <MilestoneBadge 
                                      type="heart" 
                                      label="Radiant Heart" 
                                      tooltipText={(stats.heart_action || 0) >= 10 ? "Achieved!" : `${10 - (stats.heart_action || 0)} more to go`}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-amber-500/10 rounded-lg p-4 flex items-center justify-center">
                                <div className="text-center">
                                  <h4 className="font-medium text-amber-300 mb-2">More Coming Soon</h4>
                                  <p className="text-sm text-amber-200/70">
                                    Future achievements will be unlocked as you continue your journey
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activities">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-400" />
                        Recent Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-4">
                          <div className="animate-pulse h-16 bg-gray-200/10 rounded-md"></div>
                          <div className="animate-pulse h-16 bg-gray-200/10 rounded-md"></div>
                          <div className="animate-pulse h-16 bg-gray-200/10 rounded-md"></div>
                        </div>
                      ) : activities.length > 0 ? (
                        <div className="space-y-4">
                          {activities.map((activity) => (
                            <div key={activity.id} className="flex items-start p-4 bg-gray-800/50 rounded-lg">
                              <div className="mr-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                  {activity.activity_type === 'journal_post' && (
                                    <Award className="h-5 w-5 text-blue-400" />
                                  )}
                                  {activity.activity_type === 'circle_post' && (
                                    <Award className="h-5 w-5 text-green-400" />
                                  )}
                                  {activity.activity_type === 'comment' && (
                                    <Award className="h-5 w-5 text-teal-400" />
                                  )}
                                  {activity.activity_type === 'journey_completed' && (
                                    <Award className="h-5 w-5 text-purple-400" />
                                  )}
                                  {activity.activity_type === 'heart_action' && (
                                    <Award className="h-5 w-5 text-pink-400" />
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">
                                    {activity.activity_type === 'journal_post' && 'Journal Entry'}
                                    {activity.activity_type === 'circle_post' && 'Sacred Circle Post'}
                                    {activity.activity_type === 'comment' && 'Comment Added'}
                                    {activity.activity_type === 'journey_completed' && 'Journey Completed'}
                                    {activity.activity_type === 'heart_action' && 'Heart-Centered Action'}
                                  </h4>
                                  <span className="text-sm font-semibold text-green-400">+{activity.points} points</span>
                                </div>
                                <p className="text-sm text-gray-400">
                                  {activity.description || 'No description provided'}
                                </p>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {formatDate(activity.created_at)}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {activities.length > 10 && (
                            <Button variant="outline" className="w-full">
                              Load More
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <Activity className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                          <h3 className="text-lg font-medium mb-1">No Activities Yet</h3>
                          <p className="text-sm text-gray-400 max-w-sm mx-auto">
                            Your activities will appear here as you engage with the platform. Complete journeys, write journal entries, and connect with others.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="journey">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-400" />
                        Your Lightbearer Journey
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div className="relative">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/70 to-purple-500/70"></div>
                          
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
                            const isActive = stats?.light_level >= level;
                            const isPast = stats?.light_level > level;
                            const isCurrent = stats?.light_level === level;
                            
                            return (
                              <div key={level} className="relative pl-10 pb-8">
                                <div className={`absolute left-3 top-0 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 ${
                                  isCurrent
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-300 border-amber-300/50 shadow-lg shadow-amber-500/20'
                                    : isPast
                                      ? 'bg-gradient-to-r from-green-500 to-green-300 border-green-300/50'
                                      : 'bg-gray-800 border-gray-700'
                                } flex items-center justify-center`}>
                                  <span className="text-xs font-bold text-white">{level}</span>
                                </div>
                                
                                <div className={`p-4 rounded-lg ${
                                  isCurrent
                                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/30'
                                    : isPast
                                      ? 'bg-green-500/10 border border-green-500/20'
                                      : 'bg-gray-800/50'
                                }`}>
                                  <h3 className={`font-medium ${
                                    isActive ? 'text-white' : 'text-gray-400'
                                  }`}>
                                    Level {level}: {level === 1 && 'Novice Lightbearer'}
                                    {level === 2 && 'Emerging Lightbearer'}
                                    {level === 3 && 'Radiant Lightbearer'}
                                    {level === 4 && 'Harmonic Lightbearer'}
                                    {level === 5 && 'Ascended Lightbearer'}
                                    {level === 6 && 'Cosmic Lightbearer'}
                                    {level === 7 && 'Celestial Lightbearer'}
                                    {level === 8 && 'Divine Lightbearer'}
                                    {level === 9 && 'Sovereign Lightbearer'}
                                    {level === 10 && 'Infinite Lightbearer'}
                                  </h3>
                                  
                                  <p className={`text-sm mt-1 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {level === 1 && "Begin your journey of light with the first steps toward conscious engagement."}
                                    {level === 2 && "Your light begins to shine more brightly as you deepen your practice."}
                                    {level === 3 && "Your radiance expands, illuminating others on their path."}
                                    {level === 4 && "You've harmonized with the frequencies of higher consciousness."}
                                    {level === 5 && "Your energy has ascended to new heights of spiritual awareness."}
                                    {level === 6 && "Your cosmic connection expands beyond ordinary perception."}
                                    {level === 7 && "Your celestial light bridges the earthly and divine."}
                                    {level === 8 && "Divine wisdom flows through you effortlessly."}
                                    {level === 9 && "You embody the sovereign creator energy of the universe."}
                                    {level === 10 && "You've transcended limitations, embodying infinite potential."}
                                  </p>
                                  
                                  {isActive && (
                                    <div className="mt-2 flex items-center">
                                      <Star className="h-4 w-4 text-amber-400 mr-1" />
                                      <span className="text-sm text-amber-200">
                                        {isPast ? 'Level Achieved!' : 'Current Level'}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {!isActive && (
                                    <div className="mt-2 text-xs text-gray-500">
                                      Unlock at {level === 2 ? '100' : level === 3 ? '300' : level === 4 ? '600' : level === 5 ? '1000' : level === 6 ? '1500' : level === 7 ? '2100' : level === 8 ? '2800' : level === 9 ? '3600' : '4500'} points
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Lightbearer;
