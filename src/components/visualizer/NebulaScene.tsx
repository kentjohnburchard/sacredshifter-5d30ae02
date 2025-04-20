
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const NebulaScene: React.FC<SceneProps> = ({ analyzer }) => {
  const nebulaRef = useRef<THREE.Points>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  const particleCount = 5000;
  
  // Create particles for nebula
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Position in a cloud-like formation
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random() * Math.random() * 5; // Concentration toward center
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Color gradient from purple to blue
      const hue = 0.7 + Math.random() * 0.15; // Purple to blue range
      const saturation = 0.7 + Math.random() * 0.3;
      const lightness = 0.5 + Math.random() * 0.3;
      
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random sizes
      sizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, []);
  
  useFrame((state) => {
    if (!nebulaRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Calculate frequency bands
    const lowFreq = getAverageVolume(dataArray.current, 0, 10);
    const midFreq = getAverageVolume(dataArray.current, 10, 30);
    const highFreq = getAverageVolume(dataArray.current, 30, dataArray.current.length - 1);
    
    // Update nebula particles
    const positions = nebulaRef.current.geometry.attributes.position;
    const sizes = nebulaRef.current.geometry.attributes.size;
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < particleCount; i++) {
      const ix = positions.getX(i);
      const iy = positions.getY(i);
      const iz = positions.getZ(i);
      
      // Calculate distance from center
      const distance = Math.sqrt(ix * ix + iy * iy + iz * iz);
      
      // Different frequency bands affect different distance ranges
      let scale = 1;
      if (distance < 2) {
        scale = 1 + lowFreq * 1.5;
      } else if (distance < 4) {
        scale = 1 + midFreq * 1.5;
      } else {
        scale = 1 + highFreq * 1.5;
      }
      
      // Add some movement
      const angle = time * 0.1 + distance;
      const newX = ix * scale + Math.sin(angle) * 0.02;
      const newY = iy * scale + Math.cos(angle) * 0.02;
      const newZ = iz * scale + Math.sin(angle * 0.7) * 0.02;
      
      positions.setX(i, newX);
      positions.setY(i, newY);
      positions.setZ(i, newZ);
      
      // Pulse size with audio
      const originalSize = particlesGeometry.attributes.size.getX(i);
      const freqIndex = i % dataArray.current.length;
      const freqValue = dataArray.current[freqIndex] / 256;
      sizes.setX(i, originalSize * (1 + freqValue));
    }
    
    positions.needsUpdate = true;
    sizes.needsUpdate = true;
    
    // Rotate slowly
    nebulaRef.current.rotation.y += 0.0005;
  });
  
  // Helper function to get average volume for a frequency range
  const getAverageVolume = (array: Uint8Array, start: number, end: number) => {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += array[i];
    }
    return sum / (end - start) / 256;
  };
  
  const nebulaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5));
          if (r > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, r);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);
  
  return (
    <points ref={nebulaRef} geometry={particlesGeometry} material={nebulaMaterial} />
  );
};

export default NebulaScene;
