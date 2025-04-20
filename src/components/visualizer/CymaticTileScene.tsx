
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const CymaticTileScene: React.FC<SceneProps> = ({ analyzer }) => {
  const tilesRef = useRef<THREE.Group>(null);
  const tileRefs = useRef<THREE.Mesh[]>([]);
  const dataArray = useRef<Uint8Array | null>(null);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  const tileCount = 6; // Number of tiles in each direction (6x6 grid)
  
  // Create a grid of cymatic tiles
  const createTiles = useMemo(() => {
    const tiles = [];
    const tileSize = 0.8;
    const spacing = 1.0;
    
    for (let x = 0; x < tileCount; x++) {
      for (let z = 0; z < tileCount; z++) {
        const posX = (x - tileCount / 2 + 0.5) * spacing;
        const posZ = (z - tileCount / 2 + 0.5) * spacing;
        
        // Each tile is a slightly different color
        const hue = ((x + z) / (tileCount * 2)) * 0.3 + 0.5; // Blue to purple range
        const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
        
        tiles.push(
          <mesh 
            key={`tile-${x}-${z}`} 
            position={[posX, 0, posZ]}
            ref={el => { if (el) tileRefs.current.push(el); }}
          >
            <planeGeometry args={[tileSize, tileSize, 16, 16]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              side={THREE.DoubleSide}
              wireframe={true}
            />
          </mesh>
        );
      }
    }
    
    return tiles;
  }, []);
  
  useFrame((state) => {
    if (!tilesRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    const time = state.clock.getElapsedTime();
    
    // Update each tile with cymatic patterns
    tileRefs.current.forEach((tile, index) => {
      if (!tile) return;
      
      const x = Math.floor(index / tileCount);
      const z = index % tileCount;
      
      // Get a frequency band for this tile
      const freqBandWidth = Math.floor(dataArray.current!.length / (tileCount * tileCount));
      const freqStart = index * freqBandWidth;
      const freqEnd = freqStart + freqBandWidth;
      
      if (freqEnd > dataArray.current!.length) return;
      
      // Calculate average for this frequency band
      let sum = 0;
      for (let i = freqStart; i < freqEnd; i++) {
        sum += dataArray.current![i];
      }
      const average = sum / freqBandWidth / 256;
      
      // Create wave patterns on the tile
      const geometry = tile.geometry as THREE.PlaneGeometry;
      const position = geometry.attributes.position;
      
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        
        // Different cymatic pattern for each tile
        const pattern = (x + z) % 4;
        let z = 0;
        
        switch (pattern) {
          case 0:
            // Circular waves
            z = Math.sin(Math.sqrt(x * x + y * y) * 10 - time * 3) * average * 0.3;
            break;
          case 1:
            // Grid waves
            z = Math.sin(x * 10 - time * 2) * Math.sin(y * 10 - time * 2) * average * 0.3;
            break;
          case 2:
            // Diagonal waves
            z = Math.sin((x + y) * 10 - time * 3) * average * 0.3;
            break;
          case 3:
            // Radial waves
            z = Math.sin(Math.atan2(y, x) * 5 + Math.sqrt(x * x + y * y) * 8 - time * 3) * average * 0.3;
            break;
        }
        
        position.setZ(i, z);
      }
      
      position.needsUpdate = true;
      
      // Update material properties
      if (tile.material instanceof THREE.MeshStandardMaterial) {
        // Intensity based on audio
        tile.material.emissiveIntensity = 0.3 + average * 2;
      }
    });
    
    // Rotate the entire grid slowly
    tilesRef.current.rotation.x = -Math.PI / 3; // Tilt to see better
    tilesRef.current.rotation.y += 0.001;
  });
  
  return (
    <group ref={tilesRef}>
      {createTiles}
    </group>
  );
};

export default CymaticTileScene;
