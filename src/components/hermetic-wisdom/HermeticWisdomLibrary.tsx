
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { HermeticPrincipleCard } from "@/components/hermetic-wisdom";
import { hermeticJourneys } from "@/data/hermeticJourneys";
import { Sparkles, FileAudio, MusicIcon, Headphones } from "lucide-react";
import { HermeticTrack } from "@/types/playlist";
import { getTracksForPrinciple } from "@/services/hermeticPlaylistService";
import { useNavigate } from "react-router-dom";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { FrequencyLibraryItem } from "@/types/frequencies";

const HermeticWisdomLibrary = () => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<FrequencyLibraryItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  // Fetch frequencies related to Hermetic Principles
  const { data: frequencies, isLoading } = useQuery({
    queryKey: ["hermetic-frequencies"],
    queryFn: async () => {
      try {
        // First, try to get frequencies with associated audio files
        const { data: audioFrequencies, error: audioFreqError } = await supabase
          .from('frequency_audio_files')
          .select(`
            id,
            frequency_id,
            filename,
            title,
            description,
            frequency_library(*)
          `)
          .limit(20);

        if (audioFreqError) {
          console.error("Error fetching audio frequencies:", audioFreqError);
        } else if (audioFrequencies && audioFrequencies.length > 0) {
          console.log("Found frequencies with audio files:", audioFrequencies);
          
          // Map to the expected FrequencyLibraryItem format
          const mappedFrequencies = audioFrequencies.map(item => {
            const freqData = item.frequency_library as FrequencyLibraryItem;
            return {
              ...freqData,
              audio_url: item.filename, // Use the filename from the audio_files table
              title: item.title || freqData.title,
              description: item.description || freqData.description,
            };
          }).filter(f => f); // Filter out any null values
          
          if (mappedFrequencies.length > 0) {
            return mappedFrequencies as FrequencyLibraryItem[];
          }
        }
        
        // Fallback to standard frequency library
        const { data, error } = await supabase
          .from('frequency_library')
          .select('*')
          .limit(20); 
        
        if (error) {
          console.error("Error fetching frequencies:", error);
          return [];
        }
        
        // Filter to only the frequencies that might be related to Hermetic principles
        const hermeticFrequencies = data.filter(freq => 
          freq.tags?.some((tag: string) => tag.toLowerCase().includes('hermetic')) ||
          freq.category?.toLowerCase().includes('hermetic') ||
          freq.title?.toLowerCase().includes('hermetic')
        ) || data;
        
        console.log("Found Hermetic frequencies:", hermeticFrequencies);
        return hermeticFrequencies as FrequencyLibraryItem[];
      } catch (err) {
        console.error("Failed to fetch Hermetic frequencies:", err);
        return [];
      }
    }
  });

  // Principle icons mapping
  const principleIcons = {
    "Mentalism": Sparkles,
    "Correspondence": Headphones,
    "Vibration": MusicIcon,
    "Polarity": FileAudio,
    "Rhythm": MusicIcon,
    "Cause & Effect": FileAudio,
    "Gender": MusicIcon
  };

  // Toggle play for the current track
  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  // Select a track to play
  const handleSelectTrack = (track: FrequencyLibraryItem) => {
    if (currentTrack?.id === track.id) {
      // If clicking the same track, toggle play/pause
      setIsPlaying(!isPlaying);
    } else {
      // If a different track, set as current and start playing
      setCurrentTrack(track);
      setIsPlaying(true);
      console.log("Selected track to play:", track.title, "ID:", track.id, "URL:", track.url || track.audio_url);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-purple-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Headphones className="h-5 w-5 text-purple-600" />
            Hermetic Wisdom Sound Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Experience the vibrational essence of the seven Hermetic principles through sound frequencies. 
            Each principle connects with a specific chakra and resonates at a unique frequency.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hermeticJourneys.map((journey) => {
                const IconComponent = principleIcons[journey.principle as keyof typeof principleIcons] || Sparkles;
                const frequency = frequencies?.find(f => 
                  Math.abs(f.frequency - journey.frequency) < 1 || 
                  f.title?.toLowerCase().includes(journey.principle.toLowerCase())
                );
                
                return (
                  <HermeticPrincipleCard
                    key={journey.id}
                    id={journey.id}
                    title={journey.principle}
                    quote={journey.affirmation}
                    description={`Experience the ${journey.chakra} chakra frequency at ${journey.frequency}Hz.`}
                    affirmation={journey.affirmation}
                    frequency={journey.frequency}
                    frequencyName={journey.chakra}
                    animation="fadeIn"
                    color={getColorForChakra(journey.chakra)}
                    tag={journey.tag}
                    icon={IconComponent}
                    onClick={() => {
                      if (frequency) {
                        handleSelectTrack(frequency);
                      } else {
                        toast.error("No frequency found for this principle.");
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
          
          {currentTrack && (
            <div className="fixed bottom-4 right-4 z-50">
              <Card className="p-3 flex items-center gap-3 bg-purple-600 text-white shadow-lg">
                <div>
                  <p className="font-medium">{currentTrack.title}</p>
                  <p className="text-xs">{currentTrack.chakra || "Unknown chakra"}</p>
                </div>
                <FrequencyPlayer
                  audioUrl={currentTrack.audio_url}
                  url={currentTrack.url}
                  isPlaying={isPlaying}
                  onPlayToggle={handlePlayToggle}
                  frequency={currentTrack.frequency}
                  frequencyId={currentTrack.id}
                />
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get color for chakra
const getColorForChakra = (chakra: string): string => {
  switch (chakra) {
    case "Root":
      return "from-red-500 to-red-600";
    case "Sacral":
      return "from-orange-400 to-orange-500";
    case "Solar Plexus":
      return "from-yellow-400 to-yellow-500";
    case "Heart":
      return "from-green-400 to-green-500";
    case "Throat":
      return "from-blue-400 to-blue-500";
    case "Third Eye":
      return "from-indigo-400 to-indigo-500";
    case "Crown":
      return "from-purple-400 to-violet-500";
    default:
      return "from-gray-400 to-gray-500";
  }
};

export default HermeticWisdomLibrary;
