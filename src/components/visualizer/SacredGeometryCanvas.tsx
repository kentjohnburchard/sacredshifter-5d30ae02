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
  const [colorCycle, setColorCycle] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  
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
          return `rgba(255, 25, 25, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
        case 'sacral': 
          return `rgba(255, 127, 0, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
        case 'solar plexus': 
          return `rgba(255, 215, 0, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
        case 'heart': 
          return `rgba(10, 215, 80, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
        case 'throat': 
          return `rgba(0, 191, 255, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
        case 'third eye': 
          return `rgba(138, 43, 226, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
        case 'crown': 
          return `rgba(186, 85, 211, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
        default: 
          return `rgba(159, 122, 235, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
      }
    }
    
    switch (colorScheme) {
      case 'purple': 
        return `rgba(159, 122, 235, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
      case 'blue': 
        return `rgba(20, 195, 255, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
      case 'rainbow': 
        const hue = (colorCycle % 360);
        return `hsla(${hue}, 100%, 70%, 0.95)`;
      case 'gold': 
        return `rgba(255, 215, 0, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
      default: 
        return `rgba(159, 122, 235, ${0.8 + Math.sin(timeElapsed * 0.002) * 0.2})`;
    }
  };
  
  const getHighlightColor = (): string => {
    if (chakra) {
      switch (chakra.toLowerCase()) {
        case 'root': 
          return 'rgba(255, 65, 65, 1)';
        case 'sacral': 
          return 'rgba(255, 165, 0, 1)';
        case 'solar plexus': 
          return 'rgba(255, 255, 0, 1)';
        case 'heart': 
          return 'rgba(50, 255, 150, 1)';
        case 'throat': 
          return 'rgba(80, 220, 255, 1)';
        case 'third eye': 
          return 'rgba(191, 64, 255, 1)';
        case 'crown': 
          return 'rgba(236, 100, 255, 1)';
        default: 
          return 'rgba(212, 122, 255, 1)';
      }
    }
    
    switch (colorScheme) {
      case 'purple': return 'rgba(212, 122, 255, 1)';
      case 'blue': return 'rgba(80, 220, 255, 1)';
      case 'rainbow': 
        const hue = ((colorCycle + 180) % 360);
        return `hsla(${hue}, 100%, 80%, 1)`;
      case 'gold': return 'rgba(255, 255, 80, 1)';
      default: return 'rgba(212, 122, 255, 1)';
    }
  };

  const getFrequencyColor = (binIndex: number, totalBins: number, intensity: number): string => {
    if (colorScheme === 'rainbow') {
      const hue = (binIndex / totalBins) * 360;
      return `hsla(${hue}, 100%, ${70 + intensity * 30}%, ${0.7 + intensity * 0.3})`;
    }
    
    if (chakra) {
      const chakraColors: Record<string, string> = {
        'root': `rgba(255, ${65 + intensity * 60}, ${65 + intensity * 40}, ${0.7 + intensity * 0.3})`,
        'sacral': `rgba(255, ${127 + intensity * 50}, ${0 + intensity * 50}, ${0.7 + intensity * 0.3})`,
        'solar plexus': `rgba(255, ${215 + intensity * 40}, ${0 + intensity * 60}, ${0.7 + intensity * 0.3})`,
        'heart': `rgba(${10 + intensity * 40}, ${215 + intensity * 40}, ${80 + intensity * 20}, ${0.7 + intensity * 0.3})`,
        'throat': `rgba(${0 + intensity * 40}, ${191 + intensity * 30}, 255, ${0.7 + intensity * 0.3})`,
        'third eye': `rgba(${138 + intensity * 50}, ${43 + intensity * 30}, 226, ${0.7 + intensity * 0.3})`,
        'crown': `rgba(${186 + intensity * 50}, ${85 + intensity * 40}, 211, ${0.7 + intensity * 0.3})`,
      };
      
      return chakraColors[chakra.toLowerCase()] || `rgba(159, ${122 + intensity * 50}, 235, ${0.7 + intensity * 0.3})`;
    }
    
    switch (colorScheme) {
      case 'purple': 
        return `rgba(${159 + intensity * 50}, ${122 + intensity * 30}, 235, ${0.7 + intensity * 0.3})`;
      case 'blue': 
        return `rgba(${20 + intensity * 40}, ${195 + intensity * 30}, 255, ${0.7 + intensity * 0.3})`;
      case 'gold': 
        return `rgba(255, ${215 + intensity * 40}, ${0 + intensity * 100}, ${0.7 + intensity * 0.3})`;
      default:
        return `rgba(${159 + intensity * 50}, ${122 + intensity * 30}, 235, ${0.7 + intensity * 0.3})`;
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
    setTimeElapsed(time);
    setColorCycle(prev => (prev + (colorScheme === 'rainbow' ? 0.5 : 0.2)) % 360);
    
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
      const barWidth = width / Math.min(64, frequencyData.length);
      const barMargin = 2;
      const maxBarHeight = height * 0.15;
      const barBaseline = height * 0.95;
      
      for (let i = 0; i < Math.min(64, frequencyData.length); i++) {
        const normalized = frequencyData[i] / 255;
        const barHeight = normalized * maxBarHeight;
        
        if (barHeight > 2) {
          const intensity = normalized;
          ctx.fillStyle = getFrequencyColor(i, Math.min(64, frequencyData.length), intensity);
          
          ctx.fillRect(
            i * barWidth + barMargin/2, 
            barBaseline - barHeight, 
            barWidth - barMargin, 
            barHeight
          );
          
          if (normalized > 0.4) {
            ctx.shadowColor = getHighlightColor();
            ctx.shadowBlur = normalized * 15;
            ctx.fillRect(
              i * barWidth + barMargin/2, 
              barBaseline - barHeight, 
              barWidth - barMargin, 
              barHeight
            );
            ctx.shadowBlur = 0;
          }
        }
      }

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
    gradient.addColorStop(0, baseColor.replace(')', ', 0.33)'));
    gradient.addColorStop(0.5, baseColor.replace(')', ', 0.2)'));
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
      ctx.fillStyle = getHighlightColor();
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${dominantFrequency}Hz`, 20, 30);
    }
    
    if (primeNumbers.length > 0) {
      ctx.fillStyle = getHighlightColor();
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`Primes: ${primeNumbers.slice(-3).join(', ')}`, width - 20, 30);
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
      
      let width, height;
      if (expanded) {
        width = window.innerWidth;
        height = window.innerHeight;
      } else {
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }
      
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }
      
      if (audioAnalyser && frequencyData) {
        audioAnalyser.getByteFrequencyData(frequencyData);
      }
      
      drawSacredGeometry(ctx, width, height, frequencyData, time);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    const handleResize = () => {
      if (!canvas || !ctx) return;
      
      const dpr = window.devicePixelRatio || 1;
      const width = expanded ? window.innerWidth : canvas.clientWidth;
      const height = expanded ? window.innerHeight : canvas.clientHeight;
      
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [audioAnalyser, colorScheme, chakra, liftTheVeil, expanded]);

  return (
    <canvas 
      ref={canvasRef}
      className={`w-full h-full ${expanded ? 'fixed inset-0 z-50' : ''}`}
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
