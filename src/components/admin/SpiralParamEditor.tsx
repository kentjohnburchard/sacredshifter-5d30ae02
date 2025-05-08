
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SpiralParams } from '@/hooks/useSpiralParams';
import { paramsCache } from '@/hooks/useSpiralParams';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface SpiralParamEditorProps {
  journeyId: string;
  initialParams?: SpiralParams;
  onSave?: (params: SpiralParams) => void;
}

const SpiralParamEditor: React.FC<SpiralParamEditorProps> = ({ 
  journeyId,
  initialParams,
  onSave
}) => {
  const [params, setParams] = useState<SpiralParams>(initialParams || {
    coeffA: 4,
    coeffB: 4,
    coeffC: 1.3,
    freqA: 44,
    freqB: -17,
    freqC: -54,
    color: '255,255,255',
    opacity: 80,
    strokeWeight: 0.5,
    maxCycles: 5,
    speed: 0.001
  });
  
  const [saving, setSaving] = useState(false);
  
  // Update local state when initialParams change
  useEffect(() => {
    if (initialParams) {
      setParams(initialParams);
    }
  }, [initialParams]);

  const handleParamChange = (name: keyof SpiralParams, value: any) => {
    setParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    setSaving(true);
    try {
      // Update the params in the database
      const { error } = await supabase
        .from('journey_visual_params')
        .upsert({
          journey_id: journeyId,
          params: params as unknown as Record<string, any>,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'journey_id'
        });
        
      if (error) {
        throw error;
      }
      
      // Update the local cache in useSpiralParams
      paramsCache[journeyId] = params;
      
      toast.success('Spiral parameters saved successfully');
      
      if (onSave) {
        onSave(params);
      }
    } catch (error) {
      console.error('Error saving spiral parameters:', error);
      toast.error('Failed to save spiral parameters');
    } finally {
      setSaving(false);
    }
  };
  
  const handleReset = () => {
    setParams({
      coeffA: 4,
      coeffB: 4,
      coeffC: 1.3,
      freqA: 44,
      freqB: -17,
      freqC: -54,
      color: '255,255,255',
      opacity: 80,
      strokeWeight: 0.5,
      maxCycles: 5,
      speed: 0.001
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spiral Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Coefficient A</Label>
            <div className="flex items-center gap-2">
              <Slider 
                value={[params.coeffA || 4]} 
                min={0.1} 
                max={10} 
                step={0.1}
                onValueChange={([value]) => handleParamChange('coeffA', value)}
                className="flex-1"
              />
              <Input 
                type="number" 
                value={params.coeffA || 4} 
                onChange={(e) => handleParamChange('coeffA', parseFloat(e.target.value))}
                className="w-20" 
              />
            </div>
          </div>
          
          <div>
            <Label>Coefficient B</Label>
            <div className="flex items-center gap-2">
              <Slider 
                value={[params.coeffB || 4]} 
                min={0.1} 
                max={10} 
                step={0.1}
                onValueChange={([value]) => handleParamChange('coeffB', value)}
                className="flex-1"
              />
              <Input 
                type="number" 
                value={params.coeffB || 4} 
                onChange={(e) => handleParamChange('coeffB', parseFloat(e.target.value))}
                className="w-20" 
              />
            </div>
          </div>
          
          <div>
            <Label>Coefficient C</Label>
            <div className="flex items-center gap-2">
              <Slider 
                value={[params.coeffC || 1.3]} 
                min={0.1} 
                max={5} 
                step={0.1}
                onValueChange={([value]) => handleParamChange('coeffC', value)}
                className="flex-1"
              />
              <Input 
                type="number" 
                value={params.coeffC || 1.3} 
                onChange={(e) => handleParamChange('coeffC', parseFloat(e.target.value))}
                className="w-20" 
              />
            </div>
          </div>
          
          <div>
            <Label>Frequency A</Label>
            <div className="flex items-center gap-2">
              <Slider 
                value={[params.freqA || 44]} 
                min={-100} 
                max={100} 
                step={1}
                onValueChange={([value]) => handleParamChange('freqA', value)}
                className="flex-1"
              />
              <Input 
                type="number" 
                value={params.freqA || 44} 
                onChange={(e) => handleParamChange('freqA', parseFloat(e.target.value))}
                className="w-20" 
              />
            </div>
          </div>
          
          <div>
            <Label>Frequency B</Label>
            <div className="flex items-center gap-2">
              <Slider 
                value={[params.freqB || -17]} 
                min={-100} 
                max={100} 
                step={1}
                onValueChange={([value]) => handleParamChange('freqB', value)}
                className="flex-1"
              />
              <Input 
                type="number" 
                value={params.freqB || -17} 
                onChange={(e) => handleParamChange('freqB', parseFloat(e.target.value))}
                className="w-20" 
              />
            </div>
          </div>
          
          <div>
            <Label>Frequency C</Label>
            <div className="flex items-center gap-2">
              <Slider 
                value={[params.freqC || -54]} 
                min={-100} 
                max={100} 
                step={1}
                onValueChange={([value]) => handleParamChange('freqC', value)}
                className="flex-1"
              />
              <Input 
                type="number" 
                value={params.freqC || -54} 
                onChange={(e) => handleParamChange('freqC', parseFloat(e.target.value))}
                className="w-20" 
              />
            </div>
          </div>
          
          <div>
            <Label>Color (R,G,B)</Label>
            <Input 
              type="text" 
              value={params.color || '255,255,255'} 
              onChange={(e) => handleParamChange('color', e.target.value)}
              placeholder="R,G,B (e.g. 255,100,200)" 
            />
          </div>
          
          <div>
            <Label>Opacity (%)</Label>
            <div className="flex items-center gap-2">
              <Slider 
                value={[params.opacity || 80]} 
                min={10} 
                max={100} 
                step={5}
                onValueChange={([value]) => handleParamChange('opacity', value)}
                className="flex-1"
              />
              <Input 
                type="number" 
                value={params.opacity || 80} 
                onChange={(e) => handleParamChange('opacity', parseFloat(e.target.value))}
                className="w-20" 
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>Reset</Button>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {saving ? 'Saving...' : 'Save Parameters'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpiralParamEditor;
