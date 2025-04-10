
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface SacredGeometryVisualizerProps {
  frequency?: number;
  chakra?: string;
  isPlaying?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  animationSpeed?: number;
  pulseWithAudio?: boolean;
  geometryType?: "flowerOfLife" | "metatronsCube" | "merkaba" | "sriYantra";
}

const SacredGeometryVisualizer: React.FC<SacredGeometryVisualizerProps> = ({
  frequency = 432,
  chakra,
  isPlaying = false,
  size = "md",
  animationSpeed = 1,
  pulseWithAudio = true,
  geometryType = "flowerOfLife",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  
  // Map chakras to colors
  const chakraColors = {
    root: "#ff0000",
    sacral: "#ff8000",
    "solar plexus": "#ffff00",
    heart: "#00ff00",
    throat: "#00ffff",
    "third eye": "#0000ff",
    crown: "#8000ff",
    default: "#9b87f5",
  };
  
  const chakraColor = chakra 
    ? chakraColors[chakra.toLowerCase() as keyof typeof chakraColors] || chakraColors.default
    : chakraColors.default;
    
  // Map frequencies to specific properties
  const getFrequencyProperties = (freq: number) => {
    if (freq >= 396 && freq < 417) return { intensity: 0.7, complexity: 3 }; // Liberation
    if (freq >= 417 && freq < 528) return { intensity: 0.75, complexity: 4 }; // Transformation
    if (freq >= 528 && freq < 639) return { intensity: 0.85, complexity: 5 }; // Miracle
    if (freq >= 639 && freq < 741) return { intensity: 0.8, complexity: 4 }; // Relationships
    if (freq >= 741 && freq < 852) return { intensity: 0.9, complexity: 6 }; // Expression
    if (freq >= 852 && freq <= 963) return { intensity: 0.95, complexity: 7 }; // Spiritual
    return { intensity: 0.7, complexity: 4 }; // Default
  };
  
  const freqProps = getFrequencyProperties(frequency);
  
  // Size mapping
  const sizeMap = {
    sm: { width: 120, height: 120 },
    md: { width: 200, height: 200 },
    lg: { width: 300, height: 300 },
    xl: { width: 400, height: 400 },
    full: { width: "100%", height: "100%" },
  };
  
  const dimensions = sizeMap[size];
  
  // Animation effect
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    if (size === "full") {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = canvas.parentElement?.clientHeight || 300;
    } else {
      canvas.width = typeof dimensions.width === 'number' ? dimensions.width : 300;
      canvas.height = typeof dimensions.height === 'number' ? dimensions.height : 300;
    }
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(centerX, centerY) * 0.8;
    
    let animationFrameId: number;
    let rotationAngle = 0;
    
    const drawFlowerOfLife = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set shadow for glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = chakraColor;
      
      // Base circle
      const radius = baseRadius * (isPlaying && pulseWithAudio ? 0.95 + Math.sin(Date.now() / 1000) * 0.05 : 1);
      
      // Draw the central circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius / 3, 0, Math.PI * 2);
      ctx.strokeStyle = chakraColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw the flower pattern
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotationAngle;
        const x = centerX + radius / 2 * Math.cos(angle);
        const y = centerY + radius / 2 * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, radius / 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Add complexity based on frequency
      for (let i = 0; i < freqProps.complexity; i++) {
        const angle = (Math.PI / (freqProps.complexity / 2)) * i + rotationAngle * 0.5;
        const distanceRatio = 0.65 + (i % 3) * 0.1;
        const x = centerX + radius * distanceRatio * Math.cos(angle);
        const y = centerY + radius * distanceRatio * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, radius / 4, 0, Math.PI * 2);
        ctx.globalAlpha = 0.7 - i * 0.1;
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
      
      // Increment rotation if playing
      if (isPlaying) {
        rotationAngle += 0.002 * animationSpeed;
        setRotation(rotationAngle);
      }
    };
    
    const drawMetatronsCube = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set shadow for glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = chakraColor;
      
      const radius = baseRadius * (isPlaying && pulseWithAudio ? 0.95 + Math.sin(Date.now() / 1000) * 0.05 : 1);
      
      // Draw outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = chakraColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw the 13 circles of Metatron's Cube
      const points = [];
      
      // Central circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius / 6, 0, Math.PI * 2);
      ctx.stroke();
      points.push({ x: centerX, y: centerY });
      
      // Draw the inner 6 circles
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotationAngle;
        const x = centerX + radius / 2 * Math.cos(angle);
        const y = centerY + radius / 2 * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, radius / 6, 0, Math.PI * 2);
        ctx.stroke();
        points.push({ x, y });
      }
      
      // Draw the outer 6 circles
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotationAngle + Math.PI / 6;
        const x = centerX + radius * 0.8 * Math.cos(angle);
        const y = centerY + radius * 0.8 * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, radius / 6, 0, Math.PI * 2);
        ctx.stroke();
        points.push({ x, y });
      }
      
      // Connect all points to create the cube
      ctx.beginPath();
      for (let i = 1; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
        }
      }
      ctx.globalAlpha = 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1;
      
      // Increment rotation if playing
      if (isPlaying) {
        rotationAngle += 0.002 * animationSpeed;
        setRotation(rotationAngle);
      }
    };
    
    const drawMerkaba = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set shadow for glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = chakraColor;
      
      const radius = baseRadius * (isPlaying && pulseWithAudio ? 0.95 + Math.sin(Date.now() / 1000) * 0.05 : 1);
      
      // Draw outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = chakraColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw two interlocking tetrahedrons (Star of David in 2D)
      const firstPoints = [];
      const secondPoints = [];
      
      // First triangle (pointing up)
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i + rotationAngle;
        const x = centerX + radius * 0.8 * Math.cos(angle);
        const y = centerY + radius * 0.8 * Math.sin(angle);
        firstPoints.push({ x, y });
      }
      
      // Second triangle (pointing down)
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i + rotationAngle + Math.PI;
        const x = centerX + radius * 0.8 * Math.cos(angle);
        const y = centerY + radius * 0.8 * Math.sin(angle);
        secondPoints.push({ x, y });
      }
      
      // Draw first triangle
      ctx.beginPath();
      ctx.moveTo(firstPoints[0].x, firstPoints[0].y);
      for (let i = 1; i < firstPoints.length; i++) {
        ctx.lineTo(firstPoints[i].x, firstPoints[i].y);
      }
      ctx.closePath();
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      
      // Draw second triangle
      ctx.beginPath();
      ctx.moveTo(secondPoints[0].x, secondPoints[0].y);
      for (let i = 1; i < secondPoints.length; i++) {
        ctx.lineTo(secondPoints[i].x, secondPoints[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      
      // Connect the points to create the merkaba
      ctx.beginPath();
      for (let i = 0; i < firstPoints.length; i++) {
        for (let j = 0; j < secondPoints.length; j++) {
          ctx.moveTo(firstPoints[i].x, firstPoints[i].y);
          ctx.lineTo(secondPoints[j].x, secondPoints[j].y);
        }
      }
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
      
      // Increment rotation if playing
      if (isPlaying) {
        rotationAngle += 0.003 * animationSpeed;
        setRotation(rotationAngle);
      }
    };
    
    const drawSriYantra = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set shadow for glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = chakraColor;
      
      const radius = baseRadius * (isPlaying && pulseWithAudio ? 0.95 + Math.sin(Date.now() / 1000) * 0.05 : 1);
      
      // Draw outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = chakraColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw lotus petals around the edge
      const petalCount = 9;
      for (let i = 0; i < petalCount; i++) {
        const angle = (Math.PI * 2 / petalCount) * i + rotationAngle;
        const x1 = centerX + radius * 0.7 * Math.cos(angle - Math.PI/petalCount);
        const y1 = centerY + radius * 0.7 * Math.sin(angle - Math.PI/petalCount);
        const x2 = centerX + radius * 0.9 * Math.cos(angle);
        const y2 = centerY + radius * 0.9 * Math.sin(angle);
        const x3 = centerX + radius * 0.7 * Math.cos(angle + Math.PI/petalCount);
        const y3 = centerY + radius * 0.7 * Math.sin(angle + Math.PI/petalCount);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(x2, y2, x3, y3);
        ctx.quadraticCurveTo(centerX + radius * 0.6 * Math.cos(angle), centerY + radius * 0.6 * Math.sin(angle), x1, y1);
        ctx.stroke();
      }
      
      // Draw concentric triangles
      for (let i = 0; i < 4; i++) {
        // Upward triangle
        ctx.beginPath();
        const upRadius = radius * (0.7 - i * 0.12);
        const upPoints = [];
        
        for (let j = 0; j < 3; j++) {
          const angle = (Math.PI * 2 / 3) * j + rotationAngle;
          const x = centerX + upRadius * Math.cos(angle);
          const y = centerY + upRadius * Math.sin(angle);
          upPoints.push({ x, y });
        }
        
        ctx.moveTo(upPoints[0].x, upPoints[0].y);
        for (let j = 1; j < upPoints.length; j++) {
          ctx.lineTo(upPoints[j].x, upPoints[j].y);
        }
        ctx.closePath();
        ctx.globalAlpha = 0.7 - i * 0.1;
        ctx.stroke();
        
        // Downward triangle
        ctx.beginPath();
        const downRadius = radius * (0.65 - i * 0.12);
        const downPoints = [];
        
        for (let j = 0; j < 3; j++) {
          const angle = (Math.PI * 2 / 3) * j + rotationAngle + Math.PI;
          const x = centerX + downRadius * Math.cos(angle);
          const y = centerY + downRadius * Math.sin(angle);
          downPoints.push({ x, y });
        }
        
        ctx.moveTo(downPoints[0].x, downPoints[0].y);
        for (let j = 1; j < downPoints.length; j++) {
          ctx.lineTo(downPoints[j].x, downPoints[j].y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      
      // Central point (bindu)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = chakraColor;
      ctx.globalAlpha = 1;
      ctx.fill();
      
      // Increment rotation if playing
      if (isPlaying) {
        rotationAngle += 0.002 * animationSpeed;
        setRotation(rotationAngle);
      }
    };
    
    // Draw function based on geometry type
    const draw = () => {
      if (geometryType === "flowerOfLife") {
        drawFlowerOfLife();
      } else if (geometryType === "metatronsCube") {
        drawMetatronsCube();
      } else if (geometryType === "merkaba") {
        drawMerkaba();
      } else if (geometryType === "sriYantra") {
        drawSriYantra();
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [chakraColor, freqProps.complexity, geometryType, isPlaying, size, dimensions, pulseWithAudio, animationSpeed]);
  
  return (
    <div className={`sacred-geometry-container ${isPlaying ? 'is-playing' : ''}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: isPlaying ? [1, 1.02, 1] : 1,
          rotate: isPlaying ? [0, 1, 0, -1, 0] : 0
        }}
        transition={{
          duration: 3,
          repeat: isPlaying ? Infinity : 0,
          repeatType: "reverse"
        }}
        className="relative"
        style={{
          width: typeof dimensions.width === 'string' ? dimensions.width : `${dimensions.width}px`,
          height: typeof dimensions.height === 'string' ? dimensions.height : `${dimensions.height}px`
        }}
      >
        <canvas 
          ref={canvasRef}
          className="sacred-geometry-canvas"
        />
        <div className="absolute inset-0 pointer-events-none sacred-geometry-overlay"></div>
      </motion.div>
    </div>
  );
};

export default SacredGeometryVisualizer;
