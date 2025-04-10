
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SacredVisualizerProps {
  shape: 'flower' | 'cube' | 'merkaba' | 'torus' | 'sphere';
}

const SacredVisualizer: React.FC<SacredVisualizerProps> = ({ shape }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const shapeRef = useRef<THREE.Mesh>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent background
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    let geometry: THREE.BufferGeometry;
    switch (shape) {
      case 'cube':
        geometry = new THREE.BoxGeometry();
        break;
      case 'flower':
        geometry = new THREE.IcosahedronGeometry(1, 3);
        break;
      case 'merkaba':
        geometry = new THREE.OctahedronGeometry(1, 1);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
        break;
      case 'sphere':
      default:
        geometry = new THREE.SphereGeometry(1, 32, 32);
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#9f7aea'), // Violet
      emissive: new THREE.Color('#805ad5'),
      roughness: 0.2,
      metalness: 0.8,
    });

    const shapeMesh = new THREE.Mesh(geometry, material);
    scene.add(shapeMesh);
    shapeRef.current = shapeMesh;

    const animate = () => {
      requestAnimationFrame(animate);
      if (shapeRef.current) {
        shapeRef.current.rotation.x += 0.01;
        shapeRef.current.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (shapeRef.current) scene.remove(shapeRef.current);
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [shape]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default SacredVisualizer;
