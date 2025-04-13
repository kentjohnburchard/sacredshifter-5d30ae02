
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TimelineViewer from '@/components/timeline/TimelineViewer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface PrimeHistoryEntry {
  id: string;
  timestamp: string;
  primes: number[];
  journeyTitle?: string;
}

const Timeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("journey");
  const [primeHistory] = useLocalStorage<PrimeHistoryEntry[]>('sacred-prime-history', []);
  
  return (
    <Layout pageTitle="My Journey" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6">Your Sacred Journey</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="journey">Journey Timeline</TabsTrigger>
            <TabsTrigger value="primes">Prime Sequences</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <TabsContent value="journey" className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
          <p className="mb-6">
            Track your frequency shifts and consciousness expansion through your personal timeline.
            Your journey is unique and evolving with each experience.
          </p>
          <TimelineViewer />
        </TabsContent>
        
        <TabsContent value="primes" className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
          <p className="mb-6">
            Your sacred prime number sequences visualized during frequency journeys.
            Each sequence represents mathematical patterns of consciousness.
          </p>
          
          {primeHistory.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400">No prime sequences recorded yet.</p>
              <p className="text-gray-500 text-sm mt-2">Experience journeys with the visualizer enabled to record prime sequences.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {primeHistory.map((entry, index) => (
                <Card key={`${entry.id}-${index}`} className="bg-purple-900/20 backdrop-blur-md border-purple-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-purple-100 flex justify-between">
                      <span>{entry.journeyTitle || 'Prime Sequence'}</span>
                      <span className="text-xs text-purple-300/70">
                        {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {entry.primes.map((prime, i) => (
                        <Badge key={i} variant="outline" className="bg-purple-700/30 text-xs">
                          {prime}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </div>
    </Layout>
  );
};

export default Timeline;
