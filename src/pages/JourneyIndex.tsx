
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchJourneys } from '@/services/journeyService';
import { Journey } from '@/types/journey';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Info, BookOpen } from 'lucide-react';
import { getAllJourneys } from '@/utils/coreJourneyLoader';
import { normalizeStringArray } from '@/utils/parsers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';

const JourneyIndex: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredJourney, setFeaturedJourney] = useState<Journey | null>(null);
  
  useEffect(() => {
    const loadJourneys = async () => {
      try {
        setIsLoading(true);
        // First load journeys from the database
        const dbJourneys = await fetchJourneys();
        
        // Then combine with journeys from core_content
        const allJourneys = await getAllJourneys(dbJourneys);
        
        console.log(`Loaded ${allJourneys.length} total journeys (${dbJourneys.length} from DB, ${allJourneys.length - dbJourneys.length} from core_content)`);
        
        // Find the Akashic Reconnection journey and set it as featured
        const akashicJourney = allJourneys.find(j => 
          j.filename === 'journey_akashic_reconnection' || 
          j.title?.includes('Akashic') || 
          j.tags?.some(t => t.toLowerCase().includes('akashic'))
        );
        
        if (akashicJourney) {
          setFeaturedJourney(akashicJourney);
        } else if (allJourneys.length > 0) {
          // If no Akashic journey, use the first one as featured
          setFeaturedJourney(allJourneys[0]);
        }
        
        setJourneys(allJourneys);
        setError(null);
      } catch (err) {
        console.error('Error loading journeys:', err);
        setError('Failed to load journeys. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJourneys();
  }, []);
  
  return (
    <PageLayout title="Sacred Journeys" className="bg-gradient-to-b from-purple-900/40 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">Sacred Journey Index</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-white text-center">
            {error}
          </div>
        ) : (
          <>
            {featuredJourney && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-purple-300">Featured Journey</h2>
                <Card className="bg-black/60 backdrop-blur-md border-purple-500/50 overflow-hidden">
                  <div className="relative h-40 overflow-hidden">
                    <JourneyAwareSpiralVisualizer 
                      journeyId={featuredJourney.id || featuredJourney.filename}
                      className="absolute inset-0"
                      showControls={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                      <div className="p-4">
                        <h3 className="text-2xl font-bold text-white">{featuredJourney.title}</h3>
                        {featuredJourney.sound_frequencies && (
                          <p className="text-purple-300 text-sm">Frequency: {featuredJourney.sound_frequencies}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {normalizeStringArray(featuredJourney.tags).map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-purple-900/50 text-purple-100 border-purple-500/50">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                    {featuredJourney.description && (
                      <p className="text-gray-300 mb-4">{featuredJourney.description}</p>
                    )}
                    <Link 
                      to={`/journey/${featuredJourney.filename || featuredJourney.id}`}
                      className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      <BookOpen className="h-4 w-4" />
                      Enter This Journey
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {journeys.length === 0 && !featuredJourney && (
              <Alert className="mb-6 bg-amber-500/20 border border-amber-500/50">
                <Info className="h-4 w-4" />
                <AlertTitle>No journeys found</AlertTitle>
                <AlertDescription>
                  There are no journeys available at the moment. Check back later or contact an administrator.
                </AlertDescription>
              </Alert>
            )}
            
            <h2 className="text-2xl font-bold mb-4 text-purple-300">All Sacred Journeys</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {journeys.map(journey => (
                <Card 
                  key={`${journey.id || journey.filename}`}
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
                      {normalizeStringArray(journey.tags || []).map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-purple-900/50 text-purple-100 border-purple-500/50">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                    {journey.description && (
                      <p className="text-sm text-gray-300 mt-2">{journey.description}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link 
                      to={`/journey/${journey.filename || journey.id}`} 
                      className="w-full bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-md text-center transition-colors"
                    >
                      Enter Journey
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default JourneyIndex;
