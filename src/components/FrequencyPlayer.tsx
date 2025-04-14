
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

interface FrequencyPlayerProps {
  audioUrl: string | null;
  frequency?: number;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showFrequency?: boolean;
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({
  audioUrl,
  frequency = 432,
  isPlaying = false,
  onPlayToggle,
  size = 'md',
  showFrequency = true,
}) => {
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const { playAudio, togglePlayPause, currentAudio } = useGlobalAudioPlayer();

  // Check if this player's audioUrl matches the current playing audio
  const isThisAudioPlaying = () => {
    return currentAudio?.source === audioUrl && isPlaying;
  };

  const handlePlayPause = () => {
    if (audioUrl) {
      if (isThisAudioPlaying()) {
        togglePlayPause();
      } else {
        playAudio({
          title: `Frequency ${frequency}Hz`,
          source: audioUrl,
          customData: { frequency }
        });
      }
    }

    if (onPlayToggle) {
      onPlayToggle();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }

    // Update volume of the global audio player
    const audioElement = document.getElementById('global-audio-player') as HTMLAudioElement;
    if (audioElement) {
      audioElement.volume = newVolume;
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    // Update mute status of the global audio player
    const audioElement = document.getElementById('global-audio-player') as HTMLAudioElement;
    if (audioElement) {
      audioElement.muted = newMutedState;
    }
  };

  const buttonSizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }[size];

  const iconSizeClass = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={!audioUrl}
          onClick={handlePlayPause}
          className={`${buttonSizeClass} rounded-full ${isThisAudioPlaying() ? 'bg-purple-100' : 'bg-white'}`}
        >
          {isThisAudioPlaying() ? (
            <Pause className={iconSizeClass} />
          ) : (
            <Play className={`${iconSizeClass} ml-0.5`} />
          )}
        </Button>

        {size !== 'sm' && (
          <div
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            {showVolumeSlider && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white rounded-lg shadow-lg z-10 w-32">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {showFrequency && frequency && (
        <div className="text-xs text-center text-gray-500 mt-1">
          {frequency}Hz
        </div>
      )}
    </div>
  );
};

export default FrequencyPlayer;
