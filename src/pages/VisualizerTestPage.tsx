
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { VisualThemeProvider, VisualTheme } from '@/context/VisualThemeContext';
import VisualRenderer from '@/components/visualizer/VisualRenderer';
import ChakraSelect from '@/components/chakra/ChakraSelect';
import { ChakraTag } from '@/types/chakras';
import JourneyAwareVisualRenderer from '@/components/journey/JourneyAwareVisualRenderer';

const VisualizerTestPage = () => {
  const [selectedTheme, setSelectedTheme] = useState<VisualTheme>('default');
  const [intensity, setIntensity] = useState(3);
  const [selectedChakra, setSelectedChakra] = useState<ChakraTag | ''>('');
  const [audioReactive, setAudioReactive] = useState(true);
  const [showJourneyMode, setShowJourneyMode] = useState(false);
  
  // Visual theme options
  const themeOptions: { label: string; value: VisualTheme }[] = [
    { label: 'Cymatic Grid', value: 'cymaticGrid' },
    { label: 'Starlight Field', value: 'starlightField' },
    { label: 'Fractal Ocean', value: 'fractalOcean' },
    { label: 'Merkaba Chamber', value: 'merkabaChamber' },
    { label: 'Sacred Spiral', value: 'sacredSpiral' },
    { label: 'Chakra Field', value: 'chakraField' },
    { label: 'Cosmic Collision', value: 'cosmicCollision' },
    { label: 'Default', value: 'default' }
  ];
  
  // Test journey IDs
  const testJourneyIds = [
    { id: '1', name: 'Heart Activation' },
    { id: '2', name: 'Third Eye Opening' },
    { id: '3', name: 'Root Stabilization' },
  ];
  
  const [selectedJourneyId, setSelectedJourneyId] = useState(testJourneyIds[0].id);
  
  // Fix for the type error - properly handling VisualTheme type
  const handleThemeChange = (value: string) => {
    setSelectedTheme(value as VisualTheme);
  };
  
  return (
    <PageLayout title="Visualizer Test">
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-2">Sacred Visualizer Test Environment</h1>
        <p className="mb-6">Experiment with different visual themes and settings.</p>
        
        <Tabs defaultValue="standalone">
          <TabsList className="mb-4">
            <TabsTrigger value="standalone">Standalone Mode</TabsTrigger>
            <TabsTrigger value="journey">Journey Mode</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standalone">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Visual Settings</CardTitle>
                  <CardDescription>Adjust parameters to customize the visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="theme-select">Visual Theme</Label>
                      <Select 
                        value={selectedTheme} 
                        onValueChange={handleThemeChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme..." />
                        </SelectTrigger>
                        <SelectContent>
                          {themeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Chakra Association</Label>
                      <ChakraSelect
                        value={selectedChakra}
                        onChange={(value) => setSelectedChakra(value as ChakraTag | '')}
                        placeholder="None"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label>Visual Intensity ({intensity})</Label>
                      <Slider
                        value={[intensity]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={([value]) => setIntensity(value)}
                        className="my-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Subtle</span>
                        <span>Balanced</span>
                        <span>Intense</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={audioReactive}
                        onCheckedChange={setAudioReactive}
                        id="audio-reactive-switch"
                      />
                      <Label htmlFor="audio-reactive-switch">Audio reactive</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Visual Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] rounded-md overflow-hidden border border-purple-500/30">
                    <VisualThemeProvider>
                      <VisualRenderer height="100%" showControls={true} />
                    </VisualThemeProvider>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="journey">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Journey Settings</CardTitle>
                  <CardDescription>Test with simulated journey data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="journey-select">Select Test Journey</Label>
                      <Select 
                        value={selectedJourneyId} 
                        onValueChange={setSelectedJourneyId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select journey..." />
                        </SelectTrigger>
                        <SelectContent>
                          {testJourneyIds.map(journey => (
                            <SelectItem key={journey.id} value={journey.id}>
                              {journey.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={showJourneyMode}
                        onCheckedChange={setShowJourneyMode}
                        id="journey-mode-switch"
                      />
                      <Label htmlFor="journey-mode-switch">Simulate Journey Mode</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Journey Visualization Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] rounded-md overflow-hidden border border-purple-500/30">
                    {showJourneyMode ? (
                      <JourneyAwareVisualRenderer 
                        journeyId={selectedJourneyId}
                        autoSync={false}
                        height="100%"
                        showControls={true}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-black/30">
                        <p className="text-gray-400">
                          Enable Journey Mode to preview journey-aware visualizations
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default VisualizerTestPage;
