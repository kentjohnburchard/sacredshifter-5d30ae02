
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Journey } from '@/context/JourneyContext';
import { ChakraTag } from '@/types/chakras';
import ChakraSelect from '@/components/chakra/ChakraSelect';
import VisualThemeEditor from '@/components/admin/VisualThemeEditor';
import VisualRenderer from '@/components/visualizer/VisualRenderer';

const VisualizerAdmin = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [chakraFilter, setChakraFilter] = useState<ChakraTag | ''>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchJourneys = async () => {
      setLoading(true);
      try {
        let query = supabase.from('journeys').select('*');
        
        if (chakraFilter) {
          query = query.eq('chakra_tag', chakraFilter);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching journeys:', error);
          return;
        }
        
        setJourneys(data || []);
      } catch (err) {
        console.error('Failed to fetch journeys:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJourneys();
  }, [chakraFilter]);
  
  const filteredJourneys = journeys.filter(journey => 
    journey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleJourneySelect = (journeyId: string) => {
    setSelectedJourneyId(journeyId);
  };
  
  return (
    <PageLayout title="Visualizer Administration">
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Visualizer Scene Manager</h1>
        <p className="mb-6">Configure and customize visualization scenes for Sacred Shifter journeys.</p>
        
        <Tabs defaultValue="journeys">
          <TabsList className="mb-4">
            <TabsTrigger value="journeys">Journey Visuals</TabsTrigger>
            <TabsTrigger value="presets">Visual Presets</TabsTrigger>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="journeys">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Journeys</CardTitle>
                  <CardDescription>Select a journey to customize its visuals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder="Search journeys..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Filter by Chakra</label>
                      <ChakraSelect
                        value={chakraFilter}
                        onChange={(value) => setChakraFilter(value as ChakraTag | '')}
                        placeholder="All Chakras"
                        className="w-full"
                      />
                    </div>
                    
                    {loading ? (
                      <div className="flex justify-center items-center h-24">
                        <div className="animate-spin h-8 w-8 border-b-2 border-purple-500 rounded-full"></div>
                      </div>
                    ) : filteredJourneys.length > 0 ? (
                      <div className="border rounded-md divide-y divide-gray-700/40 max-h-[400px] overflow-y-auto">
                        {filteredJourneys.map(journey => (
                          <Button
                            key={journey.id}
                            variant="ghost"
                            className={`w-full justify-start text-left px-3 py-2 h-auto ${
                              selectedJourneyId === journey.id.toString() ? 'bg-purple-900/20' : ''
                            }`}
                            onClick={() => handleJourneySelect(journey.id.toString())}
                          >
                            <div>
                              <div className="font-medium">{journey.title}</div>
                              <div className="text-xs text-gray-400">
                                {journey.chakra_tag && (
                                  <span className="mr-2">{journey.chakra_tag}</span>
                                )}
                                ID: {journey.id}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 text-gray-400">
                        No journeys found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Visual Theme Settings</CardTitle>
                  <CardDescription>
                    {selectedJourneyId ? 
                      `Customize visual theme for journey ID: ${selectedJourneyId}` : 
                      'Select a journey to customize its visual theme'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedJourneyId ? (
                    <VisualThemeEditor journeyId={selectedJourneyId} />
                  ) : (
                    <div className="text-center p-8 text-gray-400 border border-dashed rounded-md">
                      Select a journey from the list to customize its visual theme
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="presets">
            <Card>
              <CardHeader>
                <CardTitle>Visual Presets</CardTitle>
                <CardDescription>Manage reusable visual theme presets</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-6">Visual preset management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>Preview visualization scenes in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-md overflow-hidden border border-purple-500/30">
                  <VisualRenderer height="100%" showControls={true} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default VisualizerAdmin;
