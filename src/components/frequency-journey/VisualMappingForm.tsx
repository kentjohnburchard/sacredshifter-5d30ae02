
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { Loader2, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface VisualMappingFormProps {
  templates: JourneyTemplate[];
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
  onAddMapping: (templateId: string, fileName: string, url?: string) => Promise<void>;
}

const VisualMappingForm: React.FC<VisualMappingFormProps> = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  onAddMapping
}) => {
  const [visualFileName, setVisualFileName] = useState<string>('');
  const [visualUrl, setVisualUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
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
      await onAddMapping(selectedTemplate, visualFileName, visualUrl || undefined);
      
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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            {templates.map(template => (
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
  );
};

export default VisualMappingForm;
