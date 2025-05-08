
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'react-router-dom';

const JourneyExperiencePage: React.FC = () => {
  const { journeySlug } = useParams<{ journeySlug: string }>();
  
  return (
    <AppShell 
      pageTitle={`Journey: ${journeySlug}`}
      chakraColor="#9333EA" // Purple color for journeys
    >
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          Journey Experience: {journeySlug}
        </h1>
        
        <Card className="bg-black/40 border-purple-500/30">
          <CardContent className="p-6">
            <p className="text-white">Journey experience interface coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default JourneyExperiencePage;
