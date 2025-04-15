
import React, { useState } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useTheme } from '@/context/ThemeContext';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils';
import { VisualizerManager } from '@/components/visualizer/VisualizerManager';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

const SacredAudioPlayer: React.FC = () => {
  const {
    isPlaying,
    duration,
    currentTime,
    togglePlay,
    seekTo,
    audioRef,
    audioLoaded,
    audioError,
    currentTrack,
    setCurrentTime
  } = useAudioPlayer();
  
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const { liftTheVeil } = useTheme();

  const handleSeekMouseDown = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (value: number[]) => {
    const newValue = value[0];
    setSeekTime(newValue);
    if (!isSeeking) {
      setCurrentTime(newValue);
      seekTo(newValue);
    }
  };

  const handleSeekMouseUp = () => {
    setIsSeeking(false);
    seekTo(seekTime);
  };

  React.useEffect(() => {
    if (!isSeeking) {
      setSeekTime(currentTime);
    }
  }, [currentTime, isSeeking]);

  return (
    <div className="sacred-audio-player w-full max-w-4xl mx-auto">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg shadow-xl p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="h-10 w-10 rounded-full bg-purple-500 hover:bg-purple-600 text-white"
            disabled={!audioLoaded}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          <div className="flex-grow">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-purple-300">
                {currentTrack?.title || 'No track selected'}
              </h3>
              {currentTrack?.artist && (
                <p className="text-sm text-gray-400">{currentTrack.artist}</p>
              )}
            </div>
            
            <Slider
              value={[seekTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeekChange}
              onPointerDown={handleSeekMouseDown}
              onPointerUp={handleSeekMouseUp}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {audioError && (
          <div className="text-red-500 mt-2">{audioError}</div>
        )}
      </div>

      <div className="mt-4 h-48 rounded-lg overflow-hidden">
        <VisualizerManager 
          type="simple"
          audioRef={audioRef}
          isAudioReactive={false}
          colorScheme={liftTheVeil ? 'pink' : 'purple'}
          size="md"
        />
      </div>
    </div>
  );
};

export default SacredAudioPlayer;
