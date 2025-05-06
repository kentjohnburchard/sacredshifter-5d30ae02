import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { toast } from 'sonner';
import { useJourneySongs } from '@/hooks/useJourneySongs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Info,
  Music,
  BookOpen,
  Play,
  Pause,
  RefreshCcw,
  Volume2,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SacredGridVisualizer from '@/components/SacredGridVisualizer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useJourney } from '@/context/JourneyContext';

const JourneyPlayer = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  
  // Use the journey context
  const { 
    activeJourney, 
    startJourney, 
    completeJourney, 
    recordActivity 
  } = useJourney();
  
  const { 
    playAudio, 
    isPlaying, 
    currentAudio, 
    setOnEndedCallback, 
    togglePlayPause, 
    resetPlayer,
    currentTime,
    duration,
    seekTo,
    setVolume,
    getVolume
  } = useGlobalAudioPlayer();
  
  const [journey, setJourney] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(true);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [volume, setLocalVolume] = useState(0.8); // Default volume to 80%
  const [activeTab, setActiveTab] = useState('player');
  const [isVisualizerExpanded, setIsVisualizerExpanded] = useState(false);
  
  const lastPlayedIndex = useRef<number | null>(null);
  const songsRef = useRef<any[]>([]);
  const audioPlayAttemptedRef = useRef(false);
  const currentSongRef = useRef<any>(null);
  
  const { templates, loading: loadingTemplates, audioMappings } = useJourneyTemplates();
  const { songs, loading: loadingSongs } = useJourneySongs(journeyId);

  useEffect(() => {
    if (songs && songs.length > 0) {
      songsRef.current = songs;
      console.log("JourneyPlayer: Songs loaded:", songs.length);
    }
  }, [songs]);
  
  // Set initial volume when component mounts
  useEffect(() => {
    if (setVolume) {
      setVolume(volume);
    }
  }, [setVolume]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleVolumeChange = (newValue: number[]) => {
    const volumeValue = newValue[0];
    setLocalVolume(volumeValue);
    if (setVolume) {
      setVolume(volumeValue);
    }
    
    // Record activity
    if (journey) {
      recordActivity('adjust_volume', { volume: volumeValue });
    }
  };

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
            title: nextSong.title || (journey?.title ? journey.title + " (continued)" : "Journey Track"),
            artist: "Sacred Shifter",
            source: audioUrl,
            chakra: journey?.chakras?.[0]?.toLowerCase() || undefined,
            frequency: nextSong.frequency
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
  }, [journey, playAudio, setOnEndedCallback, recordActivity]);

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
      
      // Initialize the journey in context if not already active
      if (!activeJourney || activeJourney.id !== journeyId) {
        startJourney({
          id: foundJourney.id,
          title: foundJourney.title,
          description: foundJourney.description,
          chakra: foundJourney.chakras?.[0]
        });
      }
      
      if (!loadingSongs) {
        setIsLoading(false);
      }
    } else {
      console.error("JourneyPlayer: Journey not found:", journeyId);
      toast.error("Journey not found");
      setIsLoading(false);
    }
  }, [journeyId, navigate, templates, loadingSongs, loadingTemplates, activeJourney, startJourney]);

  useEffect(() => {
    if (audioPlayAttemptedRef.current || isLoading || loadingSongs || !journey) {
      return;
    }
    
    audioPlayAttemptedRef.current = true;
    console.log("JourneyPlayer: Attempting to initialize audio playback");
    
    if (songs && songs.length > 0) {
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
              title: selectedSong.title || (journey?.title || "Journey Track"),
              artist: "Sacred Shifter",
              source: audioUrl,
              chakra: journey?.chakras?.[0]?.toLowerCase() || "all",
              frequency: selectedSong.frequency
            });
            
            // Set volume to ensure audio is audible
            if (setVolume) {
              setVolume(volume);
            }
            
            setPlayerVisible(true);
            console.log("JourneyPlayer: Audio playback initialized with volume:", volume);
          } else {
            console.error("JourneyPlayer: Invalid audio URL in song");
            checkAudioMappingFallback();
          }
        } else {
          console.log("JourneyPlayer: No song selected for initialization");
          checkAudioMappingFallback();
        }
      }, 500);
    } else {
      checkAudioMappingFallback();
    }
  }, [journey, songs, loadingSongs, isLoading, playAudio, journeyId, audioMappings, setVolume, volume]);

  const checkAudioMappingFallback = () => {
    if (!journeyId || !audioMappings) {
      console.error("JourneyPlayer: No journey ID or audio mappings available");
      toast.error("No audio available for this journey");
      setPlayerError("No audio available. Please try another journey.");
      return;
    }
    
    const mapping = audioMappings[journeyId];
    if (mapping) {
      console.log("JourneyPlayer: Using audio mapping fallback:", mapping);
      
      let audioUrl = mapping.audioUrl;
      if (audioUrl && !audioUrl.startsWith('http')) {
        audioUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${mapping.audioFileName}`;
      }
      
      if (audioUrl) {
        playAudio({
          title: journey?.title || "Journey Track",
          artist: "Sacred Shifter",
          source: audioUrl,
          chakra: journey?.chakras?.[0]?.toLowerCase() || "all",
          frequency: undefined
        });
        
        const fallbackSong = {
          title: journey?.title || "Journey Track",
          audioUrl: audioUrl
        };
        
        currentSongRef.current = fallbackSong;
        songsRef.current = [fallbackSong];
        setPlayerVisible(true);
        toast.success("Playing journey audio");
      } else {
        toast.error("No audio available for this journey");
        setPlayerError("No audio available. Please try another journey.");
      }
    } else {
      console.error("JourneyPlayer: No audio mapping found for journey:", journeyId);
      toast.error("No audio available for this journey");
      setPlayerError("No audio available. Please try another journey.");
    }
  };

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
          resetPlayer();
          
          setTimeout(() => {
            console.log("JourneyPlayer: Playing new track:", newSong.title);
            playAudio({
              title: newSong.title || (journey?.title || "Journey Track"),
              artist: "Sacred Shifter",
              source: audioUrl,
              chakra: journey?.chakras?.[0]?.toLowerCase() || "all",
              frequency: newSong.frequency
            });
            
            // Set volume to ensure audio is audible
            if (setVolume) {
              setVolume(volume); 
            }
            
            setPlayerVisible(true);
            setPlayerError(null);
            toast.success(`Now playing: ${newSong.title || 'New track'}`);
          }, 200);
        }
      }
    } else {
      checkAudioMappingFallback();
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (isPlaying && currentAudio?.source) {
      setPlayerVisible(true);
      console.log("JourneyPlayer: Current audio source:", currentAudio.source);
      
      // Record playback activity
      if (journey && !audioPlayAttemptedRef.current) {
        recordActivity('audio_playback_started', {
          trackTitle: currentAudio.title,
          frequency: currentAudio.frequency
        });
        audioPlayAttemptedRef.current = true;
      }
    }
  }, [isPlaying, currentAudio, journey, recordActivity]);

  const handleJourneyComplete = () => {
    completeJourney();
    toast.success("Journey completed! Your progress has been saved.");
    navigate('/dashboard');
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
      <div className="max-w-5xl mx-auto p-4 relative z-10">
        <Card className="backdrop-blur-sm border border-purple-200/30 dark:border-purple-900/30 bg-white/80 dark:bg-black/60">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-300">
                {journey?.title || "Sacred Journey"}
              </h1>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setInfoExpanded(!infoExpanded);
                    recordActivity('toggle_info', { expanded: !infoExpanded });
                  }}
                  className="flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  {infoExpanded ? "Hide Details" : "Show Details"}
                </Button>
                
                <Button 
                  onClick={() => navigate('/journeys-directory')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  Back to Journeys
                </Button>
              </div>
            </div>
            
            {/* Use tabs to separate player controls from visualizer */}
            <Tabs 
              defaultValue="player" 
              value={activeTab}
              onValueChange={(tab) => {
                setActiveTab(tab);
                recordActivity('change_tab', { tab });
              }}
              className="mt-4"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="player">Player Controls</TabsTrigger>
                <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="player" className="space-y-4">
                <div className="bg-purple-100/30 dark:bg-purple-900/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex-1">
                      <p className="font-medium">
                        {currentSongRef.current?.title || currentAudio?.title || 'Selected Journey Track'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {isPlaying ? 'Playing now' : 'Paused'}
                        {playerError && <span className="text-red-500 ml-2">⚠️ {playerError}</span>}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => togglePlayPause()}
                        className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                      >
                        {isPlaying ? (
                          <><Pause className="h-4 w-4" /> Pause</>
                        ) : (
                          <><Play className="h-4 w-4" /> Play</>
                        )}
                      </Button>
                      <Button 
                        onClick={handlePlayNewTrack}
                        className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                        title="Try a different track if experiencing issues"
                      >
                        <RefreshCcw className="h-4 w-4" /> New Track
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-6">
                    <Progress value={progressPercentage} className="w-full" />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration || 0)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
                        onClick={() => seekTo(Math.max(0, currentTime - 10))}
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="default"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
                        onClick={() => seekTo(Math.min(duration, currentTime + 10))}
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      <div className="w-full max-w-[200px] flex items-center">
                        <Slider
                          value={[volume]}
                          min={0}
                          max={1}
                          step={0.01}
                          onValueChange={handleVolumeChange}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300 w-8">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
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
              </TabsContent>
              
              <TabsContent value="visualizer" className="space-y-4">
                <div className="bg-purple-100/30 dark:bg-purple-900/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                      Visual Experience
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => setIsVisualizerExpanded(!isVisualizerExpanded)}
                      className="flex items-center gap-2"
                    >
                      {isVisualizerExpanded ? (
                        <><Minimize className="h-4 w-4" /> Shrink</>
                      ) : (
                        <><Maximize className="h-4 w-4" /> Expand</>
                      )}
                    </Button>
                  </div>
                  
                  <div className={`relative ${isVisualizerExpanded ? 'h-[500px]' : 'h-[300px]'} w-full rounded-lg overflow-hidden transition-all duration-300`}>
                    <SacredGridVisualizer
                      width="100%"
                      height="100%"
                      autoConnect={true}
                      showControls={true}
                      expandable={false}
                      initialSettings={{
                        activeShapes: journey?.chakras?.[0]?.toLowerCase() === 'crown' ? ['flower-of-life', 'metatron-cube'] :
                                    journey?.chakras?.[0]?.toLowerCase() === 'third-eye' ? ['sri-yantra', 'fibonacci-spiral'] :
                                    journey?.chakras?.[0]?.toLowerCase() === 'throat' ? ['vesica-piscis', 'torus'] :
                                    journey?.chakras?.[0]?.toLowerCase() === 'heart' ? ['flower-of-life', 'torus'] :
                                    journey?.chakras?.[0]?.toLowerCase() === 'solar-plexus' ? ['metatron-cube', 'prime-spiral'] :
                                    journey?.chakras?.[0]?.toLowerCase() === 'sacral' ? ['fibonacci-spiral', 'vesica-piscis'] :
                                    journey?.chakras?.[0]?.toLowerCase() === 'root' ? ['prime-spiral', 'metatron-cube'] :
                                    ['flower-of-life', 'fibonacci-spiral'],
                        colorTheme: journey?.chakras?.[0]?.toLowerCase() === 'crown' ? 'cosmic-violet' :
                                  journey?.chakras?.[0]?.toLowerCase() === 'third-eye' ? 'cosmic-violet' :
                                  journey?.chakras?.[0]?.toLowerCase() === 'throat' ? 'ocean-depths' :
                                  journey?.chakras?.[0]?.toLowerCase() === 'heart' ? 'ethereal-mist' :
                                  journey?.chakras?.[0]?.toLowerCase() === 'solar-plexus' ? 'fire-essence' :
                                  journey?.chakras?.[0]?.toLowerCase() === 'sacral' ? 'fire-essence' :
                                  journey?.chakras?.[0]?.toLowerCase() === 'root' ? 'earth-tones' :
                                  'cosmic-violet',
                        mode: '3d',
                        chakraAlignmentMode: true,
                        sensitivity: 1.2,
                        mirrorEnabled: true,
                        brightness: 1.2,
                        symmetry: 8
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-center">
              <Button
                variant="default"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleJourneyComplete}
              >
                Complete Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default JourneyPlayer;
