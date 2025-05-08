
import React from 'react';
import { ChakraTag } from '@/types/chakras';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// Since CHAKRAS isn't available, use basic chakra set
const basicChakras = [
  { name: 'Root' as ChakraTag, color: '#FF0000', bgColor: '#FF000022' },
  { name: 'Sacral' as ChakraTag, color: '#FF7F00', bgColor: '#FF7F0022' },
  { name: 'Solar Plexus' as ChakraTag, color: '#FFFF00', bgColor: '#FFFF0022' },
  { name: 'Heart' as ChakraTag, color: '#00FF00', bgColor: '#00FF0022' },
  { name: 'Throat' as ChakraTag, color: '#00FFFF', bgColor: '#00FFFF22' },
  { name: 'Third Eye' as ChakraTag, color: '#0000FF', bgColor: '#0000FF22' },
  { name: 'Crown' as ChakraTag, color: '#8B00FF', bgColor: '#8B00FF22' },
  { name: 'Transpersonal' as ChakraTag, color: '#FFFFFF', bgColor: '#FFFFFF22' }
];

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
        {basicChakras.map((chakra) => {
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
