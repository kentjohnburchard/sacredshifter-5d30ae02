import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Clock, Activity, BarChart2, Zap } from 'lucide-react';
import { ChakraTag } from '@/types/chakras';
import ChakraFilter from '@/components/chakra/ChakraFilter';
import { isPrime } from '@/utils/primeCalculations';

// Simple chakra color mapping since getChakraColor is removed
const chakraColors: Record<string, string> = {
  'Root': '#FF0000',
  'Sacral': '#FF7F00',
  'Solar Plexus': '#FFFF00',
  'Heart': '#00FF00',
  'Throat': '#00FFFF',
  'Third Eye': '#0000FF',
  'Crown': '#8B00FF',
  'Transpersonal': '#FFFFFF'
};

const HeartDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedChakras, setSelectedChakras] = useState<ChakraTag[]>(['Heart']);
  const [activeTab, setActiveTab] = useState('overview');
  const [heartRate, setHeartRate] = useState<number>(72);
  const [heartRateVariability, setHeartRateVariability] = useState<number>(65);
  const [coherenceScore, setCoherenceScore] = useState<number>(7.2);
  
  // Generate some random data for the dashboard
  useEffect(() => {
    // Simulate heart rate changes
    const interval = setInterval(() => {
      const newHeartRate = Math.floor(70 + Math.random() * 10);
      setHeartRate(newHeartRate);
      
      // Check if the heart rate is a prime number
      if (isPrime(newHeartRate)) {
        console.log(`Current heart rate ${newHeartRate} is a prime number!`);
      }
      
      // Update other metrics
      setHeartRateVariability(Math.floor(60 + Math.random() * 15));
      setCoherenceScore(6.5 + Math.random() * 2);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleChakraChange = (chakras: ChakraTag[]) => {
    setSelectedChakras(chakras);
  };
  
  const getChakraColor = (chakra: string): string => {
    return chakraColors[chakra] || '#FFFFFF';
  };
  
  return (
    <PageLayout title="Heart Intelligence Dashboard">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Heart Intelligence Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Monitor your heart coherence and energy flow
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <ChakraFilter
              selectedChakras={selectedChakras}
              onChange={handleChakraChange}
              multiSelect={false}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Heart className="h-8 w-8 mr-3 text-red-500" />
                <div>
                  <div className="text-3xl font-bold">{heartRate}</div>
                  <div className="text-xs text-gray-500">BPM</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Heart Rate Variability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Activity className="h-8 w-8 mr-3 text-blue-500" />
                <div>
                  <div className="text-3xl font-bold">{heartRateVariability}</div>
                  <div className="text-xs text-gray-500">ms</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Coherence Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Zap className="h-8 w-8 mr-3 text-yellow-500" />
                <div>
                  <div className="text-3xl font-bold">{coherenceScore.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">out of 10</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Heart Coherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div 
                      className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${getChakraColor(selectedChakras[0] || 'Heart')}33`,
                        borderWidth: 2,
                        borderColor: getChakraColor(selectedChakras[0] || 'Heart'),
                        borderStyle: 'solid'
                      }}
                    >
                      <Heart 
                        className="h-16 w-16 animate-pulse" 
                        style={{ color: getChakraColor(selectedChakras[0] || 'Heart') }}
                      />
                    </div>
                    <p className="text-lg font-medium">
                      Your heart is in a {coherenceScore > 7 ? 'high' : 'moderate'} coherence state
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Focusing on the {selectedChakras[0] || 'Heart'} chakra energy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        <span>Meditation Time</span>
                      </div>
                      <span className="font-medium">15 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-gray-500" />
                        <span>Coherence Sessions</span>
                      </div>
                      <span className="font-medium">2 sessions</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BarChart2 className="h-5 w-5 mr-2 text-gray-500" />
                        <span>Average Coherence</span>
                      </div>
                      <span className="font-medium">6.8 / 10</span>
                    </div>
                    
                    <Button className="w-full mt-4">Start New Session</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <h3 className="font-medium mb-1">Heart-Focused Breathing</h3>
                      <p className="text-sm text-gray-500">5-10 minutes of conscious breathing while focusing on your heart area</p>
                    </div>
                    
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <h3 className="font-medium mb-1">Gratitude Practice</h3>
                      <p className="text-sm text-gray-500">Recall moments of appreciation and feel gratitude in your heart</p>
                    </div>
                    
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <h3 className="font-medium mb-1">Coherence Technique</h3>
                      <p className="text-sm text-gray-500">Practice quick coherence technique for 3-5 minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historical Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-gray-500">Historical heart data visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Heart Intelligence Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Coherence Patterns</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your heart coherence tends to be highest in the morning hours. Consider scheduling important
                      decisions or creative work during this time to leverage your natural coherence state.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Energy Integration</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      When focusing on the {selectedChakras[0] || 'Heart'} chakra, your heart rate variability 
                      increases by approximately 15%, indicating improved autonomic nervous system balance.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Based on your patterns, we recommend incorporating a 5-minute heart-focused breathing 
                      practice before important meetings or decisions to optimize your coherence state.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Heart intelligence data is updated in real-time. Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default HeartDashboard;
