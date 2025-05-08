
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent } from '@/components/ui/card';

const LightbearerPage: React.FC = () => {
  return (
    <AppShell 
      pageTitle="Lightbearer Progress" 
      chakraColor="#EAB308" // Yellow color for lightbearer
    >
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Lightbearer Progress</h1>
        
        <Card className="bg-black/40 border-yellow-500/30">
          <CardContent className="p-6">
            <p className="text-white">Lightbearer progress tracking coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default LightbearerPage;
