
import React, { useEffect, useState } from 'react';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudioMappingForm from './AudioMappingForm';
import VisualMappingForm from './VisualMappingForm';

interface JourneyAudioMapperProps {
  onlyShowTemplatesWithoutAudio?: boolean;
}

const JourneyAudioMapper: React.FC<JourneyAudioMapperProps> = ({ onlyShowTemplatesWithoutAudio = false }) => {
  const { templates, audioMappings, addAudioMapping, addVisualMapping } = useJourneyTemplates();
  const [filteredTemplates, setFilteredTemplates] = useState<JourneyTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
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
      
      // If we have templates but no selection, select the first one
      if (templates.length > 0 && !selectedTemplate) {
        setSelectedTemplate(templates[0].id);
      }
    }
  }, [templates, audioMappings, onlyShowTemplatesWithoutAudio, selectedTemplate]);

  // Get current mappings for the selected template
  const getCurrentMappings = () => {
    if (!selectedTemplate) return [];
    
    // This is a simplified version, ideally we'd query all mappings for a template
    const mapping = audioMappings[selectedTemplate];
    return mapping ? [mapping] : [];
  };
  
  const currentMappings = getCurrentMappings();

  // Wrapper for addVisualMapping that matches the expected type in VisualMappingForm
  const handleAddVisualMapping = async (
    templateId: string, 
    fileName: string, 
    url?: string
  ): Promise<void> => {
    await addVisualMapping(templateId, fileName, url);
    return;
  };

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
                <AudioMappingForm 
                  templates={filteredTemplates}
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  onAddMapping={addAudioMapping}
                />
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
                <VisualMappingForm 
                  templates={filteredTemplates}
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  onAddMapping={handleAddVisualMapping}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Current Visual Mappings</h3>
                {selectedTemplate ? (
                  <p className="text-gray-500">No visual mappings found for this template.</p>
                ) : (
                  <p className="text-gray-500">Select a template to view visual mappings.</p>
                )}
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
