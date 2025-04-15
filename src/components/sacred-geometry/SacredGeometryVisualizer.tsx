
import React, { useState, useEffect, useRef } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, Play, Flower, Hexagon } from 'lucide-react';

type GeometryShape = 'flower-of-life' | 'seed-of-life' | 'metatrons-cube' | 
                      'merkaba' | 'torus' | 'tree-of-life' | 'sri-yantra' | 
                      'vesica-piscis' | 'sphere';

interface SacredGeometryVisualizerProps {
  defaultShape?: GeometryShape;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showControls?: boolean;
  isAudioReactive?: boolean;
  className?: string;
  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  isVisible?: boolean;
  chakra?: string;
  frequency?: number;
  mode?: 'fractal' | 'spiral' | 'mandala';
  sensitivity?: number;
  expandable?: boolean;
  onExpandStateChange?: (expanded: boolean) => void;
}

// Drawing functions
const drawFlowerOfLife = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, color: string, time: number) => {
  const circleRadius = radius / 7;
  
  // Draw center circle
  drawCircle(ctx, centerX, centerY, circleRadius, color);
  
  // Draw first ring of circles
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI * 2 * (i / 6) + time * 0.1;
    const x = centerX + Math.cos(angle) * circleRadius * 2;
    const y = centerY + Math.sin(angle) * circleRadius * 2;
    drawCircle(ctx, x, y, circleRadius, color);
  }
  
  // Draw second ring of circles
  for (let i = 0; i < 12; i++) {
    const angle = Math.PI * 2 * (i / 12) + time * 0.05;
    const x = centerX + Math.cos(angle) * circleRadius * 4;
    const y = centerY + Math.sin(angle) * circleRadius * 4;
    drawCircle(ctx, x, y, circleRadius, color);
  }
};

const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
};

const drawMerkaba = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, color: string, time: number) => {
  // Draw two interlocking triangles
  const rotationOffset = time * 0.2;
  
  // First triangle (pointing up)
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  
  const triangle1Points = [
    { x: centerX, y: centerY - radius },
    { x: centerX - radius * 0.866, y: centerY + radius * 0.5 },
    { x: centerX + radius * 0.866, y: centerY + radius * 0.5 }
  ];
  
  ctx.moveTo(triangle1Points[0].x, triangle1Points[0].y);
  for (let i = 1; i <= 3; i++) {
    const point = triangle1Points[i % 3];
    ctx.lineTo(point.x, point.y);
  }
  
  ctx.stroke();
  
  // Second triangle (pointing down)
  ctx.beginPath();
  
  const triangle2Points = [
    { x: centerX, y: centerY + radius },
    { x: centerX - radius * 0.866, y: centerY - radius * 0.5 },
    { x: centerX + radius * 0.866, y: centerY - radius * 0.5 }
  ];
  
  ctx.moveTo(triangle2Points[0].x, triangle2Points[0].y);
  for (let i = 1; i <= 3; i++) {
    const point = triangle2Points[i % 3];
    ctx.lineTo(point.x, point.y);
  }
  
  ctx.stroke();
  
  // Draw connecting lines
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    ctx.moveTo(triangle1Points[i].x, triangle1Points[i].y);
    ctx.lineTo(triangle2Points[i].x, triangle2Points[i].y);
  }
  ctx.stroke();
};

const drawMetatronsCube = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, color: string, time: number) => {
  // Draw 13 circles at key points
  const points = [
    { x: centerX, y: centerY }, // Center
    // Six points forming a hexagon
    ...Array.from({ length: 6 }, (_, i) => {
      const angle = Math.PI * 2 * (i / 6);
      return {
        x: centerX + Math.cos(angle) * radius * 0.5,
        y: centerY + Math.sin(angle) * radius * 0.5
      };
    }),
    // Additional points
    { x: centerX, y: centerY - radius * 0.8 },
    { x: centerX, y: centerY + radius * 0.8 },
    { x: centerX - radius * 0.8, y: centerY },
    { x: centerX + radius * 0.8, y: centerY },
    { x: centerX - radius * 0.4, y: centerY - radius * 0.4 },
    { x: centerX + radius * 0.4, y: centerY - radius * 0.4 }
  ];
  
  // Draw circles at each point
  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
  
  // Draw lines connecting all points
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[j].x, points[j].y);
      ctx.stroke();
    }
  }
};

const drawSriYantra = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, color: string, time: number) => {
  // Draw outer circle
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw triangles
  const triangleCount = 9;
  const triangleRadius = radius * 0.9;
  
  for (let i = 0; i < triangleCount; i++) {
    const scale = 1 - (i * 0.09);
    const rotation = i % 2 === 0 ? 0 : Math.PI;
    
    ctx.beginPath();
    
    // Draw triangle
    const trianglePoints = [
      {
        x: centerX + Math.cos(rotation) * triangleRadius * scale,
        y: centerY + Math.sin(rotation) * triangleRadius * scale
      },
      {
        x: centerX + Math.cos(rotation + Math.PI * 2/3) * triangleRadius * scale,
        y: centerY + Math.sin(rotation + Math.PI * 2/3) * triangleRadius * scale
      },
      {
        x: centerX + Math.cos(rotation + Math.PI * 4/3) * triangleRadius * scale,
        y: centerY + Math.sin(rotation + Math.PI * 4/3) * triangleRadius * scale
      }
    ];
    
    ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y);
    ctx.lineTo(trianglePoints[1].x, trianglePoints[1].y);
    ctx.lineTo(trianglePoints[2].x, trianglePoints[2].y);
    ctx.closePath();
    ctx.stroke();
  }
  
  // Draw center dot (bindu)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.05, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
};

const SacredGeometryVisualizer: React.FC<SacredGeometryVisualizerProps> = ({
  defaultShape = 'flower-of-life',
  size = 'lg',
  showControls = true,
  isAudioReactive = false,
  className = '',
  isVisible = true,
  chakra,
  frequency,
  mode = 'fractal',
  expandable = false,
  onExpandStateChange,
}) => {
  const [currentShape, setCurrentShape] = useState<GeometryShape>(defaultShape);
  const [expanded, setExpanded] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<'fractal' | 'spiral' | 'mandala'>(mode || 'fractal');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Update shape when defaultShape prop changes
  useEffect(() => {
    if (defaultShape !== currentShape) {
      setCurrentShape(defaultShape);
    }
  }, [defaultShape, currentShape]);

  // Basic canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Get color based on chakra
    const getColor = () => {
      if (!chakra) return '#a855f7';
      
      switch (chakra.toLowerCase()) {
        case 'root': return '#ef4444';
        case 'sacral': return '#f97316';
        case 'solar plexus': return '#facc15';
        case 'heart': return '#22c55e';
        case 'throat': return '#3b82f6';
        case 'third eye': return '#6366f1';
        case 'crown': return '#a855f7';
        default: return '#a855f7';
      }
    };
    
    const color = getColor();
    let frameId: number;
    
    const animate = () => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw visualization based on shape and mode
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);
      
      const time = Date.now() / 1000;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Draw based on selected shape
      switch (currentShape) {
        case 'flower-of-life':
          drawFlowerOfLife(ctx, centerX, centerY, Math.min(width, height) * 0.4, color, time);
          break;
        case 'merkaba':
          drawMerkaba(ctx, centerX, centerY, Math.min(width, height) * 0.4, color, time);
          break;
        case 'metatrons-cube':
          drawMetatronsCube(ctx, centerX, centerY, Math.min(width, height) * 0.4, color, time);
          break;
        case 'sri-yantra':
          drawSriYantra(ctx, centerX, centerY, Math.min(width, height) * 0.4, color, time);
          break;
        default:
          drawFlowerOfLife(ctx, centerX, centerY, Math.min(width, height) * 0.4, color, time);
      }
      
      frameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentShape, chakra, visualizerMode]);

  const shouldShow = isVisible !== false;
  
  const toggleExpand = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    if (onExpandStateChange) {
      onExpandStateChange(newExpandedState);
    }
  };

  const effectiveSize = expanded ? 'xl' : size;

  const shapeOptions: { value: GeometryShape; label: string }[] = [
    { value: 'flower-of-life', label: 'Flower of Life' },
    { value: 'seed-of-life', label: 'Seed of Life' },
    { value: 'metatrons-cube', label: 'Metatron\'s Cube' },
    { value: 'merkaba', label: 'Merkaba' },
    { value: 'torus', label: 'Torus' },
    { value: 'tree-of-life', label: 'Tree of Life' },
    { value: 'sri-yantra', label: 'Sri Yantra' },
    { value: 'vesica-piscis', label: 'Vesica Piscis' },
  ];

  const modeOptions = [
    { value: 'fractal', label: 'Fractal', icon: <Flower className="w-4 h-4" /> },
    { value: 'spiral', label: 'Spiral', icon: <Hexagon className="w-4 h-4" /> },
    { value: 'mandala', label: 'Mandala', icon: <Play className="w-4 h-4 rotate-90" /> },
  ];

  if (!shouldShow) {
    return null;
  }
  
  // Update container classes based on expanded state
  const containerBaseClass = "sacred-geometry-container rounded-xl shadow-xl bg-black/20 relative";
  const containerSizeClass = expanded 
    ? "fixed inset-0 z-40 flex flex-col justify-center items-center bg-black/80 pt-12" 
    : `w-full h-[60vw] max-h-[400px] sm:h-[300px] lg:h-[384px] ${className}`;

  return (
    <div className={`${containerBaseClass} ${containerSizeClass}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full relative"
      >
        {expandable && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpand}
            className="absolute top-2 right-2 z-30 bg-black/40 hover:bg-black/60 text-white"
            title={expanded ? "Minimize" : "Maximize"}
          >
            {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        )}
        
        <div className={expanded ? "w-full h-[80vh]" : "w-full h-full"}>
          <canvas 
            ref={canvasRef} 
            className="w-full h-full" 
          />
        </div>
        
        {showControls && expanded && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
            <ToggleGroup 
              type="single" 
              value={visualizerMode}
              onValueChange={(value) => {
                if (value) {
                  setVisualizerMode(value as 'fractal' | 'spiral' | 'mandala');
                }
              }}
              className="bg-black/60 backdrop-blur-md rounded-lg p-2 flex flex-wrap justify-center shadow-lg"
            >
              {modeOptions.map((option) => (
                <ToggleGroupItem 
                  key={option.value} 
                  value={option.value}
                  className="px-3 py-1 text-xs text-white data-[state=on]:bg-purple-700 rounded flex items-center gap-2"
                >
                  {option.icon} {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
        
        {showControls && (
          <div className={`${expanded ? "absolute bottom-8" : "absolute bottom-2 sm:bottom-4"} left-1/2 transform -translate-x-1/2 z-50 w-full px-2 sm:px-0 max-w-full sm:max-w-md`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-black/80 backdrop-blur-md rounded-lg p-1 sm:p-2 flex flex-wrap justify-center shadow-lg overflow-x-auto"
            >
              <ToggleGroup 
                type="single" 
                value={currentShape}
                onValueChange={(value) => {
                  if (value) {
                    setCurrentShape(value as GeometryShape);
                  }
                }}
                className="flex flex-wrap justify-center"
              >
                {shapeOptions.map((option) => (
                  <ToggleGroupItem 
                    key={option.value} 
                    value={option.value}
                    className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs text-white data-[state=on]:bg-purple-700 rounded"
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </motion.div>
          </div>
        )}
        
        {expanded && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
            <Button
              variant="outline"
              onClick={toggleExpand}
              className="bg-purple-900/30 border-purple-400/30 text-purple-100 hover:bg-purple-900/50"
            >
              Return to Player
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SacredGeometryVisualizer;
