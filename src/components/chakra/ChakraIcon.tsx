
import React from 'react';
import { ChakraTag, getChakraColor } from '@/types/chakras';

interface ChakraIconProps {
  chakra?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  className?: string;
}

export const ChakraIcon: React.FC<ChakraIconProps> = ({ 
  chakra,
  size = 'md',
  className = ''
}) => {
  if (!chakra) return null;
  
  const sizeValue = typeof size === 'string' 
    ? { sm: 16, md: 24, lg: 32 }[size] || 24 
    : size;
  
  const color = getChakraColor(chakra);
  
  return (
    <div 
      className={`rounded-full flex items-center justify-center ${className}`}
      style={{ 
        width: sizeValue,
        height: sizeValue,
        backgroundColor: color + '33', // Add transparency
        borderWidth: 2,
        borderColor: color,
        borderStyle: 'solid'
      }}
    >
      <div 
        className="rounded-full"
        style={{ 
          width: sizeValue * 0.5,
          height: sizeValue * 0.5,
          backgroundColor: color 
        }}
      />
    </div>
  );
};

export default ChakraIcon;
