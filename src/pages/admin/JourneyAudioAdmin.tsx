
import React from 'react';
import Layout from '@/components/Layout';
import { JourneySongsManager } from '@/components/frequency-journey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Settings } from 'lucide-react';

const JourneyAudioAdmin: React.FC = () => {
  return (
    <Layout pageTitle="Journey Audio Manager">
      <div className="max-w-4xl mx-auto py-6">
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
            
            <JourneySongsManager />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default JourneyAudioAdmin;
