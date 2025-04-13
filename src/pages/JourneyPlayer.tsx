
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { toast } from 'sonner';
import { useJourneySongs } from '@/hooks/useJourneySongs';
import { SacredGeometryVisualizer } from '@/components/sacred-geometry';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';

const JourneyPlayer = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  const { playAudio, isPlaying, currentAudio } = useGlobalAudioPlayer();
  const [journey, setJourney] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { templates } = useJourneyTemplates();
  const [visualizerMode, setVisualizerMode] = useState<'fractal' | 'spiral' | 'mandala'>('fractal');
  const [showVisualizer, setShowVisualizer] = useState(true);
  
  // Create a ref for the audio element used by the global player
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Get songs for this journey using the useJourneySongs hook
  const { songs, loading: loadingSongs } = useJourneySongs(journeyId);

  // Find the audio element in the DOM after component mounts
  useEffect(() => {
    // Find the audio element being used by the global player
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioRef.current = audioElement;
    }
  }, []);
  
  // Setup audio analyzer for visualizer - only if visualizer is shown and audio is playing
  const shouldUseAudioAnalyzer = showVisualizer && isPlaying && audioRef.current !== null;
  const { audioContext, analyser } = shouldUseAudioAnalyzer ? useAudioAnalyzer(audioRef) : { audioContext: null, analyser: null };

  useEffect(() => {
    if (!journeyId) {
      navigate('/journey-templates');
      return;
    }

    console.log(`Loading journey player for journey ID: ${journeyId}`);
    console.log(`Available templates:`, templates.map(t => t.id));
    
    // Find the journey from our templates data
    const foundJourney = templates.find(j => j.id === journeyId);
    
    if (foundJourney) {
      console.log(`Found journey:`, foundJourney);
      setJourney(foundJourney);
      
      // Check if we already have this journey playing
      const isCurrentJourneyPlaying = currentAudio && 
        currentAudio.title?.includes(foundJourney.title);
      
      // Only start a new audio if not already playing this journey's audio
      if (!isCurrentJourneyPlaying) {
        // Wait for songs to load before trying to play
        if (!loadingSongs && songs.length > 0) {
          // Choose a random song from the available ones
          const randomIndex = Math.floor(Math.random() * songs.length);
          const selectedSong = songs[randomIndex];
          
          console.log(`Playing random song (${randomIndex + 1}/${songs.length}) for journey ${journeyId}:`, selectedSong);
          
          playAudio({
            title: selectedSong.title || foundJourney.title,
            artist: "Sacred Shifter",
            source: selectedSong.audioUrl
          });
        } else if (!loadingSongs && songs.length === 0) {
          console.error(`No songs found for journey ID: ${journeyId}`);
          toast.error("No audio available for this journey");
        }
      }
    } else {
      console.error("Journey not found:", journeyId);
      toast.error("Journey not found");
      // Don't navigate away - show the error UI instead
      setIsLoading(false);
    }
    
    if (!loadingSongs) {
      setIsLoading(false);
    }
  }, [journeyId, navigate, playAudio, templates, songs, loadingSongs, currentAudio]);

  // Create a container style with explicit height for the visualizer that floats above all content
  const visualizerContainerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none' as const,
    zIndex: 50  // Higher z-index to float above content but below UI controls
  };

  // Toggle visualizer on/off to save resources
  const toggleVisualizer = () => {
    setShowVisualizer(prev => !prev);
  };

  if (isLoading || loadingSongs) {
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
    <Layout pageTitle={journey?.title} useBlueWaveBackground={false} theme="cosmic">
      {/* Fixed container for the visualizer with explicit dimensions - floating above content */}
      {showVisualizer && isPlaying && (
        <div style={visualizerContainerStyle}>
          <SacredGeometryVisualizer 
            audioContext={audioContext}
            analyser={analyser}
            isVisible={true}
            chakra={journey?.chakras?.[0]}
            mode={visualizerMode}
            showControls={false}
          />
        </div>
      )}
      
      <div className="max-w-5xl mx-auto pt-4 pb-12 relative z-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-900 dark:text-purple-300">{journey.title}</h1>
        
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-100 dark:border-purple-800 shadow-lg">
          <CardContent className="pt-6 px-6">
            <div className="prose prose-purple dark:prose-invert max-w-none">
              <p className="text-lg mb-6">{journey.description}</p>
              
              <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-medium text-purple-800 dark:text-purple-300 mb-4">Journey Intent</h3>
                <p>{journey.purpose || "This journey is designed to help you connect with your inner wisdom and tap into the healing frequencies that resonate with your being."}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-purple-800 dark:text-purple-300 mb-4">Guidance</h3>
                <p>Find a comfortable position where you can relax fully. This journey works best when you can give it your complete attention.</p>
                <p className="mt-3">Let the sounds wash over you and guide your consciousness to deeper levels of awareness.</p>
                
                {journey.guidedPrompt && (
                  <div className="mt-4 bg-purple-50/50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-2">Guided Prompt</h4>
                    <p className="italic">{journey.guidedPrompt}</p>
                  </div>
                )}
              </div>
              
              <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
                <p>Your audio is now playing in the global player.</p>
                <p className="mt-1">You can continue browsing while listening to your journey.</p>
                <button 
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  onClick={() => navigate('/journey-templates')}
                >
                  Back to Journeys
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default JourneyPlayer;
