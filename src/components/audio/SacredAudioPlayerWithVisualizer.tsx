
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Maximize2, 
  Clock, 
  Save, 
  Headphones, 
  Speaker, 
  Moon, 
  Waves, 
  Settings,
  X
} from 'lucide-react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { formatTime } from '@/lib/utils';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { getColorFromScheme } from '@/utils/audioVisuals';
import { isPrime } from '@/utils/primeCalculations';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { VisualizerManager } from '@/components/visualizer/VisualizerManager';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Define Journey type based on your configuration
interface JourneyFrequency {
  name: string;
  value: string;
  description: string;
}

interface JourneySettings {
  sensitivity?: 'low' | 'medium' | 'high';
  headphones?: boolean;
  sleepTimer?: number; // in minutes
  pinkNoiseOnly?: boolean;
}

export interface Journey {
  id?: string;
  title: string;
  description?: string;
  frequencies?: number[] | JourneyFrequency[];
  chakras?: string[];
  soundSources?: string[];
  affirmation?: string;
  theme?: string;
  settings?: JourneySettings;
  audioUrl?: string;
  visualTheme?: string;
}

// Create Zustand store for player state
interface PlayerState {
  isExpanded: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  sleepTimerActive: boolean;
  sleepTimerMinutes: number;
  headphonesMode: boolean;
  lowSensitivityMode: boolean;
  pinkNoiseMode: boolean;
  
  toggleExpanded: () => void;
  togglePlayPause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  toggleSleepTimer: () => void;
  setSleepTimerMinutes: (minutes: number) => void;
  toggleHeadphonesMode: () => void;
  toggleLowSensitivityMode: () => void;
  togglePinkNoiseMode: () => void;
}

const usePlayerStore = create<PlayerState>((set) => ({
  isExpanded: true,
  isPlaying: false,
  isMuted: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  sleepTimerActive: false,
  sleepTimerMinutes: 30,
  headphonesMode: true,
  lowSensitivityMode: false,
  pinkNoiseMode: false,
  
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  toggleSleepTimer: () => set((state) => ({ sleepTimerActive: !state.sleepTimerActive })),
  setSleepTimerMinutes: (sleepTimerMinutes) => set({ sleepTimerMinutes }),
  toggleHeadphonesMode: () => set((state) => ({ headphonesMode: !state.headphonesMode })),
  toggleLowSensitivityMode: () => set((state) => ({ lowSensitivityMode: !state.lowSensitivityMode })),
  togglePinkNoiseMode: () => set((state) => ({ pinkNoiseMode: !state.pinkNoiseMode }))
}));

// Component to display equalizer bars
const EqualizerBars: React.FC<{ audioData?: Uint8Array; primePulse?: boolean }> = ({ audioData, primePulse = false }) => {
  const bars = 32;
  const barElements = [];
  
  for (let i = 0; i < bars; i++) {
    const height = audioData ? (audioData[i] || 0) / 255 * 100 : Math.random() * 50 + 10;
    const isPrimeNumber = isPrime(i + 1);
    
    barElements.push(
      <div
        key={i}
        className={`w-1 mx-0.5 rounded-t ${isPrimeNumber && primePulse ? 'bg-purple-500' : 'bg-purple-300/70'}`}
        style={{ 
          height: `${height}%`,
          transition: 'height 0.1s ease-in-out',
          animation: isPrimeNumber && primePulse ? 'pulse 2s infinite' : 'none'
        }}
      />
    );
  }
  
  return (
    <div className="flex items-end justify-center h-16 mb-2">
      {barElements}
    </div>
  );
};

// Main component
const SacredAudioPlayerWithVisualizer: React.FC<{ journey?: Journey }> = ({ journey }) => {
  const {
    isExpanded,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    sleepTimerActive,
    sleepTimerMinutes,
    headphonesMode,
    lowSensitivityMode,
    pinkNoiseMode,
    toggleExpanded,
    togglePlayPause,
    toggleMute,
    setVolume,
    setCurrentTime,
    setDuration,
    toggleSleepTimer,
    setSleepTimerMinutes,
    toggleHeadphonesMode,
    toggleLowSensitivityMode,
    togglePinkNoiseMode
  } = usePlayerStore();

  const { liftTheVeil } = useTheme();
  const { playAudio, togglePlayPause: globalTogglePlayPause, currentAudio } = useGlobalAudioPlayer();
  const { audioRef, seekTo, audioLoaded } = useAudioPlayer();
  
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [audioData, setAudioData] = useState<Uint8Array>();
  const [sleepTimerTimeLeft, setSleepTimerTimeLeft] = useState<number | null>(null);
  
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Initialize audio context and analyzer for visualizer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      
      if (audioRef.current) {
        try {
          const source = audioContext.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          
          // Set up animation frame for visualizer
          const updateVisualizer = () => {
            if (analyserRef.current) {
              const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
              analyserRef.current.getByteFrequencyData(dataArray);
              setAudioData(dataArray);
            }
            animationFrameRef.current = requestAnimationFrame(updateVisualizer);
          };
          updateVisualizer();
        } catch (error) {
          if (error instanceof Error && !error.toString().includes('already connected')) {
            console.error('Error connecting audio analyzer:', error);
          }
        }
      }
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(console.error);
        }
      };
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  }, []);
  
  // Handle play/pause toggle
  const handleTogglePlay = () => {
    togglePlayPause();
    globalTogglePlayPause();
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    if (newVolume > 0 && isMuted) {
      toggleMute();
    }
  };
  
  // Handle seeking
  const handleSeekMouseDown = () => {
    setIsSeeking(true);
  };
  
  const handleSeekChange = (value: number[]) => {
    const newValue = value[0];
    setSeekTime(newValue);
  };
  
  const handleSeekMouseUp = () => {
    setIsSeeking(false);
    seekTo(seekTime);
  };
  
  // Update current time from audio player
  useEffect(() => {
    if (!isSeeking && audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setSeekTime(audioRef.current.currentTime);
      
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  }, [isSeeking, setCurrentTime, setDuration]);
  
  // Set up sleep timer
  useEffect(() => {
    if (sleepTimerActive && sleepTimerMinutes > 0) {
      const timeInMs = sleepTimerMinutes * 60 * 1000;
      const endTime = Date.now() + timeInMs;
      
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
      }
      
      sleepTimerRef.current = setInterval(() => {
        const remaining = Math.max(0, endTime - Date.now());
        const minutesLeft = Math.floor(remaining / (60 * 1000));
        
        setSleepTimerTimeLeft(minutesLeft);
        
        if (remaining <= 0) {
          // Stop playback
          if (isPlaying) {
            handleTogglePlay();
          }
          
          // Clear timer
          if (sleepTimerRef.current) {
            clearInterval(sleepTimerRef.current);
            sleepTimerRef.current = null;
          }
          
          setSleepTimerTimeLeft(null);
          toast.success("Sleep timer completed, audio paused");
        }
      }, 1000);
      
      toast.info(`Sleep timer set for ${sleepTimerMinutes} minutes`);
      
      return () => {
        if (sleepTimerRef.current) {
          clearInterval(sleepTimerRef.current);
        }
      };
    } else {
      setSleepTimerTimeLeft(null);
      
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
        sleepTimerRef.current = null;
      }
    }
  }, [sleepTimerActive, sleepTimerMinutes, isPlaying, handleTogglePlay]);
  
  // Handler to save to timeline
  const handleSaveToTimeline = () => {
    if (!journey) return;
    
    // This would integrate with your timeline service
    toast.success(`Saved "${journey.title}" to timeline`);
  };
  
  // Determine color scheme based on journey theme
  const getJourneyColorScheme = () => {
    if (!journey || !journey.theme) return 'purple';
    
    if (journey.theme.includes('blue')) return 'blue';
    if (journey.theme.includes('pink')) return 'pink';
    if (journey.theme.includes('gold')) return 'gold';
    
    return 'purple'; // default
  };
  
  // Check if journey is provided
  if (!journey) {
    return null;
  }
  
  // Apply low sensitivity filter if enabled
  useEffect(() => {
    if (!audioContextRef.current || !analyserRef.current) return;
    
    try {
      if (lowSensitivityMode) {
        // Create a low-pass filter to reduce high frequencies
        const filter = audioContextRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000; // Adjust as needed
        
        // Reconnect with filter
        analyserRef.current.disconnect();
        analyserRef.current.connect(filter);
        filter.connect(audioContextRef.current.destination);
      } else {
        // Reconnect without filter
        try {
          analyserRef.current.disconnect();
          analyserRef.current.connect(audioContextRef.current.destination);
        } catch (e) {
          // Ignore disconnect errors
        }
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  }, [lowSensitivityMode]);
  
  // Extract the first frequency if available
  const mainFrequency = Array.isArray(journey.frequencies) && journey.frequencies.length > 0 
    ? typeof journey.frequencies[0] === 'number' 
      ? journey.frequencies[0] 
      : parseFloat((journey.frequencies[0] as JourneyFrequency).value)
    : undefined;
  
  // Main chakra if available
  const mainChakra = journey.chakras?.[0];
  
  // Determine audio source
  const audioUrl = journey.audioUrl || (pinkNoiseMode ? '/sounds/pink_noise.mp3' : '/sounds/focus-ambient.mp3');
  
  // Play audio when journey changes or settings change
  useEffect(() => {
    if (!journey) return;
    
    // Play the appropriate audio source
    playAudio({
      title: journey.title,
      artist: "Sacred Shifter",
      source: audioUrl,
      customData: {
        frequency: mainFrequency,
        chakra: mainChakra,
        journeyId: journey.id
      }
    });
    
  }, [journey, pinkNoiseMode, playAudio, audioUrl, mainFrequency, mainChakra]);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-4xl p-4">
          <div className="bg-black/30 backdrop-blur-lg rounded-lg shadow-xl border border-purple-500/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <div className="flex items-center">
                <Badge 
                  variant="outline" 
                  className="mr-2 bg-purple-500/20 text-purple-200 border-purple-500/30"
                >
                  {mainFrequency ? `${mainFrequency}Hz` : 'Sacred Audio'}
                </Badge>
                <h3 className="text-lg font-semibold text-white truncate">
                  {journey.title || 'Sacred Journey'}
                </h3>
              </div>
              
              <div className="flex items-center gap-1">
                {sleepTimerTimeLeft !== null && (
                  <Badge variant="secondary" className="mr-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {sleepTimerTimeLeft}m
                  </Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleExpanded} 
                  className="h-8 w-8 text-gray-300 hover:text-white"
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => null} // Close/hide player completely
                  className="h-8 w-8 text-gray-300 hover:text-white hover:bg-red-500/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Main Player Controls */}
            <div className="px-4 pb-3">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleTogglePlay}
                  className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                
                <div className="flex-grow">
                  <div>
                    <Slider
                      value={[seekTime]}
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeekChange}
                      onPointerDown={handleSeekMouseDown}
                      onPointerUp={handleSeekMouseUp}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                
                <div
                  className="relative"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-8 w-8 text-white"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  
                  {showVolumeSlider && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/60 rounded-lg shadow-lg z-10 w-32">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.01}
                        onValueChange={(values) => handleVolumeChange(values)}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Expanded Content */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Visualizer */}
                <div className="h-64">
                  <VisualizerManager 
                    size="lg" 
                    isAudioReactive={true}
                    colorScheme={getJourneyColorScheme()}
                    chakra={mainChakra}
                    frequency={mainFrequency}
                  />
                </div>
                
                {/* Equalizer */}
                <div className="p-4 pb-0">
                  <EqualizerBars audioData={audioData} primePulse={true} />
                </div>
                
                {/* Affirmation */}
                {journey.affirmation && (
                  <div className="text-center px-6 pb-4">
                    <p className="text-purple-200 italic font-light">
                      "{journey.affirmation}"
                    </p>
                  </div>
                )}
                
                {/* Advanced Settings */}
                <div className="bg-black/40 p-4 flex flex-wrap justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Switch 
                      checked={lowSensitivityMode}
                      onCheckedChange={toggleLowSensitivityMode}
                      id="low-sensitivity"
                    />
                    <label htmlFor="low-sensitivity" className="text-gray-300">Low Sensitivity Mode</label>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Switch 
                      checked={headphonesMode}
                      onCheckedChange={toggleHeadphonesMode}
                      id="headphones-mode"
                    />
                    <label htmlFor="headphones-mode" className="text-gray-300 flex items-center gap-1">
                      {headphonesMode ? <Headphones className="h-3 w-3" /> : <Speaker className="h-3 w-3" />}
                      {headphonesMode ? 'Headphones' : 'Speaker'}
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Switch 
                      checked={pinkNoiseMode}
                      onCheckedChange={togglePinkNoiseMode}
                      id="pink-noise"
                    />
                    <label htmlFor="pink-noise" className="text-gray-300 flex items-center gap-1">
                      <Waves className="h-3 w-3" />
                      Pink Noise Only
                    </label>
                  </div>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Sleep Timer
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 bg-black/90 border-purple-500/30">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-200">Sleep Timer</h4>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={sleepTimerActive}
                            onCheckedChange={toggleSleepTimer}
                            id="sleep-timer"
                          />
                          <label htmlFor="sleep-timer" className="text-gray-300 text-sm">
                            {sleepTimerActive ? 'Active' : 'Inactive'}
                          </label>
                        </div>
                        
                        <div className="pt-2">
                          <label className="text-xs text-gray-400 block mb-1">Duration: {sleepTimerMinutes} minutes</label>
                          <Slider
                            value={[sleepTimerMinutes]}
                            min={5}
                            max={120}
                            step={5}
                            onValueChange={(values) => setSleepTimerMinutes(values[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>5m</span>
                            <span>120m</span>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveToTimeline}
                    className="text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save to Timeline
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SacredAudioPlayerWithVisualizer;
