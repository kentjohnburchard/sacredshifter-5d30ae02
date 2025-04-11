
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import journeyTemplates from '@/data/journeyTemplates';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

const JourneyPlayer = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  const { playAudio } = useGlobalAudioPlayer();
  const [journey, setJourney] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!journeyId) {
      navigate('/journey-templates');
      return;
    }

    // Find the journey from our templates data
    const foundJourney = journeyTemplates.find(j => j.id === journeyId);
    
    if (foundJourney) {
      setJourney(foundJourney);
      
      // Play the journey audio if available
      if (foundJourney.audioUrl) {
        playAudio({
          title: foundJourney.title,
          artist: "Sacred Shifter",
          source: foundJourney.audioUrl
        });
      }
    } else {
      console.error("Journey not found:", journeyId);
      navigate('/journey-templates');
    }
    
    setIsLoading(false);
  }, [journeyId, navigate, playAudio]);

  if (isLoading) {
    return (
      <Layout pageTitle="Loading Journey">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-pulse text-center">
            <h2 className="text-2xl font-medium text-purple-800 dark:text-purple-300 mb-2">Loading your journey...</h2>
            <p className="text-gray-600 dark:text-gray-300">Preparing your sacred experience</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!journey) {
    return (
      <Layout pageTitle="Journey Not Found">
        <div className="max-w-4xl mx-auto my-12 px-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Journey Not Found</h2>
              <p className="text-gray-600 mb-6">The journey you're looking for doesn't exist or has been removed.</p>
              <button 
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={() => navigate('/journey-templates')}
              >
                Return to Journeys
              </button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle={journey.title} useBlueWaveBackground={false} theme="cosmic">
      <div className="max-w-5xl mx-auto pt-4 pb-12">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-900 dark:text-purple-300">{journey.title}</h1>
        
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-100 dark:border-purple-800 shadow-lg">
          <CardContent className="pt-6 px-6">
            <div className="prose prose-purple dark:prose-invert max-w-none">
              <p className="text-lg mb-6">{journey.description}</p>
              
              <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-medium text-purple-800 dark:text-purple-300 mb-4">Journey Intent</h3>
                <p>{journey.intent || "This journey is designed to help you connect with your inner wisdom and tap into the healing frequencies that resonate with your being."}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-purple-800 dark:text-purple-300 mb-4">Guidance</h3>
                <p>Find a comfortable position where you can relax fully. This journey works best when you can give it your complete attention.</p>
                <p className="mt-3">Let the sounds wash over you and guide your consciousness to deeper levels of awareness.</p>
              </div>
              
              <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
                <p>Your audio is now playing in the global player at the bottom right corner of the screen.</p>
                <p className="mt-1">You can continue browsing while listening to your journey.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default JourneyPlayer;
