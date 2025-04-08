
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JourneyAudioMapper from '@/components/frequency-journey/JourneyAudioMapper';
import { FileMusic, Settings } from 'lucide-react';

const AudioMappingsManager: React.FC = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <FileMusic className="h-5 w-5 text-purple-600" />
          Journey Audio Mappings Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="unmapped">Unmapped Templates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <JourneyAudioMapper onlyShowTemplatesWithoutAudio={false} />
          </TabsContent>
          
          <TabsContent value="unmapped" className="space-y-4">
            <JourneyAudioMapper onlyShowTemplatesWithoutAudio={true} />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Audio Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Audio files should be uploaded to the Supabase storage bucket: <code>frequency-assets</code>
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Recommended path format: <code>journey/your-file-name.mp3</code>
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  When you set an audio mapping, you're creating an association between a journey template and an audio file.
                  This mapping will be used when users click "Begin Journey" on a template card.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AudioMappingsManager;
