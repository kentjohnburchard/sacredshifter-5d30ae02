import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { PlayIcon, PauseIcon } from 'lucide-react';

interface FrequencyPlayerProps {
  frequency?: number;
  title?: string;
  description?: string;
  audioUrl: string;
  url?: string;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  frequencyId?: string;
  groupId?: string;
  id?: string;
}

const FrequencyPlayer: React.FC<FrequencyPlayerProps> = ({
  frequency,
  title,
  description,
  audioUrl,
  url,
  isPlaying,
  onPlayToggle,
  frequencyId,
  groupId,
  id
}) => {
  const { liftTheVeil } = useTheme();
  const { playAudio } = useGlobalAudioPlayer();
  
  const handlePlay = () => {
    // If external control is provided, use that
    if (onPlayToggle) {
      onPlayToggle();
      return;
    }
    
    // Otherwise, play the audio using the global audio player
    playAudio({
      title: title || (frequency ? `${frequency}Hz Frequency` : 'Frequency'),
      artist: "Sacred Shifter",
      source: audioUrl || url || '',
      frequency: frequency,
      chakra: description,
      id: frequencyId || id
    });
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {(title || frequency) && (
          <h3 className="text-lg font-semibold">
            {title || `${frequency}Hz`}
          </h3>
        )}
        <Button
          onClick={handlePlay}
          className={liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}
          size="sm"
          id={id}
        >
          {isPlaying ? (
            <>
              <PauseIcon className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <PlayIcon className="h-4 w-4 mr-2" />
              Play Frequency
            </>
          )}
        </Button>
      </div>
      {description && (
        <p className="text-sm opacity-80">{description}</p>
      )}
    </div>
  );
};

export default FrequencyPlayer;
