
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { Play, Pause } from 'lucide-react';

interface FrequencyPlayerProps {
  frequency?: number;
  title?: string;
  description?: string;
  audioUrl: string;
  url?: string;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  frequencyId?: string;
  groupId?: string;
  id?: string;
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({
  frequency,
  title,
  description,
  audioUrl,
  url,
  isPlaying,
  onPlayToggle,
  frequencyId,
  groupId,
  id
}) => {
  const { liftTheVeil } = useTheme();
  const { playAudio, togglePlayPause, isPlaying: globalIsPlaying, currentAudio } = useGlobalAudioPlayer();

  const handlePlay = () => {
    console.log("FrequencyPlayer: handlePlay called", { audioUrl, url });
    
    // If external control is provided, use that
    if (onPlayToggle) {
      console.log("Using external onPlayToggle handler");
      onPlayToggle();
      return;
    }
    
    // Check if we're already playing this frequency
    const isCurrentlyPlaying = 
      currentAudio?.id === frequencyId || 
      currentAudio?.id === id;
    
    if (isCurrentlyPlaying && globalIsPlaying) {
      console.log("Toggling pause for current frequency");
      togglePlayPause();
      return;
    }
    
    // Get a valid audio source
    const source = audioUrl || url || '';
    if (!source) {
      console.error("No audio source provided for FrequencyPlayer");
      return;
    }
    
    // Play the audio using the global audio player
    console.log("Playing frequency with source:", source);
    playAudio({
      title: title || (frequency ? `${frequency}Hz Frequency` : 'Frequency'),
      artist: "Sacred Shifter",
      source: source,
      frequency: frequency,
      chakra: description,
      id: frequencyId || id
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {(title || frequency) && (
          <h3 className="text-lg font-semibold">
            {title || `${frequency}Hz`}
          </h3>
        )}
        <Button
          onClick={handlePlay}
          className={liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}
          size="sm"
          id={id}
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Play Frequency
            </>
          )}
        </Button>
      </div>
      
      {description && (
        <p className="text-sm opacity-80 mb-4">{description}</p>
      )}

      <div className="relative w-full h-[200px] rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/40 to-black/70">
        {/* Visualization placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-24 h-24 rounded-full ${isPlaying ? 'animate-pulse bg-purple-500/30' : 'bg-purple-500/20'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default FrequencyPlayer;
