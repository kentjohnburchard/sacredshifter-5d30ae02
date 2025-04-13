import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { toast } from 'sonner';
import { useJourneySongs } from '@/hooks/useJourneySongs';
import FractalAudioVisualizer from '@/components/audio/FractalAudioVisualizer';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Shuffle } from 'lucide-react';

const JourneyPlayer = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  const { playAudio, isPlaying, currentAudio, setOnEndedCallback } = useGlobalAudioPlayer();
  
  // Create all useState hooks first, before any conditional logic
  const [journey, setJourney] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visualizerMode, setVisualizerMode] = useState<'purple' | 'blue' | 'rainbow' | 'gold'>('purple');
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  // Create refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedIndex = useRef<number | null>(null);
  const songsRef = useRef<any[]>([]);
  
  // Get templates
  const { templates } = useJourneyTemplates();
  
  // Get songs for this journey using the useJourneySongs hook
  const { songs, loading: loadingSongs } = useJourneySongs(journeyId);
  
  // Setup audio analyzer for visualizer - call the hook unconditionally
  const { audioContext, analyser } = useAudioAnalyzer(audioRef);

  // Store songs in ref to access in callbacks
  useEffect(() => {
    if (songs && songs.length > 0) {
      songsRef.current = songs;
    }
  }, [songs]);
  
  // Find the audio element in the DOM after component mounts
  useEffect(() => {
    // Find the audio element being used by the global player
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioRef.current = audioElement;
    }
  }, []);

  // Function to select a random song that's not the last played one
  const selectRandomSong = () => {
    if (!songsRef.current || songsRef.current.length === 0) return null;
    
    // If only one song is available, return it
    if (songsRef.current.length === 1) return songsRef.current[0];
    
    // Get available indices excluding the lastPlayedIndex
    const availableIndices = Array.from(
      { length: songsRef.current.length },
      (_, i) => i
    ).filter(index => index !== lastPlayedIndex.current);
    
    // Select a random index from available ones
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const selectedIndex = availableIndices[randomIndex];
    
    // Save this as the last played index
    lastPlayedIndex.current = selectedIndex;
    
    return songsRef.current[selectedIndex];
  };

  // Set up track completion callback
  useEffect(() => {
    // Configure the end of track handler to play another random track
    const handleTrackEnded = () => {
      console.log("Track ended, selecting next random track");
      const nextSong = selectRandomSong();
      
      if (nextSong) {
        console.log("Playing next random song:", nextSong);
        playAudio({
          title: nextSong.title || (journey?.title + " (continued)"),
          artist: "Sacred Shifter",
          source: nextSong.audioUrl
        });
      }
    };
    
    // Register the callback with the global audio player
    if (setOnEndedCallback) {
      setOnEndedCallback(handleTrackEnded);
      
      // Cleanup the callback when component unmounts
      return () => {
        setOnEndedCallback(null);
      };
    }
  }, [journey, playAudio, setOnEndedCallback]);

  useEffect(() => {
    if (!journeyId) {
      navigate('/journey-templates');
      return;
    }

    console.log(`Loading journey player for journey ID: ${journeyId}`);
    
    // Find the journey from our templates data
    const foundJourney = templates.find(j => j.id === journeyId);
    
    if (foundJourney) {
      console.log(`Found journey:`, foundJourney);
      setJourney(foundJourney);
      
      // Only start playing audio if we haven't initialized yet and are not currently playing anything
      if (!audioInitialized && !isPlaying && !loadingSongs && songs.length > 0) {
        // Select a random song to start with
        const selectedSong = selectRandomSong();
        
        if (selectedSong) {
          console.log(`Playing initial random song for journey ${journeyId}:`, selectedSong);
          
          playAudio({
            title: selectedSong.title || foundJourney.title,
            artist: "Sacred Shifter",
            source: selectedSong.audioUrl
          });
          
          // Mark as initialized to prevent repeated playback attempts
          setAudioInitialized(true);
        }
      }
    } else {
      console.error("Journey not found:", journeyId);
      toast.error("Journey not found");
      setIsLoading(false);
    }
    
    if (!loadingSongs) {
      setIsLoading(false);
    }
  }, [journeyId, navigate, playAudio, templates, songs, loadingSongs, isPlaying, audioInitialized]);

  // Toggle visualizer on/off to save resources
  const toggleVisualizer = () => {
    setShowVisualizer(prev => !prev);
  };
  
  // Change visualizer color scheme
  const cycleVisualizerMode = () => {
    const modes: ('purple' | 'blue' | 'rainbow' | 'gold')[] = ['purple', 'blue', 'rainbow', 'gold'];
    const currentIndex = modes.indexOf(visualizerMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizerMode(modes[nextIndex]);
    toast.info(`Visualizer mode: ${modes[nextIndex]}`);
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
      {/* Fractal Audio Visualizer - audio reactive, replacing sacred geometry */}
      {showVisualizer && isPlaying && (
        <FractalAudioVisualizer
          audioContext={audioContext}
          analyser={analyser}
          isVisible={true}
          colorScheme={visualizerMode}
        />
      )}
      
      <div className="max-w-5xl mx-auto pt-4 pb-12 relative z-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-900 dark:text-purple-300">{journey.title}</h1>
        
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/30 backdrop-blur-sm"
            onClick={toggleVisualizer}
          >
            {showVisualizer ? (
              <><Eye className="h-4 w-4 mr-2" /> Hide Visual</>
            ) : (
              <><EyeOff className="h-4 w-4 mr-2" /> Show Visual</>
            )}
          </Button>
          
          {showVisualizer && isPlaying && (
            <Button
              variant="outline"
              size="sm"
              className="ml-2 bg-white/30 backdrop-blur-sm"
              onClick={cycleVisualizerMode}
            >
              Change Style
            </Button>
          )}
        </div>
        
        <div className="absolute top-4 left-4 z-20 flex items-center">
          <span className="text-xs text-purple-700 dark:text-purple-300 mr-2 bg-white/30 dark:bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
            <Shuffle className="h-3 w-3 inline mr-1" />
            Random Tracks
          </span>
          {songs.length > 0 && (
            <span className="text-xs bg-white/30 dark:bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
              {songs.length} {songs.length === 1 ? 'track' : 'tracks'}
            </span>
          )}
        </div>
        
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
