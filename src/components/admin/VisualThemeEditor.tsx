
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SpiralParamTuner from './SpiralParamTuner';
import { ChakraTag } from '@/types/chakras';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VisualThemeEditorProps {
  journeyId?: string;
}

const VisualThemeEditor: React.FC<VisualThemeEditorProps> = ({ journeyId }) => {
  const [chakra, setChakra] = useState<ChakraTag | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!journeyId) {
      setIsLoading(false);
      return;
    }

    const fetchJourneyChakra = async () => {
      try {
        const { data, error } = await supabase
          .from('journeys')
          .select('chakra_tag')
          .eq('id', journeyId)
          .single();
          
        if (error) throw error;
        
        if (data?.chakra_tag) {
          setChakra(data.chakra_tag as ChakraTag);
        }
      } catch (error) {
        console.error('Error fetching journey chakra:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJourneyChakra();
  }, [journeyId]);
  
  const handleChakraChange = async (value: string) => {
    if (!journeyId) return;
    
    setChakra(value as ChakraTag);
    
    try {
      const { error } = await supabase
        .from('journeys')
        .update({ chakra_tag: value })
        .eq('id', journeyId);
        
      if (error) throw error;
      
      toast.success('Chakra updated successfully');
    } catch (error) {
      console.error('Error updating journey chakra:', error);
      toast.error('Failed to update chakra');
    }
  };

  const handlePreviewJourney = () => {
    if (!journeyId) return;
    
    // Get the journey slug
    supabase
      .from('journeys')
      .select('filename')
      .eq('id', journeyId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          toast.error('Error finding journey');
          return;
        }
        
        if (data?.filename) {
          // Open the journey in a new tab
          window.open(`/journey/${data.filename}`, '_blank');
        }
      });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          Loading visual theme editor...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-black/10">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Visual Theme Editor</span>
          <Button onClick={handlePreviewJourney} variant="outline" size="sm">
            Preview Journey
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="chakra-select">Journey Chakra</Label>
            <Select
              value={chakra}
              onValueChange={handleChakraChange}
            >
              <SelectTrigger id="chakra-select">
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
        </div>
        
        <Tabs defaultValue="spiral" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="spiral">Spiral Tuner</TabsTrigger>
            <TabsTrigger value="geometry">Sacred Geometry</TabsTrigger>
            <TabsTrigger value="colors">Color Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="spiral" className="pt-4">
            <SpiralParamTuner journeyId={journeyId} chakra={chakra} />
          </TabsContent>
          
          <TabsContent value="geometry" className="pt-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p>Sacred geometry editor coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="colors" className="pt-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p>Color theme editor coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VisualThemeEditor;
