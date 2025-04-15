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
  
  const shouldShowVisualizer = isVisualizerVisible && isPlaying && !!analyser;
  
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
    setCurrentTime(seekTime);
    seekTo(seekTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume > 0 ? volume : 0.5;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleVisualizerVisibility = () => {
    setIsVisualizerVisible(!isVisualizerVisible);
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
  };
  
  const toggleHeadphones = () => {
    setOptions(prev => ({ ...prev, headphones: !prev.headphones }));
  };
  
  const setSleepTimerMinutes = (minutes: number) => {
    if (minutes > 0) {
      startSleepTimer(minutes);
      setOptions(prev => ({ ...prev, sleepTimer: minutes }));
    } else {
      cancelSleepTimer();
      setOptions(prev => ({ ...prev, sleepTimer: 0 }));
    }
  };

  const trackTitle = currentTrack?.title || 'No track loaded';
  const trackArtist = currentTrack?.artist || '';
  const mainFrequency = currentTrack?.customData?.frequency || frequency || 432;
  
  const chakraString = currentTrack?.customData?.chakra || journey?.chakras?.[0] || 'Crown';
  const chakraArray = Array.isArray(chakraString) ? chakraString : [chakraString];
  
  const colorScheme = getChakraColorScheme(chakraArray);
  
  const isPrimeFreq = isPrime(mainFrequency);

  if (isMinimized) {
    return (
      <div className="bg-black/70 backdrop-blur-sm text-white p-2 rounded-t-lg shadow-lg border border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="p-1 rounded-full bg-purple-600 mr-2 hover:bg-purple-700"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <div className="text-xs truncate max-w-[150px]">
            {trackTitle} 
          </div>
        </div>
        <button
          className="text-white/80 hover:text-white"
          onClick={toggleMinimized}
          aria-label="Expand audio player"
        >
          <MoveUp size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={`sacred-audio-player relative rounded-t-lg overflow-hidden shadow-xl border-t border-x border-white/10 transition-all duration-300 ${isExpanded ? 'bg-black/70 backdrop-blur-md' : 'bg-black/60 backdrop-blur-sm'}`}>
      {shouldShowVisualizer && isExpanded && (
        <div className="h-48">
          <VisualizerManager
            size={isExpanded ? 'md' : 'sm'}
            isAudioReactive={true}
            colorScheme={colorScheme}
            analyzerNode={analyser}
            audioRef={audioRef}
            frequency={mainFrequency}
            chakra={chakraArray}
            isPlaying={isPlaying}
            liftedVeil={liftTheVeil}
          />
        </div>
      )}
      
      <div className="player-controls p-3 text-white">
        <div className="flex justify-between items-center mb-2">
          <div className="flex-1 mr-2">
            <h3 className="text-sm font-medium truncate">{trackTitle}</h3>
            {trackArtist && <p className="text-xs text-gray-300">{trackArtist}</p>}
          </div>
          
          <div className="flex space-x-1">
            {isExpanded && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                onClick={toggleVisualizerVisibility}
                aria-label={isVisualizerVisible ? "Hide visualizer" : "Show visualizer"}
              >
                {isVisualizerVisible ? <EyeOff size={14} /> : <Eye size={14} />}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              onClick={toggleExpanded}
              aria-label={isExpanded ? "Collapse player" : "Expand player"}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              onClick={toggleMinimized}
              aria-label="Minimize player"
            >
              <MoveDown size={14} />
            </Button>
          </div>
        </div>
        
        {mainFrequency && isExpanded && (
          <div className={`flex items-center justify-center p-1 mb-2 text-xs border-t border-b ${isPrimeFreq ? 'border-pink-400/30' : 'border-white/10'}`}>
            <span className={`${isPrimeFreq ? 'text-pink-300' : 'text-gray-200'} font-mono`}>
              {mainFrequency} Hz 
              {isPrimeFreq && ' ✦ Prime Frequency'}
            </span>
            {chakra && <span className="text-gray-300 ml-2">| {chakra} Chakra</span>}
          </div>
        )}
        
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs">{formatTime(currentTime)}</span>
          <Slider
            value={[isSeeking ? seekTime : currentTime]}
            min={0}
            max={duration || 100}
            step={1}
            onValueChange={handleSeekChange}
            onPointerDown={handleSeekMouseDown}
            onPointerUp={handleSeekMouseUp}
            className="flex-1"
          />
          <span className="text-xs">{formatTime(duration)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white rounded-full"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            
            {isExpanded && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/80 hover:text-white rounded-full"
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  aria-label="Volume"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                
                {showVolumeSlider && (
                  <div className="absolute left-0 bottom-full p-3 bg-black/90 rounded-md shadow-lg w-48 z-50">
                    <div className="flex items-center space-x-2">
                      <button onClick={toggleMute}>
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {isExpanded && (
            <div className="flex items-center space-x-2">
              {journey && (
                <>
                  <div className="flex items-center">
                    <Switch
                      id="pink-noise"
                      checked={options.pinkNoise}
                      onCheckedChange={togglePinkNoise}
                      className="data-[state=checked]:bg-pink-600"
                    />
                    <Label htmlFor="pink-noise" className="ml-1.5 text-xs">
                      <Waves size={12} className="inline mr-1" /> Pink Noise
                    </Label>
                  </div>
                  
                  <div className="flex items-center">
                    <Switch
                      id="headphones"
                      checked={options.headphones}
                      onCheckedChange={toggleHeadphones}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="headphones" className="ml-1.5 text-xs">
                      <Headphones size={12} className="inline mr-1" />
                    </Label>
                  </div>
                </>
              )}
              
              {sleepTimerActive && (
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white/80 hover:text-white"
                    onClick={cancelSleepTimer}
                    aria-label="Cancel sleep timer"
                  >
                    <Timer size={14} className="text-blue-400" />
                  </Button>
                  <span className="text-xs text-blue-400 ml-1">
                    {Math.floor(sleepTimerRemaining / 60)}:
                    {String(Math.floor(sleepTimerRemaining % 60)).padStart(2, '0')}
                  </span>
                </div>
              )}
              
              {!sleepTimerActive && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white/80 hover:text-white"
                  onClick={() => setSleepTimerMinutes(30)}
                  aria-label="Set sleep timer"
                >
                  <Moon size={14} />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SacredAudioPlayer;
