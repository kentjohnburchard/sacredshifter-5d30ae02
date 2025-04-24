
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import SacredGeometryScene from '@/components/SacredGeometryScene';
import ChakraScene from '@/components/ChakraScene';
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

interface VisualizerSceneProps {
  mode: VisualizationMode;
  analyzer: AnalyserNode | null;
  activePrimes: number[];
  mandalaSettings: MandalaSettings | null;
}

const VisualizerScene: React.FC<VisualizerSceneProps> = ({ 
  mode, 
  analyzer, 
  activePrimes,
  mandalaSettings 
}) => {
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

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      {renderVisualization()}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
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
  );
};

export default VisualizerScene;
