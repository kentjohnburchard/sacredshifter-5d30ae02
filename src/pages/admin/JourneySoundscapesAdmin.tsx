
import React from 'react';
import Layout from '@/components/Layout';
import SoundscapeManagerV2 from '@/components/admin/SoundscapeManagerV2';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Music } from 'lucide-react';

const JourneySoundscapesAdmin: React.FC = () => {
  return (
    <Layout pageTitle="Journey Soundscapes Admin">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Journey Soundscapes</h1>
          <p className="text-gray-500">
            Manage audio content for sacred journeys
          </p>
        </div>
        
        <SoundscapeManagerV2 />
      </div>
    </Layout>
  );
};

export default JourneySoundscapesAdmin;
