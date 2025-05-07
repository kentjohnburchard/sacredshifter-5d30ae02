
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';
import { createTone } from '@/utils/audioUtils';

interface ChakraTonePlayerProps {
  frequency: number;
  chakra?: string;
  autoplay?: boolean;
  loopDuration?: number;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

// Simple interface for audio state
interface AudioData {
  play: () => void;
  stop: () => void;
}

const ChakraTonePlayer: React.FC<ChakraTonePlayerProps> = ({
  frequency,
  chakra,
  autoplay = false,
  loopDuration = 0,
  onPlayStateChange,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<AudioData | null>(null);
  
  // Create tone when frequency changes
  useEffect(() => {
    if (audio) {
      audio.stop();
    }
    
    // Create a new tone with the current frequency
    const newAudio = createTone(frequency);
    setAudio(newAudio);
    
    return () => {
      if (newAudio) {
        newAudio.stop();
      }
    };
  }, [frequency]);
  
  // Handle autoplay
  useEffect(() => {
    if (autoplay && audio) {
      playTone();
    }
    
    return () => {
      if (audio) {
        audio.stop();
        setIsPlaying(false);
      }
    };
  }, [autoplay, audio]);
  
  // Handle loop duration
  useEffect(() => {
    if (loopDuration > 0 && isPlaying) {
      const timeout = setTimeout(() => {
        if (audio) {
          audio.stop();
          setIsPlaying(false);
          if (onPlayStateChange) onPlayStateChange(false);
          
          // Restart after a short pause
          setTimeout(() => {
            if (audio) {
              audio.play();
              setIsPlaying(true);
              if (onPlayStateChange) onPlayStateChange(true);
            }
          }, 500);
        }
      }, loopDuration * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [loopDuration, isPlaying, audio, onPlayStateChange]);
  
  const playTone = () => {
    if (!audio) return;
    
    audio.play();
    setIsPlaying(true);
    if (onPlayStateChange) onPlayStateChange(true);
  };
  
  const stopTone = () => {
    if (!audio) return;
    
    audio.stop();
    setIsPlaying(false);
    if (onPlayStateChange) onPlayStateChange(false);
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      stopTone();
    } else {
      playTone();
    }
  };
  
  return (
    <div className={`chakra-tone-player ${className}`}>
      <Button
        onClick={togglePlay}
        variant="outline"
        size="sm"
        className={`
          flex items-center gap-2
          ${chakra ? `chakra-${chakra.toLowerCase()}` : ''}
          ${isPlaying ? 'bg-purple-900/20' : ''}
        `}
      >
        {isPlaying ? (
          <Square className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        {frequency} Hz
      </Button>
    </div>
  );
};

export default ChakraTonePlayer;
