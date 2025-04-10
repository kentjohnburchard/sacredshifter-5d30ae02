
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const VesicaPiscis: React.FC = () => {
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

    // Create Vesica Piscis
    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ color: 0x9f7aea });
    
    const radius = 0.6;
    const distance = radius; // Distance between circle centers
    
    // Left circle
    const leftGeometry = new THREE.CircleGeometry(radius, 64);
    const leftEdges = new THREE.EdgesGeometry(leftGeometry);
    const leftCircle = new THREE.LineSegments(leftEdges, material);
    leftCircle.position.set(-distance/2, 0, 0);
    group.add(leftCircle);
    
    // Right circle
    const rightGeometry = new THREE.CircleGeometry(radius, 64);
    const rightEdges = new THREE.EdgesGeometry(rightGeometry);
    const rightCircle = new THREE.LineSegments(rightEdges, material);
    rightCircle.position.set(distance/2, 0, 0);
    group.add(rightCircle);
    
    // Add vesica shape outline
    const vesicaPoints = [];
    const segments = 64;
    
    // Draw the left arc
    for (let i = 0; i <= segments/2; i++) {
      const theta = (Math.PI / 3) + (i / segments) * (4 * Math.PI / 3);
      const x = -distance/2 + radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      vesicaPoints.push(new THREE.Vector3(x, y, 0));
    }
    
    // Draw the right arc
    for (let i = segments/2; i >= 0; i--) {
      const theta = (Math.PI / 3) + (i / segments) * (4 * Math.PI / 3);
      const x = distance/2 + radius * Math.cos(Math.PI - theta);
      const y = radius * Math.sin(Math.PI - theta);
      vesicaPoints.push(new THREE.Vector3(x, y, 0));
    }
    
    // Close the shape
    vesicaPoints.push(vesicaPoints[0]);
    
    const vesicaGeometry = new THREE.BufferGeometry().setFromPoints(vesicaPoints);
    const vesicaLine = new THREE.Line(vesicaGeometry, new THREE.LineBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.7
    }));
    
    group.add(vesicaLine);
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

export default VesicaPiscis;
