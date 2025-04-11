
import React from 'react';
import Layout from '@/components/Layout';
import { JourneyAudioMapper } from '@/components/frequency-journey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Settings, AudioLines } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudioFunctionMappingManager from '@/components/admin/AudioFunctionMappingManager';

const JourneyAudioAdmin: React.FC = () => {
  return (
    <Layout pageTitle="Audio Management Center">
      <div className="max-w-6xl mx-auto py-6">
        <Tabs defaultValue="journey" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>Journey Audio</span>
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
          
          <TabsContent value="functions">
            <AudioFunctionMappingManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default JourneyAudioAdmin;
