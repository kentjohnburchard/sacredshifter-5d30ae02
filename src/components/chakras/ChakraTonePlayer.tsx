
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createTone } from '@/utils/audioUtils';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ChakraTonePlayerProps {
  frequency: number;
  chakra: string;
  label?: string;
  description?: string;
  className?: string;
}

const ChakraTonePlayer: React.FC<ChakraTonePlayerProps> = ({
  frequency,
  chakra,
  label,
  description,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { liftTheVeil } = useTheme();

  const getBackgroundColor = () => {
    if (liftTheVeil) {
      return 'bg-pink-600 hover:bg-pink-700';
    }
    
    switch (chakra.toLowerCase()) {
      case 'root':
        return 'bg-red-600 hover:bg-red-700';
      case 'sacral':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'solar plexus':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'heart':
        return 'bg-green-600 hover:bg-green-700';
      case 'throat':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'third eye':
        return 'bg-indigo-600 hover:bg-indigo-700';
      case 'crown':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-purple-600 hover:bg-purple-700';
    }
  };

  const playTone = () => {
    setIsPlaying(true);
    
    // Create new audio element
    const audioElement = createTone(frequency);
    setAudio(audioElement);
    
    // Stop after 3 seconds
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const stopTone = () => {
    setIsPlaying(false);
    if (audio) {
      audio.pause();
      setAudio(null);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopTone();
    } else {
      playTone();
    }
  };

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg bg-white/10 backdrop-blur-sm ${className || ''}`}>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{label || `${chakra} Chakra`}</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{frequency} Hz</span>
        </div>
        {description && <p className="text-xs opacity-75 mt-1">{description}</p>}
      </div>
      <Button
        size="sm"
        onClick={togglePlay}
        className={`${getBackgroundColor()} flex items-center gap-2 min-w-[80px]`}
      >
        {isPlaying ? (
          <>
            <PauseIcon className="h-4 w-4" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <PlayIcon className="h-4 w-4" />
            <span>Play</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ChakraTonePlayer;
