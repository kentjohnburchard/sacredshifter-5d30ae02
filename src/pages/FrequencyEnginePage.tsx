
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import FrequencyEngine from '@/components/audio/FrequencyEngine';
import { ChakraTag } from '@/types/chakras';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FrequencyEnginePage: React.FC = () => {
  const [activeChakra, setActiveChakra] = React.useState<ChakraTag>('Heart');
  
  return (
    <Layout pageTitle="Frequency Engine">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Sacred Frequency Engine</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <FrequencyEngine 
              activeChakra={activeChakra}
              className="h-full"
            />
          </div>
          
          <Card className="bg-gray-900/80 border border-purple-500/30">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Frequency Engine Demo</h2>
              <p className="mb-4">
                The Frequency Engine allows you to work with sacred frequencies for sound healing and spiritual alignment. 
                You can select chakra frequencies, special tones, or enter your own custom frequency.
              </p>
              
              <Tabs defaultValue="chakras">
                <TabsList>
                  <TabsTrigger value="chakras">Chakras</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chakras" className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Choose a Chakra:</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {[
                      "Root", "Sacral", "Solar Plexus", "Heart", 
                      "Throat", "Third Eye", "Crown"
                    ].map((chakra) => (
                      <button
                        key={chakra}
                        onClick={() => setActiveChakra(chakra as ChakraTag)}
                        className={`p-2 border rounded-md text-center transition-all ${
                          activeChakra === chakra 
                            ? 'bg-purple-700 border-purple-400' 
                            : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                        }`}
                      >
                        {chakra}
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-400">
                    The selected chakra will load its corresponding frequency and update the visualization.
                  </p>
                </TabsContent>
                
                <TabsContent value="usage" className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">How to Use:</h3>
                  
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Click the play button to start the frequency</li>
                    <li>Adjust the volume slider as needed</li>
                    <li>Switch between chakra tabs to explore different frequencies</li>
                    <li>Experiment with different waveforms in the Controls tab</li>
                    <li>Save your favorite frequencies for future sessions</li>
                    <li>Try blending frequencies for enhanced experiences</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default FrequencyEnginePage;
