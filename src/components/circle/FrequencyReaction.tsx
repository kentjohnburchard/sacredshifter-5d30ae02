
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface FrequencyReactionProps {
  type: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}

const FrequencyReaction: React.FC<FrequencyReactionProps> = ({
  type,
  count,
  isActive = false,
  onClick
}) => {
  // Map frequency types to emojis and colors
  const typeConfig = {
    '432Hz': { emoji: '🎶', color: '#4ade80' },
    '528Hz': { emoji: '🔥', color: '#f97316' },
    '639Hz': { emoji: '💙', color: '#3b82f6' },
    '741Hz': { emoji: '💫', color: '#a855f7' },
    '852Hz': { emoji: '👁️', color: '#6366f1' },
    '963Hz': { emoji: '✨', color: '#d946ef' },
    'Theta': { emoji: '🌀', color: '#0ea5e9' },
    'Alpha': { emoji: '🧠', color: '#14b8a6' },
    'Delta': { emoji: '💤', color: '#8b5cf6' },
    'Gamma': { emoji: '⚡', color: '#eab308' },
  };
  
  const config = typeConfig[type as keyof typeof typeConfig] || { emoji: '✨', color: '#6366f1' };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        variant="ghost" 
        size="sm"
        className={`h-8 rounded-full px-3 py-1 ${isActive ? 'bg-opacity-30' : 'bg-opacity-10'}`}
        style={{ 
          backgroundColor: isActive ? `${config.color}40` : `${config.color}20`,
          color: isActive ? config.color : 'white',
          borderColor: isActive ? config.color : 'transparent',
          borderWidth: isActive ? '1px' : '0'
        }}
        onClick={onClick}
      >
        <span className="mr-1">{config.emoji}</span>
        <span className="text-xs">{type}</span>
        {count > 0 && <span className="ml-1 text-xs">· {count}</span>}
        
        {isActive && (
          <motion.span 
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ 
              opacity: 0,
              scale: 2
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatDelay: 1
            }}
            style={{
              border: `1px solid ${config.color}`,
              zIndex: -1
            }}
          />
        )}
      </Button>
    </motion.div>
  );
};

export default FrequencyReaction;
