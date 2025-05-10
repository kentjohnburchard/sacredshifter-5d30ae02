
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { Loader2, Music } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AudioMappingFormProps {
  templates: JourneyTemplate[];
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
  onAddMapping: (templateId: string, fileName: string, url?: string, isPrimary?: boolean) => Promise<void>;
}

const AudioMappingForm: React.FC<AudioMappingFormProps> = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  onAddMapping
}) => {
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPrimary, setIsPrimary] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  
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
      await onAddMapping(selectedTemplate, audioFileName, audioUrl || undefined, isPrimary);
      
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
  
  return (
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
            {templates.map(template => (
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
  );
};

export default AudioMappingForm;
