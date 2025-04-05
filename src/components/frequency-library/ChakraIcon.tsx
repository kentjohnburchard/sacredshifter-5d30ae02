
import React from "react";
import { 
  Circle, 
  CircleDot, 
  Flame, 
  Heart, 
  Orbit, 
  Sun, 
  Waves 
} from "lucide-react";

interface ChakraIconProps {
  chakra?: string;
  className?: string;
}

export const ChakraIcon: React.FC<ChakraIconProps> = ({ chakra, className = "h-5 w-5" }) => {
  if (!chakra) return <Circle className={className} />;

  switch (chakra.toLowerCase()) {
    case 'root':
      return <Flame className={`${className} text-red-500`} />;
    case 'sacral':
      return <Orbit className={`${className} text-orange-400`} />;
    case 'solar plexus':
      return <Sun className={`${className} text-yellow-500`} />;
    case 'heart':
      return <Heart className={`${className} text-green-500`} />;
    case 'throat':
      return <Waves className={`${className} text-blue-500`} />;
    case 'third eye':
      return <CircleDot className={`${className} text-indigo-500`} />;
    case 'crown':
      return <Circle className={`${className} text-purple-500`} />;
    default:
      return <Circle className={className} />;
  }
};
