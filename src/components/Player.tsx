
import React, { useState, useEffect } from 'react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const Player = () => {
  const { 
    currentAudio, 
    isPlaying, 
    currentTime, 
    duration, 
    togglePlayPause, 
    seekTo,
    volume,
    setVolume 
  } = useGlobalAudioPlayer();
  
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  
  // Handle mute toggle
  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume || 0.7);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };
  
  // No audio playing
  if (!currentAudio) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-purple-500/30 text-white z-50 p-2">
      <div className="container mx-auto flex items-center gap-4">
        {/* Audio info */}
        <div className="flex-shrink-0 w-36 md:w-48">
          <div className="truncate font-medium">{currentAudio.title || 'Unknown'}</div>
          <div className="text-xs text-gray-400 truncate">
            {currentAudio.chakra || currentAudio.frequency ? 
              `${currentAudio.chakra || ''} ${currentAudio.frequency ? `(${currentAudio.frequency}Hz)` : ''}` 
              : ''}
          </div>
        </div>
        
        {/* Player controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10 rounded-full p-2"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
        </div>
        
        {/* Progress bar */}
        <div className="flex-grow flex items-center gap-2">
          <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
          
          <div className="flex-grow">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={1}
              onValueChange={(values) => {
                if (values[0] !== undefined) {
                  seekTo(values[0]);
                }
              }}
              className="cursor-pointer"
            />
          </div>
          
          <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
        </div>
        
        {/* Volume control */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 rounded-full p-2"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          
          <Slider
            className="w-24"
            value={[volume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => {
              const newVolume = values[0] / 100;
              setVolume(newVolume);
              if (newVolume > 0 && isMuted) {
                setIsMuted(false);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
