
import React, { useState, useEffect, useRef } from 'react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Minimize2, 
  Maximize2, 
  Play, 
  Pause, 
  Volume, 
  VolumeX, 
  Music, 
  PlusSquare,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/context/ThemeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PrimeAudioVisualizer from './PrimeAudioVisualizer';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';

const SacredAudioPlayer: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [visualMode, setVisualMode] = useState<'prime' | 'regular'>('prime');
  const [visualLayout, setVisualLayout] = useState<'vertical' | 'radial'>('vertical');
  const { liftTheVeil } = useTheme();
  const audioProgressRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activePrime, setActivePrime] = useState<number | null>(null);
  const [showPrimeTooltip, setShowPrimeTooltip] = useState(false);
  const primeDisplayTimeout = useRef<NodeJS.Timeout | null>(null);
  
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

  // Track audio progress
  useEffect(() => {
    if (!audioElement) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
      setDuration(audioElement.duration || 0);
    };
    
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audioElement]);

  // Handle prime detection
  const handlePrimeDetected = (prime: number) => {
    // Set the active prime and show the tooltip
    setActivePrime(prime);
    setShowPrimeTooltip(true);
    
    // Clear any existing timeout
    if (primeDisplayTimeout.current) {
      clearTimeout(primeDisplayTimeout.current);
    }
    
    // Hide the tooltip after 3 seconds
    primeDisplayTimeout.current = setTimeout(() => {
      setShowPrimeTooltip(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      // Clean up timeout on unmount
      if (primeDisplayTimeout.current) {
        clearTimeout(primeDisplayTimeout.current);
      }
    };
  }, []);

  // Format time display (minutes:seconds)
  const formatTime = (time: number): string => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Handle seeking in the audio track
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioElement || !audioProgressRef.current) return;
    
    const bounds = audioProgressRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const ratio = x / bounds.width;
    const seekTime = ratio * duration;
    
    audioElement.currentTime = seekTime;
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

  // Don't render if no audio is playing or loading
  if (!currentAudio) return null;
  
  // Determine progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
            className={`rounded-xl overflow-hidden shadow-xl ${
              liftTheVeil 
                ? 'border border-pink-500/30 bg-gradient-to-br from-slate-900/95 to-black/90 shadow-pink-500/20' 
                : 'border border-purple-500/30 bg-gradient-to-br from-slate-900/95 to-black/90 shadow-purple-500/20'
            }`}
            style={{ width: '320px' }}
          >
            {/* Header with title and controls */}
            <div className={`px-4 py-3 flex items-center justify-between ${
              liftTheVeil ? 'bg-pink-950/30' : 'bg-purple-950/30'
            }`}>
              <TooltipProvider>
                <Tooltip open={showPrimeTooltip}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <h3 className={`font-medium text-sm truncate max-w-[200px] ${
                        liftTheVeil ? 'text-pink-200' : 'text-purple-200'
                      }`}>
                        Prime Harmonix {visualMode === 'prime' ? '✧' : ''}
                      </h3>
                      {activePrime && showPrimeTooltip && (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`text-xs font-medium ml-2 px-2 py-0.5 rounded-full ${
                            liftTheVeil 
                              ? 'bg-pink-500/20 text-pink-200' 
                              : 'bg-purple-500/20 text-purple-200'
                          }`}
                        >
                          Prime {activePrime}
                        </motion.span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" className="max-w-xs">
                    <p className="text-xs">
                      Aligning frequencies to prime intervals to bypass harmonic distortion and resonate with natural consciousness fields.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
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
            <div className="h-48 w-full overflow-hidden bg-black/70 relative">
              {/* Prime detection effect overlay */}
              <AnimatePresence>
                {activePrime && showPrimeTooltip && (
                  <motion.div 
                    className="absolute inset-0 z-10 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={`absolute inset-0 ${
                      liftTheVeil 
                        ? 'bg-gradient-to-t from-transparent to-pink-500/5' 
                        : 'bg-gradient-to-t from-transparent to-purple-500/5'
                    }`}></div>
                    <div className="absolute top-2 left-2 right-2 flex justify-center">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        liftTheVeil
                          ? 'bg-pink-500/20 text-pink-200'
                          : 'bg-purple-500/20 text-purple-200'
                      }`}>
                        Prime Frequency: {activePrime}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <PrimeAudioVisualizer
                audioContext={audioContext}
                analyser={analyser}
                isPlaying={isPlaying}
                colorMode={liftTheVeil ? 'veil-lifted' : 'standard'}
                visualMode={visualMode}
                layout={visualLayout}
                onPrimeDetected={handlePrimeDetected}
              />
            </div>

            {/* Track info */}
            <div className="p-4">
              <div className="mb-2">
                <h4 className={`font-medium text-sm ${
                  liftTheVeil ? 'text-pink-200' : 'text-purple-200'
                }`}>
                  {currentAudio.title || 'Now Playing'}
                </h4>
                {currentAudio.artist && (
                  <p className="text-xs text-gray-400">
                    {currentAudio.artist}
                  </p>
                )}
              </div>
              
              {/* Progress bar */}
              <div className="mb-4">
                <div 
                  ref={audioProgressRef}
                  onClick={handleSeek}
                  className={`w-full h-1.5 bg-gray-700 rounded-full cursor-pointer relative overflow-hidden mb-1`}
                >
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full ${
                      liftTheVeil ? 'bg-pink-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex justify-between items-center">
                {/* Play/pause button */}
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-10 w-10 rounded-full border ${
                    liftTheVeil ? 'border-pink-500/50 hover:border-pink-400' : 'border-purple-500/50 hover:border-purple-400'
                  }`}
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className={`h-4 w-4 ${liftTheVeil ? 'text-pink-300' : 'text-purple-300'}`} />
                  ) : (
                    <Play className={`h-4 w-4 ml-0.5 ${liftTheVeil ? 'text-pink-300' : 'text-purple-300'}`} />
                  )}
                </Button>
                
                {/* Volume control */}
                <div className="flex items-center space-x-2">
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
                    className={`w-24 ${liftTheVeil ? 'bg-pink-950/50' : 'bg-purple-950/50'}`}
                  />
                </div>
              </div>
              
              {/* Visualization controls */}
              <div className="flex justify-between text-xs mt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className={`px-2 py-1 rounded flex items-center gap-1 ${
                          liftTheVeil 
                            ? 'text-pink-300 hover:bg-pink-950/30' 
                            : 'text-purple-300 hover:bg-purple-950/30'
                        }`}
                        onClick={toggleVisualMode}
                      >
                        <PlusSquare className="h-3 w-3" />
                        {visualMode === 'prime' ? 'Prime Mode' : 'Standard Mode'}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[200px]">
                        {visualMode === 'prime' 
                          ? 'Prime Mode highlights frequencies that align with prime numbers for deeper resonance' 
                          : 'Standard Mode shows all frequency bands equally'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className={`px-2 py-1 rounded flex items-center gap-1 ${
                          liftTheVeil 
                            ? 'text-pink-300 hover:bg-pink-950/30' 
                            : 'text-purple-300 hover:bg-purple-950/30'
                        }`}
                        onClick={toggleVisualLayout}
                      >
                        <Music className="h-3 w-3" />
                        {visualLayout === 'vertical' ? 'Vertical' : 'Radial'}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[200px]">
                        Switch between vertical bars and radial circular pattern
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className={`px-2 py-1 rounded flex items-center gap-1 ${
                          liftTheVeil 
                            ? 'text-pink-300/70 hover:bg-pink-950/30 hover:text-pink-300' 
                            : 'text-purple-300/70 hover:bg-purple-950/30 hover:text-purple-300'
                        }`}
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs max-w-[220px] space-y-1">
                        <p>
                          <strong>Prime Harmonics:</strong> A frequency that bypasses standard resonance patterns to awaken your soul's original rhythm.
                        </p>
                        <p className="pt-1 text-muted-foreground">
                          When prime frequencies align, notice the glow intensify — these are moments of heightened consciousness.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className={`flex items-center space-x-2 p-2 rounded-full shadow-lg cursor-pointer ${
              liftTheVeil 
                ? 'bg-gradient-to-r from-slate-900/90 to-slate-900/95 border border-pink-500/30 shadow-pink-500/10' 
                : 'bg-gradient-to-r from-slate-900/90 to-slate-900/95 border border-purple-500/30 shadow-purple-500/10'
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
            
            {/* Prime indicator */}
            <AnimatePresence>
              {activePrime && showPrimeTooltip && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`h-2 w-2 rounded-full ${
                    liftTheVeil ? 'bg-pink-400 animate-pulse' : 'bg-purple-400 animate-pulse'
                  }`}
                />
              )}
            </AnimatePresence>
            
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
