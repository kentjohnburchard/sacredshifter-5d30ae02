
import React from 'react';
import Layout from '@/components/Layout';
import { JourneyAudioMapper } from '@/components/frequency-journey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Settings, AudioLines, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudioFunctionMappingManager from '@/components/admin/AudioFunctionMappingManager';
import VisualElementPreviewer from '@/components/admin/VisualElementPreviewer';

const JourneyAudioAdmin: React.FC = () => {
  return (
    <Layout pageTitle="Audio & Visual Management Center">
      <div className="max-w-6xl mx-auto py-6">
        <Tabs defaultValue="journey" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>Journey Audio</span>
            </TabsTrigger>
            <TabsTrigger value="visuals" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Visual Elements</span>
            </TabsTrigger>
            <TabsTrigger value="functions" className="flex items-center gap-2">
              <AudioLines className="h-4 w-4" />
              <span>Sound Functions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="journey">
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-purple-600" />
                  Journey Audio Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-6">
                  Use this interface to assign audio files to journey templates and upload new audio files.
                  When a user clicks "Begin Journey" on a template, they'll hear one of the assigned audio tracks.
                </p>
                
                <JourneyAudioMapper />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visuals">
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-teal-600" />
                  Visual Elements Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-6">
                  Assign visual elements (3D models, scenes) to journey templates. These visuals will be displayed
                  alongside audio during the journey experience. Upload your Three.js compatible visual elements
                  to Supabase storage first.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <JourneyAudioMapper />
                  <VisualElementPreviewer />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="text-md font-medium text-blue-800 mb-2">Three.js Visual Format Tips</h3>
                  <ul className="list-disc pl-5 text-sm text-blue-700">
                    <li>Use glTF/GLB format for 3D models for optimal loading performance</li>
                    <li>Keep file sizes under 5MB for the best user experience</li>
                    <li>Use compressed textures where possible</li>
                    <li>Test your visuals with different audio frequencies to ensure they respond appropriately</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="functions">
            <AudioFunctionMappingManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default JourneyAudioAdmin;
