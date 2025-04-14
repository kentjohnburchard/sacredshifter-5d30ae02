
import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX, Maximize2, Minimize2, Maximize, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Slider } from '@/components/ui/slider';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import { isPrime } from '@/lib/mathUtils';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import SimpleFallbackVisualizer from '../visualizer/SimpleFallbackVisualizer';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';

type ColorScheme = 'purple' | 'blue' | 'rainbow' | 'gold' | 'chakra';

const SacredAudioPlayer: React.FC = () => {
  const {
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    currentTrack,
    audioRef,
    seekTo
  } = useAudioPlayer();
  
  const { liftTheVeil } = useTheme();
  const location = useLocation();
  
  const [expanded, setExpanded] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [controlsExpanded, setControlsExpanded] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('purple');
  const [visualizerSensitivity, setVisualizerSensitivity] = useState<number>(1.5);
  const [showPrimeIndicators, setShowPrimeIndicators] = useState<boolean>(true);
  const [geometryComplexity, setGeometryComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { audioContext, analyser } = useAudioAnalyzer(audioRef);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [activePrimes, setActivePrimes] = useState<number[]>([]);

  useEffect(() => {
    if (!analyser || !isPlaying) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateAudioData = () => {
      analyser.getByteFrequencyData(dataArray);
      setAudioData(dataArray);
      
      // Detect prime frequency energy
      if (showPrimeIndicators) {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
        const newActivePrimes = primes.filter(prime => {
          const index = Math.floor((prime / 50) * dataArray.length);
          return index < dataArray.length && (dataArray[index] / 255) > 0.7;
        });
        setActivePrimes(newActivePrimes);
      }
    };
    
    const intervalId = setInterval(updateAudioData, 30);
    
    return () => clearInterval(intervalId);
  }, [analyser, isPlaying, showPrimeIndicators]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, audioRef]);
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;
    
    seekTo(newTime);
  };
  
  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };
  
  const toggleFullscreen = () => {
    if (!fullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error("Error attempting to enable fullscreen:", err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error("Error attempting to exit fullscreen:", err);
        });
      }
    }
    
    setFullscreen(!fullscreen);
    if (!expanded) {
      setExpanded(true);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      if (fullscreen !== isCurrentlyFullscreen) {
        setFullscreen(isCurrentlyFullscreen);
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [fullscreen]);

  const isJourneyPlayerRoute = location.pathname.includes('/journey-player');

  const colorOptions = [
    { value: 'purple', label: 'Purple' },
    { value: 'blue', label: 'Blue' },
    { value: 'rainbow', label: 'Rainbow' },
    { value: 'gold', label: 'Gold' },
    { value: 'chakra', label: 'Chakra-based' },
  ];

  const getSchemeClasses = (scheme: ColorScheme, type: 'bg' | 'border' | 'text') => {
    const baseClass = type === 'bg' ? 'bg-' : type === 'border' ? 'border-' : 'text-';
    
    switch(scheme) {
      case 'purple': return `${baseClass}purple-600`;
      case 'blue': return `${baseClass}blue-500`;
      case 'rainbow': return `${baseClass}gradient-to-r from-red-500 via-green-500 to-blue-500`;
      case 'gold': return `${baseClass}amber-500`;
      case 'chakra':
        if (currentTrack?.customData?.chakra) {
          const chakra = currentTrack.customData.chakra;
          switch(chakra) {
            case 'root': return `${baseClass}red-500`;
            case 'sacral': return `${baseClass}orange-500`;
            case 'solar': return `${baseClass}yellow-500`;
            case 'heart': return `${baseClass}green-500`;
            case 'throat': return `${baseClass}blue-400`;
            case 'third-eye': return `${baseClass}indigo-500`;
            case 'crown': return `${baseClass}purple-500`;
            default: return `${baseClass}purple-500`;
          }
        }
        return `${baseClass}purple-500`;
      default: return `${baseClass}purple-500`;
    }
  };

  return (
    <>
      {controlsExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed ${fullscreen ? 'inset-x-0 top-16' : 'right-4 bottom-[280px]'} 
            bg-black/90 backdrop-blur-md rounded-t-xl p-4 z-[1003] mx-auto
            ${fullscreen ? 'w-full sm:w-[80%] sm:mx-auto' : 'w-[350px]'}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-sm font-medium">Visualization Controls</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setControlsExpanded(false)}
              className="text-white/70 hover:text-white"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-white/90 mb-2">Color Scheme</div>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    className={`text-xs px-3 py-2 rounded-lg
                      ${colorScheme === color.value 
                        ? getSchemeClasses(colorScheme, 'bg') + ' text-white' 
                        : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
                    onClick={() => setColorScheme(color.value as ColorScheme)}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-semibold text-white/90 mb-2">Sacred Geometry Complexity</div>
              <div className="grid grid-cols-3 gap-2">
                {['simple', 'medium', 'complex'].map((level) => (
                  <button
                    key={level}
                    className={`text-xs px-3 py-2 rounded-lg
                      ${geometryComplexity === level
                        ? getSchemeClasses(colorScheme, 'bg') + ' text-white' 
                        : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
                    onClick={() => setGeometryComplexity(level as 'simple' | 'medium' | 'complex')}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-white/90">Prime Number Indicators</div>
              <div 
                className={`w-10 h-5 rounded-full relative cursor-pointer ${showPrimeIndicators ? 'bg-purple-600' : 'bg-gray-700'}`}
                onClick={() => setShowPrimeIndicators(!showPrimeIndicators)}
              >
                <div 
                  className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transform transition-transform duration-200 ${showPrimeIndicators ? 'translate-x-5' : 'translate-x-0.5'}`}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="text-xs font-semibold text-white/90 mb-2">Visualization Sensitivity</div>
              <Slider
                value={[visualizerSensitivity * 10]}
                min={5}
                max={30}
                step={5}
                onValueChange={(value) => setVisualizerSensitivity(value[0] / 10)}
                className={`w-full ${getSchemeClasses(colorScheme, 'bg')}`}
              />
              <div className="flex justify-between text-[10px] text-white/60 mt-1">
                <span>Subtle</span>
                <span>Balanced</span>
                <span>Intense</span>
              </div>
            </div>
            
            {showPrimeIndicators && activePrimes.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-white/90 mb-2">Active Prime Frequencies</div>
                <div className="flex flex-wrap gap-1">
                  {activePrimes.map(prime => (
                    <span 
                      key={prime} 
                      className="px-2 py-1 bg-pink-600/30 text-pink-300 text-xs rounded-md animate-pulse"
                    >
                      {prime}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <motion.div 
        ref={containerRef}
        className={cn(
          `fixed z-[1000] rounded-xl overflow-visible sacred-audio-player 
          ${isPlaying ? 'is-playing' : ''} ${liftTheVeil ? 'veil-lifted' : ''}`,
          fullscreen ? 'inset-0 rounded-none' : isJourneyPlayerRoute ? 'bottom-4 left-1/2 -translate-x-1/2' : 'bottom-4 right-4'
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ 
          backgroundColor: fullscreen ? 'black' : 'rgba(0, 0, 0, 0.75)',
          boxShadow: `0 0 20px ${liftTheVeil ? 'rgba(255, 105, 180, 0.7)' : 'rgba(139, 92, 246, 0.7)'}`,
          width: fullscreen ? '100%' : expanded ? '350px' : '180px',
          height: fullscreen ? '100%' : expanded ? '250px' : '80px',
          transition: 'width 0.3s ease, height 0.3s ease, left 0.3s ease, right 0.3s ease'
        }}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 w-full h-full">
            {(expanded || fullscreen) && (
              <SimpleFallbackVisualizer
                audioData={audioData || undefined}
                colorScheme={colorScheme}
                sensitivity={visualizerSensitivity}
                showPrimeIndicators={showPrimeIndicators}
                geometryComplexity={geometryComplexity}
                activePrimes={activePrimes}
              />
            )}
          </div>
          
          <div className="relative z-[1001] flex flex-col p-2 h-full">
            {(expanded || fullscreen) && (
              <div className="flex justify-between items-center mb-2">
                <div className="text-white text-xs truncate max-w-[200px]">
                  {currentTrack?.title || 'Sacred Audio'}
                  {currentTrack?.artist && <span className="opacity-70"> • {currentTrack.artist}</span>}
                </div>
                <div className="flex gap-1">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setControlsExpanded(!controlsExpanded)}
                    className="p-1 text-white/70 hover:text-white relative"
                    title="Visualization Settings"
                  >
                    <Palette size={16} />
                  </motion.button>
                  
                  {fullscreen ? (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleFullscreen}
                      className="p-1 text-white/70 hover:text-white"
                    >
                      <Minimize2 size={16} />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleFullscreen}
                      className="p-1 text-white/70 hover:text-white"
                    >
                      <Maximize size={16} />
                    </motion.button>
                  )}
                  {!fullscreen && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleExpanded}
                      className="p-1 text-white/70 hover:text-white"
                    >
                      {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </motion.button>
                  )}
                </div>
              </div>
            )}
            
            {(expanded || fullscreen) && (
              <div 
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3"
                onClick={handleSeek}
              >
                <div 
                  className={`h-full rounded-full ${getSchemeClasses(colorScheme, 'bg')}`}
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
              </div>
            )}
            
            <div className={`flex ${expanded || fullscreen ? 'justify-between' : 'justify-center'} items-center h-${expanded || fullscreen ? 'auto' : 'full'}`}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className={`${expanded || fullscreen ? 'px-4 py-2' : 'px-3 py-1.5'} bg-white text-black rounded flex items-center gap-1 hover:bg-opacity-90`}
              >
                {isPlaying ? (
                  <>
                    <Pause size={expanded || fullscreen ? 16 : 14} /> <span>{(expanded || fullscreen) ? 'Pause' : ''}</span>
                  </>
                ) : (
                  <>
                    <Play size={expanded || fullscreen ? 16 : 14} /> <span>{(expanded || fullscreen) ? 'Play' : ''}</span>
                  </>
                )}
              </motion.button>
              
              <div className="text-white text-xs">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </div>
              
              <div className="relative flex items-center">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="p-1 text-white"
                  onMouseEnter={() => setShowVolume(true)}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </motion.button>
                
                {showVolume && (
                  <div 
                    className="absolute bottom-full right-0 p-2 bg-black/80 rounded-lg mb-2"
                    onMouseEnter={() => setShowVolume(true)}
                    onMouseLeave={() => setShowVolume(false)}
                  >
                    <Slider
                      value={[volume * 100]}
                      min={0}
                      max={100}
                      step={1}
                      className={`w-24 ${getSchemeClasses(colorScheme, 'bg')}`}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                    />
                  </div>
                )}
              </div>
              
              {!expanded && !fullscreen && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleExpanded}
                  className="ml-2 p-1 text-white/70 hover:text-white"
                >
                  <Maximize2 size={14} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SacredAudioPlayer;

