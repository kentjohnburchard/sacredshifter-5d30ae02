
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChakraTag } from '@/types/chakras';

interface ChakraSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Since CHAKRAS isn't available, use basic chakra set
const basicChakras = [
  { name: 'Root', color: '#FF0000' },
  { name: 'Sacral', color: '#FF7F00' },
  { name: 'Solar Plexus', color: '#FFFF00' },
  { name: 'Heart', color: '#00FF00' },
  { name: 'Throat', color: '#00FFFF' },
  { name: 'Third Eye', color: '#0000FF' },
  { name: 'Crown', color: '#8B00FF' },
  { name: 'Transpersonal', color: '#FFFFFF' }
];

const ChakraSelect: React.FC<ChakraSelectProps> = ({
  value,
  onChange,
  placeholder = "Select a chakra...",
  className = "",
  disabled = false
}) => {
  // Ensure we're using a non-empty value for value prop
  const safeValue = value || undefined; // undefined lets the placeholder show

  return (
    <Select
      value={safeValue}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {basicChakras.map((chakra) => {
          // Ensure every item has a valid non-empty value
          const itemValue = chakra.name || `chakra-${Math.random().toString(36).slice(2, 7)}`;
          
          return (
            <SelectItem 
              key={chakra.name || itemValue} 
              value={itemValue} 
              className="flex items-center"
            >
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: chakra.color }}
                ></div>
                {chakra.name || "Unnamed Chakra"}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default ChakraSelect;
