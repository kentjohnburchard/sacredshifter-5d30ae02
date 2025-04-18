import React, { useState, useRef, useEffect } from 'react';
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
  musicFunctionality
}) => {
  // Get global audio player if autoConnect is true
  const globalAudioPlayer = autoConnect ? useGlobalAudioPlayer() : null;
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Get the audio element from global player
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
  
  // Set up audio context and analyzer
  const { audioContext, analyser } = useAudioAnalyzer(audioElementRef.current);

  // Default settings
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

  // State
  const [settings, setSettings] = useState<VisualizationSettings>({
    ...defaultSettings,
    ...initialSettings
  });
  const [controlsExpanded, setControlsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Audio analysis
  const audioAnalysis = useSacredAudioAnalysis({
    audioRef: audioRef ?? (globalAudioPlayer ? { current: globalAudioPlayer.getAudioElement() } : undefined),
    providedAudioContext: providedAudioContext || audioContext,
    providedAnalyser: providedAnalyserNode || analyser,
    sensitivity: settings.sensitivity
  });

  // Register with global audio player if needed
  useEffect(() => {
    if (autoConnect && globalAudioPlayer && globalAudioPlayer.registerPlayerVisuals) {
      try {
        globalAudioPlayer.registerPlayerVisuals({
          setAudioSource: (url: string, info?: any) => {
            // This function is called when the global audio player loads a new track
            console.log("Sacred Grid Visualizer: Received new audio source", url);
          }
        });
      } catch (err) {
        console.error("Error registering SacredGridVisualizer with global player:", err);
      }
    }
  }, [autoConnect, globalAudioPlayer]);

  // Handle settings change
  const handleSettingsChange = (newSettings: VisualizationSettings) => {
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  // Toggle controls expansion
  const toggleControls = () => {
    setControlsExpanded(prev => !prev);
  };

  // Determine container styles for fullscreen mode
  const containerStyle: React.CSSProperties = fullScreen
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
        <div className="sacred-grid-controls-container absolute bottom-0 left-0 right-0 p-4 z-10">
          <SacredGridControls
            settings={settings}
            onChange={handleSettingsChange}
            expanded={controlsExpanded}
            onToggle={toggleControls}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
            showAudioIndicator={true}
            audioLevel={audioAnalysis.amplitude}
            bpm={audioAnalysis.bpm}
          />
        </div>
      )}
    </div>
  );
};

export default SacredGridVisualizer;
