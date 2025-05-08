
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent } from '@/components/ui/card';

const SacredCirclePage: React.FC = () => {
  return (
    <AppShell 
      pageTitle="Sacred Circle" 
      chakraColor="#EC4899" // Pink color for sacred circle
    >
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Sacred Circle</h1>
        
        <Card className="bg-black/40 border-pink-500/30">
          <CardContent className="p-6">
            <p className="text-white">Sacred Circle interface coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default SacredCirclePage;
