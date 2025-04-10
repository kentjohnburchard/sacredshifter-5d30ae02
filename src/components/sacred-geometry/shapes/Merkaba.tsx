import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Merkaba: React.FC = () => {
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
    camera.position.z = 4.5; // Positioned to see the whole merkaba
    
    // Create renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Enable transparency
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    containerRef.current.appendChild(renderer.domElement);

    // Create Merkaba (Star Tetrahedron)
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x9f7aea, 
      metalness: 0.6, 
      roughness: 0.4, 
      emissive: 0x3a1b8c,
      emissiveIntensity: 0.3,
      wireframe: true,
      transparent: true,
      opacity: 0.2 // Slightly more transparent
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xb794f6,
      transparent: true,
      opacity: 0.2, // Slightly more transparent lines
    });

    // Create group to hold both tetrahedrons
    const group = new THREE.Group();

    // Create top tetrahedron with better geometry
    const topTetraGeometry = new THREE.TetrahedronGeometry(1.2);
    const topTetra = new THREE.Mesh(topTetraGeometry, material);
    const topTetraEdges = new THREE.EdgesGeometry(topTetraGeometry);
    const topTetraLines = new THREE.LineSegments(topTetraEdges, lineMaterial);
    topTetra.add(topTetraLines);
    group.add(topTetra);

    // Create bottom tetrahedron with better geometry
    const bottomTetraGeometry = new THREE.TetrahedronGeometry(1.2);
    const bottomTetra = new THREE.Mesh(bottomTetraGeometry, material);
    const bottomTetraEdges = new THREE.EdgesGeometry(bottomTetraGeometry);
    const bottomTetraLines = new THREE.LineSegments(bottomTetraEdges, lineMaterial);
    bottomTetra.rotation.x = Math.PI; // Flip it upside down
    bottomTetra.add(bottomTetraLines);
    group.add(bottomTetra);

    // Add outer sphere for energy field effect
    const sphereGeometry = new THREE.SphereGeometry(1.6, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x9f7aea,
      transparent: true,
      opacity: 0.05, // Even more transparent energy sphere
      wireframe: true,
    });
    const energySphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(energySphere);

    // Center and scale the group
    group.position.set(0, 0, 0);
    group.scale.set(0.8, 0.8, 0.8); // Scale to match MetatronsCube
    scene.add(group);

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
      group.rotation.x += 0.005;
      group.rotation.y += 0.005;
      // Make the energy sphere rotate in the opposite direction
      energySphere.rotation.x -= 0.002;
      energySphere.rotation.y -= 0.002;
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
      topTetraGeometry.dispose();
      bottomTetraGeometry.dispose();
      sphereGeometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      sphereMaterial.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center"></div>;
};

export default Merkaba;
