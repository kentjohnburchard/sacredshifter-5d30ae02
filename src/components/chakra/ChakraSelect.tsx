
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
  { name: 'Root', color: '#FF0000', id: 'root' },
  { name: 'Sacral', color: '#FF7F00', id: 'sacral' },
  { name: 'Solar Plexus', color: '#FFFF00', id: 'solar-plexus' },
  { name: 'Heart', color: '#00FF00', id: 'heart' },
  { name: 'Throat', color: '#00FFFF', id: 'throat' },
  { name: 'Third Eye', color: '#0000FF', id: 'third-eye' },
  { name: 'Crown', color: '#8B00FF', id: 'crown' },
  { name: 'Transpersonal', color: '#FFFFFF', id: 'transpersonal' }
];

const ChakraSelect: React.FC<ChakraSelectProps> = ({
  value,
  onChange,
  placeholder = "Select a chakra...",
  className = "",
  disabled = false
}) => {
  // Ensure we're using a non-empty value for value prop
  const safeValue = value || "no-selection";

  return (
    <Select
      value={safeValue}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={`${className} border-white/20 bg-black/40 backdrop-blur-md text-white`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-black/80 border-white/20 backdrop-blur-lg text-white">
        {basicChakras.length > 0 ? (
          basicChakras.map((chakra) => (
            <SelectItem 
              key={chakra.id} 
              value={chakra.id}
              className="flex items-center focus:bg-white/10 focus:text-white data-[state=checked]:bg-white/20"
            >
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: chakra.color }}
                ></div>
                {chakra.name}
              </div>
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-chakras" disabled>No chakras available</SelectItem>
        )}
        {!value && <SelectItem value="no-selection">Select a chakra</SelectItem>}
      </SelectContent>
    </Select>
  );
};

export default ChakraSelect;
