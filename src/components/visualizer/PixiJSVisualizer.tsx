
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { useAppStore } from '@/store';
import { generatePrimeSequence } from '@/utils/primeCalculations';

interface PixiJSVisualizerProps {
  width?: number;
  height?: number;
  colorScheme?: string;
  isPlaying?: boolean;
  isFullscreen?: boolean;
}

const PixiJSVisualizer: React.FC<PixiJSVisualizerProps> = ({
  width = 800,
  height = 600,
  colorScheme = '#9b87f5',
  isPlaying = false,
  isFullscreen = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const graphicsRef = useRef<PIXI.Graphics | null>(null);
  const circlesRef = useRef<PIXI.Graphics[]>([]);
  const primeCirclesRef = useRef<PIXI.Graphics[]>([]);
  const flowerPetalsRef = useRef<PIXI.Graphics[]>([]);
  const timeRef = useRef<number>(0);

  const { frequencyData, visualizationMode, visualizationQuality } = useAppStore();

  // Setup PIXI Application
  useEffect(() => {
    if (!containerRef.current) return;

    // Create PIXI Application
    const app = new PIXI.Application({
      width: width,
      height: height,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });
    
    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;
    
    // Create graphics object
    const graphics = new PIXI.Graphics();
    app.stage.addChild(graphics);
    graphicsRef.current = graphics;
    
    // Create prime sequence circles
    const primeSequence = generatePrimeSequence(100);
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create circles based on prime numbers
    primeSequence.slice(0, 20).forEach((prime, index) => {
      const circle = new PIXI.Graphics();
      circle.lineStyle(1, PIXI.utils.string2hex(colorScheme), 0.5);
      circle.drawCircle(centerX, centerY, prime * 3);
      app.stage.addChild(circle);
      circlesRef.current.push(circle);
    });
    
    // Create flower of life pattern
    const createFlowerOfLife = () => {
      const radius = Math.min(width, height) * 0.1;
      
      // Center circle
      const centerCircle = new PIXI.Graphics();
      centerCircle.lineStyle(1, PIXI.utils.string2hex(colorScheme), 0.5);
      centerCircle.drawCircle(centerX, centerY, radius);
      app.stage.addChild(centerCircle);
      flowerPetalsRef.current.push(centerCircle);
      
      // Surrounding circles
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        const petal = new PIXI.Graphics();
        petal.lineStyle(1, PIXI.utils.string2hex(colorScheme), 0.5);
        petal.drawCircle(x, y, radius);
        app.stage.addChild(petal);
        flowerPetalsRef.current.push(petal);
      }
    };
    
    createFlowerOfLife();
    
    // Animation loop
    const animate = (delta: number) => {
      timeRef.current += delta * 0.01;
      
      if (!graphicsRef.current || !isPlaying) return;
      
      graphicsRef.current.clear();
      
      if (visualizationMode === 'sacred' || visualizationMode === 'flower') {
        // Update flower of life
        flowerPetalsRef.current.forEach((petal, index) => {
          const amplitude = frequencyData ? (frequencyData[index % frequencyData.length] || 0) / 255 : 0.5;
          const scale = 0.8 + amplitude * 0.4;
          petal.scale.set(scale);
        });
      }
      
      if (visualizationMode === 'prime' || visualizationMode === 'flow') {
        // Update circles
        circlesRef.current.forEach((circle, index) => {
          const amplitude = frequencyData ? (frequencyData[index % frequencyData.length] || 0) / 255 : 0.5;
          const hue = (timeRef.current * 10 + index * 30) % 360;
          const color = PIXI.utils.string2hex(`hsl(${hue}, 70%, 50%)`);
          
          circle.clear();
          circle.lineStyle(1 + amplitude * 2, color, 0.5);
          circle.drawCircle(width / 2, height / 2, (index + 1) * 20 * (0.8 + amplitude * 0.4));
        });
        
        // Draw connecting lines
        graphicsRef.current.lineStyle(1, PIXI.utils.string2hex(colorScheme), 0.3);
        for (let i = 0; i < circlesRef.current.length - 1; i++) {
          const amplitude = frequencyData ? (frequencyData[i % frequencyData.length] || 0) / 255 : 0.5;
          if (amplitude > 0.3) {
            const angle1 = timeRef.current + i * 0.5;
            const angle2 = timeRef.current + (i + 1) * 0.5;
            const radius1 = (i + 1) * 20;
            const radius2 = (i + 2) * 20;
            
            const x1 = width / 2 + Math.cos(angle1) * radius1;
            const y1 = height / 2 + Math.sin(angle1) * radius1;
            const x2 = width / 2 + Math.cos(angle2) * radius2;
            const y2 = height / 2 + Math.sin(angle2) * radius2;
            
            graphicsRef.current.moveTo(x1, y1);
            graphicsRef.current.lineTo(x2, y2);
          }
        }
      }
      
      if (visualizationMode === 'equalizer') {
        // Draw equalizer bars
        if (frequencyData) {
          const barWidth = width / Math.min(frequencyData.length, 64);
          for (let i = 0; i < Math.min(frequencyData.length, 64); i++) {
            const amplitude = frequencyData[i] / 255;
            const barHeight = amplitude * height * 0.8;
            
            const hue = (i / 64) * 270; // Gradient from 0 to 270 (purple)
            const color = PIXI.utils.string2hex(`hsl(${hue}, 70%, 50%)`);
            
            graphicsRef.current.beginFill(color);
            graphicsRef.current.drawRect(
              i * barWidth, 
              height - barHeight, 
              barWidth - 1, 
              barHeight
            );
            graphicsRef.current.endFill();
          }
        }
      }
      
      if (visualizationMode === 'pixel') {
        // Create a particle effect
        if (frequencyData) {
          const particles = 100; // Reduce for 'low' quality
          const maxSize = visualizationQuality === 'high' ? 8 : 
                          visualizationQuality === 'medium' ? 5 : 3;
                          
          for (let i = 0; i < particles; i++) {
            const index = i % frequencyData.length;
            const amplitude = frequencyData[index] / 255;
            
            if (amplitude > 0.1) {
              const size = amplitude * maxSize;
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * width * 0.4 * amplitude;
              
              const x = width / 2 + Math.cos(angle) * distance;
              const y = height / 2 + Math.sin(angle) * distance;
              
              const hue = (timeRef.current * 10 + i * 3) % 360;
              const color = PIXI.utils.string2hex(`hsl(${hue}, 70%, 50%)`);
              
              graphicsRef.current.beginFill(color, 0.7);
              graphicsRef.current.drawCircle(x, y, size);
              graphicsRef.current.endFill();
            }
          }
        }
      }
    };
    
    app.ticker.add(animate);
    
    return () => {
      app.ticker.remove(animate);
      app.destroy(true, {
        children: true,
        texture: true,
        baseTexture: true
      });
    };
  }, [width, height, colorScheme, visualizationQuality]);
  
  // Update container size when fullscreen changes
  useEffect(() => {
    if (!appRef.current || !containerRef.current) return;
    
    const updateSize = () => {
      if (isFullscreen) {
        const newWidth = containerRef.current?.clientWidth || window.innerWidth;
        const newHeight = containerRef.current?.clientHeight || window.innerHeight;
        
        appRef.current?.renderer.resize(newWidth, newHeight);
      } else {
        appRef.current?.renderer.resize(width, height);
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, [isFullscreen, width, height]);

  // Get container classes based on fullscreen state
  const containerClasses = isFullscreen
    ? 'w-full h-full absolute inset-0'
    : 'w-full h-full';

  return (
    <div 
      ref={containerRef} 
      className={containerClasses}
      style={{ overflow: 'hidden' }}
    />
  );
};

export default PixiJSVisualizer;
