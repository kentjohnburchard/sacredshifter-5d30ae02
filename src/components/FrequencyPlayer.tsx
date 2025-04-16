
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

const FrequencyPlayer = ({ 
  frequency, 
  title, 
  description, 
  audioUrl 
}: { 
  frequency: number, 
  title: string, 
  description?: string, 
  audioUrl: string 
}) => {
  const { liftTheVeil } = useTheme();
  const { playAudio, isPlaying, togglePlayPause } = useGlobalAudioPlayer();
  
  const handlePlay = () => {
    // Play the audio using the global audio player
    playAudio({
      title: title || `${frequency}Hz Frequency`,
      artist: "Sacred Shifter",
      source: audioUrl,
      frequency: frequency,
      chakra: description
    });
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
        >
          Play Frequency
        </Button>
      </div>
      {description && (
        <p className="text-sm opacity-80">{description}</p>
      )}
    </div>
  );
};

export default FrequencyPlayer;
