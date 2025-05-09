
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useRealityOptimizer } from '@/hooks/useRealityOptimizer';
import { useTheme } from '@/context/ThemeContext';
import { Brain, ChevronRight, Star, Music, BookOpen, ArrowRight, Globe, LightbulbIcon } from 'lucide-react';
import { getChakraColor } from '@/types/chakras';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';
import RealityDashboard from '@/components/RealityDashboard';

type UserInsight = {
  type: 'journey' | 'frequency' | 'archetype' | 'chakra' | 'affirmation';
  title: string;
  description: string;
  slug?: string;
  frequency?: number;
  chakra?: string;
  actionText: string;
  actionRoute: string;
};

const RealityOptimizerPage: React.FC = () => {
  const { user } = useAuth();
  const { results, loading, getFocusChakraColor } = useRealityOptimizer();
  const { liftTheVeil } = useTheme();
  const [userInsights, setUserInsights] = useState<UserInsight[]>([]);
  const [completedJourneys, setCompletedJourneys] = useState<number>(0);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setProfileData(profile);
        }

        // Count completed journeys
        const { count } = await supabase
          .from('timeline_snapshots')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('action', 'journey_complete');
        
        if (count !== null) {
          setCompletedJourneys(count);
        }

        // Generate insights based on the user's data
        generateInsights(profile);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user, results]);

  const generateInsights = (profile: any) => {
    const insights: UserInsight[] = [];
    
    // Journey recommendation based on profile data or fallback to default
    const journeyInsight = {
      type: 'journey' as const,
      title: results?.nextSuggestedJourney || 'Root Awakening',
      description: `This journey aligns with your current energetic needs and will help balance your ${results?.underusedChakra || 'Root'} chakra.`,
      slug: (results?.nextSuggestedJourney || 'root-awakening').toLowerCase().replace(/\s+/g, '-'),
      actionText: 'Start Journey',
      actionRoute: `/journey/${(results?.nextSuggestedJourney || 'root-awakening').toLowerCase().replace(/\s+/g, '-')}`
    };
    insights.push(journeyInsight);
    
    // Frequency recommendation
    const frequencyInsight = {
      type: 'frequency' as const,
      title: `${results?.frequencySuggestion || 396}Hz Frequency`,
      frequency: results?.frequencySuggestion || 396,
      description: `This frequency resonates with your ${results?.underusedChakra || 'Root'} chakra and helps stabilize your energy field.`,
      actionText: 'Tune In',
      actionRoute: '/frequency-engine'
    };
    insights.push(frequencyInsight);
    
    // Archetype insight
    const archetypeInsight = {
      type: 'archetype' as const,
      title: `${results?.dominantArchetype || 'Alchemist'} Archetype`,
      description: `Your dominant energy pattern aligns with the ${results?.dominantArchetype || 'Alchemist'} archetype. Embracing these qualities will accelerate your spiritual growth.`,
      actionText: 'Learn More',
      actionRoute: '/journey-templates'
    };
    insights.push(archetypeInsight);
    
    // Chakra balance insight
    const chakraInsight = {
      type: 'chakra' as const,
      title: `${results?.underusedChakra || 'Root'} Chakra Focus`,
      chakra: results?.underusedChakra || 'Root',
      description: `Your ${results?.underusedChakra || 'Root'} chakra needs attention. Balance this energy center to experience greater stability and alignment.`,
      actionText: 'Explore Practices',
      actionRoute: '/frequency-engine'
    };
    insights.push(chakraInsight);
    
    // Daily affirmation
    const affirmations = [
      "I am open to cosmic guidance in my daily life.",
      "My energy field is aligned with my highest purpose.",
      "I release resistance and embrace divine flow.",
      "My consciousness expands with each breath I take.",
      "I am a vessel for spiritual transformation."
    ];
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    
    const affirmationInsight = {
      type: 'affirmation' as const,
      title: 'Daily Affirmation',
      description: affirmations[randomIndex],
      actionText: 'Set Intention',
      actionRoute: '/lightbearer'
    };
    insights.push(affirmationInsight);
    
    setUserInsights(insights);
  };

  const chakraColor = getFocusChakraColor();

  return (
    <AppShell 
      pageTitle="Reality Optimizer" 
      chakraColor={chakraColor || "#B882FF"}
    >
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Reality Optimizer</h1>
              <p className="text-white/70">
                Optimizing your spiritual journey based on your energy signature and cosmic alignment
              </p>
            </div>
            
            <div className="flex items-center mt-4 md:mt-0">
              <div className="flex items-center bg-black/30 rounded-full px-3 py-1 border border-white/20">
                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-white">
                  Level {profileData?.light_level || results?.lightbearerLevel || 1}
                </span>
              </div>
              
              <div className="ml-4 flex items-center bg-black/30 rounded-full px-3 py-1 border border-white/20">
                <BookOpen className="h-4 w-4 text-purple-400 mr-2" />
                <span className="text-white">
                  {completedJourneys} Journeys
                </span>
              </div>
            </div>
          </div>
          
          {/* Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Dashboard */}
            <div className="lg:col-span-1">
              <RealityDashboard />
            </div>
            
            {/* Insights Section */}
            <div className="lg:col-span-2">
              <Card className={`mb-6 backdrop-blur-sm ${liftTheVeil ? 'bg-pink-950/20 border-pink-500/30' : 'bg-purple-950/20 border-purple-500/30'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-white" />
                    Spiritual Insights
                  </CardTitle>
                  <CardDescription>
                    Sacred Shifter's reality engine has analyzed your energy field
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                      <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userInsights.map((insight, index) => (
                        <Card key={index} className="bg-black/30 border-white/10">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                              <div className="mb-4 sm:mb-0">
                                <h3 className="text-white font-semibold text-lg mb-1">{insight.title}</h3>
                                <p className="text-white/70">{insight.description}</p>
                                {insight.chakra && (
                                  <div 
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2"
                                    style={{ 
                                      backgroundColor: `${getChakraColor(insight.chakra as any)}30`,
                                      color: getChakraColor(insight.chakra as any),
                                      borderColor: `${getChakraColor(insight.chakra as any)}50`,
                                      borderWidth: '1px'
                                    }}
                                  >
                                    {insight.chakra} Chakra
                                  </div>
                                )}
                              </div>
                              <Button asChild className="whitespace-nowrap">
                                <Link to={insight.actionRoute}>
                                  {insight.actionText}
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Visual Reality Map */}
              <Card className={`backdrop-blur-sm ${liftTheVeil ? 'bg-pink-950/20 border-pink-500/30' : 'bg-purple-950/20 border-purple-500/30'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LightbulbIcon className="h-5 w-5 mr-2 text-white" />
                    Reality Visualization
                  </CardTitle>
                  <CardDescription>
                    Your energy field represented as a sacred geometric pattern
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-[300px] rounded-lg overflow-hidden bg-black/50">
                    <JourneyAwareSpiralVisualizer 
                      showControls={false}
                      containerId="reality-map"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-white/50 text-sm">
                    This visualization represents your current vibrational state and energetic alignment
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default RealityOptimizerPage;
