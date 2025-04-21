
import React, { useRef, useEffect, useState } from 'react';
import { Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SigilCanvasProps {
  activeFrequency: number | null;
}

interface Point {
  x: number;
  y: number;
}

const SigilCanvas: React.FC<SigilCanvasProps> = ({ activeFrequency }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [generatingSigil, setGeneratingSigil] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  
  // Set up canvas on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions with higher resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;
    
    // Get and configure context
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.scale(dpr, dpr);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 2;
    context.strokeStyle = '#9b87f5';
    contextRef.current = context;
    
    // Draw initial canvas state
    drawInitialCanvas(context, canvas.offsetWidth, canvas.offsetHeight);
    
    // Clean up animation on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Update canvas when active frequency changes
  useEffect(() => {
    if (!contextRef.current || !canvasRef.current) return;
    
    // Redraw canvas with new frequency
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    // Adjust color based on frequency
    if (activeFrequency) {
      if (activeFrequency < 280) context.strokeStyle = '#ef4444'; // Red
      else if (activeFrequency < 320) context.strokeStyle = '#f97316'; // Orange
      else if (activeFrequency < 400) context.strokeStyle = '#eab308'; // Yellow
      else if (activeFrequency < 500) context.strokeStyle = '#22c55e'; // Green
      else if (activeFrequency < 600) context.strokeStyle = '#3b82f6'; // Blue
      else if (activeFrequency < 700) context.strokeStyle = '#6366f1'; // Indigo
      else context.strokeStyle = '#a855f7'; // Purple
    } else {
      context.strokeStyle = '#9b87f5'; // Default purple
    }
    
    // Add subtle animation when frequency changes
    if (activeFrequency && points.length > 0) {
      animateSigil();
    }
    
  }, [activeFrequency, points]);
  
  // Draw initial canvas state
  const drawInitialCanvas = (context: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    context.clearRect(0, 0, width, height);
    
    // Draw grid or guidance lines
    context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    context.lineWidth = 0.5;
    
    // Draw circular grid
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 20;
    
    for (let r = maxRadius / 4; r <= maxRadius; r += maxRadius / 4) {
      context.beginPath();
      context.arc(centerX, centerY, r, 0, Math.PI * 2);
      context.stroke();
    }
    
    // Draw radial lines
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.lineTo(
        centerX + maxRadius * Math.cos(angle),
        centerY + maxRadius * Math.sin(angle)
      );
      context.stroke();
    }
    
    // Reset stroke style
    context.strokeStyle = '#9b87f5';
    context.lineWidth = 2;
  };
  
  // Handle mouse/touch down
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    
    setIsDrawing(true);
    
    // Get coordinates
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Start new path
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    
    // Add point
    setPoints(prevPoints => [...prevPoints, { x, y }]);
  };
  
  // Handle mouse/touch move
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    e.preventDefault();
    
    // Get coordinates
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Draw line
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    
    // Add point
    setPoints(prevPoints => [...prevPoints, { x, y }]);
  };
  
  // Handle mouse/touch up
  const endDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };
  
  // Clear canvas
  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Reset everything
    setPoints([]);
    drawInitialCanvas(contextRef.current, canvas.offsetWidth, canvas.offsetHeight);
  };
  
  // Animate sigil based on frequency
  const animateSigil = () => {
    if (!contextRef.current || !canvasRef.current || points.length < 2) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    let step = 0;
    const totalSteps = 60; // Animation frames
    const animate = () => {
      // Clear canvas
      context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      drawInitialCanvas(context, canvas.offsetWidth, canvas.offsetHeight);
      
      // Calculate progress
      const progress = step / totalSteps;
      
      // Draw sigil with animation
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < Math.floor(points.length * progress); i++) {
        context.lineTo(points[i].x, points[i].y);
      }
      
      context.stroke();
      
      step++;
      if (step <= totalSteps) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  };
  
  // Generate automatic sigil
  const generateSigil = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    setGeneratingSigil(true);
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    // Clear existing points and canvas
    setPoints([]);
    drawInitialCanvas(context, canvas.offsetWidth, canvas.offsetHeight);
    
    // Generate new points based on sacred geometry
    setTimeout(() => {
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const radius = Math.min(centerX, centerY) - 30;
      const newPoints: Point[] = [];
      
      // Generate shape based on active frequency or default
      const points = activeFrequency ? (activeFrequency % 10) + 3 : 7;
      
      // Create central point
      newPoints.push({ x: centerX, y: centerY });
      
      // Create outer points
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        newPoints.push({ x, y });
      }
      
      // Create connecting points
      for (let i = 1; i < newPoints.length; i++) {
        for (let j = i + 1; j < newPoints.length; j++) {
          // Only connect some points for a more interesting pattern
          if ((i + j) % 2 === 0) {
            // Calculate midpoint with slight randomization
            const midX = (newPoints[i].x + newPoints[j].x) / 2 + (Math.random() * 20 - 10);
            const midY = (newPoints[i].y + newPoints[j].y) / 2 + (Math.random() * 20 - 10);
            newPoints.push({ x: midX, y: midY });
          }
        }
      }
      
      setPoints(newPoints);
      
      // Draw the sigil
      context.beginPath();
      context.moveTo(newPoints[0].x, newPoints[0].y);
      
      for (let i = 1; i < newPoints.length; i++) {
        context.lineTo(newPoints[i].x, newPoints[i].y);
      }
      
      // Close the path
      context.lineTo(newPoints[0].x, newPoints[0].y);
      context.stroke();
      
      setGeneratingSigil(false);
      
      // Animate the sigil
      animateSigil();
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-playfair text-amber-200">Personal Sigil Activation</h2>
        <p className="text-purple-200">Draw your own sigil or generate one based on your vibrational profile</p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/50 rounded-lg p-4 shadow-lg">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
              className="w-full h-80 border border-purple-500/30 rounded-lg bg-black/20 cursor-crosshair"
            />
            
            {/* Frequency indicator */}
            {activeFrequency && (
              <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs">
                {activeFrequency} Hz Active
              </div>
            )}
            
            <div className="flex justify-between mt-4">
              <Button
                onClick={clearCanvas}
                variant="outline"
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
              >
                Clear Canvas
              </Button>
              
              <Button
                onClick={generateSigil}
                disabled={generatingSigil}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                {generatingSigil ? (
                  <>
                    <Circle className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Sigil'
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-sm opacity-80 space-y-2">
            <p>
              <span className="text-amber-400 font-medium">Sigil Instructions:</span> Draw a symbol that resonates with your intention, or use the generate button to create a sigil based on your vibrational frequency.
            </p>
            <p>
              <span className="text-amber-400 font-medium">Energy Activation:</span> Play a prime frequency while drawing to infuse your sigil with specific vibrational properties.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-lg text-purple-200 mb-4">Your Sacred Journey</p>
          <p className="font-playfair italic text-xl text-amber-200">
            "The symbol becomes the bridge between conscious desire and universal manifestation."
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigilCanvas;
