import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const SriYantra: React.FC = () => {
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

    // Create Sri Yantra
    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ 
      color: 0x9f7aea,
      transparent: true,
      opacity: 0.2 // Slightly more transparent
    });
    
    // Create the nine interlocking triangles
    const outerRadius = 1;
    
    // Four upward-pointing triangles
    for (let i = 0; i < 4; i++) {
      const scale = 1 - (i * 0.15);
      const triangleShape = new THREE.Shape();
      
      triangleShape.moveTo(0, outerRadius * scale);
      triangleShape.lineTo(-outerRadius * scale * 0.866, -outerRadius * scale * 0.5);
      triangleShape.lineTo(outerRadius * scale * 0.866, -outerRadius * scale * 0.5);
      triangleShape.lineTo(0, outerRadius * scale);
      
      const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
      const edges = new THREE.EdgesGeometry(triangleGeometry);
      const triangle = new THREE.LineSegments(edges, material);
      
      triangle.position.z = i * 0.01; // Slight offset to prevent z-fighting
      group.add(triangle);
    }
    
    // Five downward-pointing triangles
    for (let i = 0; i < 5; i++) {
      const scale = 0.95 - (i * 0.15);
      const triangleShape = new THREE.Shape();
      
      triangleShape.moveTo(0, -outerRadius * scale);
      triangleShape.lineTo(-outerRadius * scale * 0.866, outerRadius * scale * 0.5);
      triangleShape.lineTo(outerRadius * scale * 0.866, outerRadius * scale * 0.5);
      triangleShape.lineTo(0, -outerRadius * scale);
      
      const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
      const edges = new THREE.EdgesGeometry(triangleGeometry);
      const triangle = new THREE.LineSegments(edges, material);
      
      triangle.position.z = i * 0.01 + 0.005; // Slight offset
      group.add(triangle);
    }
    
    // Add central dot (bindu)
    const binduGeometry = new THREE.CircleGeometry(0.05, 32);
    const binduMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.5 // Slightly more transparent
    });
    const bindu = new THREE.Mesh(binduGeometry, binduMaterial);
    bindu.position.z = 0.1;
    group.add(bindu);
    
    // Add surrounding circles
    const circleGeometry = new THREE.CircleGeometry(outerRadius, 64);
    const edges = new THREE.EdgesGeometry(circleGeometry);
    const circle = new THREE.LineSegments(edges, material);
    circle.position.z = -0.01;
    group.add(circle);

    // Center and scale the group to match MetatronsCube
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
      binduGeometry.dispose();
      binduMaterial.dispose();
      material.dispose();
      circleGeometry.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center"></div>;
};

export default SriYantra;
