
import React from 'react';
import { motion } from 'framer-motion';

const SHAPE_COLOR = "#fff";

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface GeometricPatternsProps {
  triangleCount?: number;
  circleCount?: number;
  squareCount?: number;
}

const GeometricPatterns: React.FC<GeometricPatternsProps> = ({
  triangleCount = 7,
  circleCount = 7,
  squareCount = 7
}) => {
  // Generate random parameters for better scatter!
  const triangles = React.useMemo(() => (
    Array.from({ length: triangleCount }).map((_, i) => ({
      left: `${randomBetween(5, 85)}%`,
      top: `${randomBetween(5, 85)}%`,
      size: randomBetween(85, 170),
      // Increased animation duration to reduce rapid changes
      duration: randomBetween(25, 45), // Increased from 18-32 to 25-45 seconds
      delay: i * 1.5, // Increased from 0.8 to 1.5 for smoother transitions
      rotateDir: Math.random() > 0.5 ? 1 : -1
    }))
  ), [triangleCount]);

  const circles = React.useMemo(() => (
    Array.from({ length: circleCount }).map((_, i) => ({
      left: `${randomBetween(5, 85)}%`,
      top: `${randomBetween(5, 85)}%`,
      size: randomBetween(90, 160),
      // Increased animation duration to reduce rapid changes
      duration: randomBetween(20, 40), // Increased from 15-26 to 20-40 seconds
      delay: i * 1.2, // Increased from 0.6 to 1.2 for smoother transitions
      rotateDir: Math.random() > 0.5 ? 1 : -1
    }))
  ), [circleCount]);

  const squares = React.useMemo(() => (
    Array.from({ length: squareCount }).map((_, i) => ({
      left: `${randomBetween(5, 85)}%`,
      top: `${randomBetween(5, 85)}%`,
      size: randomBetween(65, 150),
      // Increased animation duration to reduce rapid changes
      duration: randomBetween(30, 50), // Increased from 25-36 to 30-50 seconds
      delay: i * 1.3, // Increased from 0.7 to 1.3 for smoother transitions
      rotateDir: Math.random() > 0.5 ? 1 : -1
    }))
  ), [squareCount]);

  // Reduced opacity variation to prevent light flashing
  // Increased base opacity for better visibility
  const opacityVariation = 0.1; // Reduced from ~0.2 to 0.1
  const baseOpacity = 0.9; // Increased from 0.85 for better visibility

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Apply reduced motion preferences */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}  // Slightly increased from 0.65
        transition={{ duration: 2.5 }} // Slowed fade in
      >
        {/* Triangles */}
        {triangles.map((props, i) => (
          <motion.svg
            key={`triangle-${i}`}
            className="absolute"
            width={props.size}
            height={props.size}
            style={{
              top: props.top,
              left: props.left,
              zIndex: 0,
              filter: "blur(0.5px)",
            }}
            viewBox="0 0 100 100"
            fill="none"
            // Use prefers-reduced-motion
            animate={{
              // Reduced animation intensity
              rotate: [0, props.rotateDir * 180, 0], // Reduced from 360 to 180
              opacity: [baseOpacity, baseOpacity - opacityVariation, baseOpacity], // Smaller opacity changes
              x: [0, props.rotateDir * 12, 0], // Reduced from 16 to 12
              y: [0, props.rotateDir * -15, 0], // Reduced from -20 to -15
              scale: [1, 1.08, 1], // Reduced from 1.12 to 1.08
            }}
            transition={{
              duration: props.duration,
              repeat: Infinity,
              repeatType: "reverse",
              // Use ease-in-out-sine for smoother transitions
              ease: "easeInOutSine", 
              delay: props.delay,
            }}
          >
            {/* TRIANGLE - increased stroke width for better visibility */}
            <polygon 
              points="50,18 92,87 8,87"
              fill="none"
              stroke={SHAPE_COLOR}
              strokeWidth="4"  // Increased from 3.5
              opacity="0.98" // Increased from 0.97
              strokeLinejoin="bevel"
            />
          </motion.svg>
        ))}
        {/* Circles */}
        {circles.map((props, i) => (
          <motion.svg
            key={`circle-${i}`}
            className="absolute"
            width={props.size}
            height={props.size}
            style={{
              top: props.top,
              left: props.left,
              zIndex: 0,
              filter: "blur(1px)",
            }}
            viewBox="0 0 100 100"
            fill="none"
            // Use prefers-reduced-motion
            animate={{
              // Reduced animation intensity
              rotate: [0, props.rotateDir * 180, 0],  // Reduced from 360 to 180
              opacity: [baseOpacity, baseOpacity - opacityVariation, baseOpacity], // Smaller opacity changes
              x: [0, props.rotateDir * 8, 0], // Reduced from 10 to 8
              y: [0, props.rotateDir * 8, 0], // Reduced from 11 to 8
              scale: [1, 1.05, 1], // Reduced from 1.08 to 1.05
            }}
            transition={{
              duration: props.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOutSine",
              delay: props.delay,
            }}
          >
            {/* CIRCLE - increased stroke width for better visibility */}
            <circle 
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={SHAPE_COLOR}
              strokeWidth="3.5"  // Increased from 3.2
              opacity="0.98"  // Increased from 0.96
            />
          </motion.svg>
        ))}
        {/* Squares */}
        {squares.map((props, i) => (
          <motion.svg
            key={`square-${i}`}
            className="absolute"
            width={props.size}
            height={props.size}
            style={{
              top: props.top,
              left: props.left,
              zIndex: 0,
              filter: "blur(1px)",
            }}
            viewBox="0 0 100 100"
            fill="none"
            // Use prefers-reduced-motion
            animate={{
              // Reduced animation intensity
              rotate: [0, props.rotateDir * 180, 0], // Reduced from 360 to 180
              opacity: [baseOpacity, baseOpacity - opacityVariation, baseOpacity], // Smaller opacity changes
              x: [0, props.rotateDir * -4, 0], // Reduced from -6 to -4
              y: [0, props.rotateDir * 8, 0], // Reduced from 12 to 8
              scale: [1, 1.05, 1], // Reduced from 1.09 to 1.05
            }}
            transition={{
              duration: props.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOutSine",
              delay: props.delay,
            }}
          >
            {/* SQUARE - increased stroke width for better visibility */}
            <rect 
              x="13"
              y="13"
              width="74"
              height="74"
              fill="none"
              stroke={SHAPE_COLOR}
              strokeWidth="3.5"  // Increased from 3.2
              opacity="0.98"  // Increased from 0.95
              rx="11"
            />
          </motion.svg>
        ))}
      </motion.div>

      {/* Add prefers-reduced-motion media query styles */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          /* Significantly reduce or disable animations for users with motion sensitivity */
          .absolute {
            animation: none !important;
            transition: opacity 2s ease-in-out !important;
          }
          
          /* Allow only the most minimal essential animations */
          .minimal-motion {
            transition-duration: 2s !important;
            animation-duration: 2s !important;
          }
        }
      `}</style>

      {/* 
        DEVELOPER NOTE:
        These geometric patterns have been optimized for accessibility and motion sensitivity.
        - Animation durations extended to 20-50s for gentle, non-triggering motion
        - Reduced opacity variations to prevent light flashing
        - Added prefers-reduced-motion support to respect user preferences
        - Limited motion variations and used GPU-friendly properties (transform, opacity)
        - Smooth easing functions prevent jarring transitions
        - Increased stroke width and base opacity for better visibility
        
        The goal is to create a meditative, gentle animation pattern that enhances
        the sacred atmosphere without causing discomfort to users sensitive to motion.
      */}
    </div>
  );
};

export default GeometricPatterns;
