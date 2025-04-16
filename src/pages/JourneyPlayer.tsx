
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
import { 
  Eye, 
  EyeOff, 
  Shuffle, 
  Play, 
  Pause, 
  ChevronDown, 
  ChevronUp,
  Info,
  Music,
  BookOpen
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PrimeNumberDisplay from '@/components/prime-display/PrimeNumberDisplay';

const JourneyPlayer = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  const { playAudio, isPlaying, currentAudio, setOnEndedCallback, togglePlayPause } = useGlobalAudioPlayer();
  
  // Create all useState hooks first, before any conditional logic
  const [journey, setJourney] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visualizerMode, setVisualizerMode] = useState<'purple' | 'blue' | 'rainbow' | 'gold'>('purple');
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [activePrimes, setActivePrimes] = useState<number[]>([]);
  const [visualizerMounted, setVisualizerMounted] = useState(false);
  
  // Create refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedIndex = useRef<number | null>(null);
  const songsRef = useRef<any[]>([]);
  const audioElementFoundRef = useRef(false);
  const initializationAttemptedRef = useRef(false);
  const audioPlayAttemptedRef = useRef(false);
  
  // Get templates
  const { templates, loading: loadingTemplates } = useJourneyTemplates();
  
  // Get songs for this journey using the useJourneySongs hook
  const { songs, loading: loadingSongs } = useJourneySongs(journeyId);

  // Find the audio element in the DOM after component mounts
  useEffect(() => {
    if (!audioElementFoundRef.current) {
      console.log("JourneyPlayer: Looking for audio element");
      // Try several methods to find the audio element
      const globalAudio = document.querySelector('#global-audio-player') || document.querySelector('audio');
      if (globalAudio) {
        audioRef.current = globalAudio as HTMLAudioElement;
        audioElementFoundRef.current = true;
        console.log("JourneyPlayer: Found audio element in the DOM:", globalAudio);
      } else {
        console.log("JourneyPlayer: Audio element not found, will create one if needed");
        // If no audio element is found, we'll create one later when needed
      }
    }
  }, []);
  
  // Setup audio analyzer for visualizer
  const { audioContext, analyser } = useAudioAnalyzer(audioRef.current);

  // Ensure only one visualizer is active by controlling mounting/unmounting
  useEffect(() => {
    // Only show visualizer when playing and component is mounted
    if (isPlaying && showVisualizer && !visualizerMounted) {
      console.log("JourneyPlayer: Mounting visualizer");
      setVisualizerMounted(true);
    } else if (!isPlaying && visualizerMounted) {
      console.log("JourneyPlayer: Unmounting visualizer (playback stopped)");
      setVisualizerMounted(false);
    }
  }, [isPlaying, showVisualizer, visualizerMounted]);

  // Store songs in ref to access in callbacks
  useEffect(() => {
    if (songs && songs.length > 0) {
      songsRef.current = songs;
      console.log("JourneyPlayer: Songs loaded:", songs.length);
    }
  }, [songs]);

  // Function to select a random song that's not the last played one
  const selectRandomSong = () => {
    if (!songsRef.current || songsRef.current.length === 0) {
      console.log("JourneyPlayer: No songs available");
      return null;
    }
    
    if (songsRef.current.length === 1) {
      console.log("JourneyPlayer: Only one song available, returning it");
      return songsRef.current[0];
    }
    
    const availableIndices = Array.from(
      { length: songsRef.current.length },
      (_, i) => i
    ).filter(index => index !== lastPlayedIndex.current);
    
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const selectedIndex = availableIndices[randomIndex];
    
    lastPlayedIndex.current = selectedIndex;
    console.log(`JourneyPlayer: Selected song index ${selectedIndex} out of ${songsRef.current.length}`);
    
    return songsRef.current[selectedIndex];
  };

  // Set up track completion callback
  useEffect(() => {
    if (!setOnEndedCallback) return;
    
    const handleTrackEnded = () => {
      console.log("JourneyPlayer: Track ended, selecting next random track");
      const nextSong = selectRandomSong();
      
      if (nextSong) {
        console.log("JourneyPlayer: Playing next random song:", nextSong);
        
        let audioUrl = nextSong.audioUrl;
        if (audioUrl && !audioUrl.startsWith('http')) {
          audioUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioUrl}`;
        }
        
        if (audioUrl) {
          playAudio({
            title: nextSong.title || (journey?.title + " (continued)"),
            artist: "Sacred Shifter",
            source: audioUrl
          });
        } else {
          console.error("JourneyPlayer: Invalid audio URL for next song");
          toast.error("Could not play next track: Invalid audio URL");
        }
      }
    };
    
    setOnEndedCallback(handleTrackEnded);
    console.log("JourneyPlayer: Set up track completion callback");
    
    return () => {
      setOnEndedCallback(null);
    };
  }, [journey, playAudio, setOnEndedCallback]);

  // Initialize journey and start audio playback
  useEffect(() => {
    if (!journeyId) {
      navigate('/journey-templates');
      return;
    }

    console.log(`JourneyPlayer: Loading journey player for journey ID: ${journeyId}`);
    
    if (loadingTemplates) {
      return;
    }
    
    const foundJourney = templates.find(j => j.id === journeyId);
    
    if (foundJourney) {
      console.log(`JourneyPlayer: Found journey:`, foundJourney);
      setJourney(foundJourney);
      
      if (!loadingSongs) {
        setIsLoading(false);
      }
    } else {
      console.error("JourneyPlayer: Journey not found:", journeyId);
      toast.error("Journey not found");
      setIsLoading(false);
    }
  }, [journeyId, navigate, templates, loadingSongs, loadingTemplates]);

  // Handle audio playback initialization separately from journey loading
  useEffect(() => {
    // Only attempt initialization once and only if we have the necessary data
    if (audioPlayAttemptedRef.current || isLoading || loadingSongs || !journey || !songs || songs.length === 0) {
      return;
    }
    
    // Mark that we've attempted audio initialization to prevent multiple tries
    audioPlayAttemptedRef.current = true;
    console.log("JourneyPlayer: Attempting to initialize audio playback");
    
    // Start playback with a slight delay to ensure DOM is ready
    setTimeout(() => {
      const selectedSong = selectRandomSong();
      
      if (selectedSong) {
        console.log(`JourneyPlayer: Playing initial random song for journey ${journeyId}:`, selectedSong);
        
        let audioUrl = selectedSong.audioUrl;
        if (audioUrl && !audioUrl.startsWith('http')) {
          audioUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioUrl}`;
          console.log("JourneyPlayer: Formatted URL:", audioUrl);
        }
        
        if (audioUrl) {
          // Ensure audio element exists before playing
          if (!audioRef.current) {
            console.log("JourneyPlayer: Creating audio element since none was found");
            const audioElement = document.createElement('audio');
            audioElement.id = 'global-audio-player';
            audioElement.style.display = 'none';
            audioElement.crossOrigin = 'anonymous';
            document.body.appendChild(audioElement);
            audioRef.current = audioElement;
            audioElementFoundRef.current = true;
          }
          
          playAudio({
            title: selectedSong.title || journey.title,
            artist: "Sacred Shifter",
            source: audioUrl
          });
          
          setAudioInitialized(true);
          console.log("JourneyPlayer: Audio playback initialized");
        } else {
          console.error("JourneyPlayer: Invalid audio URL");
          toast.error("Could not play audio: Invalid URL");
        }
      } else {
        console.log("JourneyPlayer: No song selected for initialization");
      }
    }, 500); // Increased delay for better stability
    
  }, [journey, songs, loadingSongs, isLoading, playAudio, journeyId]);

  // Toggle visualizer on/off
  const toggleVisualizer = () => {
    console.log("JourneyPlayer: Toggling visualizer, current state:", showVisualizer);
    setShowVisualizer(prev => !prev);
    if (showVisualizer) {
      setVisualizerMounted(false); // Unmount visualizer when hiding
    }
  };
  
  // Change visualizer color scheme
  const cycleVisualizerMode = () => {
    const modes: ('purple' | 'blue' | 'rainbow' | 'gold')[] = ['purple', 'blue', 'rainbow', 'gold'];
    const currentIndex = modes.indexOf(visualizerMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizerMode(modes[nextIndex]);
    toast.info(`Visualizer mode: ${modes[nextIndex]}`);
  };

  // Manually restart audio if it isn't playing
  const forcePlayAudio = () => {
    if (!isPlaying && songsRef.current && songsRef.current.length > 0 && journey) {
      const selectedSong = selectRandomSong();
      
      if (selectedSong) {
        console.log("JourneyPlayer: Force playing song:", selectedSong);
        
        let audioUrl = selectedSong.audioUrl;
        if (audioUrl && !audioUrl.startsWith('http')) {
          audioUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioUrl}`;
        }
        
        if (audioUrl) {
          playAudio({
            title: selectedSong.title || journey.title,
            artist: "Sacred Shifter",
            source: audioUrl
          });
        } else {
          console.error("JourneyPlayer: Invalid audio URL");
          toast.error("Could not play audio: Invalid URL");
        }
      }
    } else if (isPlaying) {
      togglePlayPause();
    }
  };

  // Toggle info panel expansion
  const toggleInfoPanel = () => {
    setInfoExpanded(!infoExpanded);
  };

  // Loading state - keep simple and focused on loading text
  if (isLoading || loadingSongs || loadingTemplates) {
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

  // Handle the case where the journey is not found, but make sure templates have loaded first
  if (!journey && !loadingTemplates) {
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

  const handlePrimeSequence = (primes: number[]) => {
    setActivePrimes(primes);
  };

  return (
    <Layout pageTitle={journey?.title} useBlueWaveBackground={false} theme="cosmic">
      {/* Only render visualizer when it should be mounted (controls single instance) */}
      {visualizerMounted && audioContext && analyser && (
        <FractalAudioVisualizer
          audioContext={audioContext}
          analyser={analyser}
          isVisible={true}
          colorScheme={visualizerMode}
          pauseWhenStopped={true}
          onPrimeSequence={handlePrimeSequence}
        />
      )}
      
      {isPlaying && activePrimes.length > 0 && (
        <PrimeNumberDisplay 
          primes={activePrimes} 
          sessionId={journeyId}
          journeyTitle={journey?.title}
        />
      )}
      
      <div className="max-w-5xl mx-auto pt-4 pb-12 relative z-10">
        <h1 className="text-3xl font-bold text-center mb-4 text-purple-900 dark:text-purple-300">{journey.title}</h1>
        
        <div className="absolute top-4 right-4 z-20 flex space-x-2">
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
              className="bg-white/30 backdrop-blur-sm"
              onClick={cycleVisualizerMode}
            >
              Change Style
            </Button>
          )}
          
          <Button
            variant={isPlaying ? "destructive" : "default"}
            size="sm"
            onClick={forcePlayAudio}
            className="bg-white/30 backdrop-blur-sm"
          >
            {isPlaying ? <><Pause className="h-4 w-4 mr-1" /> Pause</> : <><Play className="h-4 w-4 mr-1" /> Play</>}
          </Button>
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
        
        <Collapsible 
          open={infoExpanded} 
          onOpenChange={setInfoExpanded}
          className="mb-4"
        >
          <div className="flex justify-between items-center mb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Info className="h-4 w-4" />
                Journey Information
                {infoExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-100 dark:border-purple-800 mb-4">
                <CardContent className="pt-4 px-5">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="description">
                      <AccordionTrigger className="py-2 text-purple-700 dark:text-purple-300">
                        <span className="flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Description
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700 dark:text-gray-300">{journey.description}</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="purpose">
                      <AccordionTrigger className="py-2 text-purple-700 dark:text-purple-300">
                        <span className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Journey Intent
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700 dark:text-gray-300">
                          {journey.purpose || "This journey is designed to help you connect with your inner wisdom and tap into the healing frequencies that resonate with your being."}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="guidance">
                      <AccordionTrigger className="py-2 text-purple-700 dark:text-purple-300">
                        <span className="flex items-center gap-2">
                          <Music className="h-4 w-4" />
                          Guidance
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="text-gray-700 dark:text-gray-300">
                            Find a comfortable position where you can relax fully. This journey works best when you can give it your complete attention.
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Let the sounds wash over you and guide your consciousness to deeper levels of awareness.
                          </p>
                          
                          {journey.guidedPrompt && (
                            <div className="mt-4 bg-purple-50/50 dark:bg-purple-900/20 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Guided Prompt</h4>
                              <p className="italic text-gray-700 dark:text-gray-300">{journey.guidedPrompt}</p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="h-[60vh] flex items-center justify-center relative">
          {!showVisualizer && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/30 flex items-center justify-center">
              <div className="text-center bg-white/20 dark:bg-black/20 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl text-purple-700 dark:text-purple-300 mb-2">Visualizer Hidden</h3>
                <p className="text-gray-700 dark:text-gray-300">Click "Show Visual" to experience the full journey</p>
              </div>
            </div>
          )}
        </div>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-purple-100 dark:border-purple-800 mt-4">
          <CardContent className="py-4 px-5 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h2 className="text-lg font-medium text-purple-800 dark:text-purple-300">{journey.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your audio is playing in the global player</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-purple-300 dark:border-purple-700"
                onClick={toggleInfoPanel}
              >
                {infoExpanded ? "Hide Details" : "Show Details"}
              </Button>
              
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => navigate('/journey-templates')}
              >
                Back to Journeys
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default JourneyPlayer;
