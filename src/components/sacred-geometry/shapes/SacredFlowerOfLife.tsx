
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const SacredFlowerOfLife: React.FC = () => {
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
    camera.position.z = 5;
    
    // Create renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Enable transparency
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    containerRef.current.appendChild(renderer.domElement);
    
    // Create flower of life
    const group = new THREE.Group();
    const radius = 0.4;
    const layers = 3;
    const material = new THREE.LineBasicMaterial({ 
      color: 0x9f7aea,
      transparent: true,
      opacity: 0.3 // More transparent lines
    });

    // Create overlapping circles in a hex grid pattern
    for (let i = -layers; i <= layers; i++) {
      for (let j = -layers; j <= layers; j++) {
        const dx = i * radius * 1.5;
        const dy = j * radius * Math.sqrt(3) + (i % 2) * (radius * Math.sqrt(3) / 2);
        
        // Skip circles that are too far from the center
        if (Math.sqrt(dx * dx + dy * dy) > radius * layers * 1.5) continue;

        const circleGeometry = new THREE.CircleGeometry(radius, 32);
        const edges = new THREE.EdgesGeometry(circleGeometry);
        const circle = new THREE.LineSegments(edges, material);
        
        circle.position.set(dx, dy, 0);
        group.add(circle);
      }
    }
    
    // Center and scale the group
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
      material.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center"></div>;
};

export default SacredFlowerOfLife;
