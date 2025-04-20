
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const CymaticScene: React.FC<SceneProps> = ({ analyzer }) => {
  const planeRef = useRef<THREE.Mesh>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  // Create a grid of vertices for the cymatic pattern
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(5, 5, 100, 100);
    return geo;
  }, []);
  
  useFrame((state) => {
    if (!planeRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Calculate average frequency values for different bands
    const bassAvg = getAverageVolume(dataArray.current, 0, 10);
    const midAvg = getAverageVolume(dataArray.current, 10, 30);
    const trebleAvg = getAverageVolume(dataArray.current, 30, 60);
    
    // Update vertices to create wave patterns
    const time = state.clock.getElapsedTime();
    const position = planeRef.current.geometry.attributes.position;
    
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      
      // Create different wave patterns based on audio frequency bands
      const distance = Math.sqrt(x * x + y * y);
      const bass = Math.sin(distance * 1.5 - time * 2) * bassAvg * 0.02;
      const mid = Math.sin(x * 2 + time * 3) * Math.sin(y * 2 + time * 2) * midAvg * 0.02;
      const treble = Math.sin(distance * 5 + time * 5) * trebleAvg * 0.01;
      
      // Combine waves for a cymatic pattern
      position.setZ(i, bass + mid + treble);
    }
    
    position.needsUpdate = true;
    
    // Rotate slowly
    planeRef.current.rotation.z += 0.001;
  });
  
  // Helper function to get average volume for a frequency range
  const getAverageVolume = (array: Uint8Array, start: number, end: number) => {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += array[i];
    }
    return sum / (end - start) / 256;
  };
  
  return (
    <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geometry} />
      <meshStandardMaterial 
        color="#00ffff"
        wireframe={true}
        emissive="#007777"
        emissiveIntensity={1}
      />
    </mesh>
  );
};

export default CymaticScene;
