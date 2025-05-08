
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { CommunityProvider } from '@/contexts/CommunityContext';
import { useAuth } from '@/context/AuthContext';
import { useLightbearerProgress } from '@/hooks/useLightbearerProgress';
import { useChakraActivations } from '@/hooks/useChakraActivations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SacredCircleMessenger from '@/components/circle/SacredCircleMessenger';
import { getArchetypeForChakra } from '@/utils/archetypes';
import { getChakraColor } from '@/types/chakras';
import { Heart, Users, Search, MessageCircle, User, Filter, Star } from 'lucide-react';
import CircleProfile from '@/components/community/CircleProfile';
import CircleFeed from '@/components/community/CircleFeed';

const SacredCirclePage: React.FC = () => {
  const { user } = useAuth();
  const { stats, currentLevel } = useLightbearerProgress();
  const { activationCounts, getDominantChakra } = useChakraActivations();
  const [searchQuery, setSearchQuery] = useState('');
  const [alignmentFilter, setAlignmentFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('community');
  
  // Get dominant chakra and its archetype
  const dominantChakra = getDominantChakra();
  const dominantArchetype = dominantChakra ? getArchetypeForChakra(dominantChakra) : undefined;
  
  return (
    <Layout title="Sacred Circle" pageTitle="Sacred Circle | Sacred Shifter">
      <CommunityProvider>
        <div className="container mx-auto py-8 px-4 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                    Sacred Circle
                  </h1>
                  <p className="text-gray-400 max-w-3xl">
                    Connect with fellow lightbearers on the path of spiritual evolution. 
                    Share wisdom, support each other's journey, and grow together in consciousness.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
                    onClick={() => setActiveTab('community')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Community
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => setActiveTab('messages')}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Messages
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="community">Community</TabsTrigger>
                  <TabsTrigger value="reflections">Reflections</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>
                
                <TabsContent value="community" className="space-y-4">
                  {/* Search and filters */}
                  <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-grow">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Search the community..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-800/50 border-gray-700/50 pl-10"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-700/50 text-gray-300 gap-2"
                        >
                          <Filter className="h-3.5 w-3.5" />
                          Filters
                        </Button>
                        {stats?.light_level && (
                          <Badge className="bg-amber-500/20 border-amber-500/30 text-amber-200 flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Level {stats.light_level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Main community grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                      {/* User Profile */}
                      <CircleProfile />
                      
                      {/* Achievements */}
                      {dominantArchetype && (
                        <Card className="border-purple-500/30 bg-black/50 backdrop-blur-md overflow-hidden">
                          <div className="h-1 bg-gradient-to-r"
                               style={{ 
                                 backgroundImage: `linear-gradient(to right, ${dominantArchetype.themeColor}90, ${dominantArchetype.themeColor}60)` 
                               }} />
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <img 
                                src={dominantArchetype.symbol} 
                                alt={dominantArchetype.name} 
                                className="h-5 w-5" 
                                style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}
                              />
                              Dominant Archetype
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-16 w-16 rounded-full flex items-center justify-center border-2"
                                style={{ 
                                  borderColor: `${dominantArchetype.themeColor}50`,
                                  background: `radial-gradient(circle, ${dominantArchetype.themeColor}30 0%, ${dominantArchetype.themeColor}10 70%)` 
                                }}>
                                <img 
                                  src={dominantArchetype.symbol} 
                                  alt={dominantArchetype.name}
                                  className="h-8 w-8" 
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">{dominantArchetype.name}</h3>
                                <p className="text-xs text-gray-400">{dominantChakra} Chakra Path</p>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-300 mb-3">{dominantArchetype.description}</p>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-black/30 p-2 rounded text-center">
                                <div className="text-xl font-bold" style={{ color: dominantArchetype.themeColor }}>
                                  {activationCounts[dominantChakra || ''] || 0}
                                </div>
                                <div className="text-xs text-gray-400">Activations</div>
                              </div>
                              <div className="bg-black/30 p-2 rounded text-center">
                                <div className="text-xl font-bold text-purple-400">
                                  {stats?.earned_badges?.length || 0}
                                </div>
                                <div className="text-xs text-gray-400">Badges</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Sacred Circles */}
                      <Card className="border-purple-500/30 bg-black/50 backdrop-blur-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-purple-300">Sacred Circles</CardTitle>
                          <CardDescription>Join conversation circles</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {['Heart Chakra', 'Sound Healing', 'Sacred Geometry', 'Hermetic Wisdom', 'Conscious Evolution'].map((circle, i) => (
                              <div key={i} className="p-2.5 hover:bg-white/5 rounded-md cursor-pointer transition flex justify-between items-center">
                                <p className="font-medium text-sm">{circle}</p>
                                <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-300 text-xs">
                                  {Math.floor(Math.random() * 15) + 2}
                                </Badge>
                              </div>
                            ))}
                            <div className="pt-2 mt-3 border-t border-white/10">
                              <Button className="w-full bg-purple-600/30 hover:bg-purple-600/50 text-purple-200">
                                Explore All Circles
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Main Feed */}
                    <div className="lg:col-span-2">
                      <CircleFeed />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reflections" className="space-y-4">
                  <Card className="border-purple-500/30 bg-black/50 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-pink-400" />
                        Journey Reflections
                      </CardTitle>
                      <CardDescription>
                        Insights and reflections from your spiritual journeys
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Placeholder for user's journey reflections */}
                      <div className="text-center py-8 opacity-70">
                        <p>Your journey reflections will appear here as you complete sacred journeys.</p>
                        <Button className="mt-4 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200">
                          Begin a Journey
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="messages" className="space-y-4">
                  <Card className="border-purple-500/30 bg-black/50 backdrop-blur-md overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-blue-400" />
                        Sacred Messages
                      </CardTitle>
                      <CardDescription>
                        Connect directly with fellow lightbearers
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] flex items-center justify-center">
                      <div className="text-center max-w-md mx-auto">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="h-8 w-8 text-purple-300" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Sacred Circle Messenger</h3>
                        <p className="text-gray-400 mb-6">
                          Connect directly with fellow lightbearers through the Sacred Circle Messenger. 
                          Share insights, ask questions, and deepen your connections.
                        </p>
                        <Button 
                          onClick={() => setActiveTab('community')} 
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                          Return to Community
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
        
        {/* Include the floating messenger component */}
        <SacredCircleMessenger />
      </CommunityProvider>
    </Layout>
  );
};

export default SacredCirclePage;
