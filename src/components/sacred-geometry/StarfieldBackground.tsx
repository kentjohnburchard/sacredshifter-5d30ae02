
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface StarfieldBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  opacity?: number;
  isStatic: boolean; // Added isStatic prop to control animation
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({ 
  density = 'medium', 
  opacity = 0.3, // Reduced default opacity to avoid overwhelming the sacred geometry
  isStatic = true // Default to static for performance
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log("Rendering starfield background, isStatic:", isStatic);
    
    // Create scene with transparent background
    const scene = new THREE.Scene();
    
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
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Determine star count based on density
    const getStarCount = () => {
      switch(density) {
        case 'low': return 500; // Reduced count
        case 'high': return 1500; // Reduced count
        case 'medium':
        default: return 1000; // Reduced count
      }
    };
    
    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = getStarCount();
    
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.10, // Smaller stars
      transparent: true,
      opacity: opacity
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Always render once
    renderer.render(scene, camera);
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      
      // Re-render after resize
      renderer.render(scene, camera);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (starsGeometry) starsGeometry.dispose();
      if (starsMaterial) starsMaterial.dispose();
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [density, opacity, isStatic]);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
};

export default StarfieldBackground;
