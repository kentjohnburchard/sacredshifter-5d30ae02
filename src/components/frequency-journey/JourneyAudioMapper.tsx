
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import { Music, Save, FileAudio } from 'lucide-react';
import { toast } from 'sonner';
import { JourneyTemplate } from '@/data/journeyTemplates';

interface JourneyAudioMapperProps {
  onlyShowTemplatesWithoutAudio?: boolean;
}

const JourneyAudioMapper: React.FC<JourneyAudioMapperProps> = ({ 
  onlyShowTemplatesWithoutAudio = false 
}) => {
  const { templates, loading, audioMappings, addAudioMapping } = useJourneyTemplates();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [filteredTemplates, setFilteredTemplates] = useState<JourneyTemplate[]>([]);

  useEffect(() => {
    if (templates && templates.length > 0) {
      let filtered = templates;
      
      if (onlyShowTemplatesWithoutAudio) {
        filtered = templates.filter(template => !audioMappings[template.id]);
      }
      
      setFilteredTemplates(filtered);
      
      // Auto-select first template if none selected
      if (!selectedTemplate && filtered.length > 0) {
        setSelectedTemplate(filtered[0].id);
      }
    }
  }, [templates, audioMappings, onlyShowTemplatesWithoutAudio, selectedTemplate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate || !audioFileName) {
      toast.error('Please select a journey template and enter an audio file name');
      return;
    }
    
    try {
      await addAudioMapping(selectedTemplate, audioFileName);
      setAudioFileName('');
      // We don't reset selectedTemplate to allow for quickly mapping multiple audio files to the same template
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getSelectedTemplateName = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    return template ? template.title : '';
  };

  if (loading) {
    return <div>Loading journey templates...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileAudio className="h-5 w-5 text-purple-600" />
          Journey Audio Mapping
        </CardTitle>
        <CardDescription>
          Map audio files to journey templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-select">Select Journey Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger id="template-select">
                <SelectValue placeholder="Select a journey template" />
              </SelectTrigger>
              <SelectContent>
                {filteredTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id} className="flex items-center gap-2">
                    <div className="flex items-center justify-between w-full">
                      <span>{template.title}</span>
                      {audioMappings[template.id] && (
                        <Music className="h-4 w-4 ml-2 text-green-500" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="audio-filename">Audio File Name</Label>
                {audioMappings[selectedTemplate] && (
                  <span className="text-xs text-green-600">
                    Currently: {audioMappings[selectedTemplate].audioFileName}
                  </span>
                )}
              </div>
              <Input 
                id="audio-filename"
                placeholder="e.g., journey/tone-of-the-tides.mp3"
                value={audioFileName}
                onChange={(e) => setAudioFileName(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Enter the file name as stored in the Supabase bucket. Don't include the base URL.
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!selectedTemplate || !audioFileName}>
            <Save className="h-4 w-4 mr-2" />
            Map Audio to {getSelectedTemplateName()}
          </Button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Current Mappings</h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {Object.keys(audioMappings).length === 0 ? (
              <p className="text-sm text-gray-500">No audio mappings defined yet</p>
            ) : (
              Object.entries(audioMappings).map(([templateId, mapping]) => {
                const template = templates.find(t => t.id === templateId);
                return (
                  <div key={templateId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-sm">
                    <div>
                      <span className="font-medium">{template?.title || templateId}</span>
                      <span className="block text-xs text-gray-500">{mapping.audioFileName}</span>
                    </div>
                    <Music className="h-4 w-4 text-purple-500" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyAudioMapper;
