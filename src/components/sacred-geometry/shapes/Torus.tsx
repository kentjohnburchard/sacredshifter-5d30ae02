
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Torus: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create Torus group
    const torusGroup = new THREE.Group();

    // Create main Torus
    const geometry = new THREE.TorusGeometry(1, 0.4, 32, 100);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#9f7aea'), // Violet
      emissive: new THREE.Color('#805ad5'),
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    
    const torus = new THREE.Mesh(geometry, material);
    torusGroup.add(torus);

    // Add wireframe overlay
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xb794f6,
      transparent: true,
      opacity: 0.5,
    });
    const wireframeGeo = new THREE.EdgesGeometry(geometry);
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMaterial);
    torus.add(wireframe);

    // Create inner energy torus
    const innerGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 50);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d6bcfa'),
      emissive: new THREE.Color('#9f7aea'),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7,
    });
    
    const innerTorus = new THREE.Mesh(innerGeometry, innerMaterial);
    innerTorus.rotation.x = Math.PI / 2;
    torusGroup.add(innerTorus);

    scene.add(torusGroup);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.005;
      torus.rotation.y += 0.005;
      innerTorus.rotation.x += 0.008;
      innerTorus.rotation.z += 0.008;
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full"></div>;
};

export default Torus;
