
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHAKRAS, ChakraTag, getChakraColor } from '@/types/chakras';

interface ChakraSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const ChakraSelect: React.FC<ChakraSelectProps> = ({
  value,
  onChange,
  placeholder = "Select a chakra...",
  className = "",
  disabled = false
}) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {CHAKRAS.map((chakra) => (
          <SelectItem 
            key={chakra.name} 
            value={chakra.name}
            className="flex items-center"
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: chakra.color }}
              ></div>
              {chakra.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ChakraSelect;
