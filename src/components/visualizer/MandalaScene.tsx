import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';
import { MandalaSettings } from '@/components/MandalaBuilder';
import { isPrime } from '@/utils/primeCalculations';

interface MandalaSceneProps extends SceneProps {
  mandalaSettings?: MandalaSettings;
}

const MandalaScene: React.FC<MandalaSceneProps> = ({ analyzer, mandalaSettings }) => {
  const groupRef = useRef<THREE.Group>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const meshes = useRef<THREE.Mesh[][]>([]);
  
  // Initialize frequency data array
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  // Default settings if none provided
  const settings = mandalaSettings || {
    sides: 6,
    spokes: 12,
    layers: 3,
    radius: 0.7,
    mapSidesToPrime: false,
    mapSpokesToFrequency: false
  };
  
  // Create mandala geometry
  const mandalaGeometry = useMemo(() => {
    // Create a group to hold all mandala elements
    const group = new THREE.Group();
    const layerMeshes: THREE.Mesh[][] = [];
    
    // Materials with different colors for each layer
    const materials = Array.from({ length: settings.layers }, (_, i) => {
      const hue = i / settings.layers;
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(hue, 0.7, 0.5),
        emissive: new THREE.Color().setHSL(hue, 1, 0.3),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
    });
    
    // Create layers
    for (let layer = 0; layer < settings.layers; layer++) {
      const layerRadius = ((layer + 1) / settings.layers) * settings.radius;
      const meshArray: THREE.Mesh[] = [];
      layerMeshes.push(meshArray);
      
      // Create a shape for the regular polygon
      const shape = new THREE.Shape();
      
      // Draw the polygon
      for (let i = 0; i < settings.sides; i++) {
        const angle = (i / settings.sides) * Math.PI * 2;
        const x = Math.cos(angle) * layerRadius;
        const y = Math.sin(angle) * layerRadius;
        
        if (i === 0) {
          shape.moveTo(x, y);
        } else {
          shape.lineTo(x, y);
        }
      }
      shape.closePath();
      
      // Create extruded geometry
      const extrudeSettings = {
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3
      };
      
      // Create the main polygon mesh for this layer
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const mesh = new THREE.Mesh(geometry, materials[layer]);
      mesh.position.z = layer * 0.2; // Stack layers in Z direction
      group.add(mesh);
      meshArray.push(mesh);
      
      // Create spokes if we have any
      if (settings.spokes > 0) {
        for (let i = 0; i < settings.spokes; i++) {
          const angle = (i / settings.spokes) * Math.PI * 2;
          const x = Math.cos(angle) * layerRadius;
          const y = Math.sin(angle) * layerRadius;
          
          // Create a cylinder for each spoke
          const spokeGeometry = new THREE.CylinderGeometry(0.02, 0.02, layerRadius, 8);
          spokeGeometry.rotateX(Math.PI / 2);
          
          const spokeMesh = new THREE.Mesh(spokeGeometry, materials[layer]);
          spokeMesh.position.set(x / 2, y / 2, layer * 0.2);
          spokeMesh.lookAt(new THREE.Vector3(x, y, layer * 0.2));
          
          group.add(spokeMesh);
          meshArray.push(spokeMesh);
        }
      }
    }
    
    meshes.current = layerMeshes;
    return group;
  }, [settings]);
  
  // Animation frame
  useFrame(() => {
    if (!groupRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Animate based on frequency data
    meshes.current.forEach((layerMeshes, layerIndex) => {
      layerMeshes.forEach((mesh, meshIndex) => {
        // Get the right frequency bin for this element
        let binIndex = 0;
        
        if (settings.mapSidesToPrime && isPrime(meshIndex + 1)) {
          // If mapping to primes, use the mesh index as prime
          binIndex = (meshIndex % dataArray.current!.length);
        } else if (settings.mapSpokesToFrequency && layerIndex === 0) {
          // If mapping spokes to frequency, distribute evenly
          binIndex = Math.floor((meshIndex / settings.spokes) * dataArray.current!.length);
        } else {
          // Otherwise, distribute elements across the spectrum
          const totalMeshes = settings.sides + settings.spokes;
          binIndex = Math.floor((meshIndex / totalMeshes) * dataArray.current!.length);
        }
        
        // Get normalized amplitude (0-1)
        const value = dataArray.current![binIndex] / 256;
        
        // Scale the mesh based on frequency intensity
        const scale = 1 + value * 0.5;
        mesh.scale.set(scale, scale, 1 + value);
        
        // Update material properties
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.emissiveIntensity = 0.5 + value;
          
          // Adjust color hue based on frequency
          const baseHue = layerIndex / settings.layers;
          const hue = (baseHue + value * 0.1) % 1;
          mesh.material.emissive.setHSL(hue, 1, 0.5);
        }
      });
    });
    
    // Rotate the entire mandala
    groupRef.current.rotation.z += 0.002;
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
  });
  
  return (
    <group ref={groupRef}>
      <primitive object={mandalaGeometry} />
    </group>
  );
};

export default MandalaScene;
