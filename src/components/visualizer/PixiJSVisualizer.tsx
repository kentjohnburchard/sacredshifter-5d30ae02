import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { useAppStore } from '@/store';

interface PixiJSVisualizerProps {
  width?: number;
  height?: number;
  colorScheme?: string;
  isPlaying?: boolean;
  isFullscreen?: boolean;
}

const PixiJSVisualizer: React.FC<PixiJSVisualizerProps> = ({
  width = 800,
  height = 400,
  colorScheme = '#9b87f5',
  isPlaying = false,
  isFullscreen = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const { audioData, frequencyData, visualizationMode } = useAppStore();
  const [visualizerType, setVisualizerType] = useState<'flower' | 'particles' | 'wave' | 'prime'>('flower');
  const animationRef = useRef<number | null>(null);
  
  const hexToPixiColor = (hex: string): number => {
    return parseInt(hex.replace('#', ''), 16);
  };
  
  const primaryColor = hexToPixiColor(colorScheme);
  
  const getSecondaryColor = (): number => {
    return hexToPixiColor(
      colorScheme === '#9b87f5' ? '#7E69AB' : 
      colorScheme === '#ff69b4' ? '#d64e98' : 
      colorScheme === '#3490dc' ? '#2779bd' : 
      '#5c4c8a'
    );
  };
  
  useEffect(() => {
    switch (visualizationMode) {
      case 'sacred':
      case 'flower':
        setVisualizerType('flower');
        break;
      case 'prime':
        setVisualizerType('prime');
        break;
      case 'equalizer':
        setVisualizerType('wave');
        break;
      case 'pixel':
      case 'flow':
        setVisualizerType('particles');
        break;
      default:
        setVisualizerType('flower');
    }
  }, [visualizationMode]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    if (appRef.current) {
      appRef.current.destroy(true);
    }
    
    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });
    
    containerRef.current.appendChild(app.view as any);
    appRef.current = app;
    
    const handleResize = () => {
      if (containerRef.current && app.renderer) {
        const parent = containerRef.current;
        const newWidth = isFullscreen ? window.innerWidth : parent.clientWidth;
        const newHeight = isFullscreen ? window.innerHeight : parent.clientHeight;
        
        app.renderer.resize(newWidth, newHeight);
        
        if (app.stage.children.length > 0) {
          app.stage.children.forEach(child => {
            if (child instanceof PIXI.Container) {
              child.position.set(newWidth / 2, newHeight / 2);
            }
          });
        }
      }
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [width, height, isFullscreen]);
  
  useEffect(() => {
    if (!appRef.current) return;
    
    const app = appRef.current;
    
    app.stage.removeChildren();
    
    const container = new PIXI.Container();
    container.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(container);
    
    switch (visualizerType) {
      case 'flower':
        setupFlowerOfLifeVisualizer(container, app);
        break;
      case 'particles':
        setupParticlesVisualizer(container, app);
        break;
      case 'wave':
        setupWaveformVisualizer(container, app);
        break;
      case 'prime':
        setupPrimeVisualizer(container, app);
        break;
    }
  }, [visualizerType, primaryColor]);
  
  const setupFlowerOfLifeVisualizer = (container: PIXI.Container, app: PIXI.Application) => {
    const circlesContainer = new PIXI.Container();
    container.addChild(circlesContainer);
    
    const numPetals = 7;
    const baseRadius = 60;
    const petalRadius = 30;
    
    const centerCircle = new PIXI.Graphics();
    centerCircle.beginFill(primaryColor, 0.7);
    centerCircle.drawCircle(0, 0, baseRadius);
    centerCircle.endFill();
    circlesContainer.addChild(centerCircle);
    
    for (let i = 0; i < numPetals; i++) {
      const angle = (i / numPetals) * Math.PI * 2;
      const x = Math.cos(angle) * baseRadius * 1.5;
      const y = Math.sin(angle) * baseRadius * 1.5;
      
      const petal = new PIXI.Graphics();
      petal.beginFill(getSecondaryColor(), 0.5);
      petal.drawCircle(x, y, petalRadius);
      petal.endFill();
      circlesContainer.addChild(petal);
      
      const innerPetal = new PIXI.Graphics();
      innerPetal.beginFill(primaryColor, 0.3);
      innerPetal.drawCircle(x * 0.5, y * 0.5, petalRadius * 0.7);
      innerPetal.endFill();
      circlesContainer.addChild(innerPetal);
    }
    
    const animate = () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      if (audioData && audioData.length > 0) {
        let sum = 0;
        for (let i = 0; i < audioData.length; i++) {
          sum += Math.abs((audioData[i] / 128) - 1);
        }
        const average = sum / audioData.length;
        centerCircle.scale.set(1 + average * 0.5);
        
        if (frequencyData && frequencyData.length > 0) {
          const freqSum = frequencyData.reduce((acc, val) => acc + val, 0);
          const freqAvg = freqSum / frequencyData.length / 255;
          circlesContainer.rotation += 0.01 + freqAvg * 0.05;
          
          circlesContainer.children.forEach((child, index) => {
            if (child instanceof PIXI.Graphics && index > 0) {
              const freqIndex = (index * 5) % frequencyData.length;
              const alpha = 0.3 + (frequencyData[freqIndex] / 255) * 0.7;
              child.alpha = alpha;
            }
          });
        } else {
          circlesContainer.rotation += 0.01;
        }
      } else {
        circlesContainer.rotation += 0.01;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const setupParticlesVisualizer = (container: PIXI.Container, app: PIXI.Application) => {
    const particlesContainer = new PIXI.Container();
    container.addChild(particlesContainer);
    
    const numParticles = 200;
    const particles: PIXI.Graphics[] = [];
    
    for (let i = 0; i < numParticles; i++) {
      const particle = new PIXI.Graphics();
      particle.beginFill(primaryColor);
      particle.drawCircle(0, 0, 2 + Math.random() * 3);
      particle.endFill();
      particle.position.set(
        (Math.random() - 0.5) * app.screen.width,
        (Math.random() - 0.5) * app.screen.height
      );
      
      (particle as any).velocity = {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      };
      
      particlesContainer.addChild(particle);
      particles.push(particle);
    }
    
    const animate = () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      particles.forEach((particle, index) => {
        particle.position.x += (particle as any).velocity.x;
        particle.position.y += (particle as any).velocity.y;
        
        if (Math.abs(particle.position.x) > app.screen.width / 2) {
          (particle as any).velocity.x *= -1;
        }
        
        if (Math.abs(particle.position.y) > app.screen.height / 2) {
          (particle as any).velocity.y *= -1;
        }
        
        if (frequencyData && frequencyData.length > 0) {
          const freqIndex = index % frequencyData.length;
          const scale = 0.5 + (frequencyData[freqIndex] / 255) * 2;
          particle.scale.set(scale);
          
          particle.alpha = 0.3 + (frequencyData[freqIndex] / 255) * 0.7;
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const setupWaveformVisualizer = (container: PIXI.Container, app: PIXI.Application) => {
    const waveformContainer = new PIXI.Container();
    container.addChild(waveformContainer);
    
    const numBars = 128;
    const bars: PIXI.Graphics[] = [];
    const barWidth = app.screen.width / numBars;
    
    for (let i = 0; i < numBars; i++) {
      const bar = new PIXI.Graphics();
      bar.beginFill(primaryColor);
      bar.drawRect(-barWidth / 2, 0, barWidth - 2, 100);
      bar.endFill();
      bar.position.x = (i - numBars / 2) * barWidth;
      waveformContainer.addChild(bar);
      bars.push(bar);
    }
    
    const animate = () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      if (frequencyData && frequencyData.length > 0) {
        bars.forEach((bar, index) => {
          const freqIndex = Math.floor((index / bars.length) * frequencyData.length);
          const height = (frequencyData[freqIndex] / 255) * app.screen.height * 0.5;
          bar.height = Math.max(5, height);
          
          const hue = (index / bars.length) * 360;
          const color = primaryColor;
          bar.tint = color;
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const setupPrimeVisualizer = (container: PIXI.Container, app: PIXI.Application) => {
    const primeContainer = new PIXI.Container();
    container.addChild(primeContainer);
    
    const numCircles = 100;
    const circles: PIXI.Graphics[] = [];
    
    const isPrime = (num: number): boolean => {
      if (num <= 1) return false;
      if (num <= 3) return true;
      if (num % 2 === 0 || num % 3 === 0) return false;
      
      for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
      }
      
      return true;
    };
    
    const primes: number[] = [];
    for (let i = 2; i < 500; i++) {
      if (isPrime(i)) {
        primes.push(i);
      }
    }
    
    for (let i = 0; i < numCircles; i++) {
      const circle = new PIXI.Graphics();
      const radius = i % 10 === 0 ? 6 : 4;
      const isPrimeNumber = primes.includes(i);
      
      circle.beginFill(isPrimeNumber ? primaryColor : getSecondaryColor(), isPrimeNumber ? 0.8 : 0.4);
      circle.drawCircle(0, 0, radius);
      circle.endFill();
      
      const angle = i * 0.5;
      const distance = i * 2;
      circle.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance
      );
      
      primeContainer.addChild(circle);
      circles.push(circle);
      
      if (isPrimeNumber && i < 50) {
        const text = new PIXI.Text(`${i}`, {
          fontSize: 10,
          fill: 0xffffff
        });
        text.anchor.set(0.5);
        text.position.set(circle.position.x, circle.position.y - 15);
        primeContainer.addChild(text);
      }
    }
    
    const animate = () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      primeContainer.rotation += 0.005;
      
      if (frequencyData && frequencyData.length > 0) {
        circles.forEach((circle, index) => {
          const freqIndex = index % frequencyData.length;
          const scale = 0.8 + (frequencyData[freqIndex] / 255) * 1.5;
          
          const isPrimeNumber = primes.includes(index);
          circle.scale.set(isPrimeNumber ? scale * 1.2 : scale);
          
          circle.alpha = 0.4 + (frequencyData[freqIndex] / 255) * 0.6;
        });
        
        const bassAvg = frequencyData.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
        primeContainer.rotation += (bassAvg / 255) * 0.01;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-hidden"
      style={{
        backgroundColor: 'black',
        borderRadius: '0.5rem',
      }}
    />
  );
};

export default PixiJSVisualizer;
