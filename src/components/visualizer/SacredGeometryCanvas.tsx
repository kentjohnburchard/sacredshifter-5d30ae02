
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface SacredGeometryCanvasProps {
  audioAnalyser?: AnalyserNode | null;
  colorScheme?: 'purple' | 'blue' | 'rainbow' | 'gold';
  chakra?: string;
  frequency?: number;
  onPrimeDetected?: (prime: number) => void;
  onFrequencyDataAvailable?: (frequencies: number[]) => void;
}

const SacredGeometryCanvas: React.FC<SacredGeometryCanvasProps> = ({
  audioAnalyser,
  colorScheme = 'purple',
  chakra,
  frequency,
  onPrimeDetected,
  onFrequencyDataAvailable
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { liftTheVeil } = useTheme();
  
  // Tracking state for frequency data and prime detection
  const [averageFrequency, setAverageFrequency] = useState<number>(0);
  const [dominantFrequency, setDominantFrequency] = useState<number | null>(null);
  const [primeNumbers, setPrimeNumbers] = useState<number[]>([]);
  
  // Settings for visualization
  const [particles, setParticles] = useState<Particle[]>([]);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.001);
  const [baseRotation, setBaseRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [lastPrimeDetectionTime, setLastPrimeDetectionTime] = useState<number>(0);
  
  // Cache for prime number calculation
  const primeCache = useRef<Record<number, boolean>>({});
  
  // Particle class for visualization
  interface Particle {
    x: number;
    y: number;
    radius: number;
    color: string;
    velocity: number;
    angle: number;
    opacity: number;
    life: number;
    maxLife: number;
  }
  
  // Get color from chakra or colorScheme
  const getBaseColor = (): string => {
    if (chakra) {
      switch (chakra.toLowerCase()) {
        case 'root': return '#ea384c'; // Red
        case 'sacral': return '#F97316'; // Orange
        case 'solar plexus': return '#eab308'; // Yellow
        case 'heart': return '#16a34a'; // Green
        case 'throat': return '#1EAEDB'; // Blue
        case 'third eye': return '#9b87f5'; // Indigo
        case 'crown': return '#7E69AB'; // Violet
        default: break;
      }
    }
    
    // Fall back to colorScheme if no chakra
    switch (colorScheme) {
      case 'purple': return '#9b87f5';
      case 'blue': return '#1EAEDB';
      case 'rainbow': return '#FF0000'; // Rainbow will use gradient in rendering
      case 'gold': return '#eab308';
      default: return '#9b87f5';
    }
  };
  
  // Get highlight color for particles and effects
  const getHighlightColor = (): string => {
    // Brighter version of base color for highlights
    if (chakra) {
      switch (chakra.toLowerCase()) {
        case 'root': return '#ff5a6e'; // Bright Red
        case 'sacral': return '#ff9438'; // Bright Orange
        case 'solar plexus': return '#ffd028'; // Bright Yellow
        case 'heart': return '#36c368'; // Bright Green
        case 'throat': return '#3eceff'; // Bright Blue
        case 'third eye': return '#bba7ff'; // Bright Indigo
        case 'crown': return '#9e89cb'; // Bright Violet
        default: break;
      }
    }
    
    switch (colorScheme) {
      case 'purple': return '#bba7ff';
      case 'blue': return '#3eceff';
      case 'rainbow': return '#FFFFFF';
      case 'gold': return '#ffd028';
      default: return '#bba7ff';
    }
  };

  // Prime number detection
  const isPrime = (num: number): boolean => {
    // Check cache first
    if (primeCache.current[num] !== undefined) {
      return primeCache.current[num];
    }
    
    // Handle edge cases
    if (num <= 1) {
      primeCache.current[num] = false;
      return false;
    }
    if (num <= 3) {
      primeCache.current[num] = true;
      return true;
    }
    if (num % 2 === 0 || num % 3 === 0) {
      primeCache.current[num] = false;
      return false;
    }
    
    // Check for primality using 6k+-1 optimization
    let i = 5;
    while (i * i <= num) {
      if (num % i === 0 || num % (i + 2) === 0) {
        primeCache.current[num] = false;
        return false;
      }
      i += 6;
    }
    
    primeCache.current[num] = true;
    return true;
  };

  // Create particles for effects
  const createParticles = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    count: number,
    color: string
  ) => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 0.5 + Math.random() * 1.5;
      const maxLife = 50 + Math.random() * 100;
      
      newParticles.push({
        x,
        y,
        radius: 1 + Math.random() * 3,
        color,
        velocity,
        angle,
        opacity: 0.8,
        life: 0,
        maxLife
      });
    }
    
    setParticles(prevParticles => [...prevParticles, ...newParticles]);
  };

  // Draw sacred geometry based on frequency data
  const drawSacredGeometry = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frequencyData: Uint8Array | null,
    time: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear the canvas with a semi-transparent background for better visibility
    ctx.fillStyle = liftTheVeil 
      ? 'rgba(10, 10, 10, 0.9)' 
      : 'rgba(20, 20, 30, 0.9)';
    ctx.fillRect(0, 0, width, height);
    
    // Base radius for geometric shapes
    const baseRadius = Math.min(width, height) * 0.25;
    
    // Calculate visualization parameters from audio data
    let bassEnergy = 0;
    let midEnergy = 0;
    let highEnergy = 0;
    let dominantFreqBin = 0;
    let maxEnergy = 0;
    
    if (frequencyData && frequencyData.length > 0) {
      // Calculate energy in different frequency ranges
      for (let i = 0; i < frequencyData.length; i++) {
        const normalized = frequencyData[i] / 255; // Normalize to 0-1
        
        if (i < frequencyData.length / 3) {
          // Bass frequencies (first third)
          bassEnergy += normalized;
        } else if (i < frequencyData.length * 2/3) {
          // Mid frequencies (second third)
          midEnergy += normalized;
        } else {
          // High frequencies (last third)
          highEnergy += normalized;
        }
        
        // Find dominant frequency bin
        if (normalized > maxEnergy) {
          maxEnergy = normalized;
          dominantFreqBin = i;
        }
      }
      
      // Average energies
      bassEnergy = bassEnergy / (frequencyData.length / 3);
      midEnergy = midEnergy / (frequencyData.length / 3);
      highEnergy = highEnergy / (frequencyData.length / 3);
      
      // Get frequency from bin index (44.1kHz sample rate / 2 / fftSize)
      // Assuming typical sample rate and fft size of 2048
      const audioContext = audioAnalyser?.context;
      if (audioContext) {
        const sampleRate = audioContext.sampleRate;
        const binCount = audioAnalyser?.frequencyBinCount || 1024;
        const dominantFreq = Math.round(dominantFreqBin * sampleRate / (2 * binCount * 2));
        
        setDominantFrequency(dominantFreq);
        
        // Check for prime frequencies and notify
        const currentTime = Date.now();
        if (isPrime(dominantFreq) && currentTime - lastPrimeDetectionTime > 1000) {
          if (onPrimeDetected) {
            onPrimeDetected(dominantFreq);
            setPrimeNumbers(prev => [...prev, dominantFreq]);
            // Create particle burst for prime detection
            createParticles(ctx, centerX, centerY, 30, getHighlightColor());
            setLastPrimeDetectionTime(currentTime);
          }
        }
      }
      
      // Update rotation speed based on mid-frequencies
      setRotationSpeed(0.001 + midEnergy * 0.01);
      
      // Update scale based on bass (low frequencies)
      const targetScale = 0.8 + bassEnergy * 0.6;
      setScale(prev => prev * 0.9 + targetScale * 0.1); // Smooth transition
      
      // Calculate average for display
      const averageLevel = (bassEnergy + midEnergy + highEnergy) / 3;
      setAverageFrequency(averageLevel * 100);
      
      // Notify parent component about frequency data
      if (onFrequencyDataAvailable) {
        const normalizedData = Array.from(frequencyData).map(val => val / 255);
        onFrequencyDataAvailable(normalizedData);
      }
    }
    
    // Update rotation
    setBaseRotation(prev => prev + rotationSpeed);
    const currentRotation = baseRotation;
    const pulseFactor = 1 + Math.sin(time * 0.003) * 0.05; // Subtle pulse
    
    // Draw background glow
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, baseRadius * 1.5
    );
    
    const baseColor = getBaseColor();
    gradient.addColorStop(0, `${baseColor}33`);
    gradient.addColorStop(0.5, `${baseColor}11`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw sacred geometry
    const radius = baseRadius * scale * pulseFactor;
    
    // Select geometry type based on chakra or default
    const geometryType = chakra ? chakraToGeometryType(chakra) : 'flower-of-life';
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);
    
    switch (geometryType) {
      case 'flower-of-life':
        drawFlowerOfLife(ctx, radius, bassEnergy, midEnergy, highEnergy);
        break;
      case 'merkaba':
        drawMerkaba(ctx, radius, bassEnergy, midEnergy, highEnergy);
        break;
      case 'metatrons-cube':
        drawMetatronsCube(ctx, radius, bassEnergy, midEnergy, highEnergy);
        break;
      case 'sri-yantra':
        drawSriYantra(ctx, radius, bassEnergy, midEnergy, highEnergy);
        break;
      default:
        drawFlowerOfLife(ctx, radius, bassEnergy, midEnergy, highEnergy);
    }
    
    ctx.restore();
    
    // Draw particles
    updateAndDrawParticles(ctx);
    
    // Draw frequency info
    if (dominantFrequency) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${dominantFrequency}Hz`, 20, 30);
    }
  };
  
  // Update and draw particles
  const updateAndDrawParticles = (ctx: CanvasRenderingContext2D) => {
    const updatedParticles = particles.filter(p => p.life < p.maxLife).map(particle => {
      // Update particle
      const updatedParticle = { ...particle };
      updatedParticle.x += Math.cos(particle.angle) * particle.velocity;
      updatedParticle.y += Math.sin(particle.angle) * particle.velocity;
      updatedParticle.life += 1;
      updatedParticle.opacity = 1 - (particle.life / particle.maxLife);
      
      // Draw particle
      ctx.globalAlpha = updatedParticle.opacity;
      ctx.fillStyle = updatedParticle.color;
      ctx.beginPath();
      ctx.arc(updatedParticle.x, updatedParticle.y, updatedParticle.radius, 0, Math.PI * 2);
      ctx.fill();
      
      return updatedParticle;
    });
    
    ctx.globalAlpha = 1;
    setParticles(updatedParticles);
  };

  // Draw Flower of Life pattern
  const drawFlowerOfLife = (
    ctx: CanvasRenderingContext2D, 
    radius: number,
    bassEnergy: number,
    midEnergy: number,
    highEnergy: number
  ) => {
    const circleCount = 7;
    const baseColor = getBaseColor();
    const highlightColor = getHighlightColor();
    
    // Draw central circle
    ctx.strokeStyle = colorScheme === 'rainbow' ? getRainbowColor(0, circleCount) : baseColor;
    ctx.lineWidth = 1.5 + highEnergy * 3;
    
    ctx.beginPath();
    ctx.arc(0, 0, radius * (0.5 + bassEnergy * 0.3), 0, Math.PI * 2);
    ctx.stroke();
    
    // Apply glowing effect for central circle
    ctx.shadowColor = highlightColor;
    ctx.shadowBlur = 10 + midEnergy * 15;
    
    // Create surrounding circles for Flower of Life pattern
    for (let ring = 1; ring <= 2; ring++) {
      const ringRadius = radius * ring * 0.35;
      const circlesInRing = ring === 1 ? 6 : 12;
      
      for (let i = 0; i < circlesInRing; i++) {
        const rotationAngle = (i / circlesInRing) * Math.PI * 2;
        const x = Math.cos(rotationAngle) * ringRadius;
        const y = Math.sin(rotationAngle) * ringRadius;
        
        // Color varies with position in rainbow mode
        ctx.strokeStyle = colorScheme === 'rainbow' 
          ? getRainbowColor(i, circlesInRing) 
          : baseColor;
        
        ctx.beginPath();
        ctx.arc(
          x, 
          y, 
          radius * (0.3 + bassEnergy * 0.2) * (1 + Math.sin(rotationAngle + midEnergy * 10) * 0.1),
          0, 
          Math.PI * 2
        );
        ctx.stroke();
      }
    }
    
    // Reset shadow for other elements
    ctx.shadowBlur = 0;
  };

  // Draw Merkaba (Star Tetrahedron)
  const drawMerkaba = (
    ctx: CanvasRenderingContext2D, 
    radius: number,
    bassEnergy: number,
    midEnergy: number,
    highEnergy: number
  ) => {
    const baseColor = getBaseColor();
    const highlightColor = getHighlightColor();
    
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 1.5 + highEnergy * 3;
    
    // Apply glow effect
    ctx.shadowColor = highlightColor;
    ctx.shadowBlur = 5 + midEnergy * 10;
    
    // Draw upward tetrahedron
    ctx.beginPath();
    const upScale = 1 + bassEnergy * 0.3;
    const triangleRadius = radius * 0.8 * upScale;
    
    // First triangle
    ctx.moveTo(0, -triangleRadius);
    ctx.lineTo(triangleRadius * Math.cos(Math.PI * 2 / 3), triangleRadius * Math.sin(Math.PI * 2 / 3));
    ctx.lineTo(triangleRadius * Math.cos(Math.PI * 4 / 3), triangleRadius * Math.sin(Math.PI * 4 / 3));
    ctx.closePath();
    ctx.stroke();
    
    // Second triangle (rotated)
    ctx.beginPath();
    ctx.strokeStyle = colorScheme === 'rainbow' ? getRainbowColor(1, 2) : highlightColor;
    const downScale = 1 + midEnergy * 0.3;
    
    ctx.moveTo(0, triangleRadius * downScale);
    ctx.lineTo(triangleRadius * Math.cos(Math.PI * 1 / 3) * downScale, triangleRadius * Math.sin(Math.PI * 1 / 3) * downScale);
    ctx.lineTo(triangleRadius * Math.cos(Math.PI * 5 / 3) * downScale, triangleRadius * Math.sin(Math.PI * 5 / 3) * downScale);
    ctx.closePath();
    ctx.stroke();
    
    // Inner lines connecting vertices
    ctx.beginPath();
    ctx.strokeStyle = colorScheme === 'rainbow' ? getRainbowColor(2, 3) : baseColor;
    ctx.globalAlpha = 0.6 + highEnergy * 0.4;
    
    // Connect points
    for (let i = 0; i < 3; i++) {
      const angle1 = Math.PI * 2 * i / 3;
      const angle2 = Math.PI * (2 * i + 1) / 3;
      
      ctx.moveTo(
        triangleRadius * Math.cos(angle1),
        triangleRadius * Math.sin(angle1)
      );
      ctx.lineTo(
        triangleRadius * Math.cos(angle2) * downScale,
        triangleRadius * Math.sin(angle2) * downScale
      );
    }
    
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    // Reset shadow
    ctx.shadowBlur = 0;
  };

  // Draw Metatron's Cube
  const drawMetatronsCube = (
    ctx: CanvasRenderingContext2D, 
    radius: number,
    bassEnergy: number,
    midEnergy: number,
    highEnergy: number
  ) => {
    const baseColor = getBaseColor();
    const highlightColor = getHighlightColor();
    
    ctx.lineWidth = 1 + highEnergy * 2;
    ctx.shadowColor = highlightColor;
    ctx.shadowBlur = 5 + midEnergy * 8;
    
    // Draw central circle
    ctx.beginPath();
    ctx.strokeStyle = baseColor;
    ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw first ring of 6 circles
    const innerRadius = radius * 0.4;
    const points = [];
    
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i;
      const x = Math.cos(angle) * innerRadius;
      const y = Math.sin(angle) * innerRadius;
      points.push({x, y});
      
      ctx.beginPath();
      ctx.strokeStyle = colorScheme === 'rainbow' ? getRainbowColor(i, 6) : baseColor;
      const pulseRadius = radius * (0.15 + bassEnergy * 0.1 * Math.sin(angle + Date.now() * 0.001));
      ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw outer ring of points
    const outerRadius = radius * (0.8 + bassEnergy * 0.2);
    const outerPoints = [];
    
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * (i + 0.5);
      const x = Math.cos(angle) * outerRadius;
      const y = Math.sin(angle) * outerRadius;
      outerPoints.push({x, y});
      
      ctx.beginPath();
      ctx.strokeStyle = colorScheme === 'rainbow' ? getRainbowColor(i + 6, 12) : highlightColor;
      ctx.arc(x, y, radius * 0.1, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw connection lines
    ctx.lineWidth = 0.5 + highEnergy * 1.5;
    ctx.globalAlpha = 0.7 + midEnergy * 0.3;
    
    // Inner connections
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        ctx.beginPath();
        ctx.strokeStyle = colorScheme === 'rainbow' 
          ? getRainbowColor(i + j, points.length * 2) 
          : baseColor;
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
    
    // Connect inner to outer
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < outerPoints.length; j++) {
        // Only draw some lines for cleaner look
        if ((i + j) % 3 === 0) {
          ctx.beginPath();
          ctx.strokeStyle = colorScheme === 'rainbow' 
            ? getRainbowColor(i + j, points.length + outerPoints.length) 
            : highlightColor;
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(outerPoints[j].x, outerPoints[j].y);
          ctx.stroke();
        }
      }
    }
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  // Draw Sri Yantra
  const drawSriYantra = (
    ctx: CanvasRenderingContext2D, 
    radius: number,
    bassEnergy: number,
    midEnergy: number,
    highEnergy: number
  ) => {
    const baseColor = getBaseColor();
    const highlightColor = getHighlightColor();
    
    ctx.lineWidth = 1 + highEnergy * 2;
    ctx.shadowColor = highlightColor;
    ctx.shadowBlur = 5 + midEnergy * 8;
    
    // Draw outer circle
    ctx.beginPath();
    ctx.strokeStyle = baseColor;
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw triangles
    const triangleLevels = 5;
    const triangleScale = 0.85 + bassEnergy * 0.15;
    
    for (let level = 0; level < triangleLevels; level++) {
      const levelRadius = radius * (0.3 + (level / triangleLevels) * 0.7) * triangleScale;
      const inverted = level % 2 === 1;
      
      ctx.beginPath();
      ctx.strokeStyle = colorScheme === 'rainbow' 
        ? getRainbowColor(level, triangleLevels) 
        : (inverted ? highlightColor : baseColor);
      
      // Draw triangle
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 * i / 3) + (inverted ? Math.PI / 3 : 0);
        const x = Math.cos(angle) * levelRadius;
        const y = Math.sin(angle) * levelRadius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw center dot (bindu)
    ctx.beginPath();
    ctx.fillStyle = highlightColor;
    const binduSize = radius * (0.05 + midEnergy * 0.05);
    ctx.arc(0, 0, binduSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw lotus petals
    const petalCount = 8 + Math.floor(highEnergy * 8);
    const petalRadius = radius * 0.6;
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (Math.PI * 2 * i) / petalCount;
      const petalSize = radius * (0.15 + bassEnergy * 0.1);
      
      ctx.strokeStyle = colorScheme === 'rainbow' 
        ? getRainbowColor(i, petalCount) 
        : baseColor;
      
      // Draw stylized lotus petal
      ctx.beginPath();
      ctx.ellipse(
        Math.cos(angle) * petalRadius,
        Math.sin(angle) * petalRadius,
        petalSize,
        petalSize / 2,
        angle,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
  };

  // Map chakra to geometry type
  const chakraToGeometryType = (chakraName: string): string => {
    switch (chakraName.toLowerCase()) {
      case 'root':
        return 'flower-of-life';
      case 'sacral':
        return 'sri-yantra';
      case 'solar plexus':
        return 'metatrons-cube';
      case 'heart':
        return 'flower-of-life';
      case 'throat':
        return 'sri-yantra';
      case 'third eye':
        return 'metatrons-cube';
      case 'crown':
        return 'merkaba';
      default:
        return 'flower-of-life';
    }
  };

  // Generate colors for rainbow mode
  const getRainbowColor = (index: number, total: number): string => {
    const hue = (index / total) * 360;
    return `hsl(${hue}, 100%, 70%)`;
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let frequencyData: Uint8Array | null = null;
    
    if (audioAnalyser) {
      frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
    }
    
    const animate = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !ctx) return;
      
      // Adjust canvas size if needed
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
      
      // Get frequency data if available
      if (audioAnalyser && frequencyData) {
        audioAnalyser.getByteFrequencyData(frequencyData);
      }
      
      // Draw frame
      drawSacredGeometry(ctx, rect.width, rect.height, frequencyData, time);
      
      // Schedule next frame
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [audioAnalyser, colorScheme, chakra, liftTheVeil]);

  // Expose the canvas with proper sizing
  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full absolute inset-0"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
};

export default SacredGeometryCanvas;
