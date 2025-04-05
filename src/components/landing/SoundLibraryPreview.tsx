
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FrequencyLibraryItem } from "@/types/frequencies";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import { PlayIcon, PauseIcon, ListMusicIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SoundLibraryPreview = () => {
  const [frequencies, setFrequencies] = useState<FrequencyLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const [playingAll, setPlayingAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFrequencies();
  }, []);

  // When playing all frequencies in sequence
  useEffect(() => {
    if (playingAll && currentPlayingIndex !== null && currentPlayingIndex < frequencies.length - 1) {
      // Set up an event listener for when the current audio finishes
      const handleAudioEnd = () => {
        setCurrentPlayingIndex(prev => {
          if (prev !== null && prev < frequencies.length - 1) {
            return prev + 1;
          } else {
            setPlayingAll(false);
            return null;
          }
        });
      };

      const audioElement = document.querySelector(`#frequency-audio-${frequencies[currentPlayingIndex]?.id}`);
      if (audioElement) {
        audioElement.addEventListener('ended', handleAudioEnd);
        return () => {
          audioElement.removeEventListener('ended', handleAudioEnd);
        };
      }
    }
  }, [playingAll, currentPlayingIndex, frequencies]);

  const fetchFrequencies = async () => {
    try {
      const { data, error } = await supabase
        .from('frequency_library')
        .select('*')
        .or('audio_url.neq.null,url.neq.null')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error("Error fetching frequencies:", error);
      } else if (data) {
        // Filter out any frequencies without valid audio URLs
        const validFrequencies = data.filter(
          freq => (freq.audio_url && freq.audio_url.trim() !== '') || 
                 (freq.url && freq.url.trim() !== '')
        );
        console.log("Found", validFrequencies.length, "frequencies with valid audio files");
        setFrequencies(validFrequencies);
      }
    } catch (err) {
      console.error("Failed to fetch frequencies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayToggle = (index: number) => {
    if (currentPlayingIndex === index) {
      // If clicking the currently playing frequency, stop it
      setCurrentPlayingIndex(null);
      setPlayingAll(false);
    } else {
      // If another frequency is playing, stop it and play the new one
      setCurrentPlayingIndex(index);
      setPlayingAll(false);
    }
  };

  const handlePlayAll = () => {
    if (playingAll) {
      // Stop playing all
      setPlayingAll(false);
      setCurrentPlayingIndex(null);
    } else {
      // Start playing from the beginning
      setPlayingAll(true);
      setCurrentPlayingIndex(0);
    }
  };

  const getChakraColor = (chakra: string | undefined): string => {
    if (!chakra) return "from-gray-400 to-gray-500";
    
    switch (chakra.toLowerCase()) {
      case 'root': return "from-red-500 to-red-600";
      case 'sacral': return "from-orange-400 to-orange-500";
      case 'solar plexus': return "from-yellow-400 to-yellow-500";
      case 'heart': return "from-green-400 to-green-500";
      case 'throat': return "from-blue-400 to-blue-500";
      case 'third eye': return "from-indigo-400 to-indigo-500";
      case 'crown': return "from-purple-400 to-violet-500";
      default: return "from-gray-400 to-gray-500";
    }
  };

  const navigateToHermeticWisdom = () => {
    navigate('/hermetic-wisdom');
  };

  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <ListMusicIcon className="h-5 w-5 text-purple-600" />
          <span>Sacred Sound Library Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Experience the healing power of sacred frequencies. Each sound is tuned to resonate with specific chakra energy centers.
        </p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        ) : frequencies.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No frequencies available at the moment.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {frequencies.map((frequency, index) => (
                <Card 
                  key={frequency.id} 
                  className="relative overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className={`h-1 bg-gradient-to-r ${getChakraColor(frequency.chakra)}`}></div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-gray-900 line-clamp-1">{frequency.title}</h3>
                    
                    {frequency.chakra && (
                      <p className="text-xs text-gray-600 mt-1">{frequency.chakra} Chakra</p>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">{frequency.frequency} Hz</p>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <FrequencyPlayer
                        id={`frequency-audio-${frequency.id}`}
                        audioUrl={frequency.audio_url}
                        url={frequency.url}
                        isPlaying={currentPlayingIndex === index}
                        onPlayToggle={() => handlePlayToggle(index)}
                        frequency={frequency.frequency}
                        frequencyId={frequency.id}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <Button 
                variant={playingAll ? "destructive" : "outline"} 
                size="sm" 
                onClick={handlePlayAll}
                className="flex items-center gap-2"
              >
                {playingAll ? (
                  <>
                    <PauseIcon className="h-4 w-4" />
                    <span>Stop All</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4" />
                    <span>Play All</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="default"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                onClick={navigateToHermeticWisdom}
              >
                Explore Full Library
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SoundLibraryPreview;
