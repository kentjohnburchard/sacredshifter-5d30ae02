
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
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
import { toast } from "sonner";
import SacredGeometryVisualizer from "@/components/sacred-geometry/SacredGeometryVisualizer";
import { calculatePrimeFactors, generatePrimeSequence } from "@/utils/primeCalculations";
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
  onError?: (error: any) => void;
  syncWithGlobalPlayer?: boolean;
  isPlaying?: boolean;
}

const CosmicAudioPlayer = forwardRef<any, CosmicAudioPlayerProps>(({
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
  onError,
  syncWithGlobalPlayer = false,
  isPlaying: externalIsPlaying,
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay && !syncWithGlobalPlayer);
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
  const [audioContextInitialized, setAudioContextInitialized] = useState(false);
  const [visualizerKey, setVisualizerKey] = useState<string>(Date.now().toString());
  const [activeMode, setActiveMode] = useState<'fractal' | 'spiral' | 'mandala' | 'liquid-crystal'>('fractal');
  const [audioUrl, setAudioUrl] = useState<string | undefined>(defaultAudioUrl);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeCreatedRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const { liftTheVeil } = useTheme();

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    setAudioSource: (url: string) => {
      console.log("CosmicAudioPlayer: Setting audio source:", url);
      setAudioUrl(url);
    },
    getAnalyser: () => analyserRef.current,
    getAudioContext: () => audioContextRef.current
  }));
  
  // Handle external playing state changes when in sync mode
  useEffect(() => {
    if (syncWithGlobalPlayer && externalIsPlaying !== undefined) {
      setIsPlaying(externalIsPlaying);
    }
  }, [syncWithGlobalPlayer, externalIsPlaying]);
  
  // Update audio URL when it changes
  useEffect(() => {
    setAudioUrl(defaultAudioUrl);
  }, [defaultAudioUrl]);
  
  // Initialize audio context only once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const setupAudioContext = () => {
      if (!audioContextRef.current) {
        try {
          // Create new AudioContext
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          
          // Create analyzer
          const analyser = audioContextRef.current.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.8;
          analyserRef.current = analyser;
          
          console.log("Audio context and analyser initialized");
        } catch (err) {
          console.error("Error initializing audio context:", err);
          if (onError) onError(err);
        }
      }
    };

    setupAudioContext();
    
    return () => {
      // Don't close the audio context on unmount as it may be shared
    };
  }, [onError]);
  
  // Connect audio element to analyser only once when both refs exist
  useEffect(() => {
    if (!audioRef.current || !audioContextRef.current || !analyserRef.current) return;
    
    // Only create source node if it hasn't been created yet
    if (!sourceNodeCreatedRef.current) {
      try {
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        sourceNodeCreatedRef.current = true;
        setAudioContextInitialized(true);
        console.log("Audio connected to analyser successfully");
      } catch (error) {
        // If error is about already being connected, we can ignore it
        if (error instanceof DOMException && error.name === 'InvalidStateError') {
          console.log("Audio already connected to a source node, continuing");
          setAudioContextInitialized(true); 
        } else {
          console.error("Error connecting audio:", error);
          if (onError) onError(error);
        }
      }
    }
  }, [onError]);
  
  // Handle audio element events for non-synced player
  useEffect(() => {
    // Skip this setup if we're syncing with the global player
    if (syncWithGlobalPlayer) return;
    
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
    
    const handleError = (e: any) => {
      console.error("Audio player error:", e);
      setIsPlaying(false);
      if (onError) onError(e);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    audio.volume = volume;
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onError, syncWithGlobalPlayer]);
  
  // Auto-play effect for non-synced player
  useEffect(() => {
    if (autoPlay && audioRef.current && !isPlaying && !syncWithGlobalPlayer) {
      // Wait a moment to ensure everything is initialized
      const timer = setTimeout(() => {
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Error auto-playing audio:", error);
              if (onError) onError(error);
            });
          }
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [autoPlay, onError, isPlaying, syncWithGlobalPlayer]);
  
  // Detect prime frequencies in audio
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
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle play/pause - only used for non-synced player
  const togglePlay = () => {
    // If synced with global player, we should not control audio playback directly
    if (syncWithGlobalPlayer) {
      console.log("CosmicAudioPlayer: In sync mode, playback controlled by global player");
      return;
    }
    
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
  
  // Handle volume change
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    
    if (!audioRef.current || syncWithGlobalPlayer) return;
    
    audioRef.current.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current || syncWithGlobalPlayer) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioRef.current.muted = newMutedState;
  };
  
  // Handle seek
  const handleSeek = (values: number[]) => {
    if (!audioRef.current || !duration || syncWithGlobalPlayer) return;
    
    try {
      const seekTime = values[0];
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    } catch (error) {
      console.error("Error seeking audio:", error);
      if (onError) onError(error);
    }
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onExpandStateChange) {
      onExpandStateChange(newExpandedState);
    }
  };
  
  // Handle shape change
  const handleShapeChange = (shape: string) => {
    setCurrentShape(shape);
    // Force a re-render of the visualizer when shape changes
    setVisualizerKey(Date.now().toString());
    toast.success(`Sacred geometry changed to ${shape.replace(/-/g, ' ')}`);
  };
  
  // Handle color theme change
  const handleColorThemeChange = (theme: string) => {
    setColorTheme(theme);
    toast.success(`Color theme changed to ${theme.replace(/-/g, ' ')}`);
  };
  
  // Handle visualization mode change
  const handleModeChange = (mode: 'fractal' | 'spiral' | 'mandala' | 'liquid-crystal') => {
    setActiveMode(mode);
    setVisualizerKey(Date.now().toString());
    toast.success(`Visualization mode changed to ${mode.replace(/-/g, ' ')}`);
  };
  
  // Get theme classes
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
  
  // Drag handlers
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragControls.start(event);
    setIsDragging(true);
  };
  
  const endDrag = () => {
    setIsDragging(false);
  };
  
  // Toggle controls
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  // Toggle visualizer
  const toggleVisualizer = () => {
    setIsVisualizerOpen(!isVisualizerOpen);
  };
  
  // Component rendering
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
          {/* We still create an audio element for visualizations in sync mode, but don't connect it for playback */}
          {!syncWithGlobalPlayer && (
            <audio 
              ref={audioRef}
              src={audioUrl} 
              preload="metadata"
              onError={(e) => {
                console.error("Audio player error:", e);
                if (onError) onError(e);
              }}
            />
          )}
          
          <div className={`flex flex-col ${isExpanded ? 'h-full' : ''}`}>
            <AnimatePresence>
              {isVisualizerOpen && (
                <motion.div
                  key={visualizerKey}
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
                    {audioContextInitialized && (
                      <SacredGeometryVisualizer
                        key={visualizerKey}
                        defaultShape={currentShape}
                        size={isExpanded ? "xl" : "md"}
                        isAudioReactive={syncWithGlobalPlayer ? isPlaying : isPlaying}
                        audioContext={audioContextRef.current}
                        analyser={analyserRef.current}
                        chakra={chakra}
                        frequency={defaultFrequency}
                        mode={activeMode}
                        liftedVeil={liftTheVeil}
                        isVisible={true}
                        showControls={false}
                      />
                    )}
                  </div>
                  
                  <div className="absolute inset-0 z-20 opacity-80">
                    {activeMode === 'liquid-crystal' && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="ripple-container">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className={`liquid-ripple ripple-${i+1}`}
                              style={{
                                width: `${50 + i * 10}%`,
                                height: `${50 + i * 10}%`,
                                left: `${25 - i * 5}%`,
                                top: `${25 - i * 5}%`,
                                animationDelay: `${i * 0.3}s`
                              }}
                            />
                          ))}
                        </div>
                        <div className="crystal-lattice" />
                      </div>
                    )}
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
                  
                  {/* For synced player, we don't show these controls */}
                  {!syncWithGlobalPlayer && (
                    <>
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
                            <SkipBack className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full w-10 h-10 text-white bg-white/10 hover:bg-white/20"
                            onClick={togglePlay}
                          >
                            {isPlaying ? (
                              <Pause className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5 ml-0.5" />
                            )}
                          </Button>
                          
                          {showVolumeControl && (
                            <div className="flex items-center space-x-2 ml-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-white/80 hover:text-white hover:bg-white/10"
                                onClick={toggleMute}
                              >
                                {isMuted || volume === 0 ? (
                                  <VolumeX className="h-4 w-4" />
                                ) : (
                                  <Volume2 className="h-4 w-4" />
                                )}
                              </Button>
                              
                              <Slider
                                value={[volume]}
                                max={1}
                                step={0.01}
                                onValueChange={handleVolumeChange}
                                className="w-16"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    {allowShapeChange && (
                      <Select
                        value={currentShape}
                        onValueChange={handleShapeChange}
                      >
                        <SelectTrigger 
                          className="h-8 w-8 px-0 bg-transparent border-none text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                        >
                          <Settings className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900/95 text-white border-slate-700">
                          <div className="p-2">
                            <p className="text-xs text-slate-400 mb-2">Sacred Geometry</p>
                            <div className="grid grid-cols-2 gap-1">
                              {SACRED_SHAPES.map(shape => (
                                <SelectItem 
                                  key={shape} 
                                  value={shape}
                                  className="rounded hover:bg-slate-800"
                                >
                                  {shape.split('-').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ')}
                                </SelectItem>
                              ))}
                            </div>
                            
                            <p className="text-xs text-slate-400 mt-3 mb-2">Visualization Mode</p>
                            <div className="grid grid-cols-2 gap-1">
                              <SelectItem 
                                value="fractal" 
                                className="rounded hover:bg-slate-800"
                                onSelect={() => handleModeChange('fractal')}
                              >
                                Fractal Flow
                              </SelectItem>
                              <SelectItem 
                                value="spiral" 
                                className="rounded hover:bg-slate-800"
                                onSelect={() => handleModeChange('spiral')}
                              >
                                Spiral Vortex
                              </SelectItem>
                              <SelectItem 
                                value="mandala" 
                                className="rounded hover:bg-slate-800"
                                onSelect={() => handleModeChange('mandala')}
                              >
                                Mandala Form
                              </SelectItem>
                              <SelectItem 
                                value="liquid-crystal" 
                                className="rounded hover:bg-slate-800"
                                onSelect={() => handleModeChange('liquid-crystal')}
                              >
                                Liquid Crystal
                              </SelectItem>
                            </div>
                          </div>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {allowColorChange && (
                      <Select
                        value={colorTheme}
                        onValueChange={handleColorThemeChange}
                      >
                        <SelectTrigger 
                          className="h-8 w-8 px-0 bg-transparent border-none text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                        >
                          <div 
                            className="h-4 w-4 rounded-full" 
                            style={{ 
                              background: colorTheme === 'cosmic-purple' ? 'linear-gradient(135deg, #9333ea, #4f46e5)' :
                                         colorTheme === 'sacred-gold' ? 'linear-gradient(135deg, #f59e0b, #b45309)' :
                                         colorTheme === 'ethereal-blue' ? 'linear-gradient(135deg, #0ea5e9, #1e40af)' :
                                         colorTheme === 'divine-green' ? 'linear-gradient(135deg, #10b981, #064e3b)' :
                                         colorTheme === 'risen-pink' ? 'linear-gradient(135deg, #ec4899, #be185d)' :
                                         'linear-gradient(135deg, #e5e7eb, #1f2937)'
                            }}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900/95 text-white border-slate-700">
                          <div className="p-2">
                            <p className="text-xs text-slate-400 mb-2">Color Theme</p>
                            <div className="grid grid-cols-2 gap-1">
                              {COLOR_THEMES.map(theme => (
                                <SelectItem 
                                  key={theme.value} 
                                  value={theme.value}
                                  className="rounded hover:bg-slate-800 flex items-center gap-2"
                                >
                                  <div 
                                    className="h-3 w-3 rounded-full" 
                                    style={{ 
                                      background: theme.value === 'cosmic-purple' ? 'linear-gradient(135deg, #9333ea, #4f46e5)' :
                                                 theme.value === 'sacred-gold' ? 'linear-gradient(135deg, #f59e0b, #b45309)' :
                                                 theme.value === 'ethereal-blue' ? 'linear-gradient(135deg, #0ea5e9, #1e40af)' :
                                                 theme.value === 'divine-green' ? 'linear-gradient(135deg, #10b981, #064e3b)' :
                                                 theme.value === 'risen-pink' ? 'linear-gradient(135deg, #ec4899, #be185d)' :
                                                 'linear-gradient(135deg, #e5e7eb, #1f2937)'
                                    }}
                                  />
                                  <span>{theme.name}</span>
                                </SelectItem>
                              ))}
                            </div>
                          </div>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default CosmicAudioPlayer;
