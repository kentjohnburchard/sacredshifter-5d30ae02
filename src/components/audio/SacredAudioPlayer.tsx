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
import SacredGeometryVisualizer from '../sacred-geometry/SacredGeometryVisualizer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import FrequencyEqualizer from '../visualizer/FrequencyEqualizer';

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
  
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const circlesRef = useRef<Array<{x: number, y: number, radius: number, opacity: number, color: string}>>([]);
  const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  
  const [currentGeometry, setCurrentGeometry] = useState<GeometryShape>('flower-of-life');
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('classic');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('purple');
  
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
    
    const intervalId = setInterval(updateAudioData, 50);
    
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
      if (!document.fullscreenElement && fullscreen) {
        setFullscreen(false);
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
    { value: 'classic', label: 'Classic' },
    { value: 'sacred-geometry', label: 'Sacred Geometry' },
    { value: 'prime', label: 'Prime Visualizer' },
  ];

  return (
    <motion.div 
      ref={containerRef}
      className={cn(
        `fixed z-[1000] rounded-xl overflow-visible sacred-audio-player ${isPlaying ? 'is-playing' : ''} ${liftTheVeil ? 'veil-lifted' : ''}`,
        fullscreen ? 'inset-0 rounded-none' : isJourneyPlayerRoute ? 'bottom-4 left-1/2 -translate-x-1/2' : 'bottom-4 right-4',
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
                colorMode={liftTheVeil ? 'veil-lifted' : 'standard'}
                visualMode="prime"
                layout={fullscreen ? 'radial' : 'vertical'}
                onPrimeDetected={handlePrimeDetected}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-white/70 hover:text-white relative"
                      title="Customize Visualizer"
                    >
                      <Palette size={16} />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="bg-black/90 backdrop-blur-md border-white/10 z-[1002] w-72 shadow-xl"
                  >
                    <div className="p-2">
                      <div className="text-xs font-semibold mb-1">Visualizer Mode</div>
                      <div className="grid grid-cols-3 gap-1 mb-2">
                        {modeOptions.map(mode => (
                          <button
                            key={mode.value}
                            className={`text-xs px-2 py-1 rounded ${
                              visualizerMode === mode.value ? 'bg-purple-600' : 'bg-black/50 hover:bg-purple-800/50'
                            }`}
                            onClick={() => changeVisualizerMode(mode.value as VisualizerMode)}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                      
                      {visualizerMode === 'sacred-geometry' && (
                        <>
                          <div className="text-xs font-semibold mb-1">Geometric Pattern</div>
                          <div className="grid grid-cols-2 gap-1 mb-2">
                            {geometryOptions.map(pattern => (
                              <button
                                key={pattern.value}
                                className={`text-xs px-2 py-1 rounded ${
                                  currentGeometry === pattern.value ? 'bg-purple-600' : 'bg-black/50 hover:bg-purple-800/50'
                                }`}
                                onClick={() => changeGeometricPattern(pattern.value as GeometryShape)}
                              >
                                {pattern.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                      
                      <div className="text-xs font-semibold mb-1">Color Scheme</div>
                      <div className="grid grid-cols-3 gap-1">
                        {colorOptions.map(color => (
                          <button
                            key={color.value}
                            className={`text-xs px-2 py-1 rounded ${
                              colorScheme === color.value ? 'bg-purple-600' : 'bg-black/50 hover:bg-purple-800/50'
                            }`}
                            onClick={() => changeColorScheme(color.value as ColorScheme)}
                          >
                            {color.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
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
                className="h-full bg-white/70 rounded-full"
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
                      ? liftTheVeil ? 'bg-pink-500 text-white' : 'bg-purple-500 text-white'
                      : liftTheVeil ? 'bg-pink-500/20 text-pink-200' : 'bg-purple-500/20 text-purple-200'
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
                chakraColor={currentTrack?.customData?.chakra || 'purple'}
                isLiftedVeil={liftTheVeil}
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
                    className="w-24"
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
  );
};

export default SacredAudioPlayer;
