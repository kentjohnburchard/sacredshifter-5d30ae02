
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent } from '@/components/ui/card';

const TestJourney: React.FC = () => {
  return (
    <AppShell pageTitle="Test Journey" chakraColor="#9333EA">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Test Journey</h1>
        
        <Card className="bg-black/40 border-purple-500/30">
          <CardContent className="p-6">
            <p className="text-white">This is a test journey for internal development purposes.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default TestJourney;
