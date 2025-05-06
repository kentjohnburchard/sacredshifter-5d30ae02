
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { DNAStrandStatus } from '@/types/cosmic-blueprint';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dna, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface DNAStrand {
  id: number;
  active: boolean;
  chakra?: ChakraTag;
  rotation: number;
}

interface DNAHelixProps {
  dnaStrandStatus: DNAStrandStatus;
  chakraOverlay?: boolean;
  lightbearerLevel?: number;
  zoom?: number;
  rotation?: number;
}

// DNA Helix component using Three.js
const DNAHelix: React.FC<DNAHelixProps> = ({
  dnaStrandStatus,
  chakraOverlay = true,
  lightbearerLevel = 1,
  zoom = 5,
  rotation = 0
}) => {
  const group = useRef<THREE.Group>(null);
  const [strands, setStrands] = useState<DNAStrand[]>([]);
  
  // Initialize strands
  useEffect(() => {
    const chakras: ChakraTag[] = [
      'Root', 'Sacral', 'Solar Plexus', 'Heart',
      'Throat', 'Third Eye', 'Crown', 'Root', 
      'Sacral', 'Solar Plexus', 'Third Eye', 'Crown'
    ];
    
    const newStrands = dnaStrandStatus.map((active, i) => ({
      id: i,
      active,
      chakra: chakras[i],
      rotation: (i * Math.PI * 0.33) + rotation
    }));
    
    setStrands(newStrands);
  }, [dnaStrandStatus, rotation]);

  // Animate rotation
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group}>
      {/* Base spiral structure */}
      <mesh>
        <cylinderGeometry args={[2, 2, 10, 32, 1, true]} />
        <meshPhongMaterial color="#113355" opacity={0.1} transparent={true} />
      </mesh>
      
      {/* DNA strands */}
      {strands.map((strand) => (
        <group key={strand.id} rotation={[0, strand.rotation, 0]}>
          {/* Left helix */}
          <mesh position={[1.5, strand.id - 5.5, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshPhongMaterial 
              color={strand.active ? 
                chakraOverlay && strand.chakra ? getChakraColor(strand.chakra) : "#ffffff"
                : "#444444"} 
              emissive={strand.active ? "#555555" : "#000000"}
              shininess={strand.active ? 100 : 30}
            />
          </mesh>
          
          {/* Right helix */}
          <mesh position={[-1.5, strand.id - 5.5, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshPhongMaterial 
              color={strand.active ? 
                chakraOverlay && strand.chakra ? getChakraColor(strand.chakra) : "#ffffff"
                : "#444444"}
              emissive={strand.active ? "#555555" : "#000000"}
              shininess={strand.active ? 100 : 30}
            />
          </mesh>
          
          {/* Connecting bars */}
          <mesh position={[0, strand.id - 5.5, 0]} rotation={[0, Math.PI/2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
            <meshPhongMaterial
              color={strand.active ? "#aaccff" : "#666666"}
              opacity={0.8}
              transparent={true}
            />
          </mesh>
        </group>
      ))}
      
      {/* Lightbearer level indicator */}
      {lightbearerLevel > 0 && (
        <mesh position={[0, -5.5 + (lightbearerLevel * 0.8), 0]}>
          <torusGeometry args={[2.2, 0.1, 16, 100]} />
          <meshPhongMaterial color="#ffcc00" emissive="#aa7700" />
        </mesh>
      )}
    </group>
  );
};

interface DNAOverlayPanelProps {
  dnaStrandStatus: DNAStrandStatus;
  onUpdateStrand?: (index: number, active: boolean) => void;
  lightbearerLevel?: number;
  className?: string;
}

const DNAOverlayPanel: React.FC<DNAOverlayPanelProps> = ({
  dnaStrandStatus,
  onUpdateStrand,
  lightbearerLevel = 1,
  className
}) => {
  const [zoom, setZoom] = useState(5);
  const [rotation, setRotation] = useState(0);
  const [activeView, setActiveView] = useState<'3d' | 'chart'>('3d');
  const [chakraOverlay, setChakraOverlay] = useState(true);

  const handleZoomIn = () => {
    setZoom(prev => Math.max(3, Math.min(prev - 0.5, 10)));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(3, Math.min(prev + 0.5, 10)));
  };

  const handleRotate = () => {
    setRotation(prev => prev + Math.PI / 4);
  };

  return (
    <Card className={`border-indigo-500/30 bg-black/50 backdrop-blur-md ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Dna className="h-5 w-5 text-indigo-400" />
          DNA Overlay Panel
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="3d" onValueChange={(value) => setActiveView(value as '3d' | 'chart')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="3d">3D Visualization</TabsTrigger>
            <TabsTrigger value="chart">Strand Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="3d" className="pt-4">
            <div className="relative h-[400px] w-full rounded-lg bg-gradient-to-b from-black/80 to-indigo-950/30 overflow-hidden">
              <Canvas camera={{ position: [0, 0, zoom], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3366ff" />
                <DNAHelix 
                  dnaStrandStatus={dnaStrandStatus} 
                  chakraOverlay={chakraOverlay}
                  lightbearerLevel={lightbearerLevel}
                  zoom={zoom}
                  rotation={rotation}
                />
                <OrbitControls enableZoom={true} enablePan={false} />
              </Canvas>
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-black/40 backdrop-blur-sm border-white/20"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-black/40 backdrop-blur-sm border-white/20"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-black/40 backdrop-blur-sm border-white/20"
                  onClick={handleRotate}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-400">
                Active Strands: {dnaStrandStatus.filter(Boolean).length} / 12
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setChakraOverlay(!chakraOverlay)}
              >
                {chakraOverlay ? 'Hide Chakra Colors' : 'Show Chakra Colors'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="chart" className="pt-4">
            <div className="grid grid-cols-3 gap-2">
              {dnaStrandStatus.map((active, index) => (
                <Button
                  key={index}
                  variant={active ? "default" : "outline"}
                  className={`h-16 ${active ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-black/40'}`}
                  onClick={() => onUpdateStrand && onUpdateStrand(index, !active)}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold">Strand {index + 1}</span>
                    <span className="text-xs">{active ? 'Active' : 'Inactive'}</span>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              <p>Click on a strand to toggle its activation status.</p>
              <p className="mt-1">DNA strands activate as you progress in your spiritual journey.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DNAOverlayPanel;
