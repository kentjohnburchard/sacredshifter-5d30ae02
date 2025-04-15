import React, { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import { useTheme } from '@/context/ThemeContext';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';
import { VisualizerManager } from '@/components/visualizer/VisualizerManager';
import { JourneyProps } from '@/types/journey';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  FastForward, Timer, Headphones, Waves, Moon, MoveDown, MoveUp, X, Eye, EyeOff
} from 'lucide-react';
import { isPrime } from '@/lib/primeUtils';
import { getChakraColorScheme } from '@/lib/chakraColors';

interface SacredAudioPlayerProps {
  audioUrl?: string;
  url?: string;
  frequency?: number;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  frequencyId?: string;
  groupId?: string;
  id?: string;
  journey?: JourneyProps;
}

interface JourneyOptions {
  pinkNoise: boolean;
  lowSensitivity: boolean;
  headphones: boolean;
  sleepTimer: number;
}

const SacredAudioPlayer: React.FC<SacredAudioPlayerProps> = ({
  audioUrl,
  url,
  frequency,
  isPlaying: externalIsPlaying,
  onPlayToggle: externalTogglePlay,
  frequencyId,
  groupId,
  id,
  journey
}) => {
  const {
    isPlaying,
    duration,
    currentTime,
    togglePlay,
    seekTo,
    audioRef,
    audioLoaded,
    audioError,
    currentTrack,
    setCurrentTime,
    setAudioSource
  } = useAudioPlayer();
  
  const { audioContext, analyser } = useAudioAnalyzer(audioRef.current);
  
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisualizerVisible, setIsVisualizerVisible] = useState(true);
  
  const [options, setOptions] = useState<JourneyOptions>({
    pinkNoise: false,
    lowSensitivity: false,
    headphones: false,
    sleepTimer: 0
  });
  
  const [sleepTimerActive, setSleepTimerActive] = useState(false);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(0);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const pinkNoiseRef = useRef<HTMLAudioElement | null>(null);
  
  const { liftTheVeil } = useTheme();
  
  useEffect(() => {
    if (!pinkNoiseRef.current) {
      const pinkNoise = new Audio('/sounds/pink-noise.mp3');
      pinkNoise.loop = true;
      pinkNoise.volume = 0.2;
      pinkNoiseRef.current = pinkNoise;
    }
    
    return () => {
      if (pinkNoiseRef.current) {
        pinkNoiseRef.current.pause();
        pinkNoiseRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (journey?.options) {
      setOptions({
        pinkNoise: journey.options.pinkNoise || false,
        lowSensitivity: journey.options.lowSensitivity || false,
        headphones: journey.options.headphones || false,
        sleepTimer: journey.options.sleepTimer || 0
      });
      
      if (journey.options.sleepTimer && journey.options.sleepTimer > 0) {
        startSleepTimer(journey.options.sleepTimer);
      }
    }
  }, [journey]);
  
  useEffect(() => {
    const source = audioUrl || url || journey?.audioUrl;
    if (source) {
      setAudioSource(source);
    }
  }, [audioUrl, url, journey, setAudioSource]);
  
  useEffect(() => {
    if (pinkNoiseRef.current) {
      if (isPlaying && options.pinkNoise) {
        pinkNoiseRef.current.play().catch(err => console.error("Error playing pink noise:", err));
      } else {
        pinkNoiseRef.current.pause();
      }
    }
  }, [isPlaying, options.pinkNoise]);
  
  const startSleepTimer = (minutes: number) => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
    }
    
    const milliseconds = minutes * 60 * 1000;
    const endTime = Date.now() + milliseconds;
    
    setSleepTimerActive(true);
    setSleepTimerRemaining(milliseconds / 1000);
    
    sleepTimerRef.current = setInterval(() => {
      const remaining = Math.round((endTime - Date.now()) / 1000);
      
      if (remaining <= 0) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        if (sleepTimerRef.current) {
          clearInterval(sleepTimerRef.current);
        }
        
        setSleepTimerActive(false);
        setSleepTimerRemaining(0);
      } else {
        setSleepTimerRemaining(remaining);
      }
    }, 1000);
  };
  
  const cancelSleepTimer = () => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
    }
    
    setSleepTimerActive(false);
    setSleepTimerRemaining(0);
  };
  
  const handleSeekMouseDown = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (value: number[]) => {
    const newValue = value[0];
    setSeekTime(newValue);
    if (!isSeeking) {
      setCurrentTime(newValue);
      seekTo(newValue);
    }
  };

  const handleSeekMouseUp = () => {
    setIsSeeking(false);
    seekTo(seekTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    if (pinkNoiseRef.current && options.pinkNoise) {
      pinkNoiseRef.current.volume = Math.min(0.3, newVolume * 0.5);
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (audioRef.current) {
      audioRef.current.muted = newMutedState;
    }
    
    if (pinkNoiseRef.current) {
      pinkNoiseRef.current.muted = newMutedState;
    }
  };

  const handleTogglePlay = () => {
    if (externalTogglePlay) {
      externalTogglePlay();
    } else {
      togglePlay();
    }
  };
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };
  
  const togglePinkNoise = () => {
    setOptions(prev => ({ ...prev, pinkNoise: !prev.pinkNoise }));
  };
  
  const toggleLowSensitivity = () => {
    setOptions(prev => ({ ...prev, lowSensitivity: !prev.lowSensitivity }));
    
    if (audioRef.current && audioContext) {
      console.log("Low sensitivity mode toggled:", !options.lowSensitivity);
    }
  };
  
  const toggleHeadphones = () => {
    setOptions(prev => ({ ...prev, headphones: !prev.headphones }));
  };
  
  const selectSleepTimer = (value: string) => {
    const minutes = parseInt(value, 10);
    setOptions(prev => ({ ...prev, sleepTimer: minutes }));
    
    if (minutes > 0) {
      startSleepTimer(minutes);
    } else {
      cancelSleepTimer();
    }
  };

  const playerIsPlaying = externalIsPlaying !== undefined ? externalIsPlaying : isPlaying;

  useEffect(() => {
    if (!isSeeking) {
      setSeekTime(currentTime);
    }
  }, [currentTime, isSeeking]);
  
  const formatSleepTimer = () => {
    if (!sleepTimerActive) return "--:--";
    const minutes = Math.floor(sleepTimerRemaining / 60);
    const seconds = Math.floor(sleepTimerRemaining % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const displayTitle = journey?.title || currentTrack?.title || "No track selected";
  
  const displayAffirmation = journey?.affirmation || "";
  
  const frequencies = journey?.frequencies || (frequency ? [frequency] : []);
  
  const chakras = journey?.chakras || [];

  const shouldShowVisualizer = playerIsPlaying || liftTheVeil;
  
  const toggleVisualizerVisibility = () => {
    setIsVisualizerVisible(!isVisualizerVisible);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-black/70 backdrop-blur-lg rounded-full shadow-lg flex items-center p-2 pr-4 text-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleTogglePlay}
          className="h-8 w-8 rounded-full bg-purple-500 hover:bg-purple-600 mr-2"
        >
          {playerIsPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </Button>
        
        <div className="text-sm font-medium truncate max-w-[100px]">
          {displayTitle}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMinimized}
          className="h-6 w-6 ml-2 text-gray-300 hover:text-white"
        >
          <MoveUp className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const chakra = journey?.chakras?.[0] || 'Crown';
  const colorScheme = getChakraColorScheme([chakra]);

  return (
    <div className={`sacred-audio-player w-full max-w-4xl mx-auto transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-24'}`}>
      <div className="bg-black/20 backdrop-blur-sm rounded-lg shadow-xl p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-purple-300">
              {displayTitle}
            </h3>
            
            {displayAffirmation && (
              <p className="text-sm text-gray-300 italic">
                "{displayAffirmation}"
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVisualizerVisibility}
              className="h-6 w-6 text-gray-300 hover:text-white"
              title={isVisualizerVisible ? "Hide visualizer" : "Show visualizer"}
            >
              {isVisualizerVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMinimized}
              className="h-6 w-6 text-gray-300 hover:text-white"
            >
              <MoveDown className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleExpanded}
              className="h-6 w-6 text-gray-300 hover:text-white"
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTogglePlay}
            className="h-10 w-10 rounded-full bg-purple-500 hover:bg-purple-600 text-white"
            disabled={!audioLoaded && !(audioUrl || url)}
          >
            {playerIsPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          <div className="flex-grow">
            <div className="flex items-center gap-4">
              <div className="flex-grow">
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
                
                <div className="flex justify-between text-sm text-gray-400 mt-1">
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
                      onValueChange={handleVolumeChange}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Waves className="h-4 w-4 text-gray-400" />
                <Label htmlFor="pink-noise" className="text-sm text-gray-300">Pink Noise</Label>
              </div>
              <Switch 
                id="pink-noise" 
                checked={options.pinkNoise} 
                onCheckedChange={togglePinkNoise} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FastForward className="h-4 w-4 text-gray-400" />
                <Label htmlFor="low-sensitivity" className="text-sm text-gray-300">Low Sensitivity</Label>
              </div>
              <Switch 
                id="low-sensitivity" 
                checked={options.lowSensitivity} 
                onCheckedChange={toggleLowSensitivity} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4 text-gray-400" />
                <Label htmlFor="headphones" className="text-sm text-gray-300">Headphones</Label>
              </div>
              <Switch 
                id="headphones" 
                checked={options.headphones} 
                onCheckedChange={toggleHeadphones} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4 text-gray-400" />
                <Label className="text-sm text-gray-300">
                  {sleepTimerActive ? (
                    <span>Timer: {formatSleepTimer()}</span>
                  ) : (
                    <span>Sleep Timer</span>
                  )}
                </Label>
              </div>
              
              {sleepTimerActive ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={cancelSleepTimer}
                  className="h-7 px-2"
                >
                  <X className="h-3 w-3 mr-1" /> Cancel
                </Button>
              ) : (
                <select 
                  className="bg-black/30 rounded border border-white/20 text-xs text-white py-1 px-2"
                  onChange={(e) => selectSleepTimer(e.target.value)}
                  value={options.sleepTimer || "0"}
                >
                  <option value="0">Off</option>
                  <option value="5">5 min</option>
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="60">60 min</option>
                </select>
              )}
            </div>
          </div>

        {audioError && (
          <div className="text-red-500 mt-2">{audioError}</div>
        )}
      </div>

      {isExpanded && shouldShowVisualizer && isVisualizerVisible && (
        <div className="mt-4 h-64 rounded-lg overflow-hidden backdrop-blur-md bg-black/30">
          <VisualizerManager 
            isAudioReactive={true}
            colorScheme={colorScheme}
            size="md"
            frequency={frequency}
            analyzerNode={analyser}
            audioRef={audioRef}
            frequencies={journey?.frequencies || (frequency ? [frequency] : [])}
            chakras={journey?.chakras || []}
            visualTheme={journey?.visualTheme}
            isPlaying={isPlaying}
            liftedVeil={liftTheVeil}
          />
        </div>
      )}
    </div>
  );
};

export default SacredAudioPlayer;
