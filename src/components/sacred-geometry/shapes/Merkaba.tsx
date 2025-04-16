
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Merkaba: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene with transparent background
    const scene = new THREE.Scene();
    scene.background = null; // Make background fully transparent
    
    // Create camera with wider field of view
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 4; // Position camera to see the whole merkaba
    
    // Create renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Enable transparency
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    containerRef.current.appendChild(renderer.domElement);

    // Create Merkaba (Star Tetrahedron) - fixed implementation
    const group = new THREE.Group();
    
    // Material for the tetrahedrons - using MeshStandardMaterial for better lighting
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x9f7aea, 
      metalness: 0.6, 
      roughness: 0.4, 
      emissive: 0x3a1b8c,
      emissiveIntensity: 0.5,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });

    // Create upward-pointing tetrahedron
    const tetraGeometryUp = new THREE.TetrahedronGeometry(1);
    const tetraUp = new THREE.Mesh(tetraGeometryUp, material);
    tetraUp.rotation.z = Math.PI / 7; // Slight rotation for better visibility
    group.add(tetraUp);
    
    // Create downward-pointing tetrahedron
    const tetraGeometryDown = new THREE.TetrahedronGeometry(1);
    const tetraDown = new THREE.Mesh(tetraGeometryDown, material.clone());
    tetraDown.rotation.z = Math.PI;
    tetraDown.rotation.y = Math.PI / 3.5;
    group.add(tetraDown);
    
    // Create edgeTriangles for better visibility
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: 0xb794f6,
      transparent: true,
      opacity: 0.8
    });
    
    const edgesUp = new THREE.EdgesGeometry(tetraGeometryUp);
    const lineUp = new THREE.LineSegments(edgesUp, edgesMaterial);
    tetraUp.add(lineUp);
    
    const edgesDown = new THREE.EdgesGeometry(tetraGeometryDown);
    const lineDown = new THREE.LineSegments(edgesDown, edgesMaterial);
    tetraDown.add(lineDown);
    
    // Add to scene
    scene.add(group);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Increased ambient light
    scene.add(ambientLight);
    
    // Add point light for more dynamic lighting
    const pointLight = new THREE.PointLight(0xb794f6, 1.2); // Brighter purple light
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Add a second softer light from another angle for depth
    const secondLight = new THREE.PointLight(0x805ad5, 0.8);
    secondLight.position.set(-5, -2, 3);
    scene.add(secondLight);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.x += 0.005;
      group.rotation.y += 0.005;
      
      // Subtle pulsating effect
      const pulseFactor = 0.5 + Math.sin(Date.now() * 0.001) * 0.1;
      pointLight.intensity = 1.2 * pulseFactor;
      
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
      tetraGeometryUp.dispose();
      tetraGeometryDown.dispose();
      material.dispose();
      edgesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center"></div>;
};

export default Merkaba;
