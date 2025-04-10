
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Merkaba: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create Merkaba (Star Tetrahedron)
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x9f7aea, 
      metalness: 0.6, 
      roughness: 0.4, 
      emissive: 0x3a1b8c,
      emissiveIntensity: 0.3,
    });

    // Create group to hold both tetrahedrons
    const group = new THREE.Group();

    // Create top tetrahedron
    const topTetra = new THREE.Mesh(new THREE.TetrahedronGeometry(1), material);
    group.add(topTetra);

    // Create bottom tetrahedron
    const bottomTetra = new THREE.Mesh(new THREE.TetrahedronGeometry(1), material);
    bottomTetra.rotation.x = Math.PI; // Flip it upside down
    group.add(bottomTetra);

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
    };
  }, []);

  return <div ref={containerRef} className="w-full h-96"></div>;
};

export default Merkaba;
