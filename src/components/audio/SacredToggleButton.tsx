
import React from 'react';
import { motion } from 'framer-motion';
import { isPrime } from '@/utils/primeCalculations';

interface SacredToggleButtonProps {
  active: boolean;
  onClick: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SacredToggleButton: React.FC<SacredToggleButtonProps> = ({
  active,
  onClick,
  label = 'Toggle Visualizer',
  size = 'md',
  className = ''
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div 
      className={`relative group cursor-pointer ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-gradient-radial from-indigo-400 via-purple-500 to-fuchsia-600 shadow-lg ${active ? 'animate-spin-slow' : ''}`}>
        {/* Sacred Geometry Design */}
        <svg width="80%" height="80%" viewBox="0 0 100 100" className="text-white">
          {/* Center point */}
          <circle cx="50" cy="50" r="8" fill="white" className="animate-pulse-slow" />
          
          {/* Inner ring */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <circle
              key={`inner-${i}`}
              cx={50 + Math.cos(angle * Math.PI / 180) * 16}
              cy={50 + Math.sin(angle * Math.PI / 180) * 16}
              r="6"
              fill="rgba(255,255,255,0.8)"
              className={isPrime(i + 1) ? 'animate-pulse-slow' : ''}
            />
          ))}
          
          {/* Outer ring */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <circle
              key={`outer-${i}`}
              cx={50 + Math.cos(angle * Math.PI / 180) * 30}
              cy={50 + Math.sin(angle * Math.PI / 180) * 30}
              r="4"
              fill="rgba(255,255,255,0.6)"
              className={isPrime(i + 1) ? 'animate-pulse-slow' : ''}
            />
          ))}
          
          {/* Optional connecting lines for complexity */}
          <g stroke="rgba(255,255,255,0.3)" strokeWidth="1">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <line
                key={`line-${i}`}
                x1="50"
                y1="50"
                x2={50 + Math.cos(angle * Math.PI / 180) * 16}
                y2={50 + Math.sin(angle * Math.PI / 180) * 16}
                strokeDasharray={isPrime(i) ? "1,1" : ""}
              />
            ))}
          </g>
        </svg>
      </div>
      
      {/* Ripple effect when active */}
      {active && (
        <div className="absolute inset-0 rounded-full bg-indigo-400/30 animate-ripple"></div>
      )}
      
      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
        {active ? `Hide ${label}` : `Show ${label}`}
      </div>
    </motion.div>
  );
};

export default SacredToggleButton;
