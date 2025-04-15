
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { 
  FlowerOfLifeGeometry,
  MerkabaGeometry,
  MetatronCubeGeometry,
  SriYantraGeometry,
  FibonacciSpiralGeometry,
  ChakraBeamGeometry,
  GeometryConfig
} from './sacred-geometries';
import { useTheme } from '@/context/ThemeContext';

interface MultiVisualizerProps {
  frequencyData?: Uint8Array;
  geometries?: GeometryConfig[];
  enableControls?: boolean;
  layoutType?: 'circle' | 'grid' | 'stack';
  intensity?: number;
  chakra?: string;
}

const MultiVisualizer: React.FC<MultiVisualizerProps> = ({
  frequencyData,
  geometries = [],
  enableControls = true,
  layoutType = 'circle',
  intensity = 0,
  chakra = 'crown',
}) => {
  const { liftTheVeil } = useTheme();
  
  // Build a layout for the geometries based on the layout type
  const calculatePositions = (count: number) => {
    const positions: [number, number, number][] = [];
    
    switch (layoutType) {
      case 'circle':
        // Arrange in a circle
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const radius = 5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          positions.push([x, 0, z]);
        }
        break;
        
      case 'grid':
        // Arrange in a grid
        const cols = Math.ceil(Math.sqrt(count));
        const spacing = 4;
        
        for (let i = 0; i < count; i++) {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = (col - (cols-1)/2) * spacing;
          const z = (row - (Math.ceil(count/cols)-1)/2) * spacing;
          positions.push([x, 0, z]);
        }
        break;
        
      case 'stack':
      default:
        // Stack in the center with slight offsets
        for (let i = 0; i < count; i++) {
          positions.push([0, 0, 0]);
        }
        break;
    }
    
    return positions;
  };
  
  // If no geometries are specified, use a default set
  const geometriesToRender = geometries.length > 0 ? geometries : [
    { type: 'flowerOfLife', chakra: 'crown' },
    { type: 'merkaba', chakra: 'third eye' },
    { type: 'metatronCube', chakra: 'throat' },
    { type: 'sriYantra', chakra: 'heart' },
    { type: 'fibonacciSpiral', chakra: 'solar plexus' },
    { type: 'chakraBeam', chakra: 'root' }
  ];
  
  const positions = calculatePositions(geometriesToRender.length);
  
  // Add fog color based on theme
  const fogColor = liftTheVeil ? '#330033' : '#110022';
  
  return (
    <div className="w-full h-full">
      <Canvas frameloop="demand">
        <PerspectiveCamera 
          position={[0, layoutType === 'circle' ? 12 : 8, layoutType === 'circle' ? 2 : 10]} 
          fov={70} 
          makeDefault 
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <fog attach="fog" args={[fogColor, 1, 20]} />
        
        {geometriesToRender.map((geometry, index) => {
          const position = positions[index % positions.length];
          const geometryChakra = geometry.chakra || chakra;
          
          switch (geometry.type) {
            case 'flowerOfLife':
              return (
                <FlowerOfLifeGeometry
                  key={`flower-${index}`}
                  frequencyData={frequencyData}
                  chakra={geometryChakra}
                  intensity={intensity}
                  position={position}
                  scale={geometry.scale || 1}
                  isActive={geometry.isActive !== false}
                />
              );
              
            case 'merkaba':
              return (
                <MerkabaGeometry
                  key={`merkaba-${index}`}
                  frequencyData={frequencyData}
                  chakra={geometryChakra}
                  intensity={intensity}
                  position={position}
                  scale={geometry.scale || 1}
                  isActive={geometry.isActive !== false}
                />
              );
              
            case 'metatronCube':
              return (
                <MetatronCubeGeometry
                  key={`metatron-${index}`}
                  frequencyData={frequencyData}
                  chakra={geometryChakra}
                  intensity={intensity}
                  position={position}
                  scale={geometry.scale || 1}
                  isActive={geometry.isActive !== false}
                />
              );
              
            case 'sriYantra':
              return (
                <SriYantraGeometry
                  key={`sri-yantra-${index}`}
                  frequencyData={frequencyData}
                  chakra={geometryChakra}
                  intensity={intensity}
                  position={position}
                  scale={geometry.scale || 1}
                  isActive={geometry.isActive !== false}
                />
              );
              
            case 'fibonacciSpiral':
              return (
                <FibonacciSpiralGeometry
                  key={`fibonacci-${index}`}
                  frequencyData={frequencyData}
                  chakra={geometryChakra}
                  intensity={intensity}
                  position={position}
                  scale={geometry.scale || 1}
                  isActive={geometry.isActive !== false}
                />
              );
              
            case 'chakraBeam':
              return (
                <ChakraBeamGeometry
                  key={`chakra-beam-${index}`}
                  frequencyData={frequencyData}
                  chakra={geometryChakra}
                  intensity={intensity}
                  position={position}
                  scale={geometry.scale || 1}
                  isActive={geometry.isActive !== false}
                />
              );
              
            default:
              return null;
          }
        })}
        
        {enableControls && (
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            enableRotate={true}
            // For circle layout, orbit around the center
            target={[0, 0, 0]}
          />
        )}
      </Canvas>
    </div>
  );
};

export default MultiVisualizer;
