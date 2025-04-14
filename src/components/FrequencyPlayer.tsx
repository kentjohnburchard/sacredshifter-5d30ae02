import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react";
import FractalAudioVisualizer from "@/components/audio/FractalAudioVisualizer";
import useAudioAnalyzer from "@/hooks/useAudioAnalyzer";
import { useGlobalAudioPlayer } from "@/hooks/useGlobalAudioPlayer";
import PrimeNumberDisplay from "@/components/prime-display/PrimeNumberDisplay";

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
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [expandedVisualizer, setExpandedVisualizer] = useState(false);
  const [primeSequence, setPrimeSequence] = useState<number[]>([]);
  
  const effectiveAudioUrl = url || audioUrl;
  const { playAudio, togglePlayPause, currentAudio } = useGlobalAudioPlayer();
  
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const globalAudio = document.getElementById('global-audio-player') as HTMLAudioElement;
    if (globalAudio) {
      audioRef.current = globalAudio;
      console.log("FrequencyPlayer: Found audio element", globalAudio);
    } else {
      console.log("FrequencyPlayer: Audio element not found");
    }
  }, []);
  
  const { audioContext, analyser } = useAudioAnalyzer(audioRef.current);
  
  const isCurrentlyPlaying = React.useMemo(() => {
    if (!currentAudio || !effectiveAudioUrl) return false;
    return currentAudio.source === effectiveAudioUrl && isPlaying;
  }, [currentAudio, effectiveAudioUrl, isPlaying]);
  
  const handlePlayPauseClick = () => {
    onPlayToggle();
    
    if (isCurrentlyPlaying) {
      console.log("FrequencyPlayer: Toggling playback state");
      togglePlayPause();
    } else if (effectiveAudioUrl) {
      console.log("FrequencyPlayer: Playing new frequency");
      playFrequency();
    }
  };
  
  const playFrequency = () => {
    if (effectiveAudioUrl) {
      let formattedUrl = effectiveAudioUrl;
      if (!formattedUrl.startsWith('http')) {
        formattedUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${formattedUrl}`;
      }
      
      console.log("FrequencyPlayer: Playing frequency with URL:", formattedUrl);
      
      playAudio({
        title: title || `${frequency ? `${frequency}Hz` : 'Sacred'} Frequency`,
        artist: chakra ? `${chakra} Chakra` : "Sacred Shifter",
        source: formattedUrl
      });
      
      setShowVisualizer(true);
      setAudioInitialized(true);
    }
  };
  
  const toggleVisualizer = () => {
    console.log("Toggling visualizer in FrequencyPlayer, current state:", showVisualizer);
    setShowVisualizer(prev => !prev);
    if (expandedVisualizer) {
      setExpandedVisualizer(false);
    }
  };
  
  const toggleExpandedVisualizer = () => {
    setExpandedVisualizer(prev => !prev);
  };
  
  const handlePrimeSequence = (primes: number[]) => {
    setPrimeSequence(primes);
  };
  
  const getColorScheme = (): "purple" | "blue" | "rainbow" | "gold" => {
    if (!chakra) return 'purple';
    
    switch (chakra.toLowerCase()) {
      case 'root': return 'purple';
      case 'sacral': return 'gold';
      case 'solar plexus': return 'gold';
      case 'heart': return 'purple';
      case 'throat': return 'blue';
      case 'third eye': return 'blue';
      case 'crown': return 'rainbow';
      default: return 'purple';
    }
  };
  
  return (
    <div className="relative z-50">
      {showVisualizer && isPlaying && audioContext && analyser && (
        <div className={`${expandedVisualizer ? 'fixed inset-0 z-50' : 'fixed inset-0 pointer-events-none z-40'} flex items-center justify-center`}>
          <FractalAudioVisualizer 
            audioContext={audioContext} 
            analyser={analyser} 
            isVisible={true}
            colorScheme={getColorScheme()}
            pauseWhenStopped={true}
            frequency={frequency}
            chakra={chakra}
            onPrimeSequence={handlePrimeSequence}
            expanded={expandedVisualizer}
          />
        </div>
      )}
      
      {primeSequence.length > 0 && isPlaying && showVisualizer && (
        <PrimeNumberDisplay 
          primes={primeSequence} 
          sessionId={id || frequencyId} 
          journeyTitle={title}
          expanded={expandedVisualizer}
          onToggleExpand={toggleExpandedVisualizer}
        />
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
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
              onClick={toggleVisualizer}
              aria-label={showVisualizer ? "Hide visualizer" : "Show visualizer"}
            >
              {showVisualizer ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            
            {showVisualizer && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
                onClick={toggleExpandedVisualizer}
                aria-label={expandedVisualizer ? "Minimize visualizer" : "Maximize visualizer"}
              >
                {expandedVisualizer ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FrequencyPlayer;
