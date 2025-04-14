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
  isPlaying: externalIsPlaying,
  onPlayToggle: externalPlayToggle,
  url,
  frequencyId,
  groupId,
  id
}: FrequencyPlayerProps) => {
  const { liftTheVeil } = useTheme();
  const { playAudio, currentAudio, togglePlayPause } = useGlobalAudioPlayer();
  
  // Determine if this specific frequency is currently playing
  const audioSource = audioUrl || url || '';
  const isThisPlaying = currentAudio?.source === audioSource && currentAudio?.customData?.frequency === frequency;
  
  // Use external control if provided, otherwise use internal control
  const actuallyPlaying = externalIsPlaying !== undefined ? externalIsPlaying : isThisPlaying;
  
  const handlePlay = () => {
    // If external control is provided, use that
    if (externalPlayToggle) {
      externalPlayToggle();
      return;
    }
    
    // If this frequency is already playing, toggle it
    if (isThisPlaying) {
      togglePlayPause();
      return;
    }
    
    // Otherwise, play this audio using the global player
    if (audioSource) {
      playAudio({
        title: title || `${frequency}Hz Frequency`,
        artist: "Sacred Shifter",
        source: audioSource,
        customData: {
          frequency,
          chakra: description,
          frequencyId,
          groupId
        }
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
