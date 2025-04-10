
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const MetatronsCube: React.FC = () => {
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
    camera.position.z = 4.5; // Positioned to see the whole cube
    
    // Create renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Enable transparency
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    containerRef.current.appendChild(renderer.domElement);

    // Create Metatron's Cube
    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ 
      color: 0x9f7aea,
      transparent: true,
      opacity: 0.3 // More transparent lines
    });
    
    // Create 13 spheres at Fibonacci points
    const spherePositions = [
      [0, 0, 0], // Center
      [1, 0, 0], [-1, 0, 0], 
      [0.5, 0.866, 0], [-0.5, 0.866, 0], 
      [0.5, -0.866, 0], [-0.5, -0.866, 0],
      [0, 0, 1], [0, 0, -1],
      [0.5, 0.289, 0.816], [-0.5, 0.289, 0.816],
      [0.5, -0.289, 0.816], [-0.5, -0.289, 0.816]
    ];
    
    // Add vertices (small spheres)
    const pointsGeometry = new THREE.SphereGeometry(0.08, 12, 12);
    const pointsMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.6 // More transparent vertices
    });
    
    const vertices: THREE.Vector3[] = [];
    
    spherePositions.forEach(pos => {
      const point = new THREE.Mesh(pointsGeometry, pointsMaterial);
      point.position.set(pos[0], pos[1], pos[2]);
      group.add(point);
      vertices.push(new THREE.Vector3(pos[0], pos[1], pos[2]));
    });
    
    // Connect all vertices with lines
    const thickerLineMaterial = new THREE.LineBasicMaterial({ 
      color: 0xb794f6, // Slightly lighter purple
      transparent: true,
      opacity: 0.3, // More transparent lines
      linewidth: 1.5 
    });
    
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          vertices[i],
          vertices[j]
        ]);
        const line = new THREE.Line(lineGeometry, thickerLineMaterial);
        group.add(line);
      }
    }
    
    // Center the cube in the container
    group.position.set(0, 0, 0);
    group.scale.set(1.2, 1.2, 1.2); // Slightly larger
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
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      material.dispose();
      thickerLineMaterial.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center"></div>;
};

export default MetatronsCube;
