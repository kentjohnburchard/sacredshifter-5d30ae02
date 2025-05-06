
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJourneyVisuals } from '@/hooks/useJourneyVisuals';
import { VisualTheme, VisualThemeParams } from '@/context/VisualThemeContext';
import { Label } from '@/components/ui/label';
import { ChakraTag } from '@/types/chakras';
import ChakraSelect from '@/components/chakra/ChakraSelect';
import { getRecommendedVisualThemeForChakra } from '@/services/visualThemeService';
import VisualRenderer from '@/components/visualizer/VisualRenderer';

interface VisualThemeEditorProps {
  journeyId: string;
}

const VisualThemeEditor: React.FC<VisualThemeEditorProps> = ({ journeyId }) => {
  const { visualParams, loading, updateVisualParams } = useJourneyVisuals(journeyId);
  const [localParams, setLocalParams] = useState<Partial<VisualThemeParams>>({});
  const [previewActive, setPreviewActive] = useState(false);
  const [selectedChakra, setSelectedChakra] = useState<ChakraTag | undefined>(undefined);
  
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
  
  // Initialize local state with loaded params
  useEffect(() => {
    if (visualParams) {
      setLocalParams(visualParams);
      setSelectedChakra(visualParams.chakraTag);
    }
  }, [visualParams]);
  
  // Update a specific parameter
  const updateParam = (key: keyof VisualThemeParams, value: any) => {
    setLocalParams(prev => ({ ...prev, [key]: value }));
  };
  
  // Apply chakra-based theme recommendations
  const applyChakraTheme = (chakra: ChakraTag) => {
    setSelectedChakra(chakra);
    const recommendedTheme = getRecommendedVisualThemeForChakra(chakra);
    setLocalParams(prev => ({
      ...prev,
      ...recommendedTheme,
      chakraTag: chakra
    }));
  };
  
  // Save changes
  const saveChanges = async () => {
    if (await updateVisualParams(localParams)) {
      // Success notification could be added here
      console.log('Visual theme updated successfully');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visual Theme Editor</CardTitle>
          <CardDescription>Customize the visual experience for this journey</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin h-8 w-8 border-b-2 border-purple-500 rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="chakra-select">Chakra Association</Label>
                    <ChakraSelect
                      value={selectedChakra}
                      onChange={(value) => applyChakraTheme(value as ChakraTag)}
                      placeholder="Select chakra..."
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Selecting a chakra will apply recommended visual settings
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="theme-select">Visual Theme</Label>
                    <Select 
                      value={localParams.theme} 
                      onValueChange={(value) => updateParam('theme', value)}
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
                </div>
                
                <div>
                  <Label>Visual Intensity ({localParams.intensity || 3})</Label>
                  <Slider
                    value={[localParams.intensity || 3]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={([value]) => updateParam('intensity', value)}
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
                    checked={localParams.animated !== false}
                    onCheckedChange={(checked) => updateParam('animated', checked)}
                    id="animated-switch"
                  />
                  <Label htmlFor="animated-switch">Enable animation</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={localParams.audioReactive === true}
                    onCheckedChange={(checked) => updateParam('audioReactive', checked)}
                    id="audio-reactive-switch"
                  />
                  <Label htmlFor="audio-reactive-switch">Audio reactive</Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setPreviewActive(prev => !prev)}
                >
                  {previewActive ? 'Hide Preview' : 'Show Preview'}
                </Button>
                <Button onClick={saveChanges}>Save Changes</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {previewActive && (
        <Card>
          <CardHeader>
            <CardTitle>Visual Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-md overflow-hidden border border-purple-500/30">
              <VisualRenderer height={256} showControls={false} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisualThemeEditor;
