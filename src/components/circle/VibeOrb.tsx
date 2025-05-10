
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CHAKRA_COLORS, ChakraTag } from '@/types/chakras';
import { motion } from 'framer-motion';

interface VibeOrbProps {
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    currentVibe?: string;
    chakraAlignment?: ChakraTag;
    currentFrequency?: number;
    isActive?: boolean;
    lastActive?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
}

const VibeOrb: React.FC<VibeOrbProps> = ({
  user,
  size = 'md',
  showDetails = true,
  onClick
}) => {
  const orbRef = useRef<HTMLDivElement>(null);
  
  const orbSize = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-20 w-20'
  };
  
  const pulseSize = {
    sm: 'h-12 w-12',
    md: 'h-18 w-18',
    lg: 'h-24 w-24'
  };
  
  const chakra = user.chakraAlignment || 'Crown';
  const chakraColor = CHAKRA_COLORS[chakra];
  const isActive = user.isActive !== false;
  
  // Get user initials for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div 
      className="relative flex flex-col items-center"
      onClick={onClick}
      ref={orbRef}
    >
      {/* Aura effect */}
      {isActive && (
        <motion.div
          className={`absolute rounded-full ${pulseSize[size]} -z-10`}
          style={{
            backgroundColor: chakraColor + '20',
            boxShadow: `0 0 30px ${chakraColor}40`
          }}
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ 
            scale: [0.8, 1.1, 0.9],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Avatar with border color based on chakra alignment */}
      <div className="relative">
        <Avatar className={`${orbSize[size]} border-2`} style={{ borderColor: chakraColor }}>
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback 
            className="text-white"
            style={{ 
              background: `linear-gradient(45deg, ${chakraColor}90, ${chakraColor}50)`
            }}
          >
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        
        {/* Active status indicator */}
        {isActive && (
          <div 
            className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black" 
            style={{ backgroundColor: chakraColor }}
          />
        )}
      </div>
      
      {/* User details section */}
      {showDetails && (
        <div className="mt-1 text-center">
          <p className="text-sm font-medium truncate max-w-[100px]">{user.name}</p>
          
          {user.currentVibe && (
            <motion.div 
              className="px-2 py-0.5 rounded-full text-xs mt-1"
              style={{ 
                backgroundColor: chakraColor + '20',
                color: chakraColor,
                boxShadow: `0 0 10px ${chakraColor}30`
              }}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {user.currentVibe}
              {user.currentFrequency && (
                <span className="ml-1 opacity-70">{user.currentFrequency}Hz</span>
              )}
            </motion.div>
          )}
          
          {!isActive && user.lastActive && (
            <p className="text-xs text-gray-400 mt-1">{user.lastActive}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VibeOrb;
