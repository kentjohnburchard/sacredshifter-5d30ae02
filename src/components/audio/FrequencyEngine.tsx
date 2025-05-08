import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Play,
  Pause,
  Save,
  Volume2,
  VolumeX,
  Wand2,
  Plus,
  Star,
  CircleOff,
  Info,
  Settings,
  History,
  WaveformCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { createTone } from '@/utils/audioUtils';
import { JourneyPhase } from '@/components/journey/JourneyExperience';
import ArchetypeSymbol from '@/components/circle/ArchetypeSymbol';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import { ChakraTag, getChakraColor } from '@/types/chakras';

// ========== Type Definitions ==========
type WaveformType = 'sine' | 'square' | 'triangle' | 'sawtooth';
type MoodType = 'calm' | 'focus' | 'elevated' | 'healing';

interface ChakraPreset {
  name: string;
  frequency: number;
  color: string;
  glyph: string;
  label: string;
}

interface FrequencyConfig {
  frequency: number;
  volume: number;
  waveform: WaveformType;
  mood: MoodType;
  blend?: number;
}

interface FrequencyFavorite extends FrequencyConfig {
  id: string;
  name: string;
  chakra?: string;
  archetype?: string;
  dateCreated: string;
}

interface FrequencyEngineProps {
  activeChakra?: ChakraTag;
  activeArchetype?: string;
  phase?: JourneyPhase;
  autoPlay?: boolean;
  className?: string;
  onFrequencyChange?: (frequency: number) => void;
  onVisualizerParamsChange?: (params: any) => void;
}

// ========== Chakra & Archetype Data ==========
// Inline data as requested
const chakraPresets: Record<string, ChakraPreset> = {
  root: { name: "Root", frequency: 396, color: "#a83232", glyph: "/symbols/sword.svg", label: "The Warrior" },
  sacral: { name: "Sacral", frequency: 417, color: "#ff7a00", glyph: "/symbols/wave.svg", label: "The Creator" },
  solarPlexus: { name: "Solar Plexus", frequency: 528, color: "#ffd700", glyph: "/symbols/sun.svg", label: "The Hero" },
  heart: { name: "Heart", frequency: 639, color: "#e94560", glyph: "/symbols/rose.svg", label: "The Lover" },
  throat: { name: "Throat", frequency: 741, color: "#4ca1ff", glyph: "/symbols/wing.svg", label: "The Messenger" },
  thirdEye: { name: "Third Eye", frequency: 852, color: "#6a0dad", glyph: "/symbols/eye.svg", label: "The Seer" },
  crown: { name: "Crown", frequency: 963, color: "#ffffff", glyph: "/symbols/lotus.svg", label: "The Divine" }
};

const archetypeFrequencies: Record<string, number[]> = {
  "The Warrior": [396, 432],
  "The Creator": [417, 528],
  "The Hero": [528, 999],
  "The Lover": [639, 528],
  "The Messenger": [741, 852],
  "The Seer": [852, 963],
  "The Divine": [963, 7.83]
};

const specialFrequencies: Record<string, number> = {
  "Earth (Schumann)": 7.83,
  "Om": 432,
  "Manifestation": 111,
  "Deep Peace": 285,
  "DNA Repair": 528,
  "Third Eye": 852,
  "Divine Connection": 963
};

// ========== FrequencyEngine Component ==========
const FrequencyEngine: React.FC<FrequencyEngineProps> = ({
  activeChakra,
  activeArchetype,
  phase,
  autoPlay = false,
  className = '',
  onFrequencyChange,
  onVisualizerParamsChange
}) => {
  // ========== State ==========
  const [isPlaying, setIsPlaying] = useState(false);
  const [config, setConfig] = useState<FrequencyConfig>({
    frequency: 432,
    volume: 0.5,
    waveform: 'sine',
    mood: 'healing',
  });
  const [activeTab, setActiveTab] = useState('chakras');
  const [favorites, setFavorites] = useState<FrequencyFavorite[]>([]);
  const [isLooping, setIsLooping] = useState(true);
  const [isBlending, setIsBlending] = useState(false);
  const [blendFrequency, setBlendFrequency] = useState<number | null>(null);
  const [visualizerParams, setVisualizerParams] = useState({
    coeffA: 1.2,
    coeffB: 0.8,
    freqA: 4.1,
    freqB: 3.2,
    opacity: 0.8,
    strokeWeight: 1.5,
    speed: 0.5,
    color: '255,255,255',
  });
  
  // Refs for audio
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const blendOscillatorRef = useRef<OscillatorNode | null>(null);
  const blendGainNodeRef = useRef<GainNode | null>(null);
  const visualizerContainerId = "frequencyEngineVisualizer";

  // ========== Effects ==========
  
  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('frequency-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites:", e);
      }
    }
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem('frequency-favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  // Auto-play or stop based on journey phase
  useEffect(() => {
    if (!phase) return;
    
    if (phase === 'aligning' && autoPlay) {
      handlePlay();
    } else if (phase === 'integration') {
      // Begin fade out if playing
      if (isPlaying) {
        fadeOutAndStop();
      }
    }
    
    return () => {
      // Clean up audio when component unmounts
      stopAudio();
    };
  }, [phase, autoPlay]);

  // Update frequency when activeChakra changes
  useEffect(() => {
    if (activeChakra && !isPlaying) {
      // Find matching chakra preset
      const chakraKey = Object.keys(chakraPresets).find(key => 
        chakraPresets[key].name === activeChakra
      );
      
      if (chakraKey) {
        setConfig(prev => ({
          ...prev,
          frequency: chakraPresets[chakraKey].frequency,
        }));
        
        updateVisualizerFromChakra(chakraKey);
      }
    }
  }, [activeChakra]);

  // Update frequency when activeArchetype changes
  useEffect(() => {
    if (activeArchetype && archetypeFrequencies[activeArchetype]) {
      const primaryFreq = archetypeFrequencies[activeArchetype][0];
      
      setConfig(prev => ({
        ...prev,
        frequency: primaryFreq,
      }));
      
      // If there's a secondary frequency, set it as blend
      if (archetypeFrequencies[activeArchetype].length > 1) {
        setBlendFrequency(archetypeFrequencies[activeArchetype][1]);
        if (isPlaying) {
          setIsBlending(true);
          startBlendOscillator(archetypeFrequencies[activeArchetype][1]);
        }
      }
      
      // Update visualizer based on archetype
      updateVisualizerFromFrequency(primaryFreq);
    }
  }, [activeArchetype]);

  // Create/update audio when config changes while playing
  useEffect(() => {
    if (isPlaying) {
      updateMainOscillator();
      
      if (onFrequencyChange) {
        onFrequencyChange(config.frequency);
      }
    }
  }, [config.frequency, config.waveform]);

  // Update volume while playing
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = config.volume;
    }
  }, [config.volume]);

  // Update visualizer when frequency or mood changes
  useEffect(() => {
    updateVisualizerFromFrequency(config.frequency, config.mood);
  }, [config.frequency, config.mood]);

  // ========== Audio Functions ==========
  
  // Initialize audio context
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = config.volume;
    }
  };

  // Start main oscillator
  const startMainOscillator = () => {
    if (!audioContextRef.current) return;
    
    // Clean up any existing oscillator
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }
    
    // Create new oscillator
    oscillatorRef.current = audioContextRef.current.createOscillator();
    oscillatorRef.current.type = config.waveform;
    oscillatorRef.current.frequency.value = config.frequency;
    oscillatorRef.current.connect(gainNodeRef.current!);
    oscillatorRef.current.start();
  };

  // Start blend oscillator (for secondary frequency)
  const startBlendOscillator = (frequency: number) => {
    if (!audioContextRef.current || !frequency) return;
    
    // Clean up any existing blend oscillator
    if (blendOscillatorRef.current) {
      blendOscillatorRef.current.stop();
      blendOscillatorRef.current.disconnect();
    }
    
    // Create gain node for blend if needed
    if (!blendGainNodeRef.current) {
      blendGainNodeRef.current = audioContextRef.current.createGain();
      blendGainNodeRef.current.connect(audioContextRef.current.destination);
    }
    
    // Set gain for blend (lower than main)
    blendGainNodeRef.current.gain.value = config.volume * 0.4;
    
    // Create new oscillator for blend
    blendOscillatorRef.current = audioContextRef.current.createOscillator();
    blendOscillatorRef.current.type = config.waveform;
    blendOscillatorRef.current.frequency.value = frequency;
    blendOscillatorRef.current.connect(blendGainNodeRef.current);
    blendOscillatorRef.current.start();
  };

  // Update main oscillator without restarting
  const updateMainOscillator = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.type = config.waveform;
      oscillatorRef.current.frequency.value = config.frequency;
    }
    
    // Update blend oscillator if active
    if (isBlending && blendOscillatorRef.current && blendFrequency) {
      blendOscillatorRef.current.type = config.waveform;
      
      // Keep the blend frequency as is
      if (blendFrequency) {
        blendOscillatorRef.current.frequency.value = blendFrequency;
      }
    }
  };

  // Stop all audio
  const stopAudio = () => {
    // Stop main oscillator
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    
    // Stop blend oscillator
    if (blendOscillatorRef.current) {
      blendOscillatorRef.current.stop();
      blendOscillatorRef.current.disconnect();
      blendOscillatorRef.current = null;
    }
  };

  // Fade out and stop audio
  const fadeOutAndStop = () => {
    if (!gainNodeRef.current) return;
    
    const fadeTime = 2; // seconds
    const currentTime = audioContextRef.current?.currentTime || 0;
    
    // Fade out main oscillator
    gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
    gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, currentTime + fadeTime);
    
    // Fade out blend oscillator if active
    if (blendGainNodeRef.current) {
      blendGainNodeRef.current.gain.setValueAtTime(blendGainNodeRef.current.gain.value, currentTime);
      blendGainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, currentTime + fadeTime);
    }
    
    // Schedule stop after fade
    setTimeout(() => {
      stopAudio();
      setIsPlaying(false);
    }, fadeTime * 1000);
  };
  
  // ========== Visualizer Functions ==========
  
  // Update visualizer based on frequency and mood
  const updateVisualizerFromFrequency = (frequency: number, mood: MoodType = config.mood) => {
    // Map frequency to visualizer parameters
    const freqNormalized = Math.log(frequency) / Math.log(1000); // Normalized 0-1 on log scale
    
    const newParams = {
      ...visualizerParams,
      coeffA: 1 + freqNormalized * 0.5,
      coeffB: 0.7 + freqNormalized * 0.6,
      freqA: 3 + freqNormalized * 2,
      freqB: 2 + freqNormalized * 3,
      speed: 0.3 + freqNormalized * 0.4,
    };
    
    // Adjust based on mood
    if (mood === 'calm') {
      newParams.speed *= 0.7;
      newParams.freqA *= 0.8;
      newParams.freqB *= 0.8;
    } else if (mood === 'elevated') {
      newParams.speed *= 1.3;
      newParams.freqA *= 1.2;
      newParams.freqB *= 1.2;
    } else if (mood === 'focus') {
      newParams.coeffA *= 1.1;
      newParams.coeffB *= 0.9;
    }
    
    // Update visualizer params
    setVisualizerParams(newParams);
    
    // Pass to parent component if callback provided
    if (onVisualizerParamsChange) {
      onVisualizerParamsChange(newParams);
    }
  };

  // Update visualizer based on chakra
  const updateVisualizerFromChakra = (chakraKey: string) => {
    const chakra = chakraPresets[chakraKey];
    if (!chakra) return;
    
    // Extract RGB components from chakra color
    const hexToRgb = (hex: string): [number, number, number] => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result 
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
          ]
        : [255, 255, 255];
    };
    
    const [r, g, b] = hexToRgb(chakra.color);
    
    setVisualizerParams({
      ...visualizerParams,
      color: `${r},${g},${b}`,
      // Subtly adjust other parameters based on chakra position
      coeffA: 1 + (Object.keys(chakraPresets).indexOf(chakraKey) / 7) * 0.5,
      speed: 0.3 + (Object.keys(chakraPresets).indexOf(chakraKey) / 7) * 0.7,
    });
  };
  
  // ========== Event Handlers ==========
  
  // Handle play/pause button click
  const handlePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      initAudio();
      startMainOscillator();
      
      // Start blend oscillator if blending is active
      if (isBlending && blendFrequency) {
        startBlendOscillator(blendFrequency);
      }
      
      setIsPlaying(true);
    }
  };

  // Toggle blending of secondary frequency
  const toggleBlend = () => {
    if (!isBlending && blendFrequency) {
      setIsBlending(true);
      if (isPlaying) {
        startBlendOscillator(blendFrequency);
      }
    } else {
      setIsBlending(false);
      if (blendOscillatorRef.current) {
        blendOscillatorRef.current.stop();
        blendOscillatorRef.current.disconnect();
        blendOscillatorRef.current = null;
      }
    }
  };

  // Update frequency config
  const updateFrequency = (frequency: number) => {
    setConfig({
      ...config,
      frequency,
    });
    
    // Update visualizer
    updateVisualizerFromFrequency(frequency);
  };

  // Update waveform type
  const updateWaveform = (waveform: WaveformType) => {
    setConfig({
      ...config,
      waveform,
    });
  };

  // Update mood
  const updateMood = (mood: MoodType) => {
    setConfig({
      ...config,
      mood,
    });
    
    // Update visualizer
    updateVisualizerFromFrequency(config.frequency, mood);
  };

  // Save current configuration as a favorite
  const saveAsFavorite = () => {
    const favorite: FrequencyFavorite = {
      id: Date.now().toString(),
      name: `${config.frequency}Hz ${config.waveform}`,
      frequency: config.frequency,
      volume: config.volume,
      waveform: config.waveform,
      mood: config.mood,
      chakra: activeChakra,
      archetype: activeArchetype,
      blend: blendFrequency || undefined,
      dateCreated: new Date().toISOString(),
    };
    
    setFavorites([...favorites, favorite]);
    toast.success(`Saved ${config.frequency}Hz as a favorite`);
  };

  // Load a favorite configuration
  const loadFavorite = (favorite: FrequencyFavorite) => {
    setConfig({
      frequency: favorite.frequency,
      volume: favorite.volume,
      waveform: favorite.waveform,
      mood: favorite.mood,
    });
    
    // Set blend frequency if present
    if (favorite.blend) {
      setBlendFrequency(favorite.blend);
      setIsBlending(true);
      
      if (isPlaying) {
        startBlendOscillator(favorite.blend);
      }
    } else {
      setBlendFrequency(null);
      setIsBlending(false);
      
      if (blendOscillatorRef.current) {
        blendOscillatorRef.current.stop();
        blendOscillatorRef.current.disconnect();
        blendOscillatorRef.current = null;
      }
    }
    
    toast.success(`Loaded ${favorite.frequency}Hz ${favorite.waveform}`);
  };

  // Delete a favorite
  const deleteFavorite = (id: string) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
    toast.success("Favorite removed");
  };

  // Get active chakra key from ChakraTag
  const getChakraKeyFromTag = (tag?: ChakraTag): string | null => {
    if (!tag) return null;
    
    return Object.keys(chakraPresets).find(key => 
      chakraPresets[key].name === tag
    ) || null;
  };

  // Get current color based on active chakra or frequency
  const getCurrentColor = () => {
    const chakraKey = getChakraKeyFromTag(activeChakra);
    
    if (chakraKey) {
      return chakraPresets[chakraKey].color;
    }
    
    // Default color based on frequency range
    if (config.frequency < 100) return "#3399ff"; // Blue for very low frequencies
    if (config.frequency < 300) return "#a83232"; // Root chakra range
    if (config.frequency < 400) return "#ff7a00"; // Sacral chakra range
    if (config.frequency < 500) return "#ffd700"; // Solar plexus range
    if (config.frequency < 600) return "#e94560"; // Heart chakra range
    if (config.frequency < 800) return "#4ca1ff"; // Throat chakra range
    if (config.frequency < 900) return "#6a0dad"; // Third eye range
    return "#ffffff";                             // Crown chakra range
  };

  // Get the active chakra preset if any
  const getActiveChakraPreset = (): ChakraPreset | null => {
    const chakraKey = getChakraKeyFromTag(activeChakra);
    return chakraKey ? chakraPresets[chakraKey] : null;
  };

  // Format frequency for display (show fewer decimal places for higher frequencies)
  const formatFrequency = (freq: number) => {
    return freq < 100 ? freq.toFixed(2) : freq.toFixed(1);
  };

  // ========== Component Rendering ==========
  const activeChakraPreset = getActiveChakraPreset();
  const currentColor = getCurrentColor();
  
  return (
    <Card className={`bg-gray-900/90 border border-purple-500/30 backdrop-blur-md overflow-hidden ${className}`}>
      {/* Header Section with Frequency Display */}
      <div 
        className="p-3 sm:p-4 border-b border-gray-800 flex items-center justify-between"
        style={{ background: `linear-gradient(to right, ${currentColor}20, transparent)` }}
      >
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {formatFrequency(config.frequency)}
              <span className="text-sm font-normal ml-1">Hz</span>
            </h3>
            {activeChakraPreset && (
              <Badge variant="outline" className="ml-2 border-purple-400/30">
                {activeChakraPreset.name}
              </Badge>
            )}
            {activeArchetype && (
              <Badge variant="outline" className="ml-2 border-amber-400/30">
                {activeArchetype}
              </Badge>
            )}
            {config.mood && (
              <Badge variant="outline" className="hidden sm:inline-flex ml-2 border-blue-400/30">
                {config.mood}
              </Badge>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <span className="mr-2">{config.waveform}</span>
            {isBlending && blendFrequency && (
              <span className="flex items-center">
                <Plus className="h-3 w-3 mx-1" />
                {formatFrequency(blendFrequency)}Hz blend
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <Button
            onClick={handlePlay}
            size="icon"
            variant="secondary"
            style={{ 
              backgroundColor: isPlaying ? `${currentColor}40` : 'transparent',
              borderColor: isPlaying ? currentColor : 'rgba(255,255,255,0.1)', 
            }}
            className="h-10 w-10 rounded-full transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          {/* Favorite Button */}
          <Button
            onClick={saveAsFavorite}
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full border-gray-700"
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Visualizer Area */}
      <div className="w-full h-32 sm:h-48 relative overflow-hidden bg-black/70">
        <SpiralVisualizer
          params={{
            ...visualizerParams,
            maxCycles: 3,
            color: visualizerParams.color,
          }}
          className="w-full h-full"
          containerId={visualizerContainerId}
        />
        
        {activeChakraPreset && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-60">
            <img 
              src={activeChakraPreset.glyph} 
              alt={activeChakraPreset.name} 
              className="h-16 w-16 filter drop-shadow"
              style={{ filter: `drop-shadow(0 0 8px ${activeChakraPreset.color})` }}
            />
          </div>
        )}
      </div>
      
      {/* Controls Section */}
      <div className="p-3 sm:p-4 bg-black/30">
        {/* Volume Slider */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={() => setConfig({...config, volume: config.volume > 0 ? 0 : 0.5 })}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400"
          >
            {config.volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          
          <Slider
            value={[config.volume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setConfig({...config, volume: value[0] / 100})}
            className="flex-1"
          />
          
          <div className="text-xs text-gray-400 w-8 text-right">
            {Math.round(config.volume * 100)}%
          </div>
        </div>
        
        {/* Tabs for different controls */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="chakras">Chakras</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="favorites">Saved</TabsTrigger>
          </TabsList>
          
          {/* Chakra Selection Tab */}
          <TabsContent value="chakras" className="mt-0">
            <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
              {Object.entries(chakraPresets).map(([key, chakra]) => (
                <Button
                  key={key}
                  onClick={() => updateFrequency(chakra.frequency)}
                  variant="outline"
                  size="sm"
                  className={`flex-shrink-0 border border-gray-800 ${config.frequency === chakra.frequency ? 'bg-gray-800' : 'bg-transparent'}`}
                  style={{
                    borderColor: config.frequency === chakra.frequency ? chakra.color : 'rgba(255,255,255,0.1)',
                    boxShadow: config.frequency === chakra.frequency ? `0 0 10px ${chakra.color}40` : 'none'
                  }}
                >
                  <div className="flex items-center">
                    <span className="mr-1.5 inline-block w-2 h-2 rounded-full" style={{ backgroundColor: chakra.color }}></span>
                    {chakra.name}
                    <span className="text-xs text-gray-400 ml-1.5">{chakra.frequency}Hz</span>
                  </div>
                </Button>
              ))}
            </div>
            
            {/* Special Frequencies */}
            <h4 className="text-sm font-medium text-gray-400 mt-4 mb-2">Special Frequencies</h4>
            <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
              {Object.entries(specialFrequencies).map(([name, freq]) => (
                <Button
                  key={name}
                  onClick={() => updateFrequency(freq)}
                  variant="outline"
                  size="sm"
                  className={`flex-shrink-0 border border-gray-800 ${config.frequency === freq ? 'bg-gray-800' : 'bg-transparent'}`}
                >
                  {name}
                  <span className="text-xs text-gray-400 ml-1.5">{formatFrequency(freq)}Hz</span>
                </Button>
              ))}
            </div>
            
            {/* Custom Frequency Input (limited implementation) */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Custom Frequency</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={config.frequency}
                  onChange={(e) => updateFrequency(Number(e.target.value))}
                  min="1"
                  max="20000"
                  step="0.1"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="text-sm text-gray-400">Hz</span>
              </div>
            </div>
          </TabsContent>
          
          {/* Controls Tab */}
          <TabsContent value="controls" className="mt-0">
            {/* Waveform Selection */}
            <h4 className="text-sm font-medium text-gray-400 mb-2">Waveform</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {(['sine', 'square', 'triangle', 'sawtooth'] as WaveformType[]).map(type => (
                <Button
                  key={type}
                  onClick={() => updateWaveform(type)}
                  variant={config.waveform === type ? "default" : "outline"}
                  size="sm"
                  className={config.waveform === type ? 'bg-purple-700 hover:bg-purple-600' : ''}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
            
            {/* Mood Selection */}
            <h4 className="text-sm font-medium text-gray-400 mb-2 mt-4">Mood</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {(['calm', 'focus', 'elevated', 'healing'] as MoodType[]).map(mood => (
                <Button
                  key={mood}
                  onClick={() => updateMood(mood)}
                  variant={config.mood === mood ? "default" : "outline"}
                  size="sm"
                  className={config.mood === mood ? 'bg-purple-700 hover:bg-purple-600' : ''}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </Button>
              ))}
            </div>
            
            {/* Blend Toggle */}
            <h4 className="text-sm font-medium text-gray-400 mb-2 mt-4">Frequency Blend</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Toggle
                  pressed={isBlending}
                  onPressedChange={toggleBlend}
                  disabled={!blendFrequency}
                  aria-label="Toggle frequency blending"
                >
                  <WaveformCircle className="h-4 w-4 mr-1" />
                  Blend Frequencies
                </Toggle>
                
                {isBlending && blendFrequency && (
                  <Badge variant="outline" className="ml-2">
                    +{formatFrequency(blendFrequency)}Hz
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Loop Toggle */}
            <div className="flex items-center mt-4">
              <Toggle
                pressed={isLooping}
                onPressedChange={() => setIsLooping(!isLooping)}
                aria-label="Toggle looping"
              >
                <History className="h-4 w-4 mr-1" />
                Loop Continuously
              </Toggle>
            </div>
          </TabsContent>
          
          {/* Favorites Tab */}
          <TabsContent value="favorites" className="mt-0 max-h-64 overflow-y-auto">
            {favorites.length > 0 ? (
              <div className="space-y-2">
                {favorites.map(favorite => (
                  <div 
                    key={favorite.id} 
                    className="flex items-center justify-between p-2 rounded-md bg-gray-800/50 hover:bg-gray-800 cursor-pointer"
                    onClick={() => loadFavorite(favorite)}
                  >
                    <div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1.5" />
                        <span className="font-medium">{formatFrequency(favorite.frequency)}Hz</span>
                        <span className="text-xs text-gray-400 ml-1.5">
                          {favorite.waveform}
                        </span>
                      </div>
                      {favorite.chakra && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {favorite.chakra} {favorite.archetype ? `• ${favorite.archetype}` : ''}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFavorite(favorite.id);
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-white hover:bg-red-900/30"
                    >
                      <CircleOff className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Save className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No saved favorites yet</p>
                <p className="text-xs mt-1">Use the save button to store your favorite frequencies</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default FrequencyEngine;
