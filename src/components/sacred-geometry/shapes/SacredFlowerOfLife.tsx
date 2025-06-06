
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
    
    // More vibrant and visible material with improved visibility
    const material = new THREE.LineBasicMaterial({ 
      color: 0x9b87f5, // Vivid purple from the color palette
      transparent: true,
      opacity: 0.7, // Further increased opacity for better visibility
      linewidth: 3 // Even thicker lines for better visibility
    });

    // Create overlapping circles in a hex grid pattern with more pronounced visibility
    for (let i = -layers; i <= layers; i++) {
      for (let j = -layers; j <= layers; j++) {
        const dx = i * radius * 1.5;
        const dy = j * radius * Math.sqrt(3) + (i % 2) * (radius * Math.sqrt(3) / 2);
        
        // Skip circles that are too far from the center
        if (Math.sqrt(dx * dx + dy * dy) > radius * layers * 1.5) continue;

        const circleGeometry = new THREE.CircleGeometry(radius, 64); // Increased segments for smoother circles
        const edges = new THREE.EdgesGeometry(circleGeometry);
        const circle = new THREE.LineSegments(edges, material);
        
        circle.position.set(dx, dy, 0);
        group.add(circle);
      }
    }
    
    // Center and scale the group
    group.position.set(0, 0, 0);
    group.scale.set(1.3, 1.3, 1.3); // Slightly larger for better visibility
    scene.add(group);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Increased intensity
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x9b87f5, 2.5); // Brighter purple point light
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // More dynamic animation
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
