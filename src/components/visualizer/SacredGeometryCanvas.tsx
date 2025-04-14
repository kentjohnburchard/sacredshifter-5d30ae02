
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface SacredGeometryCanvasProps {
  audioAnalyser?: AnalyserNode | null;
  colorScheme?: 'purple' | 'blue' | 'rainbow' | 'gold';
  chakra?: string;
  frequency?: number;
  onPrimeDetected?: (prime: number) => void;
  onFrequencyDataAvailable?: (frequencies: number[]) => void;
  expanded?: boolean;
}

const SacredGeometryCanvas: React.FC<SacredGeometryCanvasProps> = ({
  audioAnalyser,
  colorScheme = 'purple',
  chakra,
  frequency,
  onPrimeDetected,
  onFrequencyDataAvailable,
  expanded = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { liftTheVeil } = useTheme();
  
  const [averageFrequency, setAverageFrequency] = useState<number>(0);
  const [dominantFrequency, setDominantFrequency] = useState<number | null>(null);
  const [primeNumbers, setPrimeNumbers] = useState<number[]>([]);
  
  const [particles, setParticles] = useState<Particle[]>([]);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.001);
  const [baseRotation, setBaseRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [lastPrimeDetectionTime, setLastPrimeDetectionTime] = useState<number>(0);
  
  const primeCache = useRef<Record<number, boolean>>({});
  
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
  
  const getBaseColor = (): string => {
    if (chakra) {
      switch (chakra.toLowerCase()) {
        case 'root': 
          return 'rgba(239, 68, 68, 0.9)';
        case 'sacral': 
          return 'rgba(249, 115, 22, 0.9)';
        case 'solar plexus': 
          return 'rgba(234, 179, 8, 0.9)';
        case 'heart': 
          return 'rgba(16, 185, 129, 0.9)';
        case 'throat': 
          return 'rgba(14, 165, 233, 0.9)';
        case 'third eye': 
          return 'rgba(124, 58, 237, 0.9)';
        case 'crown': 
          return 'rgba(139, 92, 246, 0.9)';
        default: 
          return 'rgba(139, 92, 246, 0.9)';
      }
    }
    
    switch (colorScheme) {
      case 'purple': return 'rgba(139, 92, 246, 0.9)';
      case 'blue': return 'rgba(14, 165, 233, 0.9)';
      case 'rainbow': return 'rgba(255, 0, 0, 0.9)';
      case 'gold': return 'rgba(234, 179, 8, 0.9)';
      default: return 'rgba(139, 92, 246, 0.9)';
    }
  };
  
  const getHighlightColor = (): string => {
    if (chakra) {
      switch (chakra.toLowerCase()) {
        case 'root': 
          return 'rgba(253, 86, 95, 1)';
        case 'sacral': 
          return 'rgba(255, 135, 51, 1)';
        case 'solar plexus': 
          return 'rgba(255, 214, 0, 1)';
        case 'heart': 
          return 'rgba(45, 212, 191, 1)';
        case 'throat': 
          return 'rgba(59, 206, 255, 1)';
        case 'third eye': 
          return 'rgba(167, 139, 250, 1)';
        case 'crown': 
          return 'rgba(192, 132, 252, 1)';
        default: 
          return 'rgba(192, 132, 252, 1)';
      }
    }
    
    switch (colorScheme) {
      case 'purple': return 'rgba(192, 132, 252, 1)';
      case 'blue': return 'rgba(59, 206, 255, 1)';
      case 'rainbow': return 'rgba(255, 255, 255, 1)';
      case 'gold': return 'rgba(255, 223, 0, 1)';
      default: return 'rgba(192, 132, 252, 1)';
    }
  };

  const isPrime = (num: number): boolean => {
    if (primeCache.current[num] !== undefined) {
      return primeCache.current[num];
    }
    
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

  const drawSacredGeometry = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frequencyData: Uint8Array | null,
    time: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.fillStyle = liftTheVeil 
      ? 'rgba(10, 10, 10, 0.9)' 
      : 'rgba(20, 20, 30, 0.9)';
    ctx.fillRect(0, 0, width, height);
    
    const baseRadius = Math.min(width, height) * 0.25;
    
    let bassEnergy = 0;
    let midEnergy = 0;
    let highEnergy = 0;
    let dominantFreqBin = 0;
    let maxEnergy = 0;
    
    if (frequencyData && frequencyData.length > 0) {
      for (let i = 0; i < frequencyData.length; i++) {
        const normalized = frequencyData[i] / 255;
        
        if (i < frequencyData.length / 3) {
          bassEnergy += normalized;
        } else if (i < frequencyData.length * 2/3) {
          midEnergy += normalized;
        } else {
          highEnergy += normalized;
        }
        
        if (normalized > maxEnergy) {
          maxEnergy = normalized;
          dominantFreqBin = i;
        }
      }
      
      bassEnergy = bassEnergy / (frequencyData.length / 3);
      midEnergy = midEnergy / (frequencyData.length / 3);
      highEnergy = highEnergy / (frequencyData.length / 3);
      
      const audioContext = audioAnalyser?.context;
      if (audioContext) {
        const sampleRate = audioContext.sampleRate;
        const binCount = audioAnalyser?.frequencyBinCount || 1024;
        const dominantFreq = Math.round(dominantFreqBin * sampleRate / (2 * binCount * 2));
        
        setDominantFrequency(dominantFreq);
        
        if (isPrime(dominantFreq) && Date.now() - lastPrimeDetectionTime > 1000) {
          if (onPrimeDetected) {
            onPrimeDetected(dominantFreq);
            setPrimeNumbers(prev => [...prev, dominantFreq]);
            createParticles(ctx, centerX, centerY, 30, getHighlightColor());
            setLastPrimeDetectionTime(Date.now());
          }
        }
      }
      
      setRotationSpeed(0.001 + midEnergy * 0.01);
      
      const targetScale = 0.8 + bassEnergy * 0.6;
      setScale(prev => prev * 0.9 + targetScale * 0.1);
      
      const averageLevel = (bassEnergy + midEnergy + highEnergy) / 3;
      setAverageFrequency(averageLevel * 100);
      
      if (onFrequencyDataAvailable) {
        const normalizedData = Array.from(frequencyData).map(val => val / 255);
        onFrequencyDataAvailable(normalizedData);
      }
    }
    
    setBaseRotation(prev => prev + rotationSpeed);
    const currentRotation = baseRotation;
    const pulseFactor = 1 + Math.sin(time * 0.003) * 0.05;
    
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
    
    const radius = baseRadius * scale * pulseFactor;
    
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
    
    updateAndDrawParticles(ctx);
    
    if (dominantFrequency) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${dominantFrequency}Hz`, 20, 30);
    }
  };

  const updateAndDrawParticles = (ctx: CanvasRenderingContext2D) => {
    const updatedParticles = particles.filter(p => p.life < p.maxLife).map(particle => {
      const updatedParticle = { ...particle };
      updatedParticle.x += Math.cos(particle.angle) * particle.velocity;
      updatedParticle.y += Math.sin(particle.angle) * particle.velocity;
      updatedParticle.life += 1;
      updatedParticle.opacity = 1 - (particle.life / particle.maxLife);
      
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
    
    ctx.strokeStyle = colorScheme === 'rainbow' ? getRainbowColor(0, circleCount) : baseColor;
    ctx.lineWidth = 1.5 + highEnergy * 3;
    
    ctx.beginPath();
    ctx.arc(0, 0, radius * (0.5 + bassEnergy * 0.3), 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.shadowColor = highlightColor;
    ctx.shadowBlur = 10 + midEnergy * 15;
    
    for (let ring = 1; ring <= 2; ring++) {
      const ringRadius = radius * ring * 0.35;
      const circlesInRing = ring === 1 ? 6 : 12;
      
      for (let i = 0; i < circlesInRing; i++) {
        const rotationAngle = (i / circlesInRing) * Math.PI * 2;
        const x = Math.cos(rotationAngle) * ringRadius;
        const y = Math.sin(rotationAngle) * ringRadius;
        
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
    
    ctx.shadowBlur = 0;
  };

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
    
    ctx.shadowColor = highlightColor;
    ctx.shadowBlur = 5 + midEnergy * 10;
    
    ctx.beginPath();
    const upScale = 1 + bassEnergy * 0.3;
    const triangleRadius = radius * 0.8 * upScale;
    
    ctx.moveTo(0, -triangleRadius);
    ctx.lineTo(triangleRadius * Math.cos(Math.PI * 2 / 3), triangleRadius * Math.sin(Math.PI * 2 / 3));
    ctx.lineTo(triangleRadius * Math.cos(Math.PI * 4 / 3), triangleRadius * Math.sin(Math.PI * 4 / 3));
    ctx.closePath();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.strokeStyle = colorScheme === 'rainbow' ? getRainbowColor(1, 2) : highlightColor;
    const downScale = 1 + midEnergy * 0.3;
    
    ctx.moveTo(0, triangleRadius * downScale);
    ctx.lineTo(triangleRadius * Math.cos(Math.PI * 1 / 3) * downScale, triangleRadius * Math.sin(Math.PI * 1 / 3) * downScale);
    ctx.lineTo(triangleRadius * Math.cos(Math.PI * 5 / 3) * downScale, triangleRadius * Math.sin(Math.PI * 5 / 3) * downScale);
    ctx.closePath();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.strokeStyle = colorScheme === 'rainbow' ? getRainbowColor(2, 3) : baseColor;
    ctx.globalAlpha = 0.6 + highEnergy * 0.4;
    
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
    
    ctx.shadowBlur = 0;
  };

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
    
    ctx.beginPath();
    ctx.strokeStyle = baseColor;
    ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    
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
    
    ctx.lineWidth = 0.5 + highEnergy * 1.5;
    ctx.globalAlpha = 0.7 + midEnergy * 0.3;
    
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
    
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < outerPoints.length; j++) {
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
    
    ctx.beginPath();
    ctx.strokeStyle = baseColor;
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    const triangleLevels = 5;
    const triangleScale = 0.85 + bassEnergy * 0.15;
    
    for (let level = 0; level < triangleLevels; level++) {
      const levelRadius = radius * (0.3 + (level / triangleLevels) * 0.7) * triangleScale;
      const inverted = level % 2 === 1;
      
      ctx.beginPath();
      ctx.strokeStyle = colorScheme === 'rainbow' 
        ? getRainbowColor(level, triangleLevels) 
        : (inverted ? highlightColor : baseColor);
      
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
    
    ctx.beginPath();
    ctx.fillStyle = highlightColor;
    const binduSize = radius * (0.05 + midEnergy * 0.05);
    ctx.arc(0, 0, binduSize, 0, Math.PI * 2);
    ctx.fill();
    
    const petalCount = 8 + Math.floor(highEnergy * 8);
    const petalRadius = radius * 0.6;
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (Math.PI * 2 * i) / petalCount;
      const petalSize = radius * (0.15 + bassEnergy * 0.1);
      
      ctx.strokeStyle = colorScheme === 'rainbow' 
        ? getRainbowColor(i, petalCount) 
        : baseColor;
      
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

  const getRainbowColor = (index: number, total: number): string => {
    const hue = (index / total) * 360;
    return `hsl(${hue}, 100%, 70%)`;
  };

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
      
      const dpr = window.devicePixelRatio || 1;
      
      // When expanded, use window dimensions instead of container dimensions
      let rect;
      if (expanded) {
        rect = {
          width: window.innerWidth,
          height: window.innerHeight
        };
      } else {
        rect = canvas.getBoundingClientRect();
      }
      
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
      
      if (audioAnalyser && frequencyData) {
        audioAnalyser.getByteFrequencyData(frequencyData);
      }
      
      drawSacredGeometry(ctx, rect.width, rect.height, frequencyData, time);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [audioAnalyser, colorScheme, chakra, liftTheVeil, expanded]);

  return (
    <canvas 
      ref={canvasRef}
      className={`w-full h-full ${expanded ? 'fixed inset-0 z-50' : 'absolute inset-0'}`}
      style={{
        position: expanded ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
};

export default SacredGeometryCanvas;
