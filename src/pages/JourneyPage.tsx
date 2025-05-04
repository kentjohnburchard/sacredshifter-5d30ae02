
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ReactMarkdown from 'react-markdown';
import { fetchJourneyBySlug, Journey } from '@/services/journeyService';
import JourneySoundscapePlayer from '@/components/journey/JourneySoundscapePlayer';
import SacredGeometryVisualizer from '@/components/sacred-geometry/SacredGeometryVisualizer';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import { useSpiralParams } from '@/hooks/useSpiralParams';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { removeFrontmatter, chakraToBackgroundClass } from '@/utils/journeyLoader';

const JourneyPage: React.FC = () => {
  const { slug = '' } = useParams();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const spiralParams = useSpiralParams(slug);
  const [bgClass, setBgClass] = useState<string>('bg-gradient-to-br from-purple-900/20 to-black');

  useEffect(() => {
    const loadJourney = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!slug) {
          setError("Journey not found");
          return;
        }
        
        // Fetch journey data from Supabase
        const journeyData = await fetchJourneyBySlug(slug);
        
        if (!journeyData) {
          setError("Journey not found");
          return;
        }
        
        setJourney(journeyData);
        
        // Determine background class based on chakra if available
        if (journeyData.tags) {
          const tags = journeyData.tags.split(',').map(tag => tag.trim().toLowerCase());
          const chakraTags = tags.filter(tag => 
            ['root', 'sacral', 'solar plexus', 'heart', 'throat', 'third eye', 'crown'].includes(tag)
          );
          
          if (chakraTags.length > 0) {
            setBgClass(chakraToBackgroundClass(chakraTags[0]));
          }
        }
        
        // Also try to fetch markdown content if available
        try {
          const response = await fetch(`/src/core_content/journeys/journey_${slug}.md`);
          if (response.ok) {
            const markdownContent = await response.text();
            setContent(removeFrontmatter(markdownContent));
          }
        } catch (mdErr) {
          console.log('No markdown file found, using database content');
        }
      } catch (err) {
        console.error("Error fetching journey:", err);
        setError("Error loading journey");
      } finally {
        setLoading(false);
      }
    };
    
    loadJourney();
  }, [slug]);

  if (loading) {
    return (
      <Layout pageTitle="Loading Journey...">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        </div>
      </Layout>
    );
  }

  if (error || !journey) {
    return (
      <Layout pageTitle="Journey Not Found">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Journey Not Found</h1>
            <p className="mt-4">The journey you are looking for could not be found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle={journey.title} className={bgClass}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{journey.title}</h1>
          {journey.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {journey.tags.split(',').map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="journey" className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="journey">Journey</TabsTrigger>
                <TabsTrigger value="details">Details & Preparation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="journey" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    {content ? (
                      <ReactMarkdown>
                        {content}
                      </ReactMarkdown>
                    ) : (
                      <>
                        {journey.intent && (
                          <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Intent</h2>
                            <p className="text-gray-700 dark:text-gray-300">{journey.intent}</p>
                          </div>
                        )}
                        
                        {journey.sound_frequencies && (
                          <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Recommended Sound Frequencies</h2>
                            <p className="text-gray-700 dark:text-gray-300">{journey.sound_frequencies}</p>
                          </div>
                        )}
                        
                        {journey.script && (
                          <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Script</h2>
                            <blockquote className="border-l-4 pl-4 italic border-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700 p-3 rounded">
                              {journey.script.split("\n").map((line, i) => (
                                <p key={i} className="my-2">{line}</p>
                              ))}
                            </blockquote>
                          </div>
                        )}
                        
                        {journey.notes && (
                          <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Notes</h2>
                            <p className="text-gray-700 dark:text-gray-300">{journey.notes}</p>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {journey.description && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Description</h3>
                          <p className="text-gray-700 dark:text-gray-300">{journey.description}</p>
                        </div>
                      )}
                      
                      {journey.duration && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Duration</h3>
                          <p className="text-gray-700 dark:text-gray-300">{journey.duration}</p>
                        </div>
                      )}
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-3">Environment Preparation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {journey.env_lighting && (
                            <div>
                              <h4 className="font-medium text-sm uppercase tracking-wider text-purple-700 dark:text-purple-300">Lighting</h4>
                              <p className="text-gray-700 dark:text-gray-300">{journey.env_lighting}</p>
                            </div>
                          )}
                          
                          {journey.env_temperature && (
                            <div>
                              <h4 className="font-medium text-sm uppercase tracking-wider text-purple-700 dark:text-purple-300">Temperature</h4>
                              <p className="text-gray-700 dark:text-gray-300">{journey.env_temperature}</p>
                            </div>
                          )}
                          
                          {journey.env_incense && (
                            <div>
                              <h4 className="font-medium text-sm uppercase tracking-wider text-purple-700 dark:text-purple-300">Incense</h4>
                              <p className="text-gray-700 dark:text-gray-300">{journey.env_incense}</p>
                            </div>
                          )}
                          
                          {journey.env_posture && (
                            <div>
                              <h4 className="font-medium text-sm uppercase tracking-wider text-purple-700 dark:text-purple-300">Posture</h4>
                              <p className="text-gray-700 dark:text-gray-300">{journey.env_posture}</p>
                            </div>
                          )}
                        </div>
                        
                        {journey.env_tools && (
                          <div className="mt-4">
                            <h4 className="font-medium text-sm uppercase tracking-wider text-purple-700 dark:text-purple-300">Optional Tools</h4>
                            <p className="text-gray-700 dark:text-gray-300">{journey.env_tools}</p>
                          </div>
                        )}
                      </div>
                      
                      {journey.recommended_users && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Recommended For</h3>
                          <p className="text-gray-700 dark:text-gray-300">{journey.recommended_users}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="mb-8">
                <CardContent className="p-0 h-[300px] relative overflow-hidden">
                  <SpiralVisualizer 
                    params={{
                      coeffA: spiralParams?.coeffA ?? 4,
                      coeffB: spiralParams?.coeffB ?? 4,
                      coeffC: spiralParams?.coeffC ?? 1.3,
                      freqA: spiralParams?.freqA ?? 44,
                      freqB: spiralParams?.freqB ?? -17,
                      freqC: spiralParams?.freqC ?? -54,
                      color: spiralParams?.color,
                      opacity: spiralParams?.opacity,
                      speed: spiralParams?.speed,
                    }}
                    containerId="journeySpiral"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <JourneySoundscapePlayer journeySlug={slug} autoPlay={false} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JourneyPage;
