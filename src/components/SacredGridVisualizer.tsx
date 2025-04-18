import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VisualizationSettings, VisualizerProps } from '@/types/visualization';
import useSacredAudioAnalysis from '@/hooks/useSacredAudioAnalysis';
import SacredGrid2DVisualizer from '@/components/visualization/SacredGrid2DVisualizer';
import SacredGrid3DVisualizer from '@/components/visualization/SacredGrid3DVisualizer';
import SacredGridControls from '@/components/visualization/SacredGridControls';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

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
  
  const { audioContext, analyser } = useAudioAnalyzer(audioElementRef.current);

  const defaultSettings: VisualizationSettings = {
    activeShapes: ['flower-of-life', 'fibonacci-spiral', 'prime-spiral', 'metatron-cube'],
    speed: 1.0,
    colorTheme: 'cosmic-violet',
    symmetry: 6,
    mode: '3d',
    mirrorEnabled: true,
    chakraAlignmentMode: false,
    sensitivity: 1.0,
    brightness: 1.0
  };

  const [settings, setSettings] = useState<VisualizationSettings>({
    ...defaultSettings,
    ...initialSettings
  });
  const [controlsExpanded, setControlsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const audioAnalysis = useSacredAudioAnalysis({
    audioRef: audioElementRef,
    providedAudioContext: providedAudioContext || audioContext,
    providedAnalyser: providedAnalyserNode || analyser,
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
  }, [autoConnect, globalAudioPlayer]);

  const handleSettingsChange = (newSettings: VisualizationSettings) => {
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const toggleControls = () => {
    setControlsExpanded(prev => !prev);
  };

  const toggleFullscreen = useCallback(() => {
    const newState = !isFullscreen;
    setIsFullscreen(newState);
    if (onExpandStateChange) {
      onExpandStateChange(newState);
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
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.95)'
      }
    : {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative'
      };

  return (
    <div
      ref={containerRef}
      className="sacred-grid-visualizer-container"
      style={containerStyle}
    >
      {settings.mode === '2d' ? (
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

      {showControls && (
        <div className={`sacred-grid-controls-container ${isFullscreen ? 'fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4' : 'absolute bottom-0 left-0 right-0 p-4'} z-10`}>
          <SacredGridControls
            settings={settings}
            onChange={handleSettingsChange}
            expanded={isFullscreen}
            onToggle={toggleFullscreen}
            className="bg-black/80 dark:bg-gray-900/80 backdrop-blur-md border border-purple-500/20"
            showAudioIndicator={true}
            audioLevel={audioAnalysis.amplitude}
            bpm={audioAnalysis.bpm}
            showAllControls={isFullscreen}
          />
        </div>
      )}

      {expandable && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 z-30 bg-purple-900/40 hover:bg-purple-900/60 text-white"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      )}
    </div>
  );
};

export default SacredGridVisualizer;
