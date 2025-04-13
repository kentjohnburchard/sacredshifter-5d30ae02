
import React, { useState, useEffect } from 'react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2, Maximize2, Play, Pause, Volume, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/context/ThemeContext';
import PrimeAudioVisualizer from './PrimeAudioVisualizer';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';

const SacredAudioPlayer: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [visualMode, setVisualMode] = useState<'prime' | 'regular'>('prime');
  const [visualLayout, setVisualLayout] = useState<'vertical' | 'radial'>('vertical');
  const { liftTheVeil } = useTheme();
  
  const { 
    playAudio, 
    isPlaying, 
    currentAudio, 
    togglePlayPause 
  } = useGlobalAudioPlayer();

  // Get a reference to the audio element
  const audioElement = document.getElementById('global-audio-player') as HTMLAudioElement | null;
  
  // Use the audio analyzer hook with the global audio element
  const { audioContext, analyser } = useAudioAnalyzer(audioElement);

  // Update volume when it changes
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioElement]);

  // Format time display (minutes:seconds)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Toggle visualization mode between prime and regular
  const toggleVisualMode = () => {
    setVisualMode(prev => prev === 'prime' ? 'regular' : 'prime');
  };

  // Toggle visualization layout between vertical and radial
  const toggleVisualLayout = () => {
    setVisualLayout(prev => prev === 'vertical' ? 'radial' : 'vertical');
  };

  // Don't render if no audio is playing
  if (!currentAudio) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className={`rounded-xl overflow-hidden shadow-xl border ${
              liftTheVeil 
                ? 'border-pink-500/30 bg-gradient-to-br from-slate-900/95 to-black' 
                : 'border-purple-500/30 bg-gradient-to-br from-slate-900/95 to-black'
            }`}
            style={{ width: '320px' }}
          >
            {/* Header with title and controls */}
            <div className={`px-4 py-3 flex items-center justify-between ${
              liftTheVeil ? 'bg-pink-950/30' : 'bg-purple-950/30'
            }`}>
              <h3 className={`font-medium text-sm truncate max-w-[200px] ${
                liftTheVeil ? 'text-pink-200' : 'text-purple-200'
              }`}>
                {currentAudio.title || 'Now Playing'}
              </h3>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 rounded-full"
                  onClick={() => setExpanded(false)}
                >
                  <Minimize2 className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </div>

            {/* Visualizer */}
            <div className="h-48 w-full overflow-hidden bg-black/70">
              <PrimeAudioVisualizer
                audioContext={audioContext}
                analyser={analyser}
                isPlaying={isPlaying}
                colorMode={liftTheVeil ? 'veil-lifted' : 'standard'}
                visualMode={visualMode}
                layout={visualLayout}
              />
            </div>

            {/* Controls */}
            <div className="p-4 space-y-4">
              {/* Artist info if available */}
              {currentAudio.artist && (
                <div className="text-xs text-gray-400">
                  {currentAudio.artist}
                </div>
              )}
              
              {/* Play/pause button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-12 w-12 rounded-full border ${
                    liftTheVeil ? 'border-pink-500/50 hover:border-pink-400' : 'border-purple-500/50 hover:border-purple-400'
                  }`}
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className={`h-5 w-5 ${liftTheVeil ? 'text-pink-300' : 'text-purple-300'}`} />
                  ) : (
                    <Play className={`h-5 w-5 ml-0.5 ${liftTheVeil ? 'text-pink-300' : 'text-purple-300'}`} />
                  )}
                </Button>
              </div>
              
              {/* Volume control */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Volume className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
                
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(values) => setVolume(values[0])}
                  className={`flex-grow ${liftTheVeil ? 'bg-pink-950/50' : 'bg-purple-950/50'}`}
                />
              </div>
              
              {/* Visualization controls */}
              <div className="flex justify-between text-xs">
                <button 
                  className={`px-2 py-1 rounded ${
                    liftTheVeil 
                      ? 'text-pink-300 hover:bg-pink-950/30' 
                      : 'text-purple-300 hover:bg-purple-950/30'
                  }`}
                  onClick={toggleVisualMode}
                >
                  {visualMode === 'prime' ? 'Prime Mode' : 'Standard Mode'}
                </button>
                
                <button 
                  className={`px-2 py-1 rounded ${
                    liftTheVeil 
                      ? 'text-pink-300 hover:bg-pink-950/30' 
                      : 'text-purple-300 hover:bg-purple-950/30'
                  }`}
                  onClick={toggleVisualLayout}
                >
                  {visualLayout === 'vertical' ? 'Vertical' : 'Radial'}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`flex items-center space-x-2 p-2 rounded-full shadow-lg cursor-pointer ${
              liftTheVeil 
                ? 'bg-gradient-to-r from-slate-900/90 to-slate-900/95 border border-pink-500/30' 
                : 'bg-gradient-to-r from-slate-900/90 to-slate-900/95 border border-purple-500/30'
            }`}
            onClick={() => setExpanded(true)}
          >
            {/* Play/pause button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
            >
              {isPlaying ? (
                <Pause className={`h-4 w-4 ${liftTheVeil ? 'text-pink-300' : 'text-purple-300'}`} />
              ) : (
                <Play className={`h-4 w-4 ml-0.5 ${liftTheVeil ? 'text-pink-300' : 'text-purple-300'}`} />
              )}
            </Button>
            
            {/* Title */}
            <div className="max-w-[120px] truncate">
              <span className={`text-xs font-medium ${
                liftTheVeil ? 'text-pink-200' : 'text-purple-200'
              }`}>
                {currentAudio.title || 'Now Playing'}
              </span>
            </div>
            
            {/* Expand button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(true);
              }}
            >
              <Maximize2 className="h-4 w-4 text-gray-400" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SacredAudioPlayer;
