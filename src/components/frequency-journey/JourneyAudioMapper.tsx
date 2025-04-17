
import React, { useEffect, useState } from 'react';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Music, Upload, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface JourneyAudioMapperProps {
  onlyShowTemplatesWithoutAudio?: boolean;
}

const JourneyAudioMapper: React.FC<JourneyAudioMapperProps> = ({ onlyShowTemplatesWithoutAudio = false }) => {
  const { templates, audioMappings, addAudioMapping, addVisualMapping } = useJourneyTemplates();
  const [filteredTemplates, setFilteredTemplates] = useState<JourneyTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [visualFileName, setVisualFileName] = useState<string>('');
  const [visualUrl, setVisualUrl] = useState<string>('');
  const [isPrimary, setIsPrimary] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('audio');

  // Filter templates based on the prop
  useEffect(() => {
    if (templates.length > 0) {
      if (onlyShowTemplatesWithoutAudio) {
        // Only show templates that don't have an audio mapping
        const templatesWithoutAudio = templates.filter(
          template => !audioMappings[template.id]
        );
        setFilteredTemplates(templatesWithoutAudio);
      } else {
        // Show all templates
        setFilteredTemplates(templates);
      }
    }
  }, [templates, audioMappings, onlyShowTemplatesWithoutAudio]);

  const handleAudioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate) {
      toast.error('Please select a journey template');
      return;
    }
    
    if (!audioFileName) {
      toast.error('Please enter an audio file name');
      return;
    }
    
    try {
      setLoading(true);
      await addAudioMapping(selectedTemplate, audioFileName, audioUrl || undefined, isPrimary);
      
      // Reset form
      setAudioFileName('');
      setAudioUrl('');
      setIsPrimary(true);
      
      toast.success('Audio mapping added successfully');
    } catch (error) {
      console.error('Error adding audio mapping:', error);
      toast.error('Failed to add audio mapping');
    } finally {
      setLoading(false);
    }
  };

  const handleVisualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate) {
      toast.error('Please select a journey template');
      return;
    }
    
    if (!visualFileName) {
      toast.error('Please enter a visual file name');
      return;
    }
    
    try {
      setLoading(true);
      await addVisualMapping(selectedTemplate, visualFileName, visualUrl || undefined);
      
      // Reset form
      setVisualFileName('');
      setVisualUrl('');
      
      toast.success('Visual mapping added successfully');
    } catch (error) {
      console.error('Error adding visual mapping:', error);
      toast.error('Failed to add visual mapping');
    } finally {
      setLoading(false);
    }
  };
  
  // Get current mappings for the selected template
  const getCurrentMappings = () => {
    if (!selectedTemplate) return [];
    
    // This is a simplified version, ideally we'd query all mappings for a template
    const mapping = audioMappings[selectedTemplate];
    return mapping ? [mapping] : [];
  };
  
  const currentMappings = getCurrentMappings();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="audio">Audio Files</TabsTrigger>
          <TabsTrigger value="visuals">Visual Elements</TabsTrigger>
        </TabsList>

        <TabsContent value="audio" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-medium">Add Audio Mapping</h3>
                <form onSubmit={handleAudioSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="template">Journey Template</Label>
                    <Select 
                      value={selectedTemplate} 
                      onValueChange={setSelectedTemplate}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTemplates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="fileName">Audio File Name</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="fileName" 
                        value={audioFileName}
                        onChange={(e) => setAudioFileName(e.target.value)}
                        placeholder="journey/your-audio-file.mp3"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Path in Supabase storage, e.g., "journey/meditation.mp3"
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="url">Custom Audio URL (Optional)</Label>
                    <Input 
                      id="url" 
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      placeholder="https://example.com/audio.mp3"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to use Supabase storage URL based on file name
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="isPrimary" 
                      checked={isPrimary}
                      onChange={(e) => setIsPrimary(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isPrimary">Set as primary audio for this journey</Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading || !selectedTemplate || !audioFileName}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Music className="mr-2 h-4 w-4" />
                        Add Audio Mapping
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Current Mappings</h3>
                {selectedTemplate ? (
                  currentMappings.length > 0 ? (
                    <div className="space-y-2">
                      {currentMappings.map((mapping, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          <div className="font-medium">{mapping.audioFileName}</div>
                          <div className="text-sm text-gray-500 truncate">{mapping.audioUrl}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No audio mappings for this template.</p>
                  )
                ) : (
                  <p className="text-gray-500">Select a template to view mappings.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visuals" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-medium">Add Visual Element Mapping</h3>
                <form onSubmit={handleVisualSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="visualTemplate">Journey Template</Label>
                    <Select 
                      value={selectedTemplate} 
                      onValueChange={setSelectedTemplate}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTemplates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="visualFileName">Visual File Name</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="visualFileName" 
                        value={visualFileName}
                        onChange={(e) => setVisualFileName(e.target.value)}
                        placeholder="visuals/your-scene.glb"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Path in Supabase storage, e.g., "visuals/meditation-scene.glb"
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="visualUrl">Custom Visual URL (Optional)</Label>
                    <Input 
                      id="visualUrl" 
                      value={visualUrl}
                      onChange={(e) => setVisualUrl(e.target.value)}
                      placeholder="https://example.com/scene.glb"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to use Supabase storage URL based on file name
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading || !selectedTemplate || !visualFileName}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Add Visual Mapping
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Current Visual Mappings</h3>
                <p className="text-gray-500">Select a template to view visual mappings.</p>
                {/* Visual mappings will be displayed here once we fetch them */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-yellow-50 p-4 rounded-md">
        <h3 className="text-md font-medium text-yellow-800 mb-2 flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Upload Instructions
        </h3>
        <p className="text-sm text-yellow-700">
          To add audio and visual files, upload them to the Supabase storage bucket: <code>frequency-assets</code>
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          Recommended path formats:
          <br />
          • Audio files: <code>journey/your-file-name.mp3</code>
          <br />
          • Visual elements: <code>visuals/your-scene-name.glb</code>
        </p>
      </div>
    </div>
  );
};

export default JourneyAudioMapper;
