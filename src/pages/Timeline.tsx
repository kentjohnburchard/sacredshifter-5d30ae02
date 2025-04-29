
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import TimelineViewer from '@/components/timeline/TimelineViewer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Clock, BookOpen, Filter, Star, Calendar } from 'lucide-react';

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
      <div className="container mx-auto py-6 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 text-shadow-lg">
            Your Sacred Journey
          </h1>
          <p className="mt-2 text-gray-300 max-w-2xl text-shadow-sm">
            Witness your evolution across time and space. Each entry marks a sacred shift in your consciousness,
            aligned with cosmic rhythms and your soul's progression.
          </p>
        </motion.div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-gray-800/30 backdrop-blur-sm">
            <TabsTrigger value="journey" className="flex items-center gap-1.5 data-[state=active]:bg-purple-700/80 text-shadow-sm">
              <Calendar className="h-4 w-4" />
              Journey Timeline
            </TabsTrigger>
            <TabsTrigger value="primes" className="flex items-center gap-1.5 data-[state=active]:bg-purple-700/80 text-shadow-sm">
              <Star className="h-4 w-4" />
              Prime Sequences
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TabsContent value="journey" className="bg-black/20 backdrop-blur-sm text-white p-6 rounded-lg border border-gray-800/30">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-gray-300 max-w-2xl text-shadow-sm">
                  Track your frequency shifts and consciousness expansion through your personal timeline.
                  Your journey is unique and evolving with each experience.
                </p>
              </div>
            </div>
            <TimelineViewer />
          </TabsContent>
          
          <TabsContent value="primes" className="bg-black/20 backdrop-blur-sm text-white p-6 rounded-lg border border-gray-800/30">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2 flex items-center gap-2 text-shadow-md">
                <Star className="h-5 w-5 text-amber-400" />
                Sacred Prime Sequences
              </h2>
              <p className="text-gray-300 text-shadow-sm">
                Your sacred prime number sequences visualized during frequency journeys.
                Each sequence represents mathematical patterns of consciousness.
              </p>
            </div>
            
            {primeHistory.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/20 flex items-center justify-center">
                  <Star className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-200 text-shadow-sm">No Prime Sequences Recorded Yet</h3>
                <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto text-shadow-xs">
                  Experience journeys with the visualizer enabled to record your unique prime number sequences.
                  These sequences reflect cosmic mathematical patterns unique to your consciousness.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {primeHistory.map((entry, index) => (
                  <motion.div
                    key={`${entry.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-purple-900/10 backdrop-blur-md border-purple-500/20 overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400/40 to-blue-400/40" />
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-purple-100 flex justify-between text-shadow-sm">
                          <span>{entry.journeyTitle || 'Prime Sequence'}</span>
                          <div className="flex items-center text-xs text-purple-300/70 text-shadow-xs">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {entry.primes.map((prime, i) => (
                            <Badge key={i} variant="outline" className="bg-purple-700/20 text-xs border-purple-500/30">
                              {prime}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Timeline;
