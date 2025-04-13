
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface StarfieldBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  opacity?: number;
  isStatic?: boolean;
  starCount?: number;
  speed?: number;
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({ 
  density = 'medium', 
  opacity = 0.3, 
  isStatic = false,
  starCount = 1500,
  speed = 0.5
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
    
    // Calculate star count
    const calculatedStarCount = starCount;
    
    // Create stars geometry first
    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(calculatedStarCount * 3);
    const sizes = new Float32Array(calculatedStarCount);
    
    // Fill with data
    for (let i = 0; i < calculatedStarCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
      
      // Varied star sizes - smaller range for more natural look
      sizes[i] = Math.random() * 1.5;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create circular star texture programmatically instead of using an image
    const starTexture = createCircularStarTexture();
    
    // Create star material with custom shaders
    const starsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: starTexture },
        opacity: { value: opacity }
      },
      vertexShader: `
        attribute float size;
        varying float vSize;
        void main() {
          vSize = size;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // Adjust size calculation to prevent squishing
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        uniform float opacity;
        varying float vSize;
        void main() {
          // Use texture properly to create circular stars
          gl_FragColor = texture2D(pointTexture, gl_PointCoord);
          // Apply opacity with softer fade toward edges
          gl_FragColor.a *= opacity * (0.3 + vSize * 0.7);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    
    // Create stars points
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    starsRef.current = stars;
    
    // Add parallax effect
    const parallaxEffect = (e: MouseEvent) => {
      if (!starsRef.current || isStatic) return;
      
      // Subtle parallax effect
      const parallaxX = (e.clientX / window.innerWidth - 0.5) * 0.1;
      const parallaxY = (e.clientY / window.innerHeight - 0.5) * 0.1;
      
      starsRef.current.rotation.x = parallaxY;
      starsRef.current.rotation.y = parallaxX;
    };
    
    window.addEventListener('mousemove', parallaxEffect);
    
    // Create a few bright stars
    const createBrightStars = () => {
      const brightStarCount = Math.floor(calculatedStarCount * 0.05); // 5% of stars are bright
      const brightGeometry = new THREE.BufferGeometry();
      const brightPositions = new Float32Array(brightStarCount * 3);
      
      for (let i = 0; i < brightStarCount; i++) {
        const i3 = i * 3;
        brightPositions[i3] = (Math.random() - 0.5) * 80;
        brightPositions[i3 + 1] = (Math.random() - 0.5) * 80;
        brightPositions[i3 + 2] = (Math.random() - 0.5) * 80;
      }
      
      brightGeometry.setAttribute('position', new THREE.BufferAttribute(brightPositions, 3));
      
      const brightMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15,
        transparent: true,
        opacity: opacity * 1.5,
        blending: THREE.AdditiveBlending
      });
      
      const brightStars = new THREE.Points(brightGeometry, brightMaterial);
      scene.add(brightStars);
      
      return brightStars;
    };
    
    const brightStars = createBrightStars();
    
    // Generate a circular star texture programmatically
    function createCircularStarTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      
      const context = canvas.getContext('2d');
      if (!context) return new THREE.Texture();
      
      // Draw circular gradient for stars
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);
      
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }
    
    // Animation loop
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current) return;
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (starsRef.current && !isStatic) {
        // Slower, more subtle rotation
        starsRef.current.rotation.x += 0.0001 * speed;
        starsRef.current.rotation.y += 0.0001 * speed;
        
        // Bright stars rotate slightly differently
        brightStars.rotation.x += 0.0001;
        brightStars.rotation.y += 0.00015;
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
      window.removeEventListener('mousemove', parallaxEffect);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (starsGeometry) starsGeometry.dispose();
      if (starsMaterial) {
        if ('dispose' in starsMaterial) starsMaterial.dispose();
      }
      
      if (brightStars) {
        if (brightStars.geometry) brightStars.geometry.dispose();
        if (brightStars.material) {
          if (Array.isArray(brightStars.material)) {
            brightStars.material.forEach(m => m.dispose());
          } else {
            brightStars.material.dispose();
          }
        }
        scene.remove(brightStars);
      }
      
      if (rendererRef.current && containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [density, opacity, isStatic, starCount, speed]);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
};

export default StarfieldBackground;
