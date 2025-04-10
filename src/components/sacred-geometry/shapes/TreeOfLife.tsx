
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const TreeOfLife: React.FC = () => {
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
    camera.position.z = 4.5; // Positioned to see the whole structure
    
    // Create renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Enable transparency
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    containerRef.current.appendChild(renderer.domElement);

    // Create Tree of Life
    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ 
      color: 0x9f7aea,
      transparent: true,
      opacity: 0.3 // More transparent lines
    });
    
    // Define the 10 Sephiroth positions
    const positions = [
      [0, 1, 0],     // Kether (Crown)
      [-0.5, 0.7, 0], // Chokmah (Wisdom)
      [0.5, 0.7, 0],  // Binah (Understanding)
      [-0.5, 0.2, 0], // Chesed (Mercy)
      [0.5, 0.2, 0],  // Geburah (Severity)
      [0, 0, 0],      // Tiphareth (Beauty)
      [-0.5, -0.3, 0], // Netzach (Victory)
      [0.5, -0.3, 0],   // Hod (Splendor)
      [0, -0.6, 0],    // Yesod (Foundation)
      [0, -1, 0]      // Malkuth (Kingdom)
    ];
    
    // Create spheres for each Sephirah
    const sphereGeometry = new THREE.SphereGeometry(0.08, 12, 12);
    const sphereMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      emissive: 0x9f7aea,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.6
    });
    
    const vertices: THREE.Vector3[] = [];
    
    positions.forEach(pos => {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(pos[0], pos[1], pos[2]);
      group.add(sphere);
      vertices.push(new THREE.Vector3(pos[0], pos[1], pos[2]));
    });
    
    // Define the 22 paths connecting the Sephiroth
    const paths = [
      [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4],
      [3, 5], [4, 5], [1, 5], [2, 5], [5, 6], [5, 7],
      [6, 7], [6, 8], [7, 8], [8, 9], [3, 6], [4, 7],
      [0, 5], [5, 8], [0, 8], [5, 9]
    ];
    
    // Connect the paths with lines
    paths.forEach(path => {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        vertices[path[0]],
        vertices[path[1]]
      ]);
      const line = new THREE.Line(lineGeometry, material);
      group.add(line);
    });
    
    // Scale the whole structure to match MetatronsCube
    group.position.set(0, 0, 0);
    group.scale.set(1.2, 1.2, 1.2);
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
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center"></div>;
};

export default TreeOfLife;
