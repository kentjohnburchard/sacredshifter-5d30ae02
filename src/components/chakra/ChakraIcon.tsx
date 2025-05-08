
import React from 'react';

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
  
  // Default color since getChakraColor doesn't exist
  const color = '#A020F0'; // Default purple
  
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
