
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createTone } from '@/utils/audioUtils';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { HarmonicInterval } from '@/data/harmonicSequence';

interface HarmonicIntervalTonePlayerProps {
  baseFrequency?: number;
  interval?: number;
  label?: string;
  description?: string;
  className?: string;
  color?: string;
  interval?: HarmonicInterval;
}

const HarmonicIntervalTonePlayer: React.FC<HarmonicIntervalTonePlayerProps> = ({
  baseFrequency = 432,
  interval: intervalRatio = 1,
  label,
  description,
  className,
  color,
  interval: harmonicInterval,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { liftTheVeil } = useTheme();

  // Determine which frequency to play
  const targetFrequency = harmonicInterval 
    ? typeof harmonicInterval.hertz === 'number' 
      ? harmonicInterval.hertz 
      : baseFrequency * parseFloat(String(harmonicInterval.ratio))
    : baseFrequency * (typeof intervalRatio === 'number' ? intervalRatio : 1);

  const getButtonColor = () => {
    if (color) return color;
    if (harmonicInterval?.color) return harmonicInterval.color;
    return liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700';
  };

  const playTone = () => {
    setIsPlaying(true);
    
    // Create new audio element
    const audioElement = createTone(targetFrequency);
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

  // Determine display text
  const displayLabel = label || (harmonicInterval?.name 
    ? `${harmonicInterval.name} (${harmonicInterval.ratio}:1)` 
    : `${intervalRatio}:1 Ratio`);

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg bg-white/10 backdrop-blur-sm ${className || ''}`}>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{displayLabel}</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{targetFrequency.toFixed(2)} Hz</span>
        </div>
        {description && <p className="text-xs opacity-75 mt-1">{description}</p>}
      </div>
      <Button
        size="sm"
        onClick={togglePlay}
        className={`${getButtonColor()} flex items-center gap-2 min-w-[80px]`}
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

export default HarmonicIntervalTonePlayer;
