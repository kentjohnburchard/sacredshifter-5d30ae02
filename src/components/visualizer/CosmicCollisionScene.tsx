
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const CosmicCollisionScene: React.FC<SceneProps> = ({ analyzer }) => {
  const collisionRef = useRef<THREE.Group>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const particlesRef1 = useRef<THREE.Points>(null);
  const particlesRef2 = useRef<THREE.Points>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  const particleCount = 3000;
  
  // Create first particle system
  const particlesGeometry1 = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Spiral galaxy pattern
      const arm = i % 2;
      const angle = (i / particleCount) * Math.PI * 10 + arm * Math.PI;
      const radius = Math.random() * 5;
      
      const x = radius * Math.cos(angle) - 2;
      const y = (Math.random() - 0.5) * 0.5;
      const z = radius * Math.sin(angle);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Blue-ish colors
      const hue = 0.6 + Math.random() * 0.1;
      const saturation = 0.7;
      const lightness = 0.5 + Math.random() * 0.3;
      
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geometry;
  }, []);
  
  // Create second particle system
  const particlesGeometry2 = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Spiral galaxy pattern
      const arm = i % 2;
      const angle = (i / particleCount) * Math.PI * 10 + arm * Math.PI;
      const radius = Math.random() * 5;
      
      const x = radius * Math.cos(angle) + 2;
      const y = (Math.random() - 0.5) * 0.5;
      const z = radius * Math.sin(angle);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Red-ish colors
      const hue = 0.0 + Math.random() * 0.1;
      const saturation = 0.7;
      const lightness = 0.5 + Math.random() * 0.3;
      
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geometry;
  }, []);
  
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);
  
  // Create shockwave ring
  const shockwaveGeometry = useMemo(() => {
    return new THREE.RingGeometry(0.5, 0.6, 64);
  }, []);
  
  useFrame((state) => {
    if (!collisionRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Calculate frequency bands
    const bassAvg = getAverageVolume(dataArray.current, 0, 10);
    const midAvg = getAverageVolume(dataArray.current, 10, 30);
    const trebleAvg = getAverageVolume(dataArray.current, 30, dataArray.current.length - 1);
    
    const time = state.clock.getElapsedTime();
    
    // Move the galaxies toward each other
    if (particlesRef1.current && particlesRef2.current) {
      const collisionProgress = Math.sin(time * 0.1) * 0.5; // -0.5 to 0.5
      
      // Move galaxies
      particlesRef1.current.position.x = 2 + collisionProgress * 4;
      particlesRef2.current.position.x = -2 - collisionProgress * 4;
      
      // Rotate galaxies
      particlesRef1.current.rotation.z += 0.001;
      particlesRef2.current.rotation.z -= 0.001;
      
      // Make particles more chaotic as they get closer
      if (collisionProgress > 0) {
        const chaos = collisionProgress * 10;
        
        updateParticles(particlesRef1.current, particlesGeometry1, chaos, bassAvg);
        updateParticles(particlesRef2.current, particlesGeometry2, chaos, midAvg);
      }
    }
    
    // Handle shockwave effect
    if (shockwaveRef.current) {
      const collisionPoint = Math.sin(time * 0.1); // -1 to 1
      
      // Show shockwave near the collision point
      if (Math.abs(collisionPoint) < 0.1) {
        const intensity = (0.1 - Math.abs(collisionPoint)) * 10;
        
        // Scale with bass response
        const scale = 3 + bassAvg * 5 + Math.sin(time * 5) * 0.5;
        shockwaveRef.current.scale.set(scale, scale, scale);
        
        // Set visibility and color
        if (shockwaveRef.current.material instanceof THREE.MeshBasicMaterial) {
          shockwaveRef.current.material.opacity = intensity * (0.5 + trebleAvg);
          
          // Change color based on audio
          const hue = 0.6 + bassAvg * 0.4; // Blue to purple range
          shockwaveRef.current.material.color.setHSL(hue, 1, 0.5);
        }
      } else {
        // Hide shockwave
        if (shockwaveRef.current.material instanceof THREE.MeshBasicMaterial) {
          shockwaveRef.current.material.opacity = 0;
        }
      }
    }
    
    // Rotate the entire scene
    collisionRef.current.rotation.y += 0.001;
  });
  
  // Helper function to get average volume for a frequency range
  const getAverageVolume = (array: Uint8Array, start: number, end: number) => {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += array[i];
    }
    return sum / (end - start) / 256;
  };
  
  // Helper function to update particles with chaos
  const updateParticles = (
    particleSystem: THREE.Points,
    originalGeometry: THREE.BufferGeometry,
    chaos: number,
    audioIntensity: number
  ) => {
    const positions = particleSystem.geometry.attributes.position;
    const originalPositions = originalGeometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const ox = originalPositions.getX(i);
      const oy = originalPositions.getY(i);
      const oz = originalPositions.getZ(i);
      
      // Add chaos with audio reactivity
      const chaosScale = chaos * (0.5 + audioIntensity * 2);
      const rx = (Math.random() - 0.5) * chaosScale;
      const ry = (Math.random() - 0.5) * chaosScale;
      const rz = (Math.random() - 0.5) * chaosScale;
      
      positions.setX(i, ox + rx);
      positions.setY(i, oy + ry);
      positions.setZ(i, oz + rz);
    }
    
    positions.needsUpdate = true;
  };
  
  return (
    <group ref={collisionRef}>
      {/* First galaxy */}
      <points ref={particlesRef1} geometry={particlesGeometry1} material={particleMaterial} />
      
      {/* Second galaxy */}
      <points ref={particlesRef2} geometry={particlesGeometry2} material={particleMaterial} />
      
      {/* Shockwave effect */}
      <mesh ref={shockwaveRef} geometry={shockwaveGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial 
          color={new THREE.Color().setHSL(0.6, 1, 0.5)}
          transparent={true} 
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default CosmicCollisionScene;
