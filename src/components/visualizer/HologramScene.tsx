
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const HologramScene: React.FC<SceneProps> = ({ analyzer }) => {
  const hologramRef = useRef<THREE.Group>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const edgesRef = useRef<THREE.LineSegments | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  const particleCount = 500;
  
  // Create base geometry for hologram
  const baseGeometry = useMemo(() => {
    // Create a tetrahedron for the base shape
    return new THREE.IcosahedronGeometry(1, 1);
  }, []);
  
  // Create edges for hologram effect
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(baseGeometry);
  }, [baseGeometry]);
  
  // Create particles for hologram
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Random positions within a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 0.8 + Math.random() * 0.5;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);
  
  useFrame((state) => {
    if (!hologramRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Calculate frequency bands
    const lowFreq = getAverageVolume(dataArray.current, 0, 5);
    const midFreq = getAverageVolume(dataArray.current, 5, 20);
    const highFreq = getAverageVolume(dataArray.current, 20, dataArray.current.length - 1);
    
    // Base hologram rotation and scale
    hologramRef.current.rotation.y += 0.002;
    
    // Make hologram pulse with bass
    const scale = 1 + lowFreq * 0.3;
    hologramRef.current.scale.set(scale, scale, scale);
    
    // Edge effects with mid frequencies
    if (edgesRef.current && edgesRef.current.material instanceof THREE.LineBasicMaterial) {
      // Pulse opacity with mid frequencies
      edgesRef.current.material.opacity = 0.5 + midFreq * 0.5;
      
      // Change color based on audio
      const hue = 0.6 + midFreq * 0.1; // Blue to purple
      edgesRef.current.material.color.setHSL(hue, 0.8, 0.5);
    }
    
    // Particle effects with high frequencies
    if (particlesRef.current && particlesRef.current.material instanceof THREE.PointsMaterial) {
      // Pulse size with high frequencies
      particlesRef.current.material.size = 0.05 + highFreq * 0.1;
      
      // Change color based on audio
      const hue = 0.6 + highFreq * 0.2; // Blue to purple range
      particlesRef.current.material.color.setHSL(hue, 1, 0.7);
    }
    
    // Add a holographic flicker effect
    const flicker = 0.7 + Math.sin(state.clock.getElapsedTime() * 10) * 0.3;
    if (edgesRef.current && edgesRef.current.material instanceof THREE.LineBasicMaterial) {
      edgesRef.current.material.opacity *= flicker;
    }
    
    // Add scan lines effect by modulating along y-axis
    const scanLineY = (state.clock.getElapsedTime() % 2) - 1; // -1 to 1 over 2 seconds
    const scanLineWidth = 0.1;
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position;
      
      for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
        const y = particlesGeometry.attributes.position.getY(i);
        const distanceFromScanLine = Math.abs(y - scanLineY);
        
        // Brighten particles near the scan line
        const brightenFactor = distanceFromScanLine < scanLineWidth ? 
          1 + (1 - distanceFromScanLine / scanLineWidth) : 1;
        
        const scale = 1 * brightenFactor;
        
        positions.setX(i, particlesGeometry.attributes.position.getX(i) * scale);
        positions.setY(i, y * scale);
        positions.setZ(i, particlesGeometry.attributes.position.getZ(i) * scale);
      }
      
      positions.needsUpdate = true;
    }
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
    <group ref={hologramRef}>
      {/* Hologram edges */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial 
          color={new THREE.Color().setHSL(0.6, 0.8, 0.5)} 
          transparent={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      
      {/* Hologram particles */}
      <points ref={particlesRef} geometry={particlesGeometry}>
        <pointsMaterial 
          color={new THREE.Color().setHSL(0.6, 1, 0.7)}
          size={0.05}
          transparent={true}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default HologramScene;
