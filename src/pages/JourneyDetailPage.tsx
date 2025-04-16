
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Music, Info, Clock, Check } from 'lucide-react';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import { useJourneySongs } from '@/hooks/useJourneySongs';
import JourneySongList from '@/components/frequency-journey/JourneySongList';
import { toast } from 'sonner';
import { JourneyTemplate } from '@/data/journeyTemplates';

const JourneyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { templates, loading: templatesLoading, audioMappings } = useJourneyTemplates();
  const { songs, loading: songsLoading } = useJourneySongs(id);
  const [journeyTemplate, setJourneyTemplate] = useState<JourneyTemplate | null>(null);

  useEffect(() => {
    if (!templatesLoading && templates.length > 0 && id) {
      const template = templates.find(t => t.id === id);
      if (template) {
        setJourneyTemplate(template);
      } else {
        toast.error("Journey template not found");
        navigate('/journey-templates');
      }
    }
  }, [id, templates, templatesLoading, navigate]);

  const getChakraColor = (chakra: string) => {
    const chakraColors = {
      'root': 'bg-red-500',
      'sacral': 'bg-orange-500',
      'solar plexus': 'bg-yellow-500',
      'heart': 'bg-green-500',
      'throat': 'bg-blue-500',
      'third eye': 'bg-indigo-500',
      'crown': 'bg-purple-500',
      'all': 'bg-gradient-to-r from-red-500 via-green-500 to-purple-500'
    };
    return chakraColors[chakra?.toLowerCase()] || 'bg-purple-500';
  };

  const handleBeginJourney = () => {
    if (journeyTemplate) {
      navigate(`/journey-player/${journeyTemplate.id}`);
    }
  };

  if (templatesLoading || !journeyTemplate) {
    return (
      <Layout pageTitle="Loading Journey Details..." theme="cosmic">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin h-12 w-12 border-4 border-t-transparent border-purple-500 rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle={`${journeyTemplate.title} - Journey Details`} theme="cosmic">
      <div className="max-w-5xl mx-auto py-6 px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/journey-templates')}
            className="mr-4 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{journeyTemplate.title}</h1>
            <p className="text-gray-300">{journeyTemplate.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-black/30 backdrop-blur-sm border border-purple-500/20 mb-6">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <div className="text-4xl mr-4">{journeyTemplate.emoji}</div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Journey Description</h2>
                    <p className="text-gray-300">{journeyTemplate.description}</p>
                  </div>
                </div>

                {journeyTemplate.purpose && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-white mb-1">Purpose</h3>
                    <p className="text-gray-300">{journeyTemplate.purpose}</p>
                  </div>
                )}

                {journeyTemplate.affirmation && (
                  <div className="my-6 p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-2">Affirmation</h3>
                    <p className="text-lg text-purple-200 italic">"{journeyTemplate.affirmation}"</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {journeyTemplate.chakras && journeyTemplate.chakras.map(chakra => (
                    <Badge 
                      key={chakra}
                      className={`text-sm ${getChakraColor(chakra)}`}
                    >
                      {chakra} Chakra
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 mt-6">
                  <Button
                    onClick={handleBeginJourney}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Play className="mr-2 h-4 w-4" /> Begin Journey
                  </Button>
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{journeyTemplate.duration || 10} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Journey Audio Tracks</h2>
              <JourneySongList 
                songs={songs} 
                journeyId={journeyTemplate.id} 
                journeyTitle={journeyTemplate.title} 
                loading={songsLoading}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-black/30 backdrop-blur-sm border border-purple-500/20 mb-6 sticky top-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Journey Details</h2>
                <div className="space-y-4">
                  {journeyTemplate.frequencies && journeyTemplate.frequencies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Frequencies</h3>
                      <ul className="list-disc pl-5 text-gray-300">
                        {journeyTemplate.frequencies.map((freq, i) => (
                          <li key={i}>{freq.name}: {freq.value} Hz</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {journeyTemplate.features && journeyTemplate.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Features</h3>
                      <ul className="space-y-2">
                        {journeyTemplate.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-gray-300">
                            <Check className="h-4 w-4 mr-2 text-green-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {journeyTemplate.soundSources && journeyTemplate.soundSources.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Sound Sources</h3>
                      <ul className="space-y-2">
                        {journeyTemplate.soundSources.map((source, i) => (
                          <li key={i} className="flex items-center text-gray-300">
                            <Music className="h-4 w-4 mr-2 text-blue-400" />
                            {source}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JourneyDetailPage;
