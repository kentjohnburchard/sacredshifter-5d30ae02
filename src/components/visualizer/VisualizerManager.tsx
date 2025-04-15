import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';

interface VisualizerManagerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReactive?: boolean;
  analyser?: AnalyserNode | null;
  colorScheme?: string;
  type?: string;
  chakra?: string;
}

const Sphere: React.FC<{ analyser: AnalyserNode | null; colorScheme: string }> = ({ analyser, colorScheme }) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Initial positioning of the spheres
    for (let i = 0; i < 512; i++) {
      dummy.position.set(0, 0, 0);
      dummy.rotation.set(0, 0, 0);
      dummy.position.x = Math.random() * 10 - 5;
      dummy.position.y = Math.random() * 10 - 5;
      dummy.position.z = Math.random() * 10 - 5;

      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }

    mesh.current.instanceMatrix.needsUpdate = true;
  }, [analyser]);

  useFrame(() => {
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    for (let i = 0; i < 512; i++) {
      dummy.position.set(0, 0, 0);
      dummy.rotation.set(0, 0, 0);
      dummy.position.x = Math.random() * 10 - 5;
      dummy.position.y = Math.random() * 10 - 5;
      dummy.position.z = Math.random() * 10 - 5;

      const bassValue = dataArray[i % dataArray.length] / 255;
      dummy.scale.setScalar(0.5 + bassValue);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  const getColor = () => {
    switch (colorScheme) {
      case 'red': return '#FF0000';
      case 'orange': return '#FFA500';
      case 'yellow': return '#FFFF00';
      case 'green': return '#00FF00';
      case 'blue': return '#00FFFF';
      case 'indigo': return '#0000FF';
      case 'purple': return '#EE82EE';
      case 'pink': return '#FF69B4';
      default: return colorScheme;
    }
  };

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 512]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial color={getColor()} />
    </instancedMesh>
  );
};

const VisualizerManager: React.FC<VisualizerManagerProps> = ({
  size = 'md',
  isAudioReactive = false,
  analyser,
  colorScheme = 'purple',
  type,
  chakra
}) => {
  const sizeMapping = {
    sm: 200,
    md: 400,
    lg: 600,
    xl: 800,
  };

  const canvasSize = sizeMapping[size];

  return (
    <Canvas
      style={{
        width: '100%',
        height: `${canvasSize}px`,
        background: 'black',
      }}
      camera={{
        position: [0, 0, 5],
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Sphere analyser={analyser} colorScheme={colorScheme} />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          height={300}
        />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
};

export { VisualizerManager };
