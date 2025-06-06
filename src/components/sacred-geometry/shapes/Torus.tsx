
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Torus: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene with transparent background
    const scene = new THREE.Scene();
    scene.background = null; // Make background fully transparent
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 4.5; // Position further back to see the whole torus
    
    // Create renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Enable transparency
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    containerRef.current.appendChild(renderer.domElement);

    // Create Torus group
    const torusGroup = new THREE.Group();

    // Create main Torus with more transparent material
    const geometry = new THREE.TorusGeometry(1, 0.4, 32, 100);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#9f7aea'), // Violet
      emissive: new THREE.Color('#805ad5'),
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
      transparent: true,
      opacity: 0.15, // Increased transparency (was 0.2)
    });
    
    const torus = new THREE.Mesh(geometry, material);
    torusGroup.add(torus);

    // Add wireframe overlay with higher transparency
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xb794f6,
      transparent: true,
      opacity: 0.08, // Increased transparency (was 0.1)
    });
    const wireframeGeo = new THREE.EdgesGeometry(geometry);
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMaterial);
    torus.add(wireframe);

    // Create inner energy torus with higher transparency
    const innerGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 50);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d6bcfa'),
      emissive: new THREE.Color('#9f7aea'),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.15, // Increased transparency (was 0.2)
    });
    
    const innerTorus = new THREE.Mesh(innerGeometry, innerMaterial);
    innerTorus.rotation.x = Math.PI / 2;
    torusGroup.add(innerTorus);

    // Center and scale the group to fit better
    torusGroup.position.set(0, 0, 0);
    torusGroup.scale.set(0.8, 0.8, 0.8);
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
      
      // Dispose of resources
      geometry.dispose();
      material.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      wireframeGeo.dispose();
      wireframeMaterial.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center"></div>;
};

export default Torus;
