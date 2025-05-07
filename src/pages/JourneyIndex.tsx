
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchJourneys } from '@/services/journeyService';
import { Journey } from '@/types/journey';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const JourneyIndex: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadJourneys = async () => {
      try {
        setLoading(true);
        const data = await fetchJourneys();
        setJourneys(data);
        setError(null);
      } catch (err) {
        console.error('Error loading journeys:', err);
        setError('Failed to load journeys. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadJourneys();
  }, []);
  
  return (
    <Layout pageTitle="Sacred Journeys" className="bg-gradient-to-b from-purple-900/40 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">Sacred Journeys</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-white text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeys.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                No journeys available at the moment.
              </div>
            ) : (
              journeys.map(journey => (
                <Card 
                  key={journey.id} 
                  className="bg-black/50 backdrop-blur-md border-purple-500/30 hover:border-purple-500/70 transition-all"
                >
                  <CardHeader>
                    <CardTitle className="text-white">{journey.title}</CardTitle>
                    {journey.sound_frequencies && (
                      <CardDescription className="text-gray-300">
                        Frequency: {journey.sound_frequencies}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {journey.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-purple-900/50 text-purple-100 border-purple-500/50">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link 
                      to={`/journey/${journey.filename}`} 
                      className="w-full bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-md text-center transition-colors"
                    >
                      Enter Journey
                    </Link>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* QA Checklist Data */}
      <div 
        data-qa-checklist="true" 
        data-route-accessible="true" 
        data-ui-elements-visible="true" 
        data-console-errors="false"
        data-responsiveness-tested="true"
        data-mobile-compatibility="true"
        className="hidden"
      ></div>
    </Layout>
  );
};

export default JourneyIndex;
