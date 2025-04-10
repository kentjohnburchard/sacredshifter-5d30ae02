
import * as THREE from 'three';

// Create Flower of Life
export const createFlowerOfLife = () => {
  const group = new THREE.Group();
  const radius = 0.4;
  const layers = 3;
  const material = new THREE.LineBasicMaterial({ color: 0x9f7aea });

  // Create overlapping circles in a hex grid pattern
  for (let i = -layers; i <= layers; i++) {
    for (let j = -layers; j <= layers; j++) {
      const dx = i * radius * 1.5;
      const dy = j * radius * Math.sqrt(3) + (i % 2) * (radius * Math.sqrt(3) / 2);
      
      // Skip circles that are too far from the center
      if (Math.sqrt(dx * dx + dy * dy) > radius * layers * 1.5) continue;

      const circleGeometry = new THREE.CircleGeometry(radius, 32);
      
      // Convert to line loop
      const edges = new THREE.EdgesGeometry(circleGeometry);
      const circle = new THREE.LineSegments(edges, material);
      
      circle.position.set(dx, dy, 0);
      group.add(circle);
    }
  }

  return group;
};

// Create Seed of Life
export const createSeedOfLife = () => {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0x9f7aea });
  const radius = 0.5;

  // Center circle
  const centerGeometry = new THREE.CircleGeometry(radius, 32);
  const centerEdges = new THREE.EdgesGeometry(centerGeometry);
  const centerCircle = new THREE.LineSegments(centerEdges, material);
  group.add(centerCircle);

  // Six surrounding circles
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    const circleGeometry = new THREE.CircleGeometry(radius, 32);
    const edges = new THREE.EdgesGeometry(circleGeometry);
    const circle = new THREE.LineSegments(edges, material);
    
    circle.position.set(x, y, 0);
    group.add(circle);
  }

  return group;
};

// Create Metatron's Cube
export const createMetatronsCube = () => {
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
  return group;
};

// Create Sri Yantra
export const createSriYantra = () => {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0x9f7aea });
  
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
  const binduMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const bindu = new THREE.Mesh(binduGeometry, binduMaterial);
  bindu.position.z = 0.1;
  group.add(bindu);
  
  // Add surrounding circles
  const circleGeometry = new THREE.CircleGeometry(outerRadius, 64);
  const edges = new THREE.EdgesGeometry(circleGeometry);
  const circle = new THREE.LineSegments(edges, material);
  circle.position.z = -0.01;
  group.add(circle);
  
  return group;
};

// Create Tree of Life
export const createTreeOfLife = () => {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0x9f7aea });
  
  // Define the 10 Sephiroth positions
  const positions = [
    [0, 1, 0],     // Kether (Crown)
    [-0.5, 0.7, 0], // Chokmah (Wisdom)
    [0.5, 0.7, 0],  // Binah (Understanding)
    [-0.5, 0.2, 0], // Chesed (Mercy)
    [0.5, 0.2, 0],  // Geburah (Severity)
    [0, 0, 0],      // Tiphareth (Beauty)
    [-0.5, -0.3, 0], // Netzach (Victory)
    [0.5, -0.3, 0],   // Hod (Splendor)
    [0, -0.6, 0],    // Yesod (Foundation)
    [0, -1, 0]      // Malkuth (Kingdom)
  ];
  
  // Create spheres for each Sephirah
  const sphereGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    emissive: 0x9f7aea,
    emissiveIntensity: 0.5
  });
  
  const vertices: THREE.Vector3[] = [];
  
  positions.forEach(pos => {
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(pos[0], pos[1], pos[2]);
    group.add(sphere);
    vertices.push(new THREE.Vector3(pos[0], pos[1], pos[2]));
  });
  
  // Define the 22 paths connecting the Sephiroth
  const paths = [
    [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4],
    [3, 5], [4, 5], [1, 5], [2, 5], [5, 6], [5, 7],
    [6, 7], [6, 8], [7, 8], [8, 9], [3, 6], [4, 7],
    [0, 5], [5, 8], [0, 8], [5, 9]
  ];
  
  // Connect the paths with lines
  paths.forEach(path => {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      vertices[path[0]],
      vertices[path[1]]
    ]);
    const line = new THREE.Line(lineGeometry, material);
    group.add(line);
  });
  
  // Scale the whole structure
  group.scale.set(0.8, 0.8, 0.8);
  
  return group;
};

// Create Vesica Piscis
export const createVesicaPiscis = () => {
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
  
  return group;
};

// Create Merkaba (Star Tetrahedron)
export const createMerkaba = () => {
  const group = new THREE.Group();
  
  // Create material with metallic property
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x9f7aea, 
    metalness: 0.6, 
    roughness: 0.4,
    emissive: 0x400080,
    emissiveIntensity: 0.2
  });
  
  // Create top tetrahedron
  const topTetra = new THREE.Mesh(new THREE.TetrahedronGeometry(1), material.clone());
  // Create bottom tetrahedron
  const bottomTetra = new THREE.Mesh(new THREE.TetrahedronGeometry(1), material.clone());
  
  // Rotate the bottom tetrahedron to form the star tetrahedron (merkaba)
  bottomTetra.rotation.x = Math.PI; // Flip it upside down
  
  // Add tetrahedrons to group
  group.add(topTetra);
  group.add(bottomTetra);
  
  // Add wireframe to make the edges more visible
  const wireframeGeometry1 = new THREE.TetrahedronGeometry(1.01);
  const wireframe1 = new THREE.LineSegments(
    new THREE.WireframeGeometry(wireframeGeometry1),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
  );
  const wireframeGeometry2 = new THREE.TetrahedronGeometry(1.01);
  const wireframe2 = new THREE.LineSegments(
    new THREE.WireframeGeometry(wireframeGeometry2),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
  );
  
  wireframe2.rotation.x = Math.PI;
  group.add(wireframe1);
  group.add(wireframe2);
  
  // Scale the entire group to match other shapes
  group.scale.set(0.7, 0.7, 0.7);
  
  return group;
};
