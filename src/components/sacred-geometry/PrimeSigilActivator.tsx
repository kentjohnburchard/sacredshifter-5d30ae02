import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from "sonner";

interface PrimeSigilActivatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withLabel?: boolean;
  withTooltip?: boolean;
}

const PrimeSigilActivator: React.FC<PrimeSigilActivatorProps> = ({
  className = '', 
  size = 'md',
  withLabel = false,
  withTooltip = true
}) => {
  const { liftTheVeil, toggleVeil } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const primes = useRef([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]).current;

  useEffect(() => {
    console.log("PrimeSigilActivator initial state:", liftTheVeil);
  }, []);

  useEffect(() => {
    console.log("PrimeSigilActivator detected state change:", liftTheVeil);
  }, [liftTheVeil]);

  const dimensions = {
    sm: 40,
    md: 60,
    lg: 80
  }[size];

  const handleClick = () => {
    toggleVeil();
    // Additional handler code if present
  };

  const createGoldenSpiralPath = (centerX: number, centerY: number, maxRadius: number): string => {
    const points: [number, number][] = [];
    const goldenRatio = 1.618033988749895;
    const numPoints = 100;
    const maxAngle = 8 * Math.PI;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * maxAngle;
      const radius = (maxRadius / 2) * Math.pow(1 / goldenRatio, angle / Math.PI);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push([x, y]);
    }
    
    return points.map((point, i) => 
      (i === 0 ? 'M' : 'L') + point[0] + ',' + point[1]
    ).join(' ');
  };
  
  const createFlowerOfLifeCircles = (centerX: number, centerY: number, radius: number): {cx: number, cy: number, r: number}[] => {
    const circles = [{ cx: centerX, cy: centerY, r: radius }];
    const positions = [
      [0, 0], [1, 0], [0.5, 0.866], 
      [-0.5, 0.866], [-1, 0], [-0.5, -0.866], 
      [0.5, -0.866]
    ];
    
    for (const [x, y] of positions) {
      if (!(x === 0 && y === 0)) {
        circles.push({
          cx: centerX + x * radius,
          cy: centerY + y * radius,
          r: radius / 2
        });
      }
    }
    
    return circles;
  };
  
  const createPrimeDots = (centerX: number, centerY: number, radius: number): {cx: number, cy: number, r: number}[] => {
    return Array.from({ length: 7 }).map((_, i) => {
      const prime = [2, 3, 5, 7, 11, 13, 17][i];
      const angle = (i / 7) * Math.PI * 2;
      const distance = (radius / 2) * (0.4 + (prime % 5) / 10);
      return {
        cx: centerX + distance * Math.cos(angle),
        cy: centerY + distance * Math.sin(angle),
        r: 1 + (prime % 3)
      };
    });
  };

  const center = dimensions / 2;
  const maxRadius = dimensions / 2 - 2;
  const spiralPath = createGoldenSpiralPath(center, center, maxRadius);
  const flowerCircles = createFlowerOfLifeCircles(center, center, maxRadius / 1.5);
  const primeDots = createPrimeDots(center, center, maxRadius);
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div 
            className={`relative inline-flex items-center ${withLabel ? 'space-x-2' : ''} ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div 
              className="relative cursor-pointer"
              onClick={handleClick}
              whileTap={{ scale: 0.95 }}
            >
              <svg 
                ref={svgRef}
                width={dimensions} 
                height={dimensions} 
                viewBox={`0 0 ${dimensions} ${dimensions}`}
                className={`
                  ${liftTheVeil ? 'text-pink-500' : 'text-purple-600'} 
                  ${isHovered ? 'drop-shadow-lg' : ''}
                `}
              >
                <circle 
                  cx={center} 
                  cy={center} 
                  r={maxRadius} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  className={liftTheVeil ? "animate-pulse-slow" : ""}
                />
                
                <g className="text-opacity-70">
                  {flowerCircles.map((circle, i) => (
                    <circle
                      key={`flower-${i}`}
                      cx={circle.cx}
                      cy={circle.cy}
                      r={circle.r}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.75"
                      opacity={0.6}
                    />
                  ))}
                </g>
                
                <path 
                  d={spiralPath} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.25" 
                  className={`origin-center ${liftTheVeil ? 'animate-spin-slow' : ''}`}
                />
                
                <g className={`${liftTheVeil ? 'text-pink-400' : 'text-purple-400'}`}>
                  {primeDots.map((dot, i) => (
                    <circle
                      key={`prime-${i}`}
                      cx={dot.cx}
                      cy={dot.cy}
                      r={dot.r}
                      fill="currentColor"
                      className="animate-pulse-slow"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </g>

                <motion.g
                  animate={{
                    rotate: liftTheVeil ? 360 : 0
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="origin-center"
                >
                  <polygon 
                    points={`${center},${center-maxRadius/3} ${center+maxRadius/3*Math.sin(2*Math.PI/3)},${center+maxRadius/3*Math.cos(2*Math.PI/3)} ${center+maxRadius/3*Math.sin(4*Math.PI/3)},${center+maxRadius/3*Math.cos(4*Math.PI/3)}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </motion.g>
                
                <circle 
                  cx={center} 
                  cy={center} 
                  r={maxRadius/12} 
                  fill="currentColor"
                  className={liftTheVeil ? "animate-pulse-slow" : ""}
                />
              </svg>
              
              <div
                className={`absolute inset-0 rounded-full bg-gradient-radial 
                ${liftTheVeil 
                  ? 'from-pink-500/30 via-fuchsia-500/20 to-transparent' 
                  : 'from-purple-500/30 via-indigo-500/20 to-transparent'
                } 
                filter blur-md opacity-80 animate-glow mix-blend-soft-light`}
              />
              
              <AnimatePresence>
                {showRipple && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className={`absolute inset-0 rounded-full border-2 ${liftTheVeil ? 'border-pink-400' : 'border-purple-400'}`}
                  />
                )}
              </AnimatePresence>
            </motion.div>
            
            {withLabel && (
              <span className={`text-sm font-medium ${liftTheVeil ? 'text-pink-500' : 'text-purple-600'}`}>
                {liftTheVeil ? 'Return to Base Reality' : 'Lift the Veil'}
              </span>
            )}
          </div>
        </TooltipTrigger>
        {withTooltip && (
          <TooltipContent className="bg-black/80 text-white backdrop-blur-sm border-gray-700 px-3 py-2">
            <p>Lift the Veil — Activate Higher Knowing</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default PrimeSigilActivator;
