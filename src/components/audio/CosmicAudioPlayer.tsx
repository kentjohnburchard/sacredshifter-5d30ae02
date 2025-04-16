import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Maximize2, Minimize2, ChevronDown, Settings, PanelLeft
} from "lucide-react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useGlobalAudioPlayer } from "@/hooks/useGlobalAudioPlayer";
import { toast } from "sonner";
import SacredGeometryVisualizer from "@/components/sacred-geometry/SacredGeometryVisualizer";
import { calculatePrimeFactors, isPrime } from "@/utils/primeCalculations";
import PrimeAudioVisualizer from "@/components/audio/PrimeAudioVisualizer";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";

const SACRED_SHAPES = [
  'flower-of-life',
  'seed-of-life',
  'metatrons-cube',
  'merkaba',
  'torus',
  'tree-of-life',
  'sri-yantra',
  'vesica-piscis',
  'sphere'
];

const COLOR_THEMES = [
  { name: "Cosmic Purple", value: "cosmic-purple" },
  { name: "Sacred Gold", value: "sacred-gold" },
  { name: "Ethereal Blue", value: "ethereal-blue" },
  { name: "Divine Green", value: "divine-green" },
  { name: "Risen Pink", value: "risen-pink" },
  { name: "Quantum White", value: "quantum-white" },
];

interface CosmicAudioPlayerProps {
  defaultAudioUrl?: string;
  defaultFrequency?: number;
  title?: string;
  description?: string;
  autoPlay?: boolean;
  showVolumeControl?: boolean;
  allowShapeChange?: boolean;
  allowColorChange?: boolean;
  initialShape?: string;
  initialColorTheme?: string;
  chakra?: string;
  initialIsExpanded?: boolean;
  onExpandStateChange?: (expanded: boolean) => void;
}

const CosmicAudioPlayer: React.FC<CosmicAudioPlayerProps> = ({
  defaultAudioUrl,
  defaultFrequency = 396,
  title,
  description,
  autoPlay = false,
  showVolumeControl = true,
  allowShapeChange = true,
  allowColorChange = true,
  initialShape = 'flower-of-life',
  initialColorTheme = 'cosmic-purple',
  chakra,
  initialIsExpanded = false,
  onExpandStateChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activePrimes, setActivePrimes] = useState<number[]>([]);
  
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
  const [colorTheme, setColorTheme] = useState(initialColorTheme);
  const [currentShape, setCurrentShape] = useState<string>(initialShape);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const { liftTheVeil } = useTheme();
  
  const { 
    playAudio, 
    isPlaying: globalIsPlaying, 
    currentAudio,
    togglePlayPause 
  } = useGlobalAudioPlayer();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
      
      console.log("Audio context and analyser initialized");
    }
    
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);
  
  useEffect(() => {
    const connectAudio = () => {
      if (!audioRef.current || !audioContextRef.current || !analyserRef.current) return;
      
      try {
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        console.log("Audio connected to analyser");
      } catch (error) {
        console.error("Error connecting audio:", error);
      }
    };
    
    const timer = setTimeout(connectAudio, 100);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    
    audio.volume = volume;
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  useEffect(() => {
    if (autoPlay && audioRef.current && !isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error auto-playing audio:", error);
        });
      }
    }
  }, [autoPlay]);
  
  const handlePrimeDetected = (prime: number) => {
    setActivePrimes(prevPrimes => {
      if (!prevPrimes.includes(prime)) {
        const newPrimes = [prime, ...prevPrimes].slice(0, 5);
        console.log("Prime detected:", prime, "Active primes:", newPrimes);
        toast.info(`Prime Frequency Detected: ${prime}Hz`);
        return newPrimes;
      }
      return prevPrimes;
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (audioRef.current.paused) {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Unable to play audio. Please try again.");
        });
      }
    } else {
      audioRef.current.pause();
    }
  };
  
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    
    if (!audioRef.current) return;
    
    audioRef.current.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioRef.current.muted = newMutedState;
  };
  
  const handleSeek = (values: number[]) => {
    if (!audioRef.current || !duration) return;
    
    const seekTime = values[0];
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };
  
  const toggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onExpandStateChange) {
      onExpandStateChange(newExpandedState);
    }
  };
  
  const handleShapeChange = (shape: string) => {
    setCurrentShape(shape);
    toast.info(`Sacred geometry changed to ${shape.replace(/-/g, ' ')}`);
  };
  
  const handleColorThemeChange = (theme: string) => {
    setColorTheme(theme);
    toast.info(`Color theme changed to ${theme.replace(/-/g, ' ')}`);
  };
  
  const getThemeClasses = () => {
    const baseClasses = "cosmic-audio-player rounded-lg shadow-xl transition-all duration-300";
    
    const themeClasses = {
      "cosmic-purple": "bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border-purple-500/30",
      "sacred-gold": "bg-gradient-to-br from-amber-900/80 to-yellow-800/80 border-yellow-500/30",
      "ethereal-blue": "bg-gradient-to-br from-blue-900/80 to-cyan-900/80 border-blue-500/30",
      "divine-green": "bg-gradient-to-br from-emerald-900/80 to-green-900/80 border-emerald-500/30",
      "risen-pink": "bg-gradient-to-br from-pink-900/80 to-rose-900/80 border-pink-500/30",
      "quantum-white": "bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-400/30",
    };
    
    return `${baseClasses} ${themeClasses[colorTheme as keyof typeof themeClasses] || themeClasses["cosmic-purple"]}`;
  };
  
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragControls.start(event);
    setIsDragging(true);
  };
  
  const endDrag = () => {
    setIsDragging(false);
  };
  
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  const toggleVisualizer = () => {
    setIsVisualizerOpen(!isVisualizerOpen);
  };
  
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      drag={!isExpanded}
      dragControls={dragControls}
      dragMomentum={false}
      dragListener={false}
      className={`fixed ${isExpanded ? 'inset-0 z-50' : 'bottom-4 right-4 z-40'}`}
      style={{
        width: isExpanded ? '100%' : '380px',
        height: isExpanded ? '100%' : 'auto',
        backdropFilter: "blur(10px)",
      }}
    >
      <Card
        className={`${getThemeClasses()} ${
          isExpanded ? 'w-full h-full rounded-none' : 'w-full border'
        } overflow-hidden relative`}
      >
        {!isExpanded && (
          <div 
            className="absolute top-0 left-0 right-0 h-8 cursor-move flex items-center justify-center"
            onPointerDown={startDrag}
            onPointerUp={endDrag}
          >
            <div className="w-12 h-1 bg-white/30 rounded-full my-2"></div>
          </div>
        )}
        
        <CardContent className={`p-0 ${isExpanded ? 'h-full flex flex-col' : ''}`}>
          <audio 
            ref={audioRef}
            src={defaultAudioUrl} 
            preload="metadata"
            autoPlay={autoPlay}
          />
          
          <div className={`flex flex-col ${isExpanded ? 'h-full' : ''}`}>
            <AnimatePresence>
              {isVisualizerOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: isExpanded ? 'auto' : '250px', 
                    opacity: 1 
                  }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full relative ${isExpanded ? 'flex-1' : 'h-[250px]'} overflow-hidden`}
                >
                  <div className="absolute inset-0 z-10">
                    <SacredGeometryVisualizer
                      defaultShape={currentShape as any}
                      size={isExpanded ? "xl" : "md"}
                      isAudioReactive={isPlaying}
                      audioContext={audioContextRef.current}
                      analyser={analyserRef.current}
                      chakra={chakra}
                      frequency={defaultFrequency}
                      mode="fractal"
                      liftedVeil={liftTheVeil}
                    />
                  </div>
                  
                  <div className="absolute inset-0 z-20 opacity-80">
                    <PrimeAudioVisualizer
                      audioContext={audioContextRef.current}
                      analyser={analyserRef.current}
                      isPlaying={isPlaying}
                      colorMode={liftTheVeil ? 'veil-lifted' : 'standard'}
                      visualMode="prime"
                      layout={isExpanded ? 'radial' : 'vertical'}
                      onPrimeDetected={handlePrimeDetected}
                    />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-wrap gap-2 justify-center">
                    {activePrimes.map((prime, index) => (
                      <div 
                        key={`${prime}-${index}`}
                        className={`px-3 py-1 rounded-full text-xs font-mono backdrop-blur-md ${
                          liftTheVeil 
                            ? 'bg-pink-600/40 text-pink-100 border border-pink-400/30' 
                            : 'bg-purple-600/40 text-purple-100 border border-purple-400/30'
                        } animate-pulse`}
                      >
                        Prime {prime}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 ${isExpanded ? 'pb-8' : ''}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">
                        {title || (defaultFrequency ? `${defaultFrequency}Hz Frequency` : 'Cosmic Audio Player')}
                      </h3>
                      <p className="text-xs text-white/70 truncate">
                        {description || 'Sacred geometry audio visualization'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={toggleVisualizer}
                      >
                        <PanelLeft className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={toggleExpanded}
                      >
                        {isExpanded ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="my-2"
                    />
                    
                    <div className="flex justify-between text-xs text-white/60">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration || 0)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2 items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white/80 hover:text-white hover:bg-white/10"
                        onClick={() => {
                          if (!audioRef.current) return;
                          audioRef.current.currentTime = 0;
                        }}
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        variant={isPlaying ? "secondary" : "default"}
                        size="icon"
                        className={`rounded-full ${
                          isPlaying 
                            ? 'bg-white/20 text-white hover:bg-white/30' 
                            : `${liftTheVeil ? 'bg-pink-600' : 'bg-purple-600'} text-white`
                        }`}
                        onClick={togglePlay}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white/80 hover:text-white hover:bg-white/10"
                        onClick={() => {
                          if (!audioRef.current) return;
                          audioRef.current.currentTime = Math.min(
                            audioRef.current.currentTime + 10,
                            audioRef.current.duration || 0
                          );
                        }}
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    {showVolumeControl && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                          onClick={toggleMute}
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          max={1}
                          step={0.01}
                          onValueChange={handleVolumeChange}
                          className="w-24"
                        />
                      </div>
                    )}
                  </div>
                  
                  {(isExpanded || allowShapeChange || allowColorChange) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {allowShapeChange && (
                        <Select
                          value={currentShape}
                          onValueChange={handleShapeChange}
                        >
                          <SelectTrigger 
                            className="h-8 px-3 py-1 text-xs bg-black/30 border-white/10 text-white/80 w-[140px]"
                          >
                            <SelectValue placeholder="Sacred Pattern" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/80 border-white/10 text-white">
                            {SACRED_SHAPES.map((shape) => (
                              <SelectItem key={shape} value={shape} className="text-xs capitalize">
                                {shape.replace(/-/g, ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      {allowColorChange && (
                        <Select
                          value={colorTheme}
                          onValueChange={handleColorThemeChange}
                        >
                          <SelectTrigger 
                            className="h-8 px-3 py-1 text-xs bg-black/30 border-white/10 text-white/80 w-[140px]"
                          >
                            <SelectValue placeholder="Color Theme" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/80 border-white/10 text-white">
                            {COLOR_THEMES.map((theme) => (
                              <SelectItem key={theme.value} value={theme.value} className="text-xs">
                                {theme.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      {defaultFrequency && (
                        <div className="flex items-center h-8 px-3 rounded-md bg-black/30 border border-white/10">
                          <span className="text-xs text-white/80">{defaultFrequency}Hz</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {!showControls && (
              <div className="p-2 flex justify-between items-center">
                <Button
                  variant={isPlaying ? "secondary" : "default"}
                  size="sm"
                  className={`rounded-full ${
                    isPlaying 
                      ? 'bg-white/20 text-white hover:bg-white/30' 
                      : `${liftTheVeil ? 'bg-pink-600' : 'bg-purple-600'} text-white`
                  }`}
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={toggleControls}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={toggleExpanded}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CosmicAudioPlayer;
