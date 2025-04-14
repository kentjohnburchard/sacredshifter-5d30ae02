
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

interface FrequencyPlayerProps {
  frequency: number;
  title?: string;
  description?: string;
  audioUrl?: string;
  
  // Additional props needed by various components
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  url?: string;
  frequencyId?: string;
  groupId?: string;
  id?: string;
}

const FrequencyPlayer = ({ 
  frequency, 
  title, 
  description, 
  audioUrl,
  isPlaying,
  onPlayToggle,
  url,
  frequencyId,
  groupId,
  id
}: FrequencyPlayerProps) => {
  const { liftTheVeil } = useTheme();
  const { playAudio, isPlaying: globalIsPlaying, togglePlayPause } = useGlobalAudioPlayer();
  
  const handlePlay = () => {
    // If external control is provided, use that
    if (onPlayToggle) {
      onPlayToggle();
      return;
    }
    
    // Otherwise, play the audio using the global audio player
    playAudio({
      title: title || `${frequency}Hz Frequency`,
      artist: "Sacred Shifter",
      source: audioUrl || url || '',
      // Pass these as custom properties
      customData: {
        frequency,
        chakra: description,
        frequencyId,
        groupId
      }
    });
  };
  
  // Use external isPlaying state if provided, otherwise use global state
  const actuallyPlaying = isPlaying !== undefined ? isPlaying : globalIsPlaying;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          {title || `${frequency}Hz`}
        </h3>
        <Button
          onClick={handlePlay}
          className={liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}
          id={id}
        >
          {actuallyPlaying ? 'Pause' : 'Play'} Frequency
        </Button>
      </div>
      {description && (
        <p className="text-sm opacity-80">{description}</p>
      )}
    </div>
  );
};

export default FrequencyPlayer;
