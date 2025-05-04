
import React, { useState, useRef, useEffect } from 'react';
import QuoteOverlay from '@/components/QuoteOverlay';
import PhiBreath from '@/components/PhiBreath';
import SessionJournal from '@/components/SessionJournal';
import VisualizerStats from '@/components/VisualizerStats';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import { MandalaSettings } from '@/components/MandalaBuilder';
import VisualizerScene from '@/components/visualizer/VisualizerScene';
import VisualizerSelector from '@/components/visualizer/VisualizerSelector';
import AudioControls from '@/components/visualizer/AudioControls';
import SideControls from '@/components/visualizer/SideControls';

type VisualizationMode = 
  'sacred' | 
  'chakra' | 
  'leyline' | 
  'cymatic' | 
  'mirrorverse' | 
  'yinyang' | 
  'metatron' | 
  'prime' | 
  'nebula' | 
  'fractal' | 
  'galaxy' | 
  'cymatictile' | 
  'hologram' | 
  'collision' |
  'mandala' |
  'phibreath';

const Home: React.FC = () => {
  // State management
  const [mode, setMode] = useState<VisualizationMode>('sacred');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [activePrimes, setActivePrimes] = useState<number[]>([]);
  const [mandalaSettings, setMandalaSettings] = useState<MandalaSettings | null>(null);
  const [phiBreathActive, setPhiBreathActive] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [statsCollapsed, setStatsCollapsed] = useState(true);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  
  // Hooks
  const { analyzer, audioContext } = useAudioAnalyzer(audioRef.current);
  
  // Set up audio context
  useEffect(() => {
    if (audioRef.current && !audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const source = context.createMediaElementSource(audioRef.current);
      source.connect(context.destination);
      sourceNodeRef.current = source;
      
      return () => {
        context.close();
      };
    }
  }, [audioContext]);
  
  // Event handlers
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };
  
  const handleModeChange = (newMode: VisualizationMode) => {
    if (newMode === 'phibreath') {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      setPhiBreathActive(true);
    } else {
      setMode(newMode);
      if (mode === 'phibreath') {
        setPhiBreathActive(false);
      }
    }
  };
  
  const handleMandalChange = (settings: MandalaSettings) => {
    setMandalaSettings(settings);
    if (mode !== 'mandala') {
      setMode('mandala');
    }
  };
  
  const togglePhiBreath = () => {
    setPhiBreathActive(!phiBreathActive);
    if (audioRef.current && !audioRef.current.paused && !phiBreathActive) {
      audioRef.current.pause();
    }
  };
  
  const handleSessionComplete = () => {
    setShowJournal(true);
  };

  // Map mode to scene string
  const getSceneFromMode = (mode: VisualizationMode): string => {
    const modeToScene: Record<VisualizationMode, string> = {
      'sacred': 'nebula',
      'nebula': 'nebula',
      'fractal': 'fractal',
      'chakra': 'cymatics',
      'cymatic': 'cymatics',
      'galaxy': 'galaxy',
      'mandala': 'mandala',
      'metatron': 'metatron',
      'yinyang': 'yinyang',
      'mirrorverse': 'mirrorverse',
      'hologram': 'hologram',
      'leyline': 'leylines',
      'collision': 'cosmic-collision',
      'cymatictile': 'cymatic-tiles',
      'prime': 'prime-symphony',
      'phibreath': 'fractal-audio'
    };
    
    return modeToScene[mode] || 'nebula';
  };
  
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="scene-container">
        <VisualizerScene 
          scene={getSceneFromMode(mode)} 
          audioAnalyzer={analyzer} 
          isPlaying={audioRef.current?.paused === false}
        />
      </div>
      
      <QuoteOverlay />
      
      <PhiBreath 
        active={phiBreathActive} 
        onToggle={togglePhiBreath} 
        audioContext={audioContext}
      />
      
      <SessionJournal
        show={showJournal}
        onClose={() => setShowJournal(false)}
        currentMode={mode}
        activePrimes={activePrimes}
        mandalaSettings={mandalaSettings}
        audioUrl={audioUrl}
      />
      
      <VisualizerStats 
        analyzer={analyzer}
        collapsed={statsCollapsed}
        onToggleCollapse={() => setStatsCollapsed(!statsCollapsed)}
        activePrimes={activePrimes.map(prime => prime * 100)}
      />
      
      <SideControls 
        onPrimesChange={setActivePrimes}
        audioContext={audioContext}
        audioSourceNode={sourceNodeRef.current}
        onVisualModeChange={(mode: string) => setMode(mode as VisualizationMode)}
        onMandalaChange={handleMandalChange}
      />
      
      <div className="overlay-controls">
        <VisualizerSelector mode={mode} onModeChange={handleModeChange} />
        
        <AudioControls 
          audioUrl={audioUrl}
          onAudioUpload={handleAudioUpload}
          onSessionEnd={handleSessionComplete}
          onToggleJournal={() => setShowJournal(true)}
          onToggleStats={() => setStatsCollapsed(!statsCollapsed)}
          statsCollapsed={statsCollapsed}
        />
      </div>
    </div>
  );
};

export default Home;
