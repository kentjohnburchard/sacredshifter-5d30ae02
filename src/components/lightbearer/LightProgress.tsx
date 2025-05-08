
import React from 'react';
import { cn } from '@/lib/utils';

interface LightProgressProps {
  value: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LightProgress: React.FC<LightProgressProps> = ({
  value,
  color = '#9b87f5',
  size = 'md',
  className
}) => {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={cn("w-full bg-gray-700/50 rounded-full overflow-hidden", heightClasses[size], className)}>
      <div 
        className="h-full transition-all duration-1000 ease-out rounded-full"
        style={{ 
          width: `${value}%`, 
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`
        }}
      />
    </div>
  );
};

export default LightProgress;
