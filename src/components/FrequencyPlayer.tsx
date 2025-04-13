
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Eye, EyeOff } from "lucide-react";
import FractalAudioVisualizer from "@/components/audio/FractalAudioVisualizer";
import useAudioAnalyzer from "@/hooks/useAudioAnalyzer";
import { useGlobalAudioPlayer } from "@/hooks/useGlobalAudioPlayer";

interface FrequencyPlayerProps {
  audioUrl?: string;
  url?: string;
  isPlaying: boolean;
  onPlayToggle: () => void;
  frequency?: number;
  frequencyId?: string;
  id?: string;
  groupId?: string;
  chakra?: string;
  title?: string;
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({
  audioUrl,
  url,
  isPlaying,
  onPlayToggle,
  frequency,
  frequencyId,
  id,
  groupId,
  chakra,
  title = "Sacred Frequency"
}) => {
  // Create all state hooks at the top
  const [showVisualizer, setShowVisualizer] = useState(false);
  
  const effectiveAudioUrl = url || audioUrl;
  const { playAudio, togglePlayPause, currentAudio } = useGlobalAudioPlayer();
  
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const audioElementFoundRef = React.useRef(false);
  
  // Find the audio element in the DOM
  useEffect(() => {
    if (!audioElementFoundRef.current) {
      const globalAudio = document.querySelector('audio');
      if (globalAudio) {
        audioRef.current = globalAudio;
        audioElementFoundRef.current = true;
        console.log("FrequencyPlayer: Found audio element");
      }
    }
  }, []);
  
  // Use the audio analyzer hook
  const { audioContext, analyser } = useAudioAnalyzer(audioRef);
  
  const isCurrentlyPlaying = React.useMemo(() => {
    if (!currentAudio || !effectiveAudioUrl) return false;
    return currentAudio.source === effectiveAudioUrl && isPlaying;
  }, [currentAudio, effectiveAudioUrl, isPlaying]);
  
  const handlePlayPauseClick = () => {
    onPlayToggle();
    
    if (isCurrentlyPlaying) {
      togglePlayPause();
    } else if (effectiveAudioUrl) {
      playFrequency();
    }
  };
  
  const playFrequency = () => {
    if (effectiveAudioUrl) {
      let formattedUrl = effectiveAudioUrl;
      if (!formattedUrl.startsWith('http')) {
        formattedUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${formattedUrl}`;
      }
      
      playAudio({
        title: title || `${frequency ? `${frequency}Hz` : 'Sacred'} Frequency`,
        artist: chakra ? `${chakra} Chakra` : "Sacred Shifter",
        source: formattedUrl
      });
    }
  };
  
  const toggleVisualizer = () => {
    console.log("Toggling visualizer in FrequencyPlayer, current state:", showVisualizer);
    setShowVisualizer(prev => !prev);
  };
  
  return (
    <div className="relative z-50">
      {showVisualizer && isPlaying && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <FractalAudioVisualizer 
            audioContext={audioContext} 
            analyser={analyser} 
            isVisible={true}
            colorScheme={chakra?.toLowerCase() === "heart" ? "gold" : 
                      chakra?.toLowerCase() === "throat" ? "blue" : 
                      chakra?.toLowerCase() === "crown" ? "rainbow" : 
                      "purple"}
          />
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={handlePlayPauseClick}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        {isPlaying && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
            onClick={toggleVisualizer}
            aria-label={showVisualizer ? "Hide visualizer" : "Show visualizer"}
          >
            {showVisualizer ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FrequencyPlayer;
