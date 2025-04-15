
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizerMode } from '@/components/audio/SacredAudioPlayerWithVisualizer';
import { useTheme } from '@/context/ThemeContext';
import { 
  FlowerOfLifeGeometry, 
  MerkabaGeometry,
  MetatronCubeGeometry,
  SriYantraGeometry, 
  FibonacciSpiralGeometry,
  ChakraBeamGeometry,
  SacredGeometryType,
  GeometryConfig,
  ChakraType
} from './sacred-geometries';
import MultiVisualizer from './MultiVisualizer';

type SacredVisualizerCanvasProps = {
  frequencyData?: Uint8Array;
  chakra?: ChakraType;
  visualizerMode?: VisualizerMode | SacredGeometryType;
  enableControls?: boolean;
  enablePostProcessing?: boolean;
  intensity?: number;
  multiView?: boolean;
  geometryConfigs?: GeometryConfig[];
};

const SacredVisualizerCanvas: React.FC<SacredVisualizerCanvasProps> = ({
  frequencyData,
  chakra = 'crown',
  visualizerMode = 'flowerOfLife', 
  enableControls = true,
  enablePostProcessing = false,
  intensity = 0,
  multiView = false,
  geometryConfigs = [],
}) => {
  // Only include the geometry types we know we properly support
  const supportedGeometryTypes: SacredGeometryType[] = [
    'flowerOfLife', 'merkaba', 'metatronCube', 'sriYantra', 'fibonacciSpiral', 'chakraBeam'
  ];
  
  // Check if visualizerMode is one of our supported types
  const isSupportedGeometry = supportedGeometryTypes.includes(visualizerMode as SacredGeometryType);
  const shouldRender = typeof visualizerMode === 'string';
  const { liftTheVeil } = useTheme();
  
  if (!shouldRender) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-purple-900/20 to-indigo-900/20 flex items-center justify-center">
        <p className="text-white/50">Visualizer unavailable</p>
      </div>
    );
  }
  
  const fogColor = liftTheVeil ? '#330033' : '#110022';
  const ambientColor = liftTheVeil ? '#ff69b4' : chakra ? {
    root: '#ef4444',
    sacral: '#f97316',
    'solar plexus': '#facc15',
    heart: '#22c55e',
    throat: '#3b82f6',
    'third eye': '#6366f1',
    crown: '#a855f7'
  }[chakra] : '#a855f7';
  
  const pointLightColor = liftTheVeil ? '#ff1493' : ambientColor;
  
  // If multiView is enabled, use the MultiVisualizer component
  if (multiView || visualizerMode === 'multi') {
    return (
      <div className="w-full h-full">
        <MultiVisualizer 
          frequencyData={frequencyData}
          enableControls={enableControls}
          intensity={intensity}
          chakra={chakra}
          geometries={geometryConfigs}
          layoutType={geometryConfigs.length > 4 ? 'circle' : 'grid'}
        />
      </div>
    );
  }
  
  // Render a specific geometry type
  const renderGeometry = () => {
    if (!isSupportedGeometry) {
      return <FlowerOfLifeGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
    }
    
    switch (visualizerMode) {
      case 'flowerOfLife':
        return <FlowerOfLifeGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
      case 'merkaba':
        return <MerkabaGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
      case 'metatronCube':
        return <MetatronCubeGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
      case 'sriYantra':
        return <SriYantraGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
      case 'fibonacciSpiral':
        return <FibonacciSpiralGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
      case 'chakraBeam':
        return <ChakraBeamGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
      default:
        return <FlowerOfLifeGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
    }
  };
  
  return (
    <div className="w-full h-full">
      <Canvas frameloop="demand">
        <PerspectiveCamera position={[0, 0, 5]} fov={70} makeDefault />
        <ambientLight intensity={0.5} color={ambientColor} />
        <pointLight position={[10, 10, 10]} intensity={1} color={pointLightColor} />
        <fog attach="fog" args={[fogColor, 1, 20]} />
        
        {renderGeometry()}
        
        {enableControls && (
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            enableRotate={true} 
            makeDefault
          />
        )}
      </Canvas>
    </div>
  );
};

export default SacredVisualizerCanvas;
