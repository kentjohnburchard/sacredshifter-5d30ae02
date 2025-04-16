import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { toast } from 'sonner';
import { useJourneySongs } from '@/hooks/useJourneySongs';
import { Button } from '@/components/ui/button';
import { 
  Info,
  Music,
  BookOpen,
  Play,
  Pause,
  RefreshCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FloatingCosmicPlayer from '@/components/audio/FloatingCosmicPlayer';

const JourneyPlayer = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  const { playAudio, isPlaying, currentAudio, setOnEndedCallback, togglePlayPause, resetPlayer } = useGlobalAudioPlayer();
  
  const [journey, setJourney] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  
  const lastPlayedIndex = useRef<number | null>(null);
  const songsRef = useRef<any[]>([]);
  const audioPlayAttemptedRef = useRef(false);
  const currentSongRef = useRef<any>(null);
  
  const { templates, loading: loadingTemplates } = useJourneyTemplates();
  const { songs, loading: loadingSongs } = useJourneySongs(journeyId);

  useEffect(() => {
    if (songs && songs.length > 0) {
      songsRef.current = songs;
      console.log("JourneyPlayer: Songs loaded:", songs.length);
    }
  }, [songs]);

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

  useEffect(() => {
    if (!setOnEndedCallback) return;
    
    const handleTrackEnded = () => {
      console.log("JourneyPlayer: Track ended, selecting next random track");
      const nextSong = selectRandomSong();
      
      if (nextSong) {
        console.log("JourneyPlayer: Playing next random song:", nextSong);
        currentSongRef.current = nextSong;
        
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
          setPlayerVisible(true);
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

  // Separate useEffect to avoid rendering issues
  useEffect(() => {
    // Only attempt to play audio when we're sure we have all needed data
    if (!isLoading && !loadingSongs && journey && songs && songs.length > 0 && !audioPlayAttemptedRef.current) {
      audioPlayAttemptedRef.current = true;
      console.log("JourneyPlayer: Attempting to initialize audio playback");
      
      // Add a small delay to ensure everything is ready
      setTimeout(() => {
        const selectedSong = selectRandomSong();
        
        if (selectedSong) {
          console.log(`JourneyPlayer: Playing initial random song for journey ${journeyId}:`, selectedSong);
          currentSongRef.current = selectedSong;
          
          let audioUrl = selectedSong.audioUrl;
          if (audioUrl && !audioUrl.startsWith('http')) {
            audioUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioUrl}`;
            console.log("JourneyPlayer: Formatted URL:", audioUrl);
          }
          
          if (audioUrl) {
            playAudio({
              title: selectedSong.title || journey.title,
              artist: "Sacred Shifter",
              source: audioUrl
            });
            
            setPlayerVisible(true);
            console.log("JourneyPlayer: Audio playback initialized and player made visible");
          } else {
            console.error("JourneyPlayer: Invalid audio URL");
            toast.error("Could not play audio: Invalid URL");
          }
        } else {
          console.log("JourneyPlayer: No song selected for initialization");
        }
      }, 500);
    }
  }, [journey, songs, loadingSongs, isLoading, playAudio, journeyId]);

  const handlePlayNewTrack = () => {
    if (songsRef.current && songsRef.current.length > 0) {
      const newSong = selectRandomSong();
      
      if (newSong) {
        currentSongRef.current = newSong;
        
        let audioUrl = newSong.audioUrl;
        if (audioUrl && !audioUrl.startsWith('http')) {
          audioUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioUrl}`;
        }
        
        if (audioUrl) {
          // Reset player completely before playing new track to avoid issues
          resetPlayer();
          
          setTimeout(() => {
            playAudio({
              title: newSong.title || journey.title,
              artist: "Sacred Shifter",
              source: audioUrl
            });
            
            setPlayerVisible(true);
            setPlayerError(null);
            toast.success(`Now playing: ${newSong.title || 'New track'}`);
          }, 200);
        }
      }
    }
  };

  const handlePlayerError = (error: any) => {
    console.error("Journey player error:", error);
    setPlayerError("Player encountered an error. Try playing a different track.");
    toast.error("Audio player error. Try a different track.");
  };

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

  return (
    <Layout pageTitle={journey?.title || "Sacred Journey"}>
      <div className="max-w-4xl mx-auto p-4 relative z-10">
        <Card className="backdrop-blur-sm border border-purple-200/30 dark:border-purple-900/30 bg-white/80 dark:bg-black/60">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-300">
                {journey?.title || "Sacred Journey"}
              </h1>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setInfoExpanded(!infoExpanded)}
                  className="flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  {infoExpanded ? "Hide Details" : "Show Details"}
                </Button>
                
                <Button 
                  onClick={() => navigate('/journey-templates')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  Back to Journeys
                </Button>
              </div>
            </div>
            
            {/* Add manual player controls for backup */}
            <div className="bg-purple-100/30 dark:bg-purple-900/30 p-4 rounded-lg mb-6 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">
                  {currentSongRef.current?.title || 'Selected Journey Track'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isPlaying ? 'Playing now' : 'Paused'}
                  {playerError && <span className="text-red-500 ml-2">⚠️ {playerError}</span>}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => togglePlayPause()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isPlaying ? (
                    <><Pause className="h-4 w-4 mr-2" /> Pause</>
                  ) : (
                    <><Play className="h-4 w-4 mr-2" /> Play</>
                  )}
                </Button>
                <Button 
                  onClick={handlePlayNewTrack}
                  className="bg-indigo-600 hover:bg-indigo-700"
                  title="Try a different track if experiencing issues"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" /> New Track
                </Button>
              </div>
            </div>
            
            {infoExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg p-6"
              >
                {journey?.description && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">
                      About This Journey
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {journey.description}
                    </p>
                  </div>
                )}
                
                <Accordion type="single" collapsible>
                  <AccordionItem value="tips">
                    <AccordionTrigger className="text-purple-800 dark:text-purple-300">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5" />
                        Tips for the Best Experience
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Wear headphones for optimal binaural effects</li>
                        <li>Find a quiet, comfortable space</li>
                        <li>Close your eyes and focus on your breath</li>
                        <li>Allow the frequencies to resonate through your body</li>
                        <li>Notice any sensations or images that arise</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="playlist">
                    <AccordionTrigger className="text-purple-800 dark:text-purple-300">
                      <div className="flex items-center">
                        <Music className="mr-2 h-5 w-5" />
                        Audio Tracks ({songs?.length || 0})
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {songs && songs.length > 0 ? (
                        <div className="space-y-2">
                          {songs.map((song, index) => (
                            <div 
                              key={index} 
                              className="flex justify-between items-center p-2 rounded bg-white/50 dark:bg-gray-800/50"
                            >
                              <span>{song.title || `Track ${index + 1}`}</span>
                              <span className="text-sm text-gray-500">
                                {song.duration ? `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, '0')}` : '~3:00'}
                              </span>
                            </div>
                          ))}
                          <p className="text-sm text-gray-500 mt-2">
                            Tracks will continue playing in the Sacred Audio Player
                          </p>
                        </div>
                      ) : (
                        <p>No audio tracks available for this journey.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Always show the Floating Cosmic Player when audio is playing */}
      {playerVisible && currentSongRef.current && (
        <FloatingCosmicPlayer
          audioUrl={currentSongRef.current.audioUrl}
          title={currentSongRef.current.title || journey?.title}
          description={journey?.description || "Sacred sound journey"}
          initiallyVisible={true}
          chakra={journey?.chakras?.[0]?.toLowerCase() || "all"}
          initialShape={journey?.id === 'trinity-journey' ? 'metatrons-cube' : 
                      journey?.id === 'dna-healing' ? 'flower-of-life' :
                      journey?.id === 'cosmic-connection' ? 'sri-yantra' : 'torus'}
          initialColorTheme={'cosmic-purple'}
          initialIsExpanded={false}
        />
      )}
    </Layout>
  );
};

export default JourneyPlayer;
