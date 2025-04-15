
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils';

interface SimpleAudioPlayerProps {
  audioUrl: string;
  frequency?: number;
  frequencyId?: string;
  groupId?: string;
  isPlaying?: boolean;
  onPlayToggle?: (isPlaying: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  url?: string;
}

const SimpleAudioPlayer: React.FC<SimpleAudioPlayerProps> = ({
  audioUrl,
  frequency,
  frequencyId,
  groupId,
  isPlaying: externalIsPlaying,
  onPlayToggle,
  size = 'md',
  id,
}) => {
  const { playAudio, togglePlayPause, isPlaying: globalIsPlaying, currentAudio } = useGlobalAudioPlayer();
  
  const isCurrentlyPlaying = 
    externalIsPlaying !== undefined 
      ? externalIsPlaying 
      : (globalIsPlaying && currentAudio?.source === audioUrl);
  
  const handlePlayToggle = () => {
    if (currentAudio?.source === audioUrl) {
      togglePlayPause();
    } else {
      playAudio({
        title: 'Audio Track', // Generic title
        source: audioUrl,
        customData: {
          frequency,
          frequencyId,
          groupId
        }
      });
    }
    
    if (onPlayToggle) {
      onPlayToggle(!isCurrentlyPlaying);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`rounded-full h-9 w-9 p-0 ${isCurrentlyPlaying ? 'bg-purple-600 text-white hover:bg-purple-700' : ''}`}
          onClick={handlePlayToggle}
        >
          {isCurrentlyPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </Button>
        
        <div className="flex-grow">
          <Slider
            value={[0]}
            min={0}
            max={100}
            step={1}
            className="cursor-not-allowed"
            disabled
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>00:00</span>
            <span>
              {frequency ? `${frequency}Hz` : "Audio Track"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAudioPlayer;
