
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const PrimeSymphonyScene: React.FC<SceneProps> = ({ analyzer }) => {
  const primeGroupRef = useRef<THREE.Group>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const primeRefs = useRef<THREE.Mesh[]>([]);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  // Generate prime numbers
  const primes = useMemo(() => {
    const result = [];
    const max = 500;
    
    // Basic sieve of Eratosthenes
    const sieve = Array(max).fill(true);
    sieve[0] = sieve[1] = false;
    
    for (let i = 2; i < Math.sqrt(max); i++) {
      if (sieve[i]) {
        for (let j = i * i; j < max; j += i) {
          sieve[j] = false;
        }
      }
    }
    
    // Collect primes
    for (let i = 2; i < max; i++) {
      if (sieve[i]) result.push(i);
    }
    
    return result.slice(0, 100); // Limit to 100 primes
  }, []);
  
  useFrame(() => {
    if (!primeGroupRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Update prime number spheres
    primeRefs.current.forEach((sphere, i) => {
      if (!sphere) return;
      
      // Map this prime to a frequency bin
      const freqIndex = Math.floor((i / primes.length) * dataArray.current!.length);
      const value = dataArray.current![freqIndex] / 256;
      
      // Set the size based on the frequency value
      const scale = 0.5 + value * 2;
      sphere.scale.set(scale, scale, scale);
      
      // Set color based on frequency
      if (sphere.material instanceof THREE.MeshStandardMaterial) {
        const hue = (i / primes.length) * 0.3 + 0.6; // Shift toward purple spectrum
        const saturation = 0.7 + value * 0.3;
        const lightness = 0.4 + value * 0.6;
        
        sphere.material.color.setHSL(hue, saturation, lightness);
        sphere.material.emissiveIntensity = value * 2;
      }
    });
    
    // Rotate the entire prime group
    primeGroupRef.current.rotation.y += 0.001;
    primeGroupRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
  });
  
  // Create positions based on prime spiral
  const positions = useMemo(() => {
    return primes.map((prime, index) => {
      const angle = prime * 0.1;
      const radius = Math.sqrt(prime) * 0.15;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (prime % 7) * 0.05; // Add some variation in the Z dimension
      
      return [x, y, z];
    });
  }, [primes]);
  
  return (
    <group ref={primeGroupRef}>
      {positions.map((pos, i) => (
        <mesh 
          key={i} 
          position={[pos[0], pos[1], pos[2]]}
          ref={el => { if (el) primeRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color={new THREE.Color().setHSL((i / positions.length) * 0.3 + 0.6, 0.8, 0.5)}
            emissive={new THREE.Color().setHSL((i / positions.length) * 0.3 + 0.6, 1, 0.5)}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

export default PrimeSymphonyScene;
