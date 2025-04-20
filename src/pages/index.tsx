
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
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';

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
  'collision';

const Home: React.FC = () => {
  const [mode, setMode] = useState<VisualizationMode>('sacred');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyzer = useAudioAnalyzer(audioRef.current);
  
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
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
        return <PrimeSymphonyScene analyzer={analyzer} />;
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
      default:
        return <SacredGeometryScene analyzer={analyzer} />;
    }
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
      
      {/* Control Panel */}
      <div className="overlay-controls">
        {/* Visualization Mode Selection */}
        <select 
          className="mode-selector" 
          value={mode}
          onChange={(e) => setMode(e.target.value as VisualizationMode)}
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
        </select>
        
        {/* Audio Controls */}
        <div className="audio-controls">
          <input 
            type="file" 
            accept="audio/*"
            onChange={handleAudioUpload}
            className="bg-opacity-50 bg-gray-800 p-2 rounded text-sm w-full"
          />
          
          <audio 
            ref={audioRef}
            controls 
            src={audioUrl}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
