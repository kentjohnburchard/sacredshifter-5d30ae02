
import React from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  intensity?: "low" | "medium" | "high";
  theme?: "cosmic" | "ethereal" | "temple";
  children?: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  intensity = "medium",
  theme = "cosmic",
  children,
}) => {
  // Configure the number of floating elements based on intensity
  const particleCount = {
    low: 15,
    medium: 30,
    high: 50,
  }[intensity];
  
  // Theme color configurations
  const themeConfig = {
    cosmic: {
      gradientStart: "from-black",
      gradientMiddle: "via-purple-950",
      gradientEnd: "to-indigo-950",
      particleColors: ["bg-purple-500/20", "bg-indigo-500/20", "bg-blue-500/20", "bg-pink-500/20"],
    },
    ethereal: {
      gradientStart: "from-blue-950",
      gradientMiddle: "via-purple-900",
      gradientEnd: "to-indigo-900",
      particleColors: ["bg-cyan-500/20", "bg-blue-400/20", "bg-purple-400/20", "bg-teal-400/20"],
    },
    temple: {
      gradientStart: "from-amber-950",
      gradientMiddle: "via-purple-900",
      gradientEnd: "to-indigo-900",
      particleColors: ["bg-amber-500/20", "bg-orange-400/20", "bg-purple-400/20", "bg-pink-400/20"],
    },
  }[theme];
  
  // Generate random particles
  const generateParticles = () => {
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Randomize size, position, animation duration and delay
      const size = Math.floor(Math.random() * 50) + 10; // 10-60px
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const duration = Math.floor(Math.random() * 60) + 60; // 60-120s
      const delay = Math.random() * -30; // -30-0s (negative for staggered start)
      
      // Randomly select shapes from sacred geometry
      const shapes = [
        "rounded-full", // Circle
        "rotate-45", // Diamond (when applied to square)
        "rotate-[30deg]", // Hexagon-like rotation
        "rotate-[60deg]", // Triangle-like rotation
      ];
      
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const colorClass = themeConfig.particleColors[Math.floor(Math.random() * themeConfig.particleColors.length)];
      
      particles.push(
        <motion.div
          key={i}
          className={`absolute ${colorClass} border border-white/10 backdrop-blur-md ${shape}`}
          style={{
            width: size,
            height: size,
            top,
            left,
            zIndex: -1,
          }}
          animate={{
            x: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            y: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            rotate: [0, 90, 180, 270, 360],
            scale: [
              Math.random() * 0.5 + 0.5,
              Math.random() * 0.5 + 0.75,
              Math.random() * 0.5 + 1,
              Math.random() * 0.5 + 0.75,
              Math.random() * 0.5 + 0.5,
            ],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            delay,
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />
      );
    }
    
    return particles;
  };
  
  return (
    <div className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${themeConfig.gradientStart} ${themeConfig.gradientMiddle} ${themeConfig.gradientEnd}`}>
      {/* Animated particles */}
      {generateParticles()}
      
      {/* Responsive grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
      
      {/* Children content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
