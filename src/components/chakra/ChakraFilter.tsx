
import React, { useState } from 'react';
import { CHAKRAS, ChakraTag } from '@/types/chakras';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ChakraFilterProps {
  selectedChakras: ChakraTag[];
  onChange: (chakras: ChakraTag[]) => void;
  multiSelect?: boolean;
  showClearButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ChakraFilter: React.FC<ChakraFilterProps> = ({
  selectedChakras,
  onChange,
  multiSelect = true,
  showClearButton = true,
  size = 'md',
  className = ''
}) => {
  const handleChakraClick = (chakra: ChakraTag) => {
    if (multiSelect) {
      const isSelected = selectedChakras.includes(chakra);
      if (isSelected) {
        onChange(selectedChakras.filter(c => c !== chakra));
      } else {
        onChange([...selectedChakras, chakra]);
      }
    } else {
      const isSelected = selectedChakras.includes(chakra);
      if (isSelected) {
        onChange([]);
      } else {
        onChange([chakra]);
      }
    }
  };
  
  const clearSelection = () => {
    onChange([]);
  };
  
  const sizeClasses = {
    sm: 'text-xs py-1 px-2 h-7',
    md: 'text-sm py-1 px-3 h-8',
    lg: 'text-base py-2 px-4 h-10'
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {CHAKRAS.map((chakra) => {
          const isSelected = selectedChakras.includes(chakra.name);
          return (
            <Button
              key={chakra.name}
              variant="outline"
              className={`
                transition-colors
                ${sizeClasses[size]}
                ${isSelected ? 'border-2' : 'border'}
              `}
              style={{
                backgroundColor: isSelected ? chakra.bgColor : 'transparent',
                color: chakra.color,
                borderColor: chakra.color,
              }}
              onClick={() => handleChakraClick(chakra.name)}
            >
              {chakra.name}
            </Button>
          );
        })}
        
        {showClearButton && selectedChakras.length > 0 && (
          <Button
            variant="ghost"
            className={`${sizeClasses[size]}`}
            onClick={clearSelection}
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChakraFilter;
