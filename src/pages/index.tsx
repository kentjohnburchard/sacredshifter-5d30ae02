
import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import QuoteOverlay from '@/components/QuoteOverlay';
import ChakraScene from '@/components/ChakraScene';
import SacredGeometryScene from '@/components/SacredGeometryScene';
import LeylineScene from '@/components/visualizer/LeylineScene';
import CymaticScene from '@/components/visualizer/CymaticScene';
import MirrorverseScene from '@/components/visualizer/MirrorverseScene';
import YinYangScene from '@/components/visualizer/YinYangScene';
import MetatronScene from '@/components/visualizer/MetatronScene';
import PrimeSymphonyScene from '@/components/visualizer/PrimeSymphonyScene';
import NebulaScene from '@/components/visualizer/NebulaScene';
import FractalScene from '@/components/visualizer/FractalScene';
import GalaxyScene from '@/components/visualizer/GalaxyScene';
import CymaticTileScene from '@/components/visualizer/CymaticTileScene';
import HologramScene from '@/components/visualizer/HologramScene';
import CosmicCollisionScene from '@/components/visualizer/CosmicCollisionScene';
import MandalaScene from '@/components/visualizer/MandalaScene';
import PrimeExplorer from '@/components/PrimeExplorer';
import ChakraPresets from '@/components/ChakraPresets';
import MandalaBuilder from '@/components/MandalaBuilder';
import PhiBreath from '@/components/PhiBreath';
import SessionJournal from '@/components/SessionJournal';
import VisualizerStats from '@/components/VisualizerStats';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import { MandalaSettings } from '@/components/MandalaBuilder';

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
  const [mode, setMode] = useState<VisualizationMode>('sacred');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyzer = useAudioAnalyzer(audioRef.current);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [activePrimes, setActivePrimes] = useState<number[]>([]);
  const [mandalaSettings, setMandalaSettings] = useState<MandalaSettings | null>(null);
  const [phiBreathActive, setPhiBreathActive] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [statsCollapsed, setStatsCollapsed] = useState(true);
  
  // Initialize audio context
  useEffect(() => {
    if (audioRef.current && !audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      
      // Connect audio element to context
      const source = context.createMediaElementSource(audioRef.current);
      source.connect(context.destination);
      sourceNodeRef.current = source;
      
      return () => {
        context.close();
      };
    }
  }, [audioContext]);
  
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };
  
  const handleModeChange = (newMode: VisualizationMode) => {
    // If switching to phi breath mode, pause audio
    if (newMode === 'phibreath') {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      setPhiBreathActive(true);
    } else {
      setMode(newMode);
      // If coming from phi breath, resume audio
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
  
  const renderVisualization = () => {
    switch (mode) {
      case 'sacred':
        return <SacredGeometryScene analyzer={analyzer} />;
      case 'chakra':
        return <ChakraScene analyzer={analyzer} />;
      case 'leyline':
        return <LeylineScene analyzer={analyzer} />;
      case 'cymatic':
        return <CymaticScene analyzer={analyzer} />;
      case 'mirrorverse':
        return <MirrorverseScene analyzer={analyzer} />;
      case 'yinyang':
        return <YinYangScene analyzer={analyzer} />;
      case 'metatron':
        return <MetatronScene analyzer={analyzer} />;
      case 'prime':
        return <PrimeSymphonyScene analyzer={analyzer} activePrimes={activePrimes} />;
      case 'nebula':
        return <NebulaScene analyzer={analyzer} />;
      case 'fractal':
        return <FractalScene analyzer={analyzer} />;
      case 'galaxy':
        return <GalaxyScene analyzer={analyzer} />;
      case 'cymatictile':
        return <CymaticTileScene analyzer={analyzer} />;
      case 'hologram':
        return <HologramScene analyzer={analyzer} />;
      case 'collision':
        return <CosmicCollisionScene analyzer={analyzer} />;
      case 'mandala':
        return <MandalaScene analyzer={analyzer} mandalaSettings={mandalaSettings || undefined} />;
      default:
        return <SacredGeometryScene analyzer={analyzer} />;
    }
  };
  
  const togglePhiBreath = () => {
    setPhiBreathActive(!phiBreathActive);
    if (audioRef.current && !audioRef.current.paused && !phiBreathActive) {
      audioRef.current.pause();
    }
  };
  
  // Session completion handler
  const handleSessionComplete = () => {
    setShowJournal(true);
  };
  
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* 3D Scene */}
      <div className="scene-container">
        <Canvas>
          {/* Lights */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          {/* Dynamic scene based on selected mode */}
          {renderVisualization()}
          
          {/* Stars background */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Camera controls */}
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            zoomSpeed={0.5}
            rotateSpeed={0.5}
            maxDistance={50}
            minDistance={3}
          />
        </Canvas>
      </div>
      
      {/* Quote Overlay */}
      <QuoteOverlay />
      
      {/* Phi Breath Mode Overlay */}
      <PhiBreath 
        active={phiBreathActive} 
        onToggle={togglePhiBreath} 
        audioContext={audioContext}
      />
      
      {/* Journal Modal */}
      <SessionJournal
        show={showJournal}
        onClose={() => setShowJournal(false)}
        currentMode={mode}
        activePrimes={activePrimes}
        mandalaSettings={mandalaSettings}
        audioUrl={audioUrl}
      />
      
      {/* Stats Visualizer */}
      <VisualizerStats 
        analyzer={analyzer}
        collapsed={statsCollapsed}
        onToggleCollapse={() => setStatsCollapsed(!statsCollapsed)}
        activePrimes={activePrimes.map(prime => prime * 100)}
      />
      
      {/* Advanced Controls Panel */}
      <div className="fixed left-4 top-4 bottom-4 w-72 flex flex-col space-y-4 overflow-y-auto hide-scrollbar z-10">
        <PrimeExplorer 
          onPrimesChange={setActivePrimes}
          audioContext={audioContext}
          audioSourceNode={sourceNodeRef.current}
          setVisualMode={(mode: string) => setMode(mode as VisualizationMode)}
        />
        
        <ChakraPresets
          audioContext={audioContext}
          audioSourceNode={sourceNodeRef.current}
          setVisualMode={(mode: string) => setMode(mode as VisualizationMode)}
        />
        
        <MandalaBuilder
          setVisualMode={(mode: string) => setMode(mode as VisualizationMode)}
          onMandalaChange={handleMandalChange}
        />
      </div>
      
      {/* Control Panel */}
      <div className="overlay-controls">
        {/* Visualization Mode Selection */}
        <select 
          className="mode-selector" 
          value={mode}
          onChange={(e) => handleModeChange(e.target.value as VisualizationMode)}
        >
          <option value="sacred">Sacred Geometry</option>
          <option value="chakra">Chakra Alignment</option>
          <option value="leyline">Ley Lines</option>
          <option value="cymatic">Cymatics</option>
          <option value="mirrorverse">Mirrorverse</option>
          <option value="yinyang">Yin Yang</option>
          <option value="metatron">Metatron's Cube</option>
          <option value="prime">Prime Symphony</option>
          <option value="nebula">Cosmic Nebula</option>
          <option value="fractal">Fractal Patterns</option>
          <option value="galaxy">Galaxy</option>
          <option value="cymatictile">Cymatic Tiles</option>
          <option value="hologram">Hologram</option>
          <option value="collision">Cosmic Collision</option>
          <option value="mandala">Sacred Mandala</option>
          <option value="phibreath">Phi Breath Mode</option>
        </select>
        
        {/* Audio Controls */}
        <div className="audio-controls">
          <input 
            type="file" 
            accept="audio/*"
            onChange={handleAudioUpload}
            className="bg-opacity-50 bg-gray-800 p-2 rounded text-sm w-full"
          />
          
          <div className="flex gap-2">
            <audio 
              ref={audioRef}
              controls 
              src={audioUrl}
              onEnded={handleSessionComplete}
              className="w-full"
            />
            
            <button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
              onClick={() => setShowJournal(true)}
            >
              Journal
            </button>
            
            <button 
              className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
              onClick={() => setStatsCollapsed(!statsCollapsed)}
            >
              Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
