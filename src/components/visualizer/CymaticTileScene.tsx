
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const CymaticTileScene: React.FC<SceneProps> = ({ analyzer }) => {
  const tilesRef = useRef<THREE.Group>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const tiles = useRef<THREE.Mesh[][]>([]);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  // Create a grid of tiles
  const grid = useMemo(() => {
    const size = 8; // 8x8 grid
    const tileSize = 0.4;
    const spacing = 0.1;
    const totalSize = size * (tileSize + spacing);
    const offset = -totalSize / 2 + tileSize / 2;
    
    const group = new THREE.Group();
    
    // Initialize the tiles array
    const tilesArray: THREE.Mesh[][] = [];
    
    // Create tiles
    for (let x = 0; x < size; x++) {
      tilesArray[x] = [];
      for (let z = 0; z < size; z++) {
        const geometry = new THREE.BoxGeometry(tileSize, 0.1, tileSize);
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL((x + z) / (size * 2), 0.7, 0.5),
          emissive: new THREE.Color().setHSL((x + z) / (size * 2), 1, 0.3),
          emissiveIntensity: 0.5
        });
        
        const tile = new THREE.Mesh(geometry, material);
        tile.position.x = offset + x * (tileSize + spacing);
        tile.position.z = offset + z * (tileSize + spacing);
        
        group.add(tile);
        tilesArray[x][z] = tile;
      }
    }
    
    tiles.current = tilesArray;
    return group;
  }, []);
  
  useFrame(() => {
    if (!tilesRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    const size = tiles.current.length;
    
    // Animate tiles based on frequency data
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const tile = tiles.current[x][z];
        if (!tile) continue;
        
        // Map this tile to a frequency bin
        const binIndex = Math.floor(((x * size + z) / (size * size)) * dataArray.current.length);
        const value = dataArray.current[binIndex] / 256;
        
        // Animate height based on frequency
        tile.scale.y = 0.1 + value * 2;
        
        // Change color intensity based on frequency
        if (tile.material instanceof THREE.MeshStandardMaterial) {
          tile.material.emissiveIntensity = value * 2;
          
          // Adjust color based on frequency
          const hue = (x + z) / (size * 2) + value * 0.2;
          const saturation = 0.7 + value * 0.3;
          const lightness = 0.3 + value * 0.4;
          
          tile.material.color.setHSL(hue, saturation, lightness);
          tile.material.emissive.setHSL(hue, 1, lightness * 0.5);
        }
      }
    }
    
    // Rotate the entire grid
    tilesRef.current.rotation.y += 0.002;
  });
  
  return (
    <primitive object={grid} ref={tilesRef} />
  );
};

export default CymaticTileScene;
