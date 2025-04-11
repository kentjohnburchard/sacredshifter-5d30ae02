
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Eye, EyeOff } from "lucide-react";
import { SacredGeometryVisualizer } from "@/components/sacred-geometry";
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
  const [showVisualizer, setShowVisualizer] = useState(true);
  const effectiveAudioUrl = url || audioUrl;
  const { playAudio } = useGlobalAudioPlayer();
  
  // Create audio element only once using ref
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const audioInitialized = React.useRef(false);
  
  // Initialize audio element only once
  useEffect(() => {
    if (!audioInitialized.current) {
      audioRef.current = new Audio();
      audioInitialized.current = true;
    }
  }, []);
  
  // Get analyzer for visualization
  const { audioContext, analyser } = useAudioAnalyzer(audioRef);
  
  // Set up the audio source when component mounts or URL changes
  useEffect(() => {
    if (effectiveAudioUrl && audioRef.current) {
      let formattedUrl = effectiveAudioUrl;
      
      // Format URL if needed
      if (!formattedUrl.startsWith('http')) {
        formattedUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${formattedUrl}`;
      }
      
      // Set the source but don't play yet
      audioRef.current.src = formattedUrl;
      audioRef.current.load();
      
      // If we want to start playing, handle with global player
      if (isPlaying) {
        playFrequency();
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [effectiveAudioUrl]);
  
  // Update audio playback state when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      playFrequency();
    }
  }, [isPlaying]);
  
  const playFrequency = () => {
    if (effectiveAudioUrl) {
      // Use the global player
      playAudio({
        title: title || `${frequency ? `${frequency}Hz` : 'Sacred'} Frequency`,
        artist: chakra ? `${chakra} Chakra` : "Sacred Shifter",
        source: effectiveAudioUrl
      });
    }
  };
  
  const handlePlayPauseClick = () => {
    // Toggle play state in parent component
    onPlayToggle();
    
    // If not playing, start playing
    if (!isPlaying) {
      playFrequency();
    }
  };
  
  const toggleVisualizer = () => {
    setShowVisualizer(prev => !prev);
  };
  
  return (
    <div className="relative">
      <SacredGeometryVisualizer 
        audioContext={audioContext} 
        analyser={analyser} 
        isVisible={showVisualizer && isPlaying}
        chakra={chakra}
        frequency={frequency}
        mode="fractal"
      />
      
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
