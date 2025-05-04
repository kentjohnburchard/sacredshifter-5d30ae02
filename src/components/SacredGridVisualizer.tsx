import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VisualizationSettings, VisualizerProps } from '@/types/visualization';
import useSacredAudioAnalysis from '@/hooks/useSacredAudioAnalysis';
import SacredGrid2DVisualizer from '@/components/visualization/SacredGrid2DVisualizer';
import SacredGrid3DVisualizer from '@/components/visualization/SacredGrid3DVisualizer';
import SacredGridControls from '@/components/visualization/SacredGridControls';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import SacredGridBackground from '@/components/visualization/SacredGridBackground';
import PrimeNumberAffirmations from '@/components/visualization/PrimeNumberAffirmations';
import PrimeAudioVisualizer from '@/components/audio/PrimeAudioVisualizer';

const SacredGridVisualizer: React.FC<VisualizerProps> = ({
  width = '100%',
  height = '100%',
  audioRef,
  autoConnect = true,
  showControls = true,
  fullScreen = false,
  initialSettings,
  onSettingsChange,
  audioContext: providedAudioContext,
  analyserNode: providedAnalyserNode,
  musicFunctionality,
  expandable = false,
  onExpandStateChange
}) => {
  const globalAudioPlayer = autoConnect ? useGlobalAudioPlayer() : null;
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  // Get stored volume from localStorage or use default
  const getInitialVolume = () => {
    try {
      const storedVolume = localStorage.getItem('sacredShifterVolume');
      return storedVolume ? parseFloat(storedVolume) : 0.8;
    } catch (e) {
      return 0.8;
    }
  };
  
  useEffect(() => {
    if (globalAudioPlayer) {
      const audioElement = document.querySelector('#global-audio-player');
      if (audioElement instanceof HTMLAudioElement) {
        audioElementRef.current = audioElement;
        console.log("Connected to global audio player element");
      }
    } else if (audioRef?.current) {
      audioElementRef.current = audioRef.current;
    }
  }, [globalAudioPlayer, audioRef]);
  
  const { analyzer, audioContext } = useAudioAnalyzer(audioElementRef.current);

  const defaultSettings: VisualizationSettings = {
    activeShapes: ['flower-of-life', 'fibonacci-spiral', 'prime-spiral', 'metatron-cube'],
    speed: 1.0,
    colorTheme: 'cosmic-violet',
    symmetry: 6,
    mode: '3d',
    mirrorEnabled: true,
    chakraAlignmentMode: false,
    sensitivity: 1.0,
    brightness: 1.0,
    showGrid: true,
    gridIntensity: 0.6,
    showPrimeAffirmations: true,
    visualizerType: 'sacred-geometry',
    rotationSpeed: 1.0
  };

  const [settings, setSettings] = useState<VisualizationSettings>({
    ...defaultSettings,
    ...initialSettings
  });
  const [controlsExpanded, setControlsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(getInitialVolume());

  const audioAnalysis = useSacredAudioAnalysis({
    audioRef: audioElementRef,
    providedAudioContext: providedAudioContext || audioContext,
    providedAnalyser: providedAnalyserNode || analyzer,
    sensitivity: settings.sensitivity
  });

  useEffect(() => {
    if (autoConnect && globalAudioPlayer && globalAudioPlayer.registerPlayerVisuals) {
      try {
        globalAudioPlayer.registerPlayerVisuals({
          setAudioSource: (url: string, info?: any) => {
            console.log("Sacred Grid Visualizer: Received new audio source", url);
          }
        });
      } catch (err) {
        console.error("Error registering SacredGridVisualizer with global player:", err);
      }
    }
    
    // Set initial volume if connected to global audio player
    if (globalAudioPlayer && globalAudioPlayer.setVolume) {
      globalAudioPlayer.setVolume(volume);
    }
  }, [autoConnect, globalAudioPlayer, volume]);

  const handleSettingsChange = (newSettings: VisualizationSettings) => {
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const handleVolumeChange = useCallback((newValue: number[]) => {
    const volumeValue = newValue[0];
    setVolume(volumeValue);
    if (globalAudioPlayer && globalAudioPlayer.setVolume) {
      globalAudioPlayer.setVolume(volumeValue);
    }
  }, [globalAudioPlayer]);

  const toggleControls = () => {
    setControlsExpanded(prev => !prev);
  };

  const toggleFullscreen = useCallback(() => {
    const newState = !isFullscreen;
    setIsFullscreen(newState);
    if (onExpandStateChange) {
      onExpandStateChange(newState);
    }
    // Auto-expand controls when entering fullscreen mode
    if (newState) {
      setControlsExpanded(true);
    }
  }, [isFullscreen, onExpandStateChange]);

  const containerStyle: React.CSSProperties = isFullscreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        width: '100vw',
        height: '100vh'
      }
    : {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative'
      };

  return (
    <div
      ref={containerRef}
      className="sacred-grid-visualizer-container bg-transparent"
      style={containerStyle}
    >
      {/* Sacred grid background */}
      {settings.showGrid && (
        <div className="absolute inset-0 z-0">
          <SacredGridBackground 
            intensity={settings.gridIntensity} 
            color={settings.colorTheme === 'cosmic-violet' ? '#9b87f5' : 
                  settings.colorTheme === 'chakra-rainbow' ? '#e5deff' :
                  settings.colorTheme === 'fire-essence' ? '#ff6b6b' :
                  settings.colorTheme === 'ocean-depths' ? '#00bcd4' :
                  settings.colorTheme === 'earth-tones' ? '#8bc34a' :
                  settings.colorTheme === 'ethereal-mist' ? '#ffffff' : '#9b87f5'}
            pulseSpeed={settings.speed * 0.5}
          />
        </div>
      )}
      
      {/* Main visualizer - conditional based on setting */}
      <div className="relative z-10">
        {settings.visualizerType === 'prime-audio' ? (
          <PrimeAudioVisualizer
            audioContext={audioContext || providedAudioContext || null}
            analyser={analyzer || providedAnalyserNode || null}
            isPlaying={!!globalAudioPlayer?.isPlaying}
            colorMode={settings.colorTheme === 'cosmic-violet' ? 'standard' :
                      settings.colorTheme === 'chakra-rainbow' ? 'chakra' :
                      settings.colorTheme === 'ethereal-mist' ? 'liquid-crystal' : 'standard'}
            visualMode={'prime'}
            layout={settings.mode === '3d' ? 'radial' : 'vertical'}
            sensitivity={settings.sensitivity}
          />
        ) : settings.mode === '2d' ? (
          <SacredGrid2DVisualizer
            width="100%"
            height="100%"
            settings={settings}
            audioAnalysis={audioAnalysis}
            className="sacred-grid-visualizer"
          />
        ) : (
          <SacredGrid3DVisualizer
            width="100%"
            height="100%"
            settings={settings}
            audioAnalysis={audioAnalysis}
            className="sacred-grid-visualizer"
          />
        )}
      </div>
      
      {/* Prime number affirmations overlay */}
      {settings.showPrimeAffirmations && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <PrimeNumberAffirmations enabled={true} />
        </div>
      )}

      {/* Controls container */}
      {showControls && (
        <div className={`sacred-grid-controls-container ${isFullscreen ? 'fixed top-8 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4' : 'absolute bottom-0 left-0 right-0 p-4'} z-30`}>
          <SacredGridControls
            settings={settings}
            onChange={handleSettingsChange}
            expanded={controlsExpanded}
            onToggle={toggleControls}
            className="bg-black/70 dark:bg-gray-900/70 backdrop-blur-md border border-purple-500/30"
            showAudioIndicator={true}
            audioLevel={audioAnalysis.amplitude}
            bpm={audioAnalysis.bpm}
            showAllControls={isFullscreen}
          />
        </div>
      )}

      {/* Volume control */}
      <div className={`absolute ${isFullscreen ? 'top-8 left-8' : 'bottom-14 left-4'} z-30 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 transition-all`}>
        <Volume2 className="h-4 w-4 text-white" />
        <Slider
          value={[volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
        <span className="text-xs text-white">{Math.round(volume * 100)}%</span>
      </div>

      {/* Fullscreen toggle */}
      {expandable && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 z-30 bg-purple-900/50 hover:bg-purple-700/60 text-white"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      )}
    </div>
  );
};

export default SacredGridVisualizer;
