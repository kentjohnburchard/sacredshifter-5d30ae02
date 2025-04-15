
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { isPrime } from '@/lib/primeUtils';
import * as THREE from 'three';
import {
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  X,
  Eye
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { FlowerOfLifeGeometry, FibonacciSpiralGeometry, MerkabaGeometry, MetatronCubeGeometry, SriYantraGeometry, ChakraBeamGeometry } from '@/components/visualizer/sacred-geometries';

// Define chakra palettes
const chakraPalettes = {
  classic: {
    root: '#ef4444',
    sacral: '#f97316',
    solarPlexus: '#facc15',
    heart: '#22c55e',
    throat: '#3b82f6',
    thirdEye: '#6366f1',
    crown: '#a855f7'
  },
  mystic: {
    root: '#ff0055',
    sacral: '#ff6600',
    solarPlexus: '#ffcc00',
    heart: '#00ff99',
    throat: '#00ccff',
    thirdEye: '#9900ff',
    crown: '#ff33cc'
  },
  candy: {
    root: '#ff6ec7',
    sacral: '#ffb347',
    solarPlexus: '#ffff66',
    heart: '#98ff98',
    throat: '#00ffff',
    thirdEye: '#cba6ff',
    crown: '#ff69b4'
  },
  cosmic: {
    root: '#d81159',
    sacral: '#ff304f',
    solarPlexus: '#ffba49',
    heart: '#06d6a0',
    throat: '#1b9aaa',
    thirdEye: '#544b8d',
    crown: '#8a2be2'
  }
};

// Sacred geometry stages for evolution
const geometryTypes = [
  { type: 'circle', title: 'Origin Point' },
  { type: 'fibonacciSpiral', title: 'Fibonacci Spiral', component: FibonacciSpiralGeometry },
  { type: 'flowerOfLife', title: 'Flower of Life', component: FlowerOfLifeGeometry },
  { type: 'merkaba', title: 'Merkaba', component: MerkabaGeometry },
  { type: 'metatronCube', title: 'Metatron\'s Cube', component: MetatronCubeGeometry },
  { type: 'sriYantra', title: 'Sri Yantra', component: SriYantraGeometry },
  { type: 'chakraBeam', title: 'Chakra Beam', component: ChakraBeamGeometry }
];

// Audio frequency analysis constants
const FREQUENCY_BANDS = 32;
const DETECT_PRIME_THRESHOLD = 0.7; // Threshold for prime detection sensitivity

interface EnhancedSacredAudioPlayerProps {
  chakra?: string;
  frequency?: number;
  audioUrl?: string;
  initialPalette?: string;
}

const EnhancedSacredAudioPlayer: React.FC<EnhancedSacredAudioPlayerProps> = ({
  chakra = 'crown',
  frequency = 432,
  audioUrl,
  initialPalette = 'classic'
}) => {
  // State
  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<string>(initialPalette);
  const [hoverPalette, setHoverPalette] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [geometryStage, setGeometryStage] = useState(0);
  const [evolutionProgress, setEvolutionProgress] = useState(0);
  const [isEvolvingGeometry, setIsEvolvingGeometry] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [primesDetected, setPrimesDetected] = useState<number[]>([]);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const equalizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const primePulseTriggerRef = useRef<number>(0);
  
  // Audio player hook
  const {
    isPlaying,
    togglePlay,
    audioRef,
    audioContext,
    currentTrack,
    duration,
    currentTime,
    seekTo
  } = useAudioPlayer();

  // Set up audio analyzer
  useEffect(() => {
    if (!audioContext || !audioRef.current) return;

    // Clean up previous analyzer
    if (analyzerRef.current) {
      analyzerRef.current = null;
    }

    // Create analyzer node
    try {
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 2048;
      analyzer.smoothingTimeConstant = 0.8;
      
      // Connect audio to analyzer
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);
      
      // Create frequency data array
      const bufferLength = analyzer.frequencyBinCount;
      const frequencyData = new Uint8Array(bufferLength);
      
      analyzerRef.current = analyzer;
      frequencyDataRef.current = frequencyData;
    } catch (error) {
      console.error("Error setting up audio analyzer:", error);
    }

    return () => {
      if (analyzerRef.current) {
        analyzerRef.current.disconnect();
      }
    };
  }, [audioContext, audioRef]);

  // Extract current chakra color based on palette
  const chakraColor = useMemo(() => {
    const paletteToUse = hoverPalette || selectedPalette;
    const normalizedChakra = chakra.toLowerCase().replace(/\s+/g, '');
    
    // First try exact match
    if (chakraPalettes[paletteToUse][normalizedChakra]) {
      return chakraPalettes[paletteToUse][normalizedChakra];
    }
    
    // Fall back to crown if no match
    return chakraPalettes[paletteToUse].crown;
  }, [chakra, selectedPalette, hoverPalette]);

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

  // Set audio source if provided
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl, audioRef]);

  // Sacred geometry evolution based on audio
  useEffect(() => {
    let evolutionInterval: ReturnType<typeof setInterval>;
    
    // Start evolving when playing
    if (isPlaying) {
      setIsEvolvingGeometry(true);
      
      // Gradually evolve the sacred geometry over time
      evolutionInterval = setInterval(() => {
        setEvolutionProgress(prev => {
          const newProgress = prev + 0.25;
          
          // Check for stage transition
          if (newProgress >= 100 && geometryStage < geometryTypes.length - 1) {
            setGeometryStage(prevStage => prevStage + 1);
            return 0;
          }
          
          return Math.min(newProgress, 100);
        });
      }, 1000);
    } else {
      setIsEvolvingGeometry(false);
    }
    
    return () => {
      clearInterval(evolutionInterval);
    };
  }, [isPlaying, geometryStage]);

  // Audio visualization animation loop
  useEffect(() => {
    if (!isPlaying || !analyzerRef.current || !frequencyDataRef.current) return;
    
    const drawEqualizer = () => {
      if (!analyzerRef.current || !equalizerCanvasRef.current || !frequencyDataRef.current) return;
      
      const analyzer = analyzerRef.current;
      const canvas = equalizerCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Get frequency data
      analyzer.getByteFrequencyData(frequencyDataRef.current);
      const bufferLength = analyzer.frequencyBinCount;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw frequency bars
      const barWidth = (canvas.width / FREQUENCY_BANDS) * 0.8;
      const barSpacing = (canvas.width / FREQUENCY_BANDS) * 0.2;
      
      for (let i = 0; i < FREQUENCY_BANDS; i++) {
        // Get frequency value (average of a range of frequencies)
        const startIndex = Math.floor((i / FREQUENCY_BANDS) * bufferLength);
        const endIndex = Math.floor(((i + 1) / FREQUENCY_BANDS) * bufferLength);
        
        let sum = 0;
        for (let j = startIndex; j < endIndex; j++) {
          sum += frequencyDataRef.current[j];
        }
        const average = sum / (endIndex - startIndex);
        const barHeight = (average / 255) * (canvas.height);
        
        // Determine bar color based on chakra gradient
        const palette = chakraPalettes[selectedPalette];
        const chakraValues = Object.values(palette);
        const colorIndex = Math.floor((i / FREQUENCY_BANDS) * chakraValues.length);
        const color = chakraValues[colorIndex];
        
        // Draw bar with glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        
        const x = i * (barWidth + barSpacing);
        const y = canvas.height - barHeight;
        
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Check for prime frequency
        const frequencyValue = Math.round(20 + (i / FREQUENCY_BANDS) * 2000);
        const isFrequencyPrime = isPrime(frequencyValue);
        const normalizedValue = average / 255;
        
        // Detect prime frequency activation
        if (isFrequencyPrime && normalizedValue > DETECT_PRIME_THRESHOLD && frequencyValue > 50) {
          if (primePulseTriggerRef.current % 15 === 0) { // Limit triggers
            setPrimesDetected(prev => {
              if (prev.includes(frequencyValue)) return prev;
              const newPrimes = [...prev, frequencyValue];
              if (newPrimes.length > 5) newPrimes.shift(); // Keep only last 5 primes
              return newPrimes;
            });
          }
          primePulseTriggerRef.current += 1;
          
          // Draw prime indicator
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y + barHeight / 2, 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      
      // Continue animation frame
      animationFrameRef.current = requestAnimationFrame(drawEqualizer);
    };
    
    // Start animation
    drawEqualizer();
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, selectedPalette, analyzerRef.current]);
  
  // Calculate the current scale based on evolution progress
  const currentScale = useMemo(() => {
    return 1 + (evolutionProgress / 100) * 0.5;
  }, [evolutionProgress]);

  // Format time for display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Dynamic styles based on state
  const playerStyles = useMemo(() => {
    if (fullscreen) {
      return {
        container: "fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md",
        visualizer: "w-full flex-grow",
        controls: "w-full p-4 backdrop-blur-lg bg-black/50 flex flex-col gap-2",
      };
    }
    if (minimized) {
      return {
        container: "fixed bottom-4 right-4 z-50 w-64 rounded-lg shadow-xl overflow-hidden bg-black/80 backdrop-blur-md border border-purple-500/30",
        visualizer: "h-20",
        controls: "p-2 flex items-center gap-2",
      };
    }
    return {
      container: "fixed bottom-4 right-4 z-50 w-96 rounded-lg shadow-xl overflow-hidden bg-black/80 backdrop-blur-md border border-purple-500/30",
      visualizer: expanded ? "h-72" : "h-48",
      controls: "p-3 flex flex-col gap-2",
    };
  }, [fullscreen, minimized, expanded]);

  // Determine current geometry component
  const CurrentGeometry = useMemo(() => {
    if (geometryStage === 0) {
      // Initial circle (vesica piscis)
      return null; // We'll render a simple circle manually
    }
    
    return geometryTypes[geometryStage]?.component;
  }, [geometryStage]);

  // Handle player position drag (floating UI)
  const handleDragEnd = (event, info) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Snap to edges if close enough
    const snapThreshold = 20;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let newX = info.point.x;
    let newY = info.point.y;
    
    // Snap to right edge
    if (viewportWidth - (info.point.x + rect.width) < snapThreshold) {
      newX = viewportWidth - rect.width;
    }
    
    // Snap to left edge
    if (info.point.x < snapThreshold) {
      newX = 0;
    }
    
    // Snap to bottom edge
    if (viewportHeight - (info.point.y + rect.height) < snapThreshold) {
      newY = viewportHeight - rect.height;
    }
    
    // Snap to top edge
    if (info.point.y < snapThreshold) {
      newY = 0;
    }
    
    // Apply new position
    container.style.transform = `translate(${newX}px, ${newY}px)`;
  };

  // Handle seeking in audio
  const handleSeek = (value: number[]) => {
    seekTo(value[0]);
  };

  // Return to normal view from fullscreen
  const exitFullscreen = () => {
    setFullscreen(false);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className={playerStyles.container}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", duration: 0.5 }}
        drag={!fullscreen}
        dragMomentum={false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {/* Visualizer */}
        <motion.div className={playerStyles.visualizer}>
          <Canvas
            shadows
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <color attach="background" args={['#000000']} />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color={chakraColor} />
            <fog attach="fog" args={['#000000', 5, 20]} />
            
            {/* Origin circle (vesica piscis) - always visible but grows into complex shapes */}
            {geometryStage === 0 && (
              <mesh scale={currentScale}>
                <torusGeometry args={[1, 0.1, 16, 32]} />
                <meshStandardMaterial
                  color={chakraColor}
                  emissive={chakraColor}
                  emissiveIntensity={2}
                  metalness={0.5}
                  roughness={0.2}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}
            
            {/* Current sacred geometry based on evolution stage */}
            {CurrentGeometry && (
              <CurrentGeometry
                chakra={chakra.toLowerCase().replace(/\s+/g, '-') as any}
                intensity={(evolutionProgress / 100) * 0.7}
                frequencyData={frequencyDataRef.current}
                scale={currentScale}
                isActive={true}
              />
            )}
            
            {/* Prime number pulse effects */}
            {primesDetected.map((prime, index) => (
              <mesh key={`prime-${prime}-${index}`} scale={1 + index * 0.1}>
                <ringGeometry args={[1.8 + index * 0.1, 1.9 + index * 0.1, 64]} />
                <meshBasicMaterial 
                  color={chakraColor} 
                  transparent 
                  opacity={0.2 - index * 0.03} 
                  side={THREE.DoubleSide} 
                />
              </mesh>
            ))}
            
            {/* Camera controls */}
            <OrbitControls 
              enablePan={false}
              enableZoom={fullscreen}
              enableRotate={true}
              autoRotate={isPlaying}
              autoRotateSpeed={1.0}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>
        </motion.div>
        
        {/* Controls */}
        <motion.div className={playerStyles.controls}>
          {/* Title & Frequency */}
          {!minimized && (
            <div className="flex justify-between items-center">
              <div className="text-white text-sm font-medium truncate">
                {currentTrack?.title || "Sacred Audio"}
                <div className="text-xs text-white/70">
                  {frequency}Hz • {chakra} Chakra
                </div>
              </div>
              
              <div className="flex space-x-2">
                {fullscreen && (
                  <Button 
                    onClick={exitFullscreen}
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-white/80 hover:text-white"
                  >
                    <X size={16} />
                  </Button>
                )}
                {!fullscreen && (
                  <>
                    <Button 
                      onClick={() => setExpanded(!expanded)}
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-white/80 hover:text-white"
                    >
                      {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </Button>
                    <Button 
                      onClick={() => setFullscreen(true)}
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-white/80 hover:text-white"
                    >
                      <Maximize2 size={16} />
                    </Button>
                    <Button 
                      onClick={() => setMinimized(!minimized)}
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-white/80 hover:text-white"
                    >
                      <Minimize2 size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Playback controls */}
          <div className={`flex ${minimized ? 'justify-between' : 'justify-center'} items-center`}>
            {/* Play/Pause button */}
            <Button
              onClick={togglePlay}
              size={minimized ? "sm" : "default"}
              variant="default" 
              className={`rounded-full ${minimized ? 'w-8 h-8' : 'w-12 h-12'} bg-gradient-to-tr from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500`}
            >
              {isPlaying ? (
                <Pause size={minimized ? 14 : 20} className="text-white" />
              ) : (
                <Play size={minimized ? 14 : 20} className="text-white ml-0.5" />
              )}
            </Button>
            
            {/* Title in minimized view */}
            {minimized && (
              <div className="text-white text-xs truncate max-w-[120px]">
                {currentTrack?.title || "Sacred Audio"}
              </div>
            )}
            
            {/* Volume control in minimized view */}
            {minimized && (
              <div className="relative">
                <Button
                  onClick={toggleMute}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-white/80 hover:text-white"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </Button>
              </div>
            )}
          </div>
          
          {/* Additional controls when expanded */}
          {!minimized && (
            <>
              {/* Time slider */}
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span>{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="flex-grow"
                />
                <span>{formatTime(duration || 0)}</span>
              </div>
              
              {/* Volume control button */}
              <div className="flex justify-between items-center">
                <div className="relative">
                  <Button
                    onClick={() => setShowVolume(!showVolume)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white/80 hover:text-white"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </Button>
                  
                  {/* Volume slider popup */}
                  {showVolume && (
                    <motion.div 
                      className="absolute left-0 bottom-full mb-2 bg-black/90 backdrop-blur-md p-3 rounded-md shadow-lg w-48 z-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={toggleMute}
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-white/80"
                        >
                          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </Button>
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          min={0}
                          max={1}
                          step={0.01}
                          onValueChange={(val) => setVolume(val[0])}
                          className="flex-grow"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Palette selector */}
                {expanded && (
                  <div className="flex gap-1">
                    {Object.keys(chakraPalettes).map((palette) => (
                      <motion.button
                        key={palette}
                        className={`w-6 h-6 rounded-full border ${selectedPalette === palette ? 'border-white' : 'border-gray-700'}`}
                        style={{
                          background: `linear-gradient(to right, ${chakraPalettes[palette].root}, ${chakraPalettes[palette].crown})`,
                        }}
                        onClick={() => setSelectedPalette(palette)}
                        onMouseEnter={() => setHoverPalette(palette)}
                        onMouseLeave={() => setHoverPalette(null)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.95 }}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Equalizer */}
              {expanded && (
                <div className="mt-2 p-1 border border-white/10 rounded-lg bg-black/30">
                  <canvas 
                    ref={equalizerCanvasRef}
                    width={300}
                    height={40}
                    className="w-full h-10 rounded"
                  />
                  
                  {/* Prime number frequencies detected */}
                  {primesDetected.length > 0 && (
                    <div className="mt-1 text-[10px] text-white/60 flex gap-1 flex-wrap">
                      {primesDetected.map(prime => (
                        <span 
                          key={prime} 
                          className="px-1.5 py-0.5 rounded bg-white/10 text-white/80"
                        >
                          {prime}Hz
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Geometry stage indicator */}
              {expanded && geometryTypes[geometryStage] && (
                <motion.div 
                  className="text-xs text-center text-white/60 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={geometryStage}
                >
                  <span>
                    {geometryTypes[geometryStage].title} {isEvolvingGeometry && '• Evolving'}
                  </span>
                  
                  {isEvolvingGeometry && (
                    <div className="mt-1 bg-white/10 rounded-full h-1 overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                        style={{ width: `${evolutionProgress}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedSacredAudioPlayer;
