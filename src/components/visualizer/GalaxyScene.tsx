
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const GalaxyScene: React.FC<SceneProps> = ({ analyzer }) => {
  const galaxyRef = useRef<THREE.Points>(null);
  const galaxyCoreRef = useRef<THREE.Points>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  const particleCount = 10000;
  const coreParticleCount = 2000;
  
  // Create spiral galaxy particles
  const galaxyGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Spiral pattern
      const armCount = 2;
      const armIdx = i % armCount;
      const angle = (i / particleCount) * Math.PI * 20 + (armIdx * Math.PI * 2 / armCount);
      const radius = Math.random() * 10;
      const spiralFactor = 0.1 + Math.random() * 0.1;
      
      const x = radius * Math.cos(angle + radius * spiralFactor);
      const y = (Math.random() - 0.5) * 0.5; // Thin disk
      const z = radius * Math.sin(angle + radius * spiralFactor);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Colors based on distance from center
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      let hue, saturation, lightness;
      
      if (distanceFromCenter < 2) {
        // Core: more yellowy-white
        hue = 0.15;
        saturation = 0.5;
        lightness = 0.7;
      } else if (distanceFromCenter < 6) {
        // Mid-arms: blue-ish
        hue = 0.6 + Math.random() * 0.1;
        saturation = 0.7;
        lightness = 0.6;
      } else {
        // Outer arms: purple-ish
        hue = 0.7 + Math.random() * 0.1;
        saturation = 0.8;
        lightness = 0.5;
      }
      
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Size based on position
      sizes[i] = 0.05 + Math.random() * 0.05;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, []);
  
  // Create galaxy core particles
  const coreGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(coreParticleCount * 3);
    const colors = new Float32Array(coreParticleCount * 3);
    const sizes = new Float32Array(coreParticleCount);
    
    for (let i = 0; i < coreParticleCount; i++) {
      // Dense sphere in the center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random() * Math.random() * 2; // Concentration toward center
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.2; // Flattened in y
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Yellowy-white core
      const hue = 0.15;
      const saturation = 0.3 + Math.random() * 0.3;
      const lightness = 0.7 + Math.random() * 0.3;
      
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Larger particles for the core
      sizes[i] = 0.1 + Math.random() * 0.15;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, []);
  
  const galaxyMaterial = useMemo(() => {
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
  
  useFrame(() => {
    if ((!galaxyRef.current && !galaxyCoreRef.current) || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Calculate frequency bands
    const bass = getAverageVolume(dataArray.current, 0, 5);
    const mid = getAverageVolume(dataArray.current, 5, 20);
    const treble = getAverageVolume(dataArray.current, 20, dataArray.current.length - 1);
    
    // Rotate the galaxy
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += 0.001 + bass * 0.002;
    }
    
    if (galaxyCoreRef.current) {
      galaxyCoreRef.current.rotation.y += 0.002 + mid * 0.003;
      
      // Make the core pulse with the bass
      const scale = 1 + bass * 0.5;
      galaxyCoreRef.current.scale.set(scale, scale, scale);
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
    <group>
      <points ref={galaxyRef} geometry={galaxyGeometry} material={galaxyMaterial} />
      <points ref={galaxyCoreRef} geometry={coreGeometry} material={galaxyMaterial} />
    </group>
  );
};

export default GalaxyScene;
