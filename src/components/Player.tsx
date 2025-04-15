
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Trash2 } from 'lucide-react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

interface PlayerProps {
  track: {
    id: string;
    title: string;
    audioUrl: string;
    url?: string;
    [key: string]: any;
  };
  onDelete?: (id: string) => void;
}

const Player: React.FC<PlayerProps> = ({ track, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { playAudio, togglePlayPause, currentAudio } = useGlobalAudioPlayer();

  const handlePlayToggle = () => {
    if (currentAudio?.source === track.audioUrl) {
      togglePlayPause();
      setIsPlaying(!isPlaying);
    } else {
      playAudio({
        title: track.title || 'Audio Track',
        source: track.audioUrl,
        customData: track
      });
      setIsPlaying(true);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="font-medium text-sm">{track.title}</h3>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full w-8 h-8 p-0 ${isPlaying ? 'bg-purple-600 text-white' : ''}`}
              onClick={handlePlayToggle}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
            </Button>
            
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-8 h-8 p-0 text-red-500 hover:bg-red-50"
                onClick={() => onDelete(track.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Player;
