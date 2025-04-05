
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

interface AudioAsset {
  id: string;
  title: string;
  frequency: number;
  chakra: string;
  principle: string;
  audioUrl: string;
  tags: string[];
  duration: number;
}

const HermeticWisdomLibrary = () => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null);
  const [audioAssets, setAudioAssets] = useState<AudioAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<AudioAsset | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  // Map of principle names to their icon components
  const principleIcons = {
    "Mentalism": Sparkles,
    "Correspondence": Headphones,
    "Vibration": MusicIcon,
    "Polarity": FileAudio,
    "Rhythm": MusicIcon,
    "Cause & Effect": FileAudio,
    "Gender": MusicIcon
  };

  useEffect(() => {
    // Fetch audio assets from the library
    const fetchAudioAssets = async () => {
      setIsLoading(true);
      
      try {
        // For now, create mock data based on the hermetic journeys
        // In a real implementation, this would fetch from Supabase
        const mockAssets: AudioAsset[] = hermeticJourneys.map(journey => ({
          id: `asset-${journey.id}`,
          title: `${journey.frequency}Hz - ${journey.title}`,
          frequency: journey.frequency,
          chakra: journey.chakra,
          principle: journey.principle,
          audioUrl: "https://pixabay.com/music/meditation-spiritual-zen-spiritual-yoga-meditation-relaxing-music-21400.mp3", // placeholder
          tags: [journey.tag, journey.chakra.toLowerCase(), "frequency"],
          duration: 180 + Math.floor(Math.random() * 180) // random duration between 3-6 minutes
        }));
        
        setAudioAssets(mockAssets);
      } catch (error) {
        console.error("Error fetching audio assets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudioAssets();
  }, []);

  const handlePrincipleSelect = (principle: string) => {
    setSelectedPrinciple(principle === selectedPrinciple ? null : principle);
  };

  const handleJourneyClick = (principleId: string) => {
    const journey = hermeticJourneys.find(j => j.principle === principleId);
    if (journey) {
      navigate(`/hermetic-wisdom/${journey.id}`);
    }
  };

  const handlePlayAudio = (asset: AudioAsset) => {
    if (currentTrack && currentTrack.id === asset.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(asset);
      setIsPlaying(true);
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
                const asset = audioAssets.find(a => a.principle === journey.principle);
                const IconComponent = principleIcons[journey.principle as keyof typeof principleIcons] || Sparkles;
                
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
                    onClick={() => handleJourneyClick(journey.principle)}
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
                  <p className="text-xs">{currentTrack.principle}</p>
                </div>
                <FrequencyPlayer 
                  audioUrl={currentTrack.audioUrl}
                  isPlaying={isPlaying}
                  onPlayToggle={() => setIsPlaying(!isPlaying)}
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
