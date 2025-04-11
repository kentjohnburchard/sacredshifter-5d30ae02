
import React, { useEffect, useState } from 'react';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Music, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface JourneyAudioMapperProps {
  onlyShowTemplatesWithoutAudio?: boolean;
}

const JourneyAudioMapper: React.FC<JourneyAudioMapperProps> = ({ onlyShowTemplatesWithoutAudio = false }) => {
  const { templates, audioMappings, addAudioMapping } = useJourneyTemplates();
  const [filteredTemplates, setFilteredTemplates] = useState<JourneyTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPrimary, setIsPrimary] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="text-lg font-medium">Add Audio Mapping</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
      
      <div className="bg-yellow-50 p-4 rounded-md">
        <h3 className="text-md font-medium text-yellow-800 mb-2 flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Upload Instructions
        </h3>
        <p className="text-sm text-yellow-700">
          To add audio files, upload them to the Supabase storage bucket: <code>frequency-assets</code>
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          Recommended path format: <code>journey/your-file-name.mp3</code>
        </p>
      </div>
    </div>
  );
};

export default JourneyAudioMapper;
