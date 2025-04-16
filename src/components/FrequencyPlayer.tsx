
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { Play, Pause } from 'lucide-react';

interface FrequencyPlayerProps {
  frequency?: number;
  title?: string;
  description?: string;
  audioUrl?: string;
  // New added props
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  frequencyId?: string;
  url?: string;
  id?: string;
  groupId?: string;
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({ 
  frequency = 432, 
  title, 
  description, 
  audioUrl,
  isPlaying = false,
  onPlayToggle,
  frequencyId,
  url,
  id,
  groupId
}) => {
  const { liftTheVeil } = useTheme();
  const { playAudio, isPlaying: globalIsPlaying, togglePlayPause } = useGlobalAudioPlayer();
  
  const handlePlay = () => {
    if (onPlayToggle) {
      onPlayToggle();
      return;
    }
    
    // Play the audio using the global audio player
    if (audioUrl) {
      playAudio({
        title: title || `${frequency}Hz Frequency`,
        artist: "Sacred Shifter",
        source: audioUrl,
        frequency: frequency,
        chakra: description
      });
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          {title || `${frequency}Hz`}
        </h3>
        <Button
          onClick={handlePlay}
          className={liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}
          size="sm"
        >
          {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isPlaying ? "Pause" : "Play"} Frequency
        </Button>
      </div>
      {description && (
        <p className="text-sm opacity-80">{description}</p>
      )}
    </div>
  );
};

export default FrequencyPlayer;
