
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { 
  FlowerOfLifeGeometry, 
  MerkabaGeometry,
  MetatronCubeGeometry,
  SriYantraGeometry,
  FibonacciSpiralGeometry,
  ChakraBeamGeometry,
  GeometryConfig,
  SacredGeometryType,
  getChakraColor
} from './sacred-geometries';
import { useTheme } from '@/context/ThemeContext';

interface MultiVisualizerProps {
  frequencyData?: Uint8Array;
  geometries?: GeometryConfig[];
  enableControls?: boolean;
  layoutType?: 'circle' | 'grid' | 'stack';
  intensity?: number;
  chakra?: 'root' | 'sacral' | 'solar plexus' | 'heart' | 'throat' | 'third eye' | 'crown';
}

const MultiVisualizer: React.FC<MultiVisualizerProps> = ({
  frequencyData,
  geometries = [],
  enableControls = true,
  layoutType = 'circle',
  intensity = 0,
  chakra = 'crown'
}) => {
  const { liftTheVeil } = useTheme();
  
  // If no geometries are provided, create default ones
  const effectiveGeometries = useMemo(() => {
    if (geometries && geometries.length > 0) {
      return geometries;
    }
    
    // Default set of geometries
    return [
      { type: 'flowerOfLife', chakra, position: [0, 0, 0], scale: 0.7 },
      { type: 'merkaba', chakra, position: [0, 0, 0], scale: 0.7 },
      { type: 'metatronCube', chakra, position: [0, 0, 0], scale: 0.7 },
      { type: 'sriYantra', chakra, position: [0, 0, 0], scale: 0.7 },
      { type: 'fibonacciSpiral', chakra, position: [0, 0, 0], scale: 0.7 },
      { type: 'chakraBeam', chakra, position: [0, 0, 0], scale: 0.7 }
    ] as GeometryConfig[];
  }, [geometries, chakra]);
  
  // Calculate positions for the geometries based on layout type
  const positionedGeometries = useMemo(() => {
    return effectiveGeometries.map((geometry, index) => {
      const totalItems = effectiveGeometries.length;
      const color = geometry.chakra ? getChakraColor(geometry.chakra) : getChakraColor(chakra);
      let position: [number, number, number] = geometry.position || [0, 0, 0];
      
      // Adjust positions based on layout type
      if (layoutType === 'circle') {
        const radius = totalItems <= 3 ? 1.5 : 2.5;
        const angle = (index / totalItems) * Math.PI * 2;
        position = [
          Math.sin(angle) * radius, 
          Math.cos(angle) * radius, 
          0
        ];
      } else if (layoutType === 'grid') {
        const gridSize = Math.ceil(Math.sqrt(totalItems));
        const gridX = index % gridSize;
        const gridY = Math.floor(index / gridSize);
        const spacing = totalItems <= 4 ? 2 : 3;
        position = [
          (gridX - (gridSize - 1) / 2) * spacing, 
          (gridY - (gridSize - 1) / 2) * spacing, 
          0
        ];
      }
      
      // Apply scale based on layout
      const scale = geometry.scale || 
        (layoutType === 'circle' ? (totalItems <= 3 ? 0.7 : 0.5) : 
         (layoutType === 'grid' ? (totalItems <= 4 ? 0.7 : 0.5) : 1));
         
      return {
        ...geometry,
        position,
        scale,
        color
      };
    });
  }, [effectiveGeometries, layoutType, chakra]);
  
  // Component to render a specific geometry type
  const GeometryRenderer = ({ 
    type, 
    position, 
    scale, 
    rotation,
    chakra: geometryChakra, 
    isActive = true,
    color
  }: GeometryConfig & { color?: string }) => {
    const props = {
      chakra: geometryChakra || chakra,
      position,
      scale,
      rotation,
      isActive,
      frequencyData,
      intensity,
      color
    };
    
    switch (type) {
      case 'flowerOfLife':
        return <FlowerOfLifeGeometry {...props} />;
      case 'merkaba':
        return <MerkabaGeometry {...props} />;
      case 'metatronCube':
        return <MetatronCubeGeometry {...props} />;
      case 'sriYantra':
        return <SriYantraGeometry {...props} />;
      case 'fibonacciSpiral':
        return <FibonacciSpiralGeometry {...props} />;
      case 'chakraBeam':
        return <ChakraBeamGeometry {...props} />;
      default:
        return <FlowerOfLifeGeometry {...props} />;
    }
  };
  
  const ambientColor = liftTheVeil ? '#ff69b4' : '#9370db';
  const fogColor = liftTheVeil ? '#330033' : '#110022';
  
  return (
    <Canvas frameloop="demand">
      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, 10]} 
        fov={layoutType === 'circle' ? 60 : 50}
      />
      
      <ambientLight intensity={0.5} color={ambientColor} />
      <pointLight position={[10, 10, 10]} color={ambientColor} intensity={1} />
      
      <fog attach="fog" args={[fogColor, 1, 20]} />
      
      {positionedGeometries.map((geometry, index) => (
        <GeometryRenderer
          key={`geometry-${geometry.type}-${index}`}
          {...geometry}
        />
      ))}
      
      {enableControls && (
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          enableRotate={true}
          target={[0, 0, 0]}
        />
      )}
    </Canvas>
  );
};

export default MultiVisualizer;
