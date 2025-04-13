
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface StarfieldBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  opacity?: number;
  isStatic: boolean; // Controls animation
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({ 
  density = 'medium', 
  opacity = 0.3, 
  isStatic = false // Changed default to false to enable animation
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log("Rendering starfield background, isStatic:", isStatic);
    
    // Create scene with transparent background
    const scene = new THREE.Scene();
    scene.background = null; // Make background transparent
    sceneRef.current = scene;
    
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
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    
    // Add the renderer to the DOM
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    
    // Determine star count based on density
    const getStarCount = () => {
      switch(density) {
        case 'low': return 500;
        case 'high': return 1500;
        case 'medium':
        default: return 1000;
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
      size: 0.10,
      transparent: true,
      opacity: opacity
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    starsRef.current = stars;
    
    // Animation loop
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current) return;
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (starsRef.current && !isStatic) {
        // Only rotate if not static
        starsRef.current.rotation.x += 0.0005;
        starsRef.current.rotation.y += 0.0008;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      
      renderer.render(scene, camera);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (starsGeometry) starsGeometry.dispose();
      if (starsMaterial) starsMaterial.dispose();
      
      if (rendererRef.current && containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [density, opacity, isStatic]);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
};

export default StarfieldBackground;
