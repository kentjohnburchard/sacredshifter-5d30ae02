
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const MetatronsCube: React.FC = () => {
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

    // Create Metatron's Cube
    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ color: 0x9f7aea });
    
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
    const pointsGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const pointsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const vertices: THREE.Vector3[] = [];
    
    spherePositions.forEach(pos => {
      const point = new THREE.Mesh(pointsGeometry, pointsMaterial);
      point.position.set(pos[0], pos[1], pos[2]);
      group.add(point);
      vertices.push(new THREE.Vector3(pos[0], pos[1], pos[2]));
    });
    
    // Connect all vertices with lines
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          vertices[i],
          vertices[j]
        ]);
        const line = new THREE.Line(lineGeometry, material);
        group.add(line);
      }
    }
    
    group.scale.set(0.5, 0.5, 0.5);
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

export default MetatronsCube;
