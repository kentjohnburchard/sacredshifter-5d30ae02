
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChakraTag } from '@/types/chakras';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import { useSpiralParams } from '@/hooks/useSpiralParams';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, RotateCcw, Eye } from 'lucide-react';

interface SpiralParamTunerProps {
  journeyId?: string;
  chakra?: ChakraTag;
}

// Default parameters to start with
const defaultSpiralParams = {
  coeffA: 1.0,
  coeffB: 1.0,
  freqA: 2.0,
  freqB: 1.5,
  color: '255,255,255',
  opacity: 70,
  strokeWeight: 1.0,
  speed: 0.1,
  maxCycles: 3
};

const SpiralParamTuner: React.FC<SpiralParamTunerProps> = ({ journeyId, chakra }) => {
  const { getDefaultParamsForChakra } = useSpiralParams();
  const [activeTab, setActiveTab] = useState<string>('basics');
  const [selectedChakra, setSelectedChakra] = useState<ChakraTag | undefined>(chakra);
  const [params, setParams] = useState(() => {
    return chakra 
      ? getDefaultParamsForChakra(chakra)
      : defaultSpiralParams;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLivePreview, setIsLivePreview] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load existing parameters for this journey if available
  useEffect(() => {
    const loadExistingParams = async () => {
      if (journeyId) {
        try {
          const { data, error } = await supabase
            .from('journey_visual_params')
            .select('params')
            .eq('journey_id', journeyId)
            .single();
          
          if (error) {
            console.log('No existing parameters found, using defaults');
            return;
          }
          
          if (data?.params) {
            setParams(data.params);
          }
        } catch (error) {
          console.error('Error loading parameters:', error);
        }
      }
    };
    
    loadExistingParams();
  }, [journeyId]);

  // Update params when chakra changes
  useEffect(() => {
    if (selectedChakra) {
      const chakraParams = getDefaultParamsForChakra(selectedChakra);
      setParams(chakraParams);
      setHasUnsavedChanges(true);
    }
  }, [selectedChakra, getDefaultParamsForChakra]);

  // Handle parameter changes
  const handleParamChange = (key: string, value: number | string) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  // Load parameters for a selected chakra
  const handleChakraSelect = (value: string) => {
    setSelectedChakra(value as ChakraTag);
  };

  // Reset parameters to defaults for the selected chakra
  const handleReset = () => {
    if (selectedChakra) {
      setParams(getDefaultParamsForChakra(selectedChakra));
    } else {
      setParams(defaultSpiralParams);
    }
    setHasUnsavedChanges(true);
  };

  // Save parameters to the database
  const handleSave = async () => {
    if (!journeyId) {
      toast.error('No journey ID provided, cannot save parameters');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('journey_visual_params')
        .upsert({
          journey_id: journeyId,
          params,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'journey_id'
        });
      
      if (error) throw error;
      
      toast.success('Parameters saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving parameters:', error);
      toast.error('Failed to save parameters');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to render sliders
  const renderSlider = (
    name: string, 
    min: number, 
    max: number, 
    step: number, 
    value: number,
    label: string
  ) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm">{label}</Label>
        <Input 
          className="w-16 h-8 text-xs p-1 ml-2"
          value={value}
          type="number"
          min={min}
          max={max}
          step={step}
          onChange={(e) => handleParamChange(name, parseFloat(e.target.value))}
        />
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => handleParamChange(name, values[0])}
      />
    </div>
  );

  // Extract RGB values for color sliders
  const rgbColor = params.color.split(',').map(Number);
  const [red, green, blue] = rgbColor.length === 3 ? rgbColor : [255, 255, 255];

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-black/40">
        <div className="flex justify-between items-center">
          <CardTitle>Spiral Parameter Tuner</CardTitle>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={isLivePreview}
              onCheckedChange={setIsLivePreview}
              id="live-preview"
            />
            <Label htmlFor="live-preview" className="cursor-pointer text-sm">
              <Eye className="h-4 w-4 inline mr-1" /> Live Preview
            </Label>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Chakra selector */}
            <div className="space-y-2">
              <Label>Chakra Base</Label>
              <Select
                value={selectedChakra}
                onValueChange={handleChakraSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select chakra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Root">Root</SelectItem>
                  <SelectItem value="Sacral">Sacral</SelectItem>
                  <SelectItem value="Solar Plexus">Solar Plexus</SelectItem>
                  <SelectItem value="Heart">Heart</SelectItem>
                  <SelectItem value="Throat">Throat</SelectItem>
                  <SelectItem value="Third Eye">Third Eye</SelectItem>
                  <SelectItem value="Crown">Crown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Parameter tabs */}
            <Tabs defaultValue="basics" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="movement">Movement</TabsTrigger>
              </TabsList>
              
              {/* Basic parameters */}
              <TabsContent value="basics" className="space-y-4 pt-4">
                {renderSlider('coeffA', 0.1, 3.0, 0.1, params.coeffA, 'Coefficient A')}
                {renderSlider('coeffB', 0.1, 3.0, 0.1, params.coeffB, 'Coefficient B')}
                {renderSlider('freqA', 0.1, 10.0, 0.1, params.freqA, 'Frequency A')}
                {renderSlider('freqB', 0.1, 10.0, 0.1, params.freqB, 'Frequency B')}
              </TabsContent>
              
              {/* Appearance parameters */}
              <TabsContent value="appearance" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs text-red-500">Red</Label>
                      <Slider
                        min={0}
                        max={255}
                        step={1}
                        value={[red]}
                        onValueChange={(values) => {
                          handleParamChange('color', `${values[0]},${green},${blue}`);
                        }}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-green-500">Green</Label>
                      <Slider
                        min={0}
                        max={255}
                        step={1}
                        value={[green]}
                        onValueChange={(values) => {
                          handleParamChange('color', `${red},${values[0]},${blue}`);
                        }}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-blue-500">Blue</Label>
                      <Slider
                        min={0}
                        max={255}
                        step={1}
                        value={[blue]}
                        onValueChange={(values) => {
                          handleParamChange('color', `${red},${green},${values[0]}`);
                        }}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div 
                    className="h-6 rounded-md border border-white/20 mt-2" 
                    style={{ backgroundColor: `rgb(${params.color})` }}
                  />
                </div>
                
                {renderSlider('opacity', 0, 100, 5, params.opacity, 'Opacity')}
                {renderSlider('strokeWeight', 0.1, 5.0, 0.1, params.strokeWeight, 'Stroke Weight')}
              </TabsContent>
              
              {/* Movement parameters */}
              <TabsContent value="movement" className="space-y-4 pt-4">
                {renderSlider('speed', 0.01, 0.5, 0.01, params.speed, 'Speed')}
                {renderSlider('maxCycles', 1, 10, 1, params.maxCycles, 'Max Cycles')}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Preview area */}
          {isLivePreview && (
            <div className="border border-white/10 rounded-lg bg-black/30 min-h-[300px] relative overflow-hidden">
              <div className="absolute inset-0">
                <SpiralVisualizer
                  params={params}
                  containerId="tuner-preview"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-black/20 flex justify-between">
        <Button
          variant="outline" 
          onClick={handleReset}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={isSaving || !journeyId || !hasUnsavedChanges}
        >
          <Save className="mr-2 h-4 w-4" /> 
          {isSaving ? "Saving..." : "Save Parameters"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpiralParamTuner;
