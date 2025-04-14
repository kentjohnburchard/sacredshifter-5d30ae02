import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX, Maximize2, Minimize2, Maximize, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import { isPrime } from '@/lib/mathUtils';
import PrimeAudioVisualizer from './PrimeAudioVisualizer';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import SacredGeometryVisualizer from '../sacred-geometry/EnhancedGeometryVisualizer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import FrequencyEqualizer from '../visualizer/FrequencyEqualizer';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

type GeometryShape = 'flower-of-life' | 'seed-of-life' | 'metatrons-cube' | 
                     'merkaba' | 'torus' | 'tree-of-life' | 'sri-yantra' | 
                     'vesica-piscis' | 'sphere';

type VisualizerMode = 'classic' | 'sacred-geometry' | 'prime';

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
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  const { liftTheVeil } = useTheme();
  
  const [expanded, setExpanded] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [controlsExpanded, setControlsExpanded] = useState(false);
  
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const circlesRef = useRef<Array<{x: number, y: number, radius: number, opacity: number, color: string}>>([]);
  const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  
  const [currentGeometry, setCurrentGeometry] = useState<GeometryShape>('flower-of-life');
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('classic');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('purple');
  const [visualizerSensitivity, setVisualizerSensitivity] = useState<number>(1.5);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [detectedPrimes, setDetectedPrimes] = useState<number[]>([]);
  const [activePrime, setActivePrime] = useState<number | null>(null);
  
  const location = useLocation();

  const changeVisualizerMode = (mode: VisualizerMode) => {
    setVisualizerMode(mode);
  };

  const changeGeometricPattern = (pattern: GeometryShape) => {
    setCurrentGeometry(pattern);
  };

  const changeColorScheme = (scheme: ColorScheme) => {
    setColorScheme(scheme);
  };
  
  const chakraColors = {
    root: '#FF0000',
    sacral: '#FFA500',
    solar: '#FFFF00',
    heart: '#00FF00',
    throat: '#00FFFF',
    thirdEye: '#0000FF',
    crown: '#EE82EE'
  };

  const { audioContext, analyser } = useAudioAnalyzer(audioRef);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);

  const getColorByScheme = (scheme: ColorScheme) => {
    switch(scheme) {
      case 'purple': return '#8B5CF6';
      case 'blue': return '#3B82F6';
      case 'rainbow': return 'rainbow';
      case 'gold': return '#F59E0B';
      case 'chakra':
        if (currentTrack?.customData?.chakra) {
          const chakra = currentTrack.customData.chakra;
          switch(chakra) {
            case 'root': return '#FF0000';
            case 'sacral': return '#FFA500';
            case 'solar': return '#FFFF00';
            case 'heart': return '#00FF00';
            case 'throat': return '#00FFFF';
            case 'third-eye': return '#0000FF';
            case 'crown': return '#EE82EE';
            default: return '#8B5CF6';
          }
        }
        return '#8B5CF6';
      default: return '#8B5CF6';
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const updateCanvasSize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const container = canvas.parentElement;
      
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        setCanvasSize({ width, height });
      }
    };
    
    updateCanvasSize();
    
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    const container = canvasRef.current.parentElement;
    if (container) {
      resizeObserver.observe(container);
    }
    
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [expanded, fullscreen]);

  const drawVisualizer = () => {
    if (!canvasRef.current || !audioData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i];
    }
    const averageAmplitude = sum / audioData.length / 255;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const seedRadius = Math.min(canvas.width, canvas.height) * 0.1 * (1 + averageAmplitude * 0.3);
    
    let mainColor;
    if (liftTheVeil) {
      const gradientColor = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradientColor.addColorStop(0, 'rgba(255, 54, 171, 0.7)');
      gradientColor.addColorStop(0.5, 'rgba(255, 112, 233, 0.7)');
      gradientColor.addColorStop(1, 'rgba(185, 103, 255, 0.7)');
      mainColor = gradientColor;
    } else {
      let frequencyColor = '#8B5CF6';
      
      if (currentTrack?.customData?.frequency) {
        const freq = currentTrack.customData.frequency;
        if (freq < 250) frequencyColor = chakraColors.root;
        else if (freq < 350) frequencyColor = chakraColors.sacral;
        else if (freq < 450) frequencyColor = chakraColors.solar;
        else if (freq < 550) frequencyColor = chakraColors.heart;
        else if (freq < 650) frequencyColor = chakraColors.throat;
        else if (freq < 750) frequencyColor = chakraColors.thirdEye;
        else frequencyColor = chakraColors.crown;
      }
      
      mainColor = frequencyColor;
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, seedRadius, 0, Math.PI * 2);
    ctx.fillStyle = typeof mainColor === 'string' ? `${mainColor}80` : mainColor;
    ctx.fill();
    
    ctx.shadowBlur = 15;
    ctx.shadowColor = typeof mainColor === 'string' ? mainColor : '#8B5CF6';
    
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i;
      const distance = seedRadius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      ctx.beginPath();
      ctx.arc(x, y, seedRadius * (0.5 + averageAmplitude * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = typeof mainColor === 'string' 
        ? `${mainColor}40`
        : mainColor;
      ctx.fill();
    }
    
    const time = performance.now() / 1000;
    const pulseFactor = 1 + Math.sin(time * 2) * 0.1;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, seedRadius * 2 * pulseFactor, 0, Math.PI * 2);
    ctx.strokeStyle = typeof mainColor === 'string' ? mainColor : '#8B5CF6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    if (isPlaying && audioData) {
      const currentFrequency = currentTrack?.customData?.frequency || 0;
      const isPrimeOrClose = primeNumbers.some(prime => 
        Math.abs(currentFrequency - prime) < 5 || 
        Math.abs(currentFrequency % prime) < 5
      );
      
      if (isPrimeOrClose && Math.random() > 0.9) {
        const angle = Math.random() * Math.PI * 2;
        const distance = seedRadius * (1 + Math.random());
        
        circlesRef.current.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          radius: seedRadius * (0.3 + Math.random() * 0.3),
          opacity: 0.7,
          color: liftTheVeil 
            ? `hsla(${Math.random() * 360}, 100%, 70%, 0.7)`
            : typeof mainColor === 'string' ? mainColor : '#8B5CF6'
        });
      }
      
      if (averageAmplitude > 0.4 && Math.random() > 0.8) {
        circlesRef.current.push({
          x: centerX,
          y: centerY,
          radius: seedRadius * 0.8,
          opacity: 0.5,
          color: typeof mainColor === 'string' ? mainColor : '#8B5CF6'
        });
      }
    }
    
    circlesRef.current = circlesRef.current.filter(circle => {
      circle.radius += 1;
      circle.opacity -= 0.01;
      
      if (circle.opacity <= 0 || circle.radius > Math.min(canvas.width, canvas.height) / 2) {
        return false;
      }
      
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      
      const colorString = circle.color.startsWith('hsl') 
        ? circle.color.replace(')', `, ${circle.opacity})`)
        : circle.color.startsWith('rgb')
          ? circle.color.replace(')', `, ${circle.opacity})`)
          : `${circle.color}${Math.floor(circle.opacity * 255).toString(16).padStart(2, '0')}`;
      
      ctx.fillStyle = colorString;
      ctx.fill();
      
      return true;
    });
    
    ctx.shadowBlur = 0;
    
    if (activePrime) {
      const primeRingRadius = seedRadius * 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, primeRingRadius, 0, Math.PI * 2);
      ctx.strokeStyle = liftTheVeil 
        ? `rgba(255, 54, 171, ${0.3 + Math.sin(time * 3) * 0.2})`
        : `rgba(139, 92, 246, ${0.3 + Math.sin(time * 3) * 0.2})`;
      ctx.lineWidth = 3 + Math.sin(time * 2) * 2;
      ctx.stroke();
      
      ctx.font = `${fullscreen ? 20 : 14}px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = liftTheVeil ? 'rgba(255, 54, 171, 0.8)' : 'rgba(139, 92, 246, 0.8)';
      ctx.fillText(`Prime ${activePrime}`, centerX, fullscreen ? centerY + 60 : centerY + 40);
    }
    
    animationFrameRef.current = requestAnimationFrame(drawVisualizer);
  };

  useEffect(() => {
    if (!analyser || !isPlaying) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateAudioData = () => {
      analyser.getByteFrequencyData(dataArray);
      setAudioData(dataArray);
    };
    
    const intervalId = setInterval(updateAudioData, 30);
    
    return () => clearInterval(intervalId);
  }, [analyser, isPlaying]);

  useEffect(() => {
    if (isPlaying && canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, canvasSize, audioData]);

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
  
  const handlePrimeDetected = (prime: number) => {
    setActivePrime(prime);
    
    if (!detectedPrimes.includes(prime)) {
      setDetectedPrimes(prev => [...prev, prime]);
    }
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

  const geometryOptions = [
    { value: 'flower-of-life', label: 'Flower of Life' },
    { value: 'seed-of-life', label: 'Seed of Life' },
    { value: 'metatrons-cube', label: 'Metatron\'s Cube' },
    { value: 'merkaba', label: 'Merkaba' },
    { value: 'torus', label: 'Torus' },
    { value: 'tree-of-life', label: 'Tree of Life' },
    { value: 'sri-yantra', label: 'Sri Yantra' },
    { value: 'vesica-piscis', label: 'Vesica Piscis' },
  ];
  
  const colorOptions = [
    { value: 'purple', label: 'Purple' },
    { value: 'blue', label: 'Blue' },
    { value: 'rainbow', label: 'Rainbow' },
    { value: 'gold', label: 'Gold' },
    { value: 'chakra', label: 'Chakra-based' },
  ];
  
  const modeOptions = [
    { value: 'classic', label: 'Classic', icon: <Maximize2 size={16} /> },
    { value: 'sacred-geometry', label: 'Sacred Geometry', icon: <Maximize size={16} /> },
    { value: 'prime', label: 'Prime Visualizer', icon: <Volume2 size={16} /> },
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
              <div className="text-xs font-semibold text-white/90 mb-2">Visualizer Mode</div>
              <div className="grid grid-cols-3 gap-2">
                {modeOptions.map(mode => (
                  <button
                    key={mode.value}
                    className={`text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-2
                      ${visualizerMode === mode.value 
                        ? getSchemeClasses(colorScheme, 'bg') + ' text-white' 
                        : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
                    onClick={() => changeVisualizerMode(mode.value as VisualizerMode)}
                  >
                    {mode.icon} {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {visualizerMode === 'sacred-geometry' && (
              <div>
                <div className="text-xs font-semibold text-white/90 mb-2">Geometric Pattern</div>
                <div className="grid grid-cols-2 gap-2">
                  {geometryOptions.map(pattern => (
                    <button
                      key={pattern.value}
                      className={`text-xs px-3 py-2 rounded-lg
                        ${currentGeometry === pattern.value 
                          ? getSchemeClasses(colorScheme, 'bg') + ' text-white' 
                          : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
                      onClick={() => changeGeometricPattern(pattern.value as GeometryShape)}
                    >
                      {pattern.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    onClick={() => changeColorScheme(color.value as ColorScheme)}
                  >
                    {color.label}
                  </button>
                ))}
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
            {visualizerMode === 'classic' && (
              <canvas 
                ref={canvasRef}
                className="absolute inset-0 w-full h-full sacred-geometry-canvas rounded-lg"
                style={{ opacity: 0.9 }}
              />
            )}
            
            {visualizerMode === 'prime' && (expanded || fullscreen) && (
              <div className="absolute inset-0 w-full h-full">
                <PrimeAudioVisualizer 
                  audioContext={audioContext} 
                  analyser={analyser} 
                  isPlaying={isPlaying}
                  colorMode={liftTheVeil ? 'veil-lifted' : colorScheme === 'chakra' ? 'chakra' : 'standard'}
                  colorScheme={colorScheme}
                  visualMode="prime"
                  layout={fullscreen ? 'radial' : 'vertical'}
                  onPrimeDetected={handlePrimeDetected}
                  sensitivity={visualizerSensitivity}
                  chakra={currentTrack?.customData?.chakra}
                />
              </div>
            )}
            
            {visualizerMode === 'sacred-geometry' && (expanded || fullscreen) && (
              <div className="absolute inset-0 w-full h-full">
                <SacredGeometryVisualizer
                  defaultShape={currentGeometry}
                  size={fullscreen ? 'xl' : 'lg'}
                  showControls={false}
                  isAudioReactive={true}
                  audioContext={audioContext}
                  analyser={analyser}
                  isVisible={true}
                  chakra={currentTrack?.customData?.chakra}
                  frequency={currentTrack?.customData?.frequency}
                  expandable={false}
                  mode={fullscreen ? 'spiral' : 'fractal'} 
                  sensitivity={visualizerSensitivity}
                  colorScheme={colorScheme}
                />
              </div>
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
            
            {(expanded || fullscreen) && detectedPrimes.length > 0 && (
              <div className="flex gap-1 flex-wrap mb-2 max-w-full">
                {detectedPrimes.slice(0, 5).map(prime => (
                  <span 
                    key={prime}
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activePrime === prime 
                        ? liftTheVeil ? 'bg-pink-500 text-white' : getSchemeClasses(colorScheme, 'bg') + ' text-white'
                        : liftTheVeil ? 'bg-pink-500/20 text-pink-200' : getSchemeClasses(colorScheme, 'bg').replace('bg-', 'bg-') + '/20 text-white/80'
                    }`}
                  >
                    {prime}
                  </span>
                ))}
                {detectedPrimes.length > 5 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/10 text-white/70">
                    +{detectedPrimes.length - 5}
                  </span>
                )}
              </div>
            )}
            
            {(expanded || fullscreen) && audioData && (
              <div className="w-full h-16 mb-2">
                <FrequencyEqualizer 
                  frequencyData={audioData}
                  barCount={32}
                  chakraColor={currentTrack?.customData?.chakra || colorScheme}
                  isLiftedVeil={liftTheVeil}
                  colorScheme={colorScheme}
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
