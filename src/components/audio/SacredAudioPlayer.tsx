import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import EnhancedGeometryVisualizer from '@/components/sacred-geometry/EnhancedGeometryVisualizer';
import { useTheme } from '@/context/ThemeContext';

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
  const [geometryExpanded, setGeometryExpanded] = useState(false);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeekMouseDown = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeekTime(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(false);
    const seekToTime = parseFloat(e.target.value);
    setCurrentTime(seekToTime);
    seekTo(seekToTime);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (!isSeeking) {
        setSeekTime(currentTime);
      }
    }
  }, [currentTime, isSeeking, audioRef]);

  return (
    <div className="sacred-audio-player w-full">
      <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-sm rounded-lg shadow-xl p-4">
        {currentTrack ? (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-purple-300">{currentTrack.title}</h3>
            {currentTrack.artist && <p className="text-sm text-gray-400">{currentTrack.artist}</p>}
          </div>
        ) : (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-purple-300">No track selected</h3>
            <p className="text-sm text-gray-400">Select a track to play</p>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={!audioLoaded}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <div className="flex-grow mx-4">
            <input
              type="range"
              className="w-full"
              min="0"
              max={duration}
              step="0.1"
              value={seekTime}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        
        {audioError && (
          <div className="text-red-500 mt-2">
            Error: {audioError}
          </div>
        )}
      </div>
      
      {/* Sacred Geometry Visualizer */}
      <div className={`w-full max-w-4xl mx-auto mt-4 mb-4 ${geometryExpanded ? 'z-30' : 'z-10'}`}>
        <EnhancedGeometryVisualizer 
          showControls={true}
          isAudioReactive={true}
          expandable={true}
          onExpandStateChange={setGeometryExpanded}
          mode={liftTheVeil ? 'spiral' : 'fractal'}
        />
      </div>
    </div>
  );
};

export default SacredAudioPlayer;
