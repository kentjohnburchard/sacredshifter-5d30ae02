
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useChakraActivations } from '@/hooks/useChakraActivations';
import { ChakraTag } from '@/types/chakras';
import ChakraTagComponent from '@/components/chakra/ChakraTag';
import { Progress } from '@/components/ui/progress';
import { Heart, Crown, Radio } from 'lucide-react';

const HeartDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    activationCounts, 
    loading: chakraLoading, 
    getDominantChakra
  } = useChakraActivations();
  const [dominantChakra, setDominantChakra] = useState<ChakraTag | null>(null);

  useEffect(() => {
    setDominantChakra(getDominantChakra());
  }, [activationCounts]);

  const chakras: ChakraTag[] = [
    'Crown', 'Third Eye', 'Throat', 'Heart', 
    'Solar Plexus', 'Sacral', 'Root'
  ];

  // Calculate total activations
  const totalActivations = Object.values(activationCounts).reduce((sum, count) => sum + count, 0);

  // Helper to get percentage
  const getChakraPercentage = (chakra: ChakraTag): number => {
    const count = activationCounts[chakra] || 0;
    return totalActivations > 0 ? Math.round((count / totalActivations) * 100) : 0;
  };

  // Helper to get chakra color for progress bar
  const getChakraProgressColor = (chakra: ChakraTag): string => {
    switch(chakra) {
      case 'Root': return '#ea384c';
      case 'Sacral': return '#ff7e47';
      case 'Solar Plexus': return '#ffd034';
      case 'Heart': return '#4ade80';
      case 'Throat': return '#48cae7';
      case 'Third Eye': return '#7e69ab';
      case 'Crown': return '#9b87f5';
      case 'Transpersonal': return '#e5deff';
      default: return '#9ca3af';
    }
  };

  return (
    <Layout pageTitle="Heart Dashboard | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300"
            style={{textShadow: '0 2px 10px rgba(219, 39, 119, 0.7)'}}>
          Heart Center Dashboard
        </h1>
        <p className="text-lg text-center text-white mb-10 max-w-3xl mx-auto opacity-80">
          Track your heart-centered practices and chakra balance
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-400" />
                Chakra Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chakraLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin h-5 w-5 border-b-2 border-purple-500 rounded-full mr-2"></div>
                  <span>Loading chakra data...</span>
                </div>
              ) : totalActivations === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-2">No chakra activity recorded yet.</p>
                  <p className="text-sm text-gray-500">
                    Explore journeys and practices to activate your chakras!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dominantChakra && (
                    <div className="bg-black/50 border border-purple-500/20 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="h-5 w-5 text-purple-400" />
                        <h3 className="font-medium">Dominant Energy Center</h3>
                      </div>
                      <div className="flex items-center">
                        <ChakraTagComponent chakra={dominantChakra} size="lg" />
                        <span className="ml-2 text-gray-300">
                          ({getChakraPercentage(dominantChakra)}% of your activity)
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {chakras.map(chakra => (
                    <div key={chakra} className="flex items-center gap-3">
                      <ChakraTagComponent chakra={chakra} showTooltip={false} />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">{chakra}</span>
                          <span className="text-gray-400">
                            {activationCounts[chakra] || 0} activations
                          </span>
                        </div>
                        <Progress
                          value={getChakraPercentage(chakra)}
                          className="h-2"
                          style={{
                            backgroundColor: 'rgba(30, 30, 30, 0.5)',
                            border: '1px solid rgba(75, 75, 75, 0.2)'
                          }}
                          indicatorStyle={{
                            backgroundColor: getChakraProgressColor(chakra)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-pink-400" />
                Heart Resonance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-gray-400">Heart metrics coming soon!</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Future updates will include emotional intelligence tracking,
                    <br />heart coherence data, and compassion practices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-400" />
                Recommended Heart Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-400 py-6">
                Chakra-specific heart practice recommendations coming soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HeartDashboard;
