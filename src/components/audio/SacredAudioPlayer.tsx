import React, { useState } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useTheme } from '@/context/ThemeContext';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils';
import { VisualizerManager } from '@/components/visualizer/VisualizerManager';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

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
    setCurrentTime,
    audioAnalyser
  } = useAudioPlayer();
  
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
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

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (audioRef.current) {
      audioRef.current.muted = newMutedState;
    }
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
            
            <div className="flex items-center gap-4">
              <div className="flex-grow">
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
              
              <div
                className="relative"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="h-8 w-8 text-white"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>

                {showVolumeSlider && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/60 rounded-lg shadow-lg z-10 w-32">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {audioError && (
          <div className="text-red-500 mt-2">{audioError}</div>
        )}
      </div>

      <div className="mt-4 h-48 rounded-lg overflow-hidden">
        <VisualizerManager 
          isAudioReactive={true}
          analyser={audioAnalyser}
          colorScheme={liftTheVeil ? 'pink' : 'purple'}
          size="md"
        />
      </div>
    </div>
  );
};

export default SacredAudioPlayer;
