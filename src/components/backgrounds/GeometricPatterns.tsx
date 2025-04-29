
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
      duration: randomBetween(18, 32),
      delay: i * 0.8,
      rotateDir: Math.random() > 0.5 ? 1 : -1
    }))
  ), [triangleCount]);

  const circles = React.useMemo(() => (
    Array.from({ length: circleCount }).map((_, i) => ({
      left: `${randomBetween(5, 85)}%`,
      top: `${randomBetween(5, 85)}%`,
      size: randomBetween(90, 160),
      duration: randomBetween(15, 26),
      delay: i * 0.6,
      rotateDir: Math.random() > 0.5 ? 1 : -1
    }))
  ), [circleCount]);

  const squares = React.useMemo(() => (
    Array.from({ length: squareCount }).map((_, i) => ({
      left: `${randomBetween(5, 85)}%`,
      top: `${randomBetween(5, 85)}%`,
      size: randomBetween(65, 150),
      duration: randomBetween(25, 36),
      delay: i * 0.7,
      rotateDir: Math.random() > 0.5 ? 1 : -1
    }))
  ), [squareCount]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}  // Increased from 0.55
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
            animate={{
              rotate: [0, props.rotateDir * 360, 0],
              opacity: [0.92, 0.75, 0.90],  // Increased opacity
              x: [0, props.rotateDir * 16, 0],
              y: [0, props.rotateDir * -20, 0],
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: props.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: props.delay,
            }}
          >
            {/* TRIANGLE */}
            <polygon 
              points="50,18 92,87 8,87"
              fill="none"
              stroke={SHAPE_COLOR}
              strokeWidth="3.5"  // Increased from 3.2
              opacity="0.97"  // Increased from 0.93
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
            animate={{
              rotate: [0, props.rotateDir * 360, 0],
              opacity: [0.92, 0.72, 0.88],  // Increased opacity
              x: [0, props.rotateDir * 10, 0],
              y: [0, props.rotateDir * 11, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: props.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: props.delay,
            }}
          >
            {/* CIRCLE */}
            <circle 
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={SHAPE_COLOR}
              strokeWidth="3.2"  // Increased from 2.8
              opacity="0.96"  // Increased from 0.90
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
            animate={{
              rotate: [0, props.rotateDir * 360, 0],
              opacity: [0.92, 0.78, 0.88],  // Increased opacity
              x: [0, props.rotateDir * -6, 0],
              y: [0, props.rotateDir * 12, 0],
              scale: [1, 1.09, 1],
            }}
            transition={{
              duration: props.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: props.delay,
            }}
          >
            {/* SQUARE */}
            <rect 
              x="13"
              y="13"
              width="74"
              height="74"
              fill="none"
              stroke={SHAPE_COLOR}
              strokeWidth="3.2"  // Increased from 2.9
              opacity="0.95"  // Increased from 0.91
              rx="11"
            />
          </motion.svg>
        ))}
      </motion.div>
    </div>
  );
};

export default GeometricPatterns;
