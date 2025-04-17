import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Maximize2, Minimize2, ChevronDown, Settings, PanelLeft, Bug
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
  visualModeOnly?: boolean;
  debugMode?: boolean;
  providedAudioContext?: AudioContext | null;
  providedAnalyser?: AnalyserNode | null;
  sourceConnected?: boolean;
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
  visualModeOnly = false,
  debugMode = false,
  providedAudioContext = null,
  providedAnalyser = null,
  sourceConnected = false,
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
  const [showControls, setShowControls] = useState(!visualModeOnly);
  const [isDragging, setIsDragging] = useState(false);
  const [audioContextInitialized, setAudioContextInitialized] = useState(false);
  const [visualizerKey, setVisualizerKey] = useState<string>(Date.now().toString());
  const [activeMode, setActiveMode] = useState<'fractal' | 'spiral' | 'mandala' | 'liquid-crystal'>('fractal');
  const [audioUrl, setAudioUrl] = useState<string | undefined>(defaultAudioUrl);
  const [showDebugInfo, setShowDebugInfo] = useState(debugMode);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(providedAudioContext);
  const analyserRef = useRef<AnalyserNode | null>(providedAnalyser);
  const sourceNodeCreatedRef = useRef<boolean>(sourceConnected);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const { liftTheVeil } = useTheme();

  useEffect(() => {
    if (providedAudioContext) {
      audioContextRef.current = providedAudioContext;
      setAudioContextInitialized(true);
    }
    
    if (providedAnalyser) {
      analyserRef.current = providedAnalyser;
    }
    
    if (sourceConnected) {
      sourceNodeCreatedRef.current = true;
    }
  }, [providedAudioContext, providedAnalyser, sourceConnected]);

  useImperativeHandle(ref, () => ({
    setAudioSource: (url: string) => {
      console.log("CosmicAudioPlayer: Setting audio source:", url);
      setAudioUrl(url);
    },
    getAnalyser: () => analyserRef.current,
    getAudioContext: () => audioContextRef.current
  }));
  
  useEffect(() => {
    if (syncWithGlobalPlayer && externalIsPlaying !== undefined) {
      setIsPlaying(externalIsPlaying);
    }
  }, [syncWithGlobalPlayer, externalIsPlaying]);
  
  useEffect(() => {
    setAudioUrl(defaultAudioUrl);
  }, [defaultAudioUrl]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (audioContextRef.current && analyserRef.current) {
      console.log("CosmicAudioPlayer: Using provided audio context and analyser");
      setAudioContextInitialized(true);
      return;
    }
    
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
          
          console.log("Audio context and analyser initialized in CosmicAudioPlayer");
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
  
  useEffect(() => {
    if (sourceNodeCreatedRef.current) {
      // Source already connected, no need to reconnect
      console.log("CosmicAudioPlayer: Source already connected, skipping connection");
      setAudioContextInitialized(true);
      return;
    }
    
    if (!audioRef.current || !audioContextRef.current || !analyserRef.current) return;
    
    try {
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      sourceNodeCreatedRef.current = true;
      setAudioContextInitialized(true);
      console.log("CosmicAudioPlayer: Audio connected to analyser successfully");
    } catch (error) {
      // If error is about already being connected, we can ignore it
      if (error instanceof DOMException && error.name === 'InvalidStateError') {
        console.log("CosmicAudioPlayer: Audio already connected to a source node, continuing");
        setAudioContextInitialized(true); 
      } else {
        console.error("CosmicAudioPlayer: Error connecting audio:", error);
        if (onError) onError(error);
      }
    }
  }, [onError]);
  
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
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const togglePlay = () => {
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
  
  const toggleMute = () => {
    if (!audioRef.current || syncWithGlobalPlayer) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioRef.current.muted = newMutedState;
  };
  
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
  
  const toggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onExpandStateChange) {
      onExpandStateChange(newExpandedState);
    }
  };
  
  const handleShapeChange = (shape: string) => {
    setCurrentShape(shape);
    setVisualizerKey(Date.now().toString());
    toast.success(`Sacred geometry changed to ${shape.replace(/-/g, ' ')}`);
  };
  
  const handleColorThemeChange = (theme: string) => {
    setColorTheme(theme);
    toast.success(`Color theme changed to ${theme.replace(/-/g, ' ')}`);
  };
  
  const handleModeChange = (mode: 'fractal' | 'spiral' | 'mandala' | 'liquid-crystal') => {
    setActiveMode(mode);
    setVisualizerKey(Date.now().toString());
    toast.success(`Visualization mode changed to ${mode.replace(/-/g, ' ')}`);
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
  
  const toggleDebugMode = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      drag={!isExpanded && !visualModeOnly}
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
        {!isExpanded && !visualModeOnly && (
          <div 
            className="absolute top-0 left-0 right-0 h-8 cursor-move flex items-center justify-center"
            onPointerDown={startDrag}
            onPointerUp={endDrag}
          >
            <div className="w-12 h-1 bg-white/30 rounded-full my-2"></div>
          </div>
        )}
        
        <CardContent className={`p-0 ${isExpanded ? 'h-full flex flex-col' : ''}`}>
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
                  
                  {showDebugInfo && (
                    <div className="absolute top-2 left-2 right-2 z-50 p-2 bg-black/80 text-white rounded text-xs font-mono">
                      <div className="mb-1">
                        <strong>Visual Debug:</strong>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="ml-2 h-6 px-2 py-0 text-[10px] bg-red-900/30 hover:bg-red-900/50 border-red-500/30"
                          onClick={toggleDebugMode}
                        >
                          Close
                        </Button>
                      </div>
                      <div>Audio URL: {audioUrl || 'None'}</div>
                      <div>Chakra: {chakra || 'None'}</div>
                      <div>Freq: {defaultFrequency || 'None'}</div>
                      <div>Shape: {currentShape}</div>
                      <div>Mode: {activeMode}</div>
                      <div>Sync: {syncWithGlobalPlayer ? 'Yes' : 'No'}</div>
                      <div>Playing: {isPlaying ? 'Yes' : 'No'}</div>
                      <div>Audio Context: {audioContextRef.current ? 'Created' : 'Missing'}</div>
                      <div>Analyser: {analyserRef.current ? 'Created' : 'Missing'}</div>
                      <div>Source Connected: {sourceNodeCreatedRef.current ? 'Yes' : 'No'}</div>
                      <div>Provided Context: {providedAudioContext ? 'Yes' : 'No'}</div>
                      <div>Provided Analyser: {providedAnalyser ? 'Yes' : 'No'}</div>
                    </div>
                  )}
                  
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
              {showControls && !visualModeOnly && (
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
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={toggleDebugMode}
                      >
                        <Bug className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
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
                        
                        <div className="flex justify-between text-xs text-gray-500">
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
            
            {visualModeOnly && (
              <div className="absolute bottom-4 right-4 z-40">
                <div className="flex space-x-2">
                  {allowShapeChange && (
                    <Select
                      value={currentShape}
                      onValueChange={handleShapeChange}
                    >
                      <SelectTrigger 
                        className="h-8 w-8 p-0 rounded-full bg-black/40 border-none text-white/70 hover:text-white hover:bg-black/60"
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
                  
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full bg-black/40 border-none text-white/70 hover:text-white hover:bg-black/60"
                    onClick={toggleDebugMode}
                  >
                    <Bug className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default CosmicAudioPlayer;
